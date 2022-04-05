//@ts-check
const { chromium, webkit, firefox } = require("playwright");
const http = require('http');
const { randomUUID } = require('crypto'); // Added in: node v14.17.0
const express = require('express');
import { Request, Response, Application } from 'express';
const cors = require("cors");
const Crawler = require('node-html-crawler');
const fs = require("fs");
const { DomHandler } = require("domhandler");
// const zipper =require("zip-local")
import got from 'got';
// const cron = require('node-cron')
import https from 'https';
import { GoogleSERP } from 'serp-parser'
import Sheet from './models/sheets';
const { google } = require('googleapis');

const auth = new google.auth.GoogleAuth({
  keyFile: 'astral-oven-346308-83edca6d2187.json',
  scopes: ['https://www.googleapis.com/auth/cloud-platform'],
});
const drive = google.drive({
        version: 'v3',
        auth: auth
});


const cheerio = require('cheerio');
const sheetheader = {
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDO0zSU4B4WSKYp\nSyG4MgVU0QpiZIb2MWxDSfhDB/9cw9Bafzngv1WAEWA9MTNuRP5m3dvMkhsQsPst\nURvEvpS+3ki5hYm3Ed/eriTZWiOq+ZIDETJ98QYbD7OQpj5AfAfXVuinyEY9xGo7\ncA4HgADkDJx71Izd5c/1gWPmfkJ+FblRjEbg431E3LE5Pc2uE9jxz2l6H4Yxn4pj\nVZwnTTzvrPPJ+DpbIKv1EeoJcObPr4p1ZGhd1GuJagJSKKoNbt15rpAwzdtg/gav\n+sSqUAvugt/SD1UW/dmPFcdufbz5Ohmpnk+yy4Ce7Md1hAwYrPeroL2eALK0uiCY\nsV2P/UH9AgMBAAECggEASpSluuOgZde3t19E3weGnaGt1XI7qq6CxDb5w64wGvLv\ngJqtM8q7Ga3qXtaNnb9aX5y0JG4xPVEcmihL06QHvlYosmGhmfbjnAh++DPFdeN+\nEAYVB44w7fQ5A7m27AjtyOypg8s37REVX66WGIVDjPixOwQX8fJrjbOlYxn3f0BP\nKVVORhjlg1jrrMP+KHJfWuU/GzPkfeQK67nkWtaKf0ywzdRXkzEWz9Rr+tWwx5aW\nPCDQvnUjYvaN3GCr0ycF17GOejYw7dcmhsHW5A7wc5syX3HEmaNABad3h4c8o9MN\nHOQu/9IwYgx8PVpSIDphAI8EJnFUaxwHoCR125C2LwKBgQDsrLZKMAX2WtJAA0GU\nyglkQbN3TjY51JHYa3vcTK46JeuXK8wgh+7SDiTfrYNfOC9PeyXsnruz7CfLx343\nsxB60YlJ2g7+rzZG5Ny9bAQ59MuHu0k/U3LpV64XNjL2aSW7gvdaJaeAS1H6SlMT\nccGTgm8P6XQCsKTnsWgbYZu+FwKBgQDftolfbjde80l+J1wIDY0BncpNFYwsnDkb\nz1xOyAzEmagke8F2AnBnVSObJOACaHpxOt7Wv2gT/55mXjmXUiopaPBW9sGwF1Q8\n43srl9FwglnPjdlUGys0PCe8iVrB2ZkSjoWuzG1+EA3tMmZSYJ8mO2G2knh5vXt9\nX8PGSKIBCwKBgQDOaIJCiUdp5yNeeHiFjv5J1ZLzBd786IqZuIO5SZbZV6DzolrQ\nNDzwLS2zddwQ+ysnojsc9gK1k8vRSRam9R/2PTACnI5fR+eKRKbO/JljAj9PDOOA\nuwKIxtMpozcm9+TUeA/JKvW+SfIg2xlA6ADu6N57fhqTDgODnZEx8Bqn2QKBgHVk\nPdXb6iZjF8+hK8P2CGYuvLeSdQn7uGQFffTBOSH5V6g9YJliUkWHAbYptXrOBGJi\neAjMS/siiaZCD4p+TS2JqYSY265hr4x7+mg3tGmLnUEyuDZQQ22Xm2pt0TgjzRVV\nwISnNVWPax9q8RKNLTZMtsutNJb9fU2e8QadmpVdAoGAV+8CAzO5Ao73e2vLdIRT\nepmMlji8vU4NAfgTHjVoj0njFceL1sWWFnBAfsREl4ufm/r+oq0bwusYzOsPz7hL\nuKqtroZkz6K+rw0X8Nr4R6FGAqaJ5kiHNYwGVKD8wJOuumOsq7RMeKkzTAOof1pg\nK4M8lVE0Q+2XAXsRRSlMJJk=\n-----END PRIVATE KEY-----\n",
  "client_email": "google-drive-spider@astral-oven-346308.iam.gserviceaccount.com"
}
var path = require('path');
const app: Application = express();
app.use(cors());

