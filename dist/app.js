"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseSitemap = exports.get_shopify_defaut_sitemap = exports.upsertFile = exports.leibiexiangqing = exports.homepage = exports.crawlUrls = exports.top500 = exports.upwork = void 0;
//@ts-check
const { chromium, webkit, firefox } = require("playwright");
const http = require('http');
const express = require('express');
const cors = require("cors");
const Crawler = require('node-html-crawler');
const fs = require("fs");
const { DomHandler } = require("domhandler");
// const zipper =require("zip-local")
const got_1 = __importDefault(require("got"));
const serp_parser_1 = require("serp-parser");
const cheerio = require('cheerio');
var path = require('path');
const app = express();
app.use(cors());
function searchsitemap(url) {
    return __awaiter(this, void 0, void 0, function* () {
        const browser = yield webkit.launch();
        // Create a new incognito browser context.
        const context = yield browser.newContext({
            headless: false,
            ignoreHTTPSErrors: true,
            // proxy: { server: 'socks5://127.0.0.1:1080' },
        });
        const page = yield context.newPage();
        yield page.goto('https://www.google.com/search?q=' + url + '++sitemap.xml');
        const parser = new serp_parser_1.GoogleSERP(yield page.content());
        console.dir(parser.serp['organic']);
        let sitemapcandidate = [];
        for (let i = 0; i < parser.serp['organic'].length; i++) {
            let result = parser.serp['organic'][i]['url'];
            const rootdomain = rootdomainfromurl(url);
            console.log('root domain', rootdomain);
            if (result.includes('.xml') || result.includes(rootdomain)) {
                console.log('search sitemap xml', result);
                // fs.writeFileSync("shopify-sitemap-mapping.txt", +',' + result)
                sitemapcandidate.push(result);
            }
            //use i instead of 0
        }
        return sitemapcandidate;
    });
}
function isneedproxy(url) {
    return http.get(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            return true;
        }
        else {
            return false;
        }
    });
}
function rootdomainfromurl(url) {
    console.log('url for root domain', url);
    if (typeof url === 'string')
        url = new URL(url);
    const domain = url.hostname;
    const elems = domain.split('.');
    const iMax = elems.length - 1;
    const elem1 = elems[iMax - 1];
    const elem2 = elems[iMax];
    const isSecondLevelDomain = iMax >= 3 && (elem1 + elem2).length <= 5;
    return (isSecondLevelDomain ? elems[iMax - 2] + '.' : '') + elem1 + '.' + elem2;
}
function diff_sitemapindex_ornot_pl(url) {
    return __awaiter(this, void 0, void 0, function* () {
        const browser = yield webkit.launch();
        // Create a new incognito browser context.
        const context = yield browser.newContext({
            headless: false,
            ignoreHTTPSErrors: true,
            // proxy: { server: 'socks5://127.0.0.1:1080' },
        });
        const page = yield context.newPage();
        const res = yield page.goto(url, { timeout: 0 }).catch((e) => null);
        let data;
        if (res == null) {
            yield (0, got_1.default)(url).then((response) => {
                data = response.body;
            }).catch((err) => {
                console.log(err);
            });
        }
        else {
            data = yield res.body();
        }
        if (data == null) {
            return [[], []];
        }
        else {
            // console.log(data)
            const $ = cheerio.load(data);
            // console.log(await res.body())
            // 
            var list = [];
            console.log('=============');
            let subsitemaps = $('sitemap').find('loc')
                .toArray()
                .map((element) => $(element).text());
            let urlset = $('url loc').text().split('\n').map((el) => el.trim()).filter((a) => a);
            urlset = $('url').find('loc')
                .toArray()
                .map((element) => $(element).text());
            console.log('sitemapindex/sitemap', url, subsitemaps.length);
            console.log('urlset/url', url, urlset.length);
            yield browser.close();
            return [subsitemaps, urlset];
        }
    });
}
function parseSitemap(original_sitemapurl) {
    return __awaiter(this, void 0, void 0, function* () {
        const url_list = [];
        const [subsitemaps, locs] = yield diff_sitemapindex_ornot_pl(original_sitemapurl);
        if (subsitemaps.length > 0) {
            console.log(subsitemaps.filter((a) => a));
            console.log(original_sitemapurl, ' got sub sitemap', subsitemaps.length);
            for (let i = 0; i < subsitemaps.length; i++) {
                const sitemap_url = subsitemaps[i];
                const [[], locs] = yield diff_sitemapindex_ornot_pl(sitemap_url);
                for (let i = 0; i < locs.length; i++) {
                    url_list.push(locs[i]);
                }
            }
        }
        else if (locs.length > 0) {
            console.log(locs.filter((a) => a));
            for (let i = 0; i < locs.length; i++) {
                url_list.push(locs[i]);
            }
        }
        else {
            console.log('this url is not a valid sitemap url');
        }
        console.log('this url is  sitemap url', url_list[0]);
        return url_list;
    });
}
exports.parseSitemap = parseSitemap;
// 函数实现，参数 delay 单位 毫秒 ；
function sleep(delay) {
    for (var t = Date.now(); Date.now() - t <= delay;)
        ;
}
// 调用方法，同步执行，阻塞后续程序的执行；
function get_shopify_defaut_sitemap(url) {
    return __awaiter(this, void 0, void 0, function* () {
        let url_list_tmp = [];
        let url_list = [];
        const default_sitemap_url = "https://" + new URL(url).hostname + '/sitemap.xml';
        console.log('domain-', url, '--sitemapurl', default_sitemap_url);
        const default_sitemap_url_list = yield parseSitemap(default_sitemap_url);
        if (default_sitemap_url_list.length == 0) {
            console.log('default sitemap got no url', default_sitemap_url);
            // const sitemapcandiates = await searchsitemap(url)
            // console.log('try search sitemap url',sitemapcandiates[0])
            // const sitemapcandiates_url_list: Array<string> = []
            // if (sitemapcandiates.length > 1) {
            //   for (let i = 0; i < 1; i++) {
            //     const sitemapcandiates_url = sitemapcandiates[i]
            //     // sleep(500);
            //     url_list.push(sitemapcandiates_url)
            //     // const sitemapcandiates_url_list = await parseSitemap(sitemapcandiates_url)
            //     // url_list.push.apply(url_list, sitemapcandiates_url_list)
            //   }
            // } else {
            //   console.log('there is no candidacted sitemap in serp result')
            // }
        }
        else {
            url_list.push(default_sitemap_url);
        }
        return Array.from(new Set(url_list));
    });
}
exports.get_shopify_defaut_sitemap = get_shopify_defaut_sitemap;
function check_url_cato(url) {
    if (url.includes('/pages/')) {
    }
    else if (url.includes('/products/')) {
    }
    else if (url.includes('/collections/')) {
    }
    else if (url.includes('/blogs/')) {
    }
    else {
    }
}
function checkstoreispassword(url) {
    return __awaiter(this, void 0, void 0, function* () {
        const browser = yield webkit.launch();
        // Create a new incognito browser context.
        const context = yield browser.newContext({
            headless: false,
            ignoreHTTPSErrors: true,
            // proxy: { server: 'socks5://127.0.0.1:1080' }      ,
        });
        const page = yield browser.newPage();
        const res = yield page.goto(url);
        const redirect_url = res.url;
        if (redirect_url.includes('password')) {
            console.log('this site is under construction');
            return true;
        }
        else {
            return false;
        }
    });
}
function upsertFile(name) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('is file ok?');
        myMkdirSync(path.dirname(name));
        try {
            // try to read file
            yield fs.promises.readFile(name);
        }
        catch (error) {
            // create empty file, because it wasn't found
            yield fs.promises.writeFile(name, '');
        }
        return fs.readFileSync(name).toString().replace(/\r\n/g, '\n').split('\n');
    });
}
exports.upsertFile = upsertFile;
var myMkdirSync = function (dir) {
    if (fs.existsSync(dir)) {
        console.log('is parent dir ok?');
    }
    try {
        fs.mkdirSync(dir);
    }
    catch (err) {
        if (err.code == 'ENOENT') {
            console.log('parent dir', dir);
            myMkdirSync(path.dirname(dir)); //create parent dir
            myMkdirSync(dir); //create dir
        }
    }
};
function homepage(url) {
    return __awaiter(this, void 0, void 0, function* () {
        const browser = yield webkit.launch();
        const context = yield browser.newContext({
            headless: false,
            ignoreHTTPSErrors: true,
            //      proxy: { server: 'socks5://127.0.0.1:1080' },
        });
        const page = yield context.newPage();
        yield page.goto('https://www.merchantgenius.io');
        // console.log(await page.content())
        const yuefen = page.locator('xpath=//html/body/main/div/div[2]/a');
        yield upsertFile('./shopify-catalog.txt');
        yield upsertFile('./shopify-merchantgenius.txt');
        const cato = [];
        let diff_cato = [];
        let diff = false;
        for (let i = 0; i < (yield yuefen.count()); i++) {
            const suburl = yield yuefen.nth(i).getAttribute('href');
            const filename = suburl.split('/').pop();
            console.log('name', filename);
            const url = 'https://www.merchantgenius.io' + suburl;
            console.log(url);
            // <a href="/shop/date/2020-08-29"
            const history = fs.readFileSync('./shopify-catalog.txt').toString().replace(/\r\n/g, '\n').split('\n');
            const log = fs.createWriteStream('./shopify-catalog.txt', { flags: 'a' });
            // on new log entry ->
            console.log(history.includes(url));
            if (history.includes(url) == false) {
                log.write(url + "\n");
                diff = true;
                diff_cato.push(filename);
            }
            // you can skip closing the stream if you want it to be opened while
            // a program runs, then file handle will be closed
            log.end();
            cato.push(filename);
        }
        return diff_cato;
    });
}
exports.homepage = homepage;
function leibiexiangqing(cato) {
    return __awaiter(this, void 0, void 0, function* () {
        const browser = yield webkit.launch();
        const context = yield browser.newContext({
            headless: false,
            ignoreHTTPSErrors: true,
            //      proxy: { server: 'socks5://127.0.0.1:1080' },
        });
        const p_page = yield context.newPage();
        let domains = [];
        for (let i = 0; i < cato.length; i++) {
            const filename = cato[i];
            const url = 'https://www.merchantgenius.io/shop/date/' + filename;
            const history = yield upsertFile("./merchantgenius/shopify-" + filename + ".txt");
            console.log(filename, ' contains ', history.length);
            if (history.length == 1) {
                console.log('dig url published on ', url);
                yield p_page.goto(url);
                // await p_page.goto(url)
                // console.log(await p_page.content())
                const shopurls = p_page.locator('.blogImage [href^="/shop/url/"]');
                console.log('loading exisit domain', history.length);
                const tmp = p_page.locator('div.container:nth-child(4)');
                const t = yield tmp.textContent();
                const url_count = t.split('stores were found.')[0].split('A total of ')[1];
                console.log('total count in page', url_count, 'we detected ', yield shopurls.count());
                if (url_count < history.length) {
                    console.log('there is need to   saving');
                }
                else {
                    for (let i = 0; i < (yield shopurls.count()); i++) {
                        const url = yield shopurls.nth(i).getAttribute('href');
                        const domain = url.split('/shop/url/').pop();
                        if (history.indexOf(domain) > -1) {
                            console.log('this domain is done', domain);
                        }
                        else {
                            domains.push(domain);
                            history.push(domain);
                            console.log('bingo', domain);
                        }
                    }
                    const uniqdomains = Array.from(new Set(history));
                    console.log('founded domains', uniqdomains.length, ' under ', filename);
                    console.log('============start saving==========', filename);
                    savedomains(uniqdomains, filename);
                    console.log('============finish saving==========', filename);
                }
            }
            else {
                console.log('this cato has been scraped', cato[i]);
            }
        }
        return Array.from(new Set(domains));
    });
}
exports.leibiexiangqing = leibiexiangqing;
function savedomains(uniqdomains, filename) {
    const catohistory = fs.readFileSync('shopify-merchantgenius.txt').toString().replace(/\r\n/g, '\n').split('\n');
    console.log('loading exisit domain', catohistory.length);
    const log1 = fs.createWriteStream('shopify-merchantgenius.txt', { flags: 'a' });
    // console.log('saving domain to index text',uniqdomains[i])
    const history = fs.readFileSync("merchantgenius/shopify-" + filename + ".txt").toString().replace(/\r\n/g, '\n').split('\n');
    console.log('loading exisit domain', history.length);
    const log = fs.createWriteStream("merchantgenius/shopify-" + filename + ".txt", { flags: 'w' });
    for (let i = 0; i < uniqdomains.length; i++) {
        if (catohistory.includes(uniqdomains[i]) == false) {
            log1.write(uniqdomains[i] + "\n");
        }
        // on new log entry ->
        if (history.includes(uniqdomains[i]) == false) {
            log.write(uniqdomains[i] + "\n");
        }
    }
    log1.end();
    log.end();
}
app.get("/upwork", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield upwork();
}));
function upwork() {
    return __awaiter(this, void 0, void 0, function* () {
        const browser = yield webkit.launch();
        const context = yield browser.newContext({
            headless: false,
            ignoreHTTPSErrors: true,
            proxy: { server: 'socks5://127.0.0.1:1080' },
        });
        yield upsertFile('./upwork-tiktok.json');
        yield upsertFile('./upwork-youtube.json');
        yield upsertFile('./upwork-nft.json');
        const p_page = yield context.newPage();
        for (let item of ['tiktok', 'youtube', 'nft']) {
            const url = "https://www.upwork.com/nx/jobs/search/?q=" + item + "&per_page=10&sort=recency";
            console.log(url);
            // https://www.upwork.com/nx/jobs/search/?q=tiktok&sort=recency
            const res = yield p_page.goto(url, { timeout: 0 });
            // console.log(await res.text())
            const total = yield p_page.locator('div.pt-20:nth-child(3) > div:nth-child(1) > span:nth-child(1) > strong:nth-child(1)').textContent();
            const totalcount = total.replace(',', '');
            console.log(totalcount);
            // .text()
            const pages = Math.round(totalcount / 50); //  5            5            6
            console.log('total count in page', totalcount, "===", item);
            const log = fs.createWriteStream('./upwork-' + item + '.json', { flags: 'a' });
            log.write('[');
            for (let p = 0; p < pages; p++) {
                const pageurl = "https://www.upwork.com/nx/jobs/search/?q=" + item + "&per_page=50&sort=recency" + '&page=' + p;
                yield p_page.goto(pageurl, { timeout: 0 });
                const joburls = p_page.locator('a[href^="/job/"]');
                console.log('we detected ', pageurl, yield joburls.count());
                for (let i = 0; i < (yield joburls.count()); i++) {
                    let jobtitle = yield joburls.nth(i).textContent();
                    jobtitle = jobtitle.replace('\r', '');
                    jobtitle = jobtitle.replace('\n', '').trim();
                    console.log(yield joburls.nth(i).getAttribute('href'));
                    const joburl = 'https://www.upwork.com' + (yield joburls.nth(i).getAttribute('href'));
                    yield p_page.goto(joburl, { timeout: 0 });
                    let jobdes = yield p_page.locator('.job-description > div:nth-child(1)').textContent().trim();
                    let jobskill = yield p_page.locator('section.up-card-section:nth-child(5) > div:nth-child(2)').textContent().trim();
                    // console.log(jobdes)
                    // jobdes=jobdes.replace('\n',' ')
                    jobdes = jobdes.replace('\r', ' ');
                    jobskill = jobskill.split("\n").join(" ");
                    // console.log(jobdes)
                    jobskill = jobskill.replace('\r', '\n');
                    jobskill = jobskill.split("\n").join(",");
                    // console.log(jobdes)
                    const job = {
                        "title": jobtitle,
                        "url": joburl,
                        "des": jobdes,
                        "tag": jobskill
                    };
                    console.log(job);
                    // on new log entry ->
                    log.write(JSON.stringify(job, null, 2));
                    // you can skip closing the stream if you want it to be opened while
                    // a program runs, then file handle will be closed
                    log.write(',');
                }
            }
            log.write(']');
            log.end();
        }
    });
}
exports.upwork = upwork;
function top500() {
    return __awaiter(this, void 0, void 0, function* () {
        const browser = yield webkit.launch();
        const context = yield browser.newContext({
            headless: false,
            ignoreHTTPSErrors: true,
            // proxy: { server: 'socks5://127.0.0.1:1080' },
        });
        yield upsertFile('./shopify-top-500-afership.txt');
        const rawjson = yield upsertFile('./page-data.json');
        if (rawjson.length == 0) {
            const options = {
                hostname: 'https://websites.am-static.com',
                path: '/www/v3/aftership/page-data/store-list/top-500-shopify-stores/page-data.json',
                // path: '/merchantgenius',
                method: 'GET'
            };
            http.get(options, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    const log = fs.createWriteStream('./page-data.json', { flags: 'w' });
                    log.write(body);
                    log.end();
                }
            });
        }
        const content = JSON.parse(yield fs.promises.readFile('./page-data.json'));
        console.log(content);
        const json = content['result']['pageContext']['story']['content']['storeList'];
        for (let i = 0; i < json.length; i++) {
            let item = json[i];
            console.log(item);
            const content = [item['url'], item['country'], item['company_name'], item['monthly_traffic'], item['alexa_url_info']['rank']];
            // "company_name": "BBC Shop US",
            // "country": "USA",
            // "country_name": "United States of America",
            // "domain": "shop.bbc.com",
            // "ecommerce_categories": [
            //   {
            //     "title": "entertainment",
            //     "path": "Entertainment"
            //   }
            // ],
            // "ecommerce_platform": "shopify",
            // "logo": "https://cella.s3.amazonaws.com/b/b/c/shop.bbc.com/logo/20200722_030712_shop.bbc.com.png",
            // "monthly_traffic": "416,700,000",
            // "url": "http://shop.bbc.com",
            // "alexa_url_info": {
            //   "rank": "83"
            // }
            const log = fs.createWriteStream('./shopify-top-500-afership.txt', { flags: 'a' });
            // on new log entry ->
            log.write(content + "\n");
            // you can skip closing the stream if you want it to be opened while
            // a program runs, then file handle will be closed
            log.end();
        }
    });
}
exports.top500 = top500;
function crawlUrls(url) {
    let url_list = [];
    const domain = rootdomainfromurl(url);
    const crawler = new Crawler(domain);
    crawler.crawl();
    crawler.on('data', (data) => url_list.push(data.url));
    crawler.on('error', (error) => console.error(error));
    crawler.on('end', () => console.log(`Finish! All urls on domain ${domain} a crawled!`));
    return url_list;
}
exports.crawlUrls = crawlUrls;
app.get("/scrapetop500", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield top500();
}));
app.get("/top500", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let uniqdomains = yield upsertFile("shopify-top-500-afership.txt");
    uniqdomains = uniqdomains.map((item) => item.split(',')[0]).filter(a => a);
    uniqdomains = Array.from(new Set(uniqdomains));
    console.log(uniqdomains);
    let url_list = [];
    console.log('qu chong hou domains', uniqdomains.length);
    for (let i = 0; i < uniqdomains.length; i++) {
        console.log('starting to do ==========', uniqdomains[i]);
        let filename = '';
        if (uniqdomains[i].includes('https://')) {
            filename = uniqdomains[i].replace('https://', '');
        }
        else if (uniqdomains[i].includes('http://')) {
            filename = uniqdomains[i].replace('http://', '');
            console.log('there is http', filename);
        }
        else {
            filename = uniqdomains[i];
        }
        console.log('sitemaps file is', filename);
        const done = yield upsertFile('sitemaps/' + filename + '-sitemap-urls.txt');
        let sitemapurl = '';
        if (done.length > 1) {
            console.log('this shop has scraped urls');
        }
        else {
            const sitemapurl = yield get_shopify_defaut_sitemap(uniqdomains[i]);
            if (sitemapurl.length == 0) {
                console.log('there is no sitemap url could found');
                url_list = crawlUrls(uniqdomains[i]);
            }
            else {
                // url_list = await parseSitemap(sitemapurl[0])
                console.log('there is  sitemap url  found', sitemapurl[0]);
                url_list = yield parseSitemap(sitemapurl[0]);
            }
            const log = fs.createWriteStream('sitemaps/' + filename + '-sitemap-urls.txt', { flags: 'a' });
            if (url_list.length > 1) {
                for (let i = 0; i < url_list.length; i++) {
                    log.write(url_list[i] + '\n');
                }
            }
        }
    }
    // compress 
    // zipper.sync.zip('./sitemaps').compress().save('./sitemaps-500.zip')
    // upload
}));
app.get("/merchantgenius", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const diff_cato = yield homepage('');
        if (diff_cato.length > 1) {
            const uniqdomains = yield leibiexiangqing(diff_cato);
            // const catohistory = fs.readFileSync('shopify-merchantgenius.txt').toString().replace(/\r\n/g, '\n').split('\n');
            for (let i = 0; i < uniqdomains.length; i++) {
                yield upsertFile('sitemaps/' + uniqdomains[i] + '-sitemap-urls.txt');
                // const url_list = await get_shopify_defaut_sitemap(uniqdomains[i])
                const sitemapurl = yield get_shopify_defaut_sitemap(uniqdomains[i]);
                const url_list = yield parseSitemap(sitemapurl[0]);
                const log = fs.createWriteStream('sitemaps/' + uniqdomains[i] + '-sitemap-urls.txt', { flags: 'a' });
                if (url_list.length > 1) {
                    for (let i = 0; i < url_list.length; i++) {
                        log.write(url_list[i] + '\n');
                    }
                }
            }
        }
    }
    catch (error) {
        console.log('error===', error);
    }
}));