async function searchsitemap(url: string) {
  const browser = await webkit.launch();
  // Create a new incognito browser context.
  const context = await browser.newContext(
    {
      headless: false,
      ignoreHTTPSErrors: true,
      // proxy: { server: 'socks5://127.0.0.1:1080' },
    });
  const page = await context.newPage();

  await page.goto('https://www.google.com/search?q=' + url + '++sitemap.xml');


  const parser = new GoogleSERP(await page.content());
  console.dir(parser.serp['organic']);

  let sitemapcandidate: Array<string> = []
  for (let i = 0; i < parser.serp['organic'].length; i++) {
    let result = parser.serp['organic'][i]['url']
    const rootdomain = rootdomainfromurl(url)
    console.log('root domain', rootdomain)
    if (result.includes('.xml') || result.includes(rootdomain)) {
      console.log('search sitemap xml', result)
      // fs.writeFileSync("shopify-sitemap-mapping.txt", +',' + result)
      sitemapcandidate.push(result)
    }
    //use i instead of 0

  }
  return sitemapcandidate

}

function isneedproxy(url: string) {

  return http.get(url, function (error: any, response: { statusCode: number; }, body: any) {
    if (!error && response.statusCode == 200) {
      return true
    } else {

      return false
    }

  })


}

function rootdomainfromurl(url: string | URL) {
  console.log('url for root domain', url)

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

async function diff_sitemapindex_ornot_pl(url: string) {

  const browser = await webkit.launch();
  // Create a new incognito browser context.
  const context = await browser.newContext(
    {
      headless: false,
      ignoreHTTPSErrors: true,
      // proxy: { server: 'socks5://127.0.0.1:1080' },
    });
  const page = await context.newPage();

  try {
    const res = await page.goto(url, { timeout: 0 }).catch((e: any) => null);
    let data
    if (res == null) {
      await got(url).then((response: { body: any; }) => {
        data = response.body
      }).catch((err: any) => {
        console.log(err);
      });
    } else {
      data = await res.body()
    }
    if (data == null) {
      return [[], []]
    } else {
      // console.log(data)
      const $ = cheerio.load(data);


      // console.log(await res.body())
      // 
      var list = []
      console.log('=============',)
      let subsitemaps = $('sitemap').find('loc')
        .toArray()
        .map((element: any) => $(element).text())

      let urlset = $('url loc').text().split('\n').map((el: string) => el.trim()).filter((a: any) => a)
      urlset = $('url').find('loc')
        .toArray()
        .map((element: any) => $(element).text())
      console.log('sitemapindex/sitemap', url, subsitemaps.length)
      console.log('urlset/url', url, urlset.length)
      await browser.close()
      return [subsitemaps, urlset]


    }

  } catch (e) {
    console.log('Here I am in catch block ' + e);
    browser.close()
    return []

  }


}
async function parseSitemap(original_sitemapurl: string) {
  const url_list: Array<string> = []
  const [subsitemaps, locs] = await diff_sitemapindex_ornot_pl(original_sitemapurl)
  if (subsitemaps.length > 0) {
    console.log(subsitemaps.filter((a: any) => a))
    console.log(original_sitemapurl, ' got sub sitemap', subsitemaps.length)
    for (let i = 0; i < subsitemaps.length; i++) {
      const sitemap_url = subsitemaps[i]
      const [[], locs] = await diff_sitemapindex_ornot_pl(sitemap_url)
      for (let i = 0; i < locs.length; i++) {
        url_list.push(locs[i])
      }
    }
  } else if (locs.length > 0) {
    console.log(locs.filter((a: any) => a))

    for (let i = 0; i < locs.length; i++) {
      url_list.push(locs[i])
    }
  }
  else {

    console.log('this url is not a valid sitemap url')

  }
  console.log('this url is  sitemap url', url_list[0])

  return url_list


}

// 函数实现，参数 delay 单位 毫秒 ；
function sleep(delay: number) {
  for (var t = Date.now(); Date.now() - t <= delay;);
}

// 调用方法，同步执行，阻塞后续程序的执行；
async function get_shopify_defaut_sitemap(url: string) {
  let url_list_tmp: Array<string> = []
  let url_list: Array<string> = []

  const default_sitemap_url = "https://" + new URL(url).hostname + '/sitemap.xml'
  console.log('domain-', url, '--sitemapurl', default_sitemap_url)
  const default_sitemap_url_list = await parseSitemap(default_sitemap_url)
  if (default_sitemap_url_list.length == 0) {
    console.log('default sitemap got no url', default_sitemap_url)
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


  } else {
    url_list.push(default_sitemap_url)


  }

  return Array.from(new Set(url_list));
}
function check_url_cato(url: string) {
  if (url.includes('/pages/')) {

  } else if (url.includes('/products/')) {


  } else if (url.includes('/collections/')) {

  } else if (url.includes('/blogs/')) {

  } else {


  }



}
async function checkstoreispassword(url: string) {
  const browser = await webkit.launch();
  // Create a new incognito browser context.
  const context = await browser.newContext(
    {
      headless: false,
      ignoreHTTPSErrors: true,
      // proxy: { server: 'socks5://127.0.0.1:1080' }      ,
    });
  const page = await browser.newPage();

  const res = await page.goto(url);
  const redirect_url = res.url
  if (redirect_url.includes('password')) {
    console.log('this site is under construction')
    return true
  } else {

    return false
  }




}

function download_google_drive(fileId: any) {

  drive.files
    .get({ fileId, alt: 'media' }, { responseType: 'stream' })
    .then((res: { data: any; }) => {
      return res.data
    }
    );
}

async function upsertFile_google_drive(filename: any, filepath: any, mimeType: any) {

  let fileid = ''
  const res = await drive.files.list({
    pageSize: 10,
    fields: 'nextPageToken, files(id, name)',
  });
  const files = res.data.files;
  if (files.length === 0) {
    console.log('No files found.');
  } else {
    console.log('Files:');
    for (const file of files) {
      if (file.name == filename) {
        fileid = file.id

      }
    }

  }
  if (fileid == '') {

    const res = await drive.files.create({
      requestBody: {
        name: filename,
        mimeType: mimeType
      },
      media: {
        mimeType: mimeType,
        body: fs.createReadStream(filepath)
      },
      resouce: {
        name: filename,
        parents: ['17Qo6cOvChdRdc6YtvZcnO0uAn916D-d7']

      },
      fields: 'id',
    });
  } else {
    download_google_drive(fileid)

  }

}
async function upsertFile(name: string) {
  console.log('is file ok?')
  myMkdirSync(path.dirname(name));

  try {
    // try to read file
    await fs.promises.readFile(name)
  } catch (error) {
    // create empty file, because it wasn't found
    await fs.promises.writeFile(name, '')
  }
  return fs.readFileSync(name).toString().replace(/\r\n/g, '\n').split('\n');

}


var myMkdirSync = function (dir: String) {
  if (fs.existsSync(dir)) {
    console.log('is parent dir ok?')
  }

  try {
    fs.mkdirSync(dir)

  } catch (err: any) {
    if (err.code == 'ENOENT') {
      console.log('parent dir', dir)
      myMkdirSync(path.dirname(dir)) //create parent dir
      myMkdirSync(dir) //create dir
    }
  }
}





async function homepage(url: string) {
  const browser = await webkit.launch();

  const context = await browser.newContext(
    {
      headless: false,
      ignoreHTTPSErrors: true,
      //      proxy: { server: 'socks5://127.0.0.1:1080' },
    });
  const page = await context.newPage();


  await page.goto('https://www.merchantgenius.io', { timeout: 0 })
  // console.log(await page.content())
  const yuefen = page.locator('xpath=//html/body/main/div/div[2]/a')
  await upsertFile('./shopify-catalog.txt')
  await upsertFile('./shopify-merchantgenius.txt')

  const cato = []
  let diff_cato = []
  let diff: boolean = false
  for (let i = 0; i < await yuefen.count(); i++) {
    const suburl = await yuefen.nth(i).getAttribute('href')
    const filename = suburl.split('/').pop()
    console.log('name', filename)
    const url = 'https://www.merchantgenius.io' + suburl
    console.log(url)
    // <a href="/shop/date/2020-08-29"
    const history = fs.readFileSync('./shopify-catalog.txt').toString().replace(/\r\n/g, '\n').split('\n');
    const log = fs.createWriteStream('./shopify-catalog.txt', { flags: 'a' });

    // on new log entry ->
    console.log(history.includes(url))
    if (history.includes(url) == false) {
      log.write(url + "\n");
      diff = true
      diff_cato.push(filename)
    }
    // you can skip closing the stream if you want it to be opened while
    // a program runs, then file handle will be closed
    log.end();

    cato.push(filename)

  }
  browser.close()
  return diff_cato


}

async function leibiexiangqing(cato: Array<string>) {
  const browser = await webkit.launch();

  const context = await browser.newContext(
    {
      headless: false,
      ignoreHTTPSErrors: true,
      //      proxy: { server: 'socks5://127.0.0.1:1080' },
    });
  const p_page = await context.newPage();
  let domains: Array<string> = []


  for (let i = 0; i < cato.length; i++) {
    const filename = cato[i]
    const url = 'https://www.merchantgenius.io/shop/date/' + filename


    const history: Array<string> = await upsertFile("./merchantgenius/shopify-" + filename + ".txt")
    console.log(filename, ' contains ', history.length)
    if (history.length == 1) {
      console.log('dig url published on ', url)
      try {
        await p_page.goto(url, { timeout: 0 })
        // await p_page.goto(url)

        // console.log(await p_page.content())
        const shopurls = p_page.locator('.blogImage [href^="/shop/url/"] .dateLinks')
        console.log('loading exisit domain', history.length)

        const tmp = p_page.locator('div.container:nth-child(4)')
        const t = await tmp.textContent()
        const url_count = t.split('stores were found.')[0].split('A total of ')[1]
        console.log('total count in page', url_count, 'we detected ', await shopurls.count())

        if (url_count < history.length) {
          console.log('there is need to   saving')
        } else {
          // <a style="text-decoration:none; color:grey; text-transform: uppercase;
          // font-size: 85%;" href="/shop/date/2022-04-03">See all from April 3, 2022 →</a>

          // <a href="/shop/date/2022-04-02"><button style="cursor: pointer;" class="dateLinks">04/02</button></a>
          for (let i = 1; i < await shopurls.count(); i++) {
            const url = await shopurls.nth(i).getAttribute('href')
            const domain = url.split('/shop/url/').pop()
            if (history.indexOf(domain) > -1) {
              console.log('this domain is done', domain)
            } else {
              domains.push(domain)
              history.push(domain)
              console.log('bingo', domain)

            }
          }
          const uniqdomains = Array.from(new Set(history));
          console.log('founded domains', uniqdomains.length, ' under ', filename)
          console.log('============start saving==========', filename)

          savedomains(uniqdomains, filename)
          console.log('============finish saving==========', filename)

        }
      } catch (e) {
        console.log('couldnot access this page ' + e);
        browser.close()

      }
    }
    else {

      console.log('this cato has been scraped', cato[i])
    }
  }
  browser.close()

  return Array.from(new Set(domains));
}
function savedomains(uniqdomains: Array<string>, filename: string) {

  const catohistory = fs.readFileSync('shopify-merchantgenius.txt').toString().replace(/\r\n/g, '\n').split('\n');
  console.log('loading exisit domain', catohistory.length)
  const log1 = fs.createWriteStream('shopify-merchantgenius.txt', { flags: 'a' });
  // console.log('saving domain to index text',uniqdomains[i])
  const history = fs.readFileSync("merchantgenius/shopify-" + filename + ".txt").toString().replace(/\r\n/g, '\n').split('\n');
  console.log('loading exisit domain', history.length)

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




function getgoogleonesheet(docid: string,index:string) {

  // https://docs.google.com/spreadsheets/d/1FDnff04yl9dN7QOmJooC_5hESHRhFmKUUN1DPvoVrEU/edit#gid=0
  // docid = '1FDnff04yl9dN7QOmJooC_5hESHRhFmKUUN1DPvoVrEU'
  const options = {
    hostname: 'google-sheets-rest.herokuapp.com',
    port: 443,
    // path: '/top500',
    path: '/sheets/' + docid+'/'+index,
    method: 'GET',
  }

  let data=''
  const req = https.request(options, res => {
    console.log(`statusCode: ${res.statusCode}`)
  
    res.on('data', d => {
      data=d
      // process.stdout.write(d)

      // {  
      //   "sheet": {
      //     "index": 0,
      //     "data": [
      //       {
      //         "name": "Isaac",
      //         "age": "25",
      //         "birth day": "25/12/1995"
      //       },
      //       {
      //         "name": "lavinia",
      //         "age": "20",
      //         "birth day": "23/08/2000"
      //       }
      //     ]
      //   }
      // }
    })
  })
  
  req.on('error', error => {
    console.error(error)
  })
  
  req.end()  

  return data
}
function getgooglesheets(docid: string) {

  // https://docs.google.com/spreadsheets/d/1FDnff04yl9dN7QOmJooC_5hESHRhFmKUUN1DPvoVrEU/edit#gid=0
  // docid = '1FDnff04yl9dN7QOmJooC_5hESHRhFmKUUN1DPvoVrEU'
  const optionstop500 = {
    hostname: 'google-sheets-rest.herokuapp.com',
    port: 443,
    // path: '/top500',
    path: '/sheets/' + docid,
    method: 'GET',
  }
}

function addrow2googlesheet(docId: string, index: string, data: string) {
  const options = {
    hostname: "",
    port: 443,
    path: '/sheets/' + docId +'/'+ index

  }

  const req = https.request(options, res => {
    console.log(`statusCode: ${res.statusCode}`)

    res.on('data', d => {
      process.stdout.write(d)
    })
  })

  req.on('error', error => {
    console.error(error)
  })

  req.write(data)
  req.end()



  //   {
  //     "rowValues": [
  //     {"name": "Dilma", "age": 53},
  //     {"name": "Pedro", "age": 56}
  //   ]
  // }

}
async function upwork(item: string) {
  const browser = await webkit.launch();

  const context = await browser.newContext(
    {
      headless: false,
      ignoreHTTPSErrors: true,
      // proxy: { server: 'socks5://127.0.0.1:1080' },
    });
  // await upsertFile('./upwork/upwork-tiktok.json')
  // await upsertFile('./upwork/upwork-youtube.json')
  // await upsertFile('./upwork/upwork-nft.json')
  const p_page = await context.newPage();
  // for (let item of ['tiktok', 'youtube', 'nft']) {
  const url = "https://www.upwork.com/nx/jobs/search/?q=" + item + "&per_page=10&sort=recency"
  console.log(url)
  // https://www.upwork.com/nx/jobs/search/?q=tiktok&sort=recency
  const res = await p_page.goto(url, { timeout: 0 })
  // console.log(await res.text())
  const total = await p_page.locator('div.pt-20:nth-child(3) > div:nth-child(1) > span:nth-child(1) > strong:nth-child(1)').textContent()
  const totalcount = total.replace(',', '')
  console.log(totalcount)
  // .text()
  const pages = Math.round(totalcount / 50) //  5            5            6
  // console.log('total count in page', totalcount, "===", item)
  // const log = fs.createWriteStream('./upwork/upwork-' + item + '.json', { flags: 'a' });

  // log.write('[');

  for (let p = 0; p < pages; p++) {

    const pageurl = "https://www.upwork.com/nx/jobs/search/?q=" + item + "&per_page=50&sort=recency" + '&page=' + p
    await p_page.goto(pageurl, { timeout: 0 })

    const joburls = p_page.locator('a[href^="/job/"]')
    console.log('we detected ', pageurl, await joburls.count())
    const sheetid = ''
    for (let i = 0; i < await joburls.count(); i++) {

      let jobtitle = await joburls.nth(i).textContent()
      jobtitle = jobtitle.replace('\r', '')
      jobtitle = jobtitle.replace('\n', '').trim()
      console.log(await joburls.nth(i).getAttribute('href'))
      const joburl = 'https://www.upwork.com' + await joburls.nth(i).getAttribute('href')
      await p_page.goto(joburl, { timeout: 0 })
      let jobdes = await p_page.locator('.job-description > div:nth-child(1)').textContent().trim()
      let jobskill = await p_page.locator('section.up-card-section:nth-child(5) > div:nth-child(2)').textContent().trim()
      // console.log(jobdes)
      // jobdes=jobdes.replace('\n',' ')
      jobdes = jobdes.replace('\r', ' ')
      jobskill = jobskill.split("\n").join(" ")

      // console.log(jobdes)
      jobskill = jobskill.replace('\r', '\n')

      jobskill = jobskill.split("\n").join(",")
      // console.log(jobdes)
      const job = [{
        "id": randomUUID(),
        "keyword":item,
        "title": jobtitle,
        "url": joburl,
        "des": jobdes,
        "tag": jobskill,
        "update": Date.now()
      }]

      const data = JSON.stringify({
        "rowValues": job
      })

      // https://docs.google.com/spreadsheets/d/1eXeaUurrqHsS0thkKzyDQdhCMeNYmt9a3pdLa0tPy44/edit#gid=0
      addrow2googlesheet('1eXeaUurrqHsS0thkKzyDQdhCMeNYmt9a3pdLa0tPy44', '1', data)
      // on new log entry ->
      // log.write(JSON.stringify(job, null, 2));
      // you can skip closing the stream if you want it to be opened while
      // a program runs, then file handle will be closed
      // log.write(',');


    }
  }




}
async function top500() {
  const browser = await webkit.launch();

  const context = await browser.newContext(
    {
      headless: false,
      ignoreHTTPSErrors: true,
      // proxy: { server: 'socks5://127.0.0.1:1080' },
    });
  await upsertFile('./shopify-top-500-afership.txt')
  const rawjson = await upsertFile('./page-data.json')
  if (rawjson.length == 0) {
    const options = {
      hostname: 'https://websites.am-static.com',
      path: '/www/v3/aftership/page-data/store-list/top-500-shopify-stores/page-data.json',
      // path: '/merchantgenius',
      method: 'GET'
    }
    http.get(options, function (error: any, response: { statusCode: number; }, body: any) {
      if (!error && response.statusCode == 200) {
        const log = fs.createWriteStream('./page-data.json', { flags: 'w' });
        log.write(body)
        log.end()
      }
    })

  }
  const content = JSON.parse(await fs.promises.readFile('./page-data.json'))
  console.log(content)
  const json = content['result']['pageContext']['story']['content']['storeList']

  for (let i = 0; i < json.length; i++) {
    let item = json[i]
    console.log(item)
    const content = [item['url'], item['country'], item['company_name'], item['monthly_traffic'], item['alexa_url_info']['rank']]

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


}
function crawlUrls(url: string) {


  let url_list: Array<string> = []
  const domain = rootdomainfromurl(url);
  const crawler = new Crawler(domain);

  crawler.crawl();
  crawler.on('data', (data: { result: { statusCode: any; }; url: any; }) => url_list.push(data.url));
  crawler.on('error', (error: any) => console.error(error));
  crawler.on('end', () => console.log(`Finish! All urls on domain ${domain} a crawled!`));
  return url_list

}

//   {
//     "keyword: "google",
//     "totalResults": 15860000000,
//     "timeTaken": 0.61,
//     "currentPage": 1,
//     "pagination": [
//       { page: 1,
//         path: "" },
//       { page: 2,
//         path: "/search?q=google&safe=off&gl=US&pws=0&nfpr=1&ei=N1QvXKbhOLCC5wLlvLa4Dg&start=10&sa=N&ved=0ahUKEwjm2Mn2ktTfAhUwwVkKHWWeDecQ8tMDCOwB" },
//       ...
//     ],
//     "videos": [
//       { title: "The Matrix YouTube Movies Science Fiction - 1999 $ From $3.99",
//         sitelink: "https://www.youtube.com/watch?v=3DfOTKGvtOM",
//         date: 2018-10-28T23:00:00.000Z,
//         source: "YouTube",
//         channel: "Warner Movies On Demand",
//         videoDuration: "2:23" },
//       ...
//     ],
//     "thumbnailGroups": [
//         { "heading": "Organization software",
//           "thumbnails:": [ {
//             "sitelink": "/search?safe=off&gl=US&pws=0&nfpr=1&q=Microsoft&stick=H4sIAAAAAAAAAONgFuLUz9U3MDFNNk9S4gAzi8tMtGSyk630k0qLM_NSi4v1M4uLS1OLrIozU1LLEyuLVzGKp1n5F6Un5mVWJZZk5ucpFOenlZQnFqUCAMQud6xPAAAA&sa=X&ved=2ahUKEwjm2Mn2ktTfAhUwwVkKHWWeDecQxA0wHXoECAQQBQ",
//             "title": "Microsoft Corporation"
//           },
//           ...
//         ]
//       },
//       ...
//     ],
//     "organic": [
//       {
//         "domain": "www.google.com",
//         "position": 1,
//         "title": "Google",
//         "url": "https://www.google.com/",
//         "cachedUrl": "https://webcache.googleusercontent.com/search?q=cache:y14FcUQOGl4J:https://www.google.com/+&cd=1&hl=en&ct=clnk&gl=us",
//         "similarUrl": "/search?safe=off&gl=US&pws=0&nfpr=1&q=related:https://www.google.com/+google&tbo=1&sa=X&ved=2ahUKEwjm2Mn2ktTfAhUwwVkKHWWeDecQHzAAegQIARAG",
//         "linkType": "HOME",
//         "sitelinks": [
//           { "title": "Google Docs",
//             "snippet": "Google Docs brings your documents to life with smart ...",
//             "type": "card" },
//           { "title": "Google News",
//             "snippet": "Comprehensive up-to-date news coverage, aggregated from ...",
//             "type": "card" },
//           ...
//         ],
//         "snippet": "Settings Your data in Search Help Send feedback. AllImages. Account · Assistant · Search · Maps · YouTube · Play · News · Gmail · Contacts · Drive · Calendar."
//       },
//       {
//         "domain": "www.google.org",
//         "position": 2,
//         "title": "Google.org: Home",
//         "url": "https://www.google.org/",
//         "cachedUrl": "https://webcache.googleusercontent.com/search?q=cache:Nm9ycLj-SKoJ:https://www.google.org/+&cd=24&hl=en&ct=clnk&gl=us",
//         "similarUrl": "/search?safe=off&gl=US&pws=0&nfpr=1&q=related:https://www.google.org/+google&tbo=1&sa=X&ved=2ahUKEwjm2Mn2ktTfAhUwwVkKHWWeDecQHzAXegQIDBAF",
//         "linkType": "HOME",
//         "snippet": "Data-driven, human-focused philanthropy powered by Google. We bring the best of Google to innovative nonprofits that are committed to creating a world that..."
//       },
//       ...
//     ],
//     "relatedKeywords": [
//       { keyword: google search,
//         path: "/search?safe=off&gl=US&pws=0&nfpr=1&q=google+search&sa=X&ved=2ahUKEwjm2Mn2ktTfAhUwwVkKHWWeDecQ1QIoAHoECA0QAQ" },
//       { keyword: google account,
//         path: "/search?safe=off&gl=US&pws=0&nfpr=1&q=google+account&sa=X&ved=2ahUKEwjm2Mn2ktTfAhUwwVkKHWWeDecQ1QIoAXoECA0QAg" },
//       ...
//     ]
//   }




// app.listen(8081, () => {
//   console.log("server started");

//   // cron.schedule("* * * * *", function () {
//   //   // API call goes here
//   //   console.log("running a task every minute");
//   // const optionstop500 = {
//   //   hostname: 'localhost',
//   //   port: 8083,
//   //   path: '/top500',
//   //   // path: '/merchantgenius',
//   //   method: 'GET'
//   // }
//   // http.get(optionstop500, function (error: any, response: { statusCode: number; }, body: any) {
//   //   if (!error && response.statusCode == 200) {
//   //     console.log(body) // Print the google web page.
//   //   }
//   // })



//   // const optionsmerchantgenius = {
//   //   hostname: 'localhost',
//   //   port: 8083,
//   //   // path: '/top500',
//   //   path: '/merchantgenius',
//   //   method: 'GET'
//   // }
//   // http.get(optionsmerchantgenius, function (error: any, response: { statusCode: number; }, body: any) {
//   //   if (!error && response.statusCode == 200) {
//   //     console.log(body) // Print the google web page.
//   //   }
//   // })



//   // const optionsupwork = {
//   //   hostname: 'localhost',
//   //   port: 8083,
//   //   path: '/upwork',
//   //   method: 'GET'
//   // }
//   // http.get(optionsupwork, function (error: any, response: { statusCode: number; }, body: any) {
//   //   if (!error && response.statusCode == 200) {
//   //     console.log(body) // Print the google web page.
//   //   }
//   // })      



//   // })
// })
export { upwork, top500, crawlUrls, homepage,getgoogleonesheet, leibiexiangqing, upsertFile, get_shopify_defaut_sitemap, parseSitemap }

