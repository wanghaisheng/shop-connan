import cheerio from 'cheerio';
// import sites from './sitesToCrawl.json';
import {upsertFile,get_shopify_defaut_sitemap,crawlUrls,parseSitemap} from './app.js'
const KV_KEY = 'links';

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});
/**
 * Respond with hello worker text
 * @param {Request} request
 * @returns {Response.text} link tree in siteMapUrl -> links[] format
 */
async function handleRequest(request) {
  const kv = JSON.parse(await KV.get(KV_KEY)) || {};
  let uniqdomains = await upsertFile("shopify-top-500-afership.txt")
  uniqdomains = uniqdomains.map((item) => item.split(',')[0]).filter(a => a)
  sites = Array.from(new Set(uniqdomains))
  const siteMaps = [];
  for (const site of sites) {
    siteMaps.push(...(await getLinks(site + '/sitemap.xml', true)));
  }
  for (const sitemap of siteMaps) {
    kv[sitemap] = await getLinks(sitemap);
  }

  const result = JSON.stringify(kv);

  await KV.put(KV_KEY, result);  

  for (const site of sites) {
    const sitemapurl = await get_shopify_defaut_sitemap(site)
    if (sitemapurl.length == 0) {
      console.log('there is no sitemap url could found')
      url_list = crawlUrls(site)
  
    } else {
      // url_list = await parseSitemap(sitemapurl[0])
      console.log('there is  sitemap url  found', sitemapurl[0])
      url_list = await parseSitemap(sitemapurl[0])
    }
    

    kv[site+'-urls'] = url_list
  }

  const urlresult = JSON.stringify(kv);

  await KV.put(KV_KEY, urlresult);

  return new Response(result, {
    headers: { 'content-type': 'application/json' },
  });
}

async function getLinks(url, onlySiteMapUrls = false) {
  const options = {
    headers: {
      'content-type': 'text/html;charset=UTF-8',
    },
  };

  const response = await fetch(url, options);
  const result = await response.text();

  const $ = cheerio.load(result);
  const linkObjects = $('loc');

  const _links = [];
  linkObjects.each((index, element) => {
    const linkText = $(element).text();
    if (onlySiteMapUrls && linkText.endsWith('.xml')) {
      _links.push(linkText);
    } else {
      _links.push(linkText);
    }
  });
  return _links;
}

async function getUrls(url, onlySiteMapUrls = false) {

  let uniqdomains = await upsertFile("shopify-top-500-afership.txt")
  uniqdomains = uniqdomains.map((item) => item.split(',')[0]).filter(a => a)
  uniqdomains = Array.from(new Set(uniqdomains))
  console.log(uniqdomains)
  let url_list = []

  console.log('qu chong hou domains', uniqdomains.length)
  for (let i = 0; i < uniqdomains.length; i++) {
    console.log('starting to do ==========', uniqdomains[i])
    let filename = ''

    if (uniqdomains[i].includes('https://')) {
      filename = uniqdomains[i].replace('https://', '')
    } else if (uniqdomains[i].includes('http://')) {
      filename = uniqdomains[i].replace('http://', '')
      console.log('there is http', filename)
    } else {
      filename = uniqdomains[i]
    }
    console.log('sitemaps file is', filename)
    const done = await upsertFile('sitemaps/' + filename + '-sitemap-urls.txt')
    let sitemapurl = ''
    if (done.length > 1) {
      console.log('this shop has scraped urls')
    } else {
      const sitemapurl = await get_shopify_defaut_sitemap(uniqdomains[i])
      if (sitemapurl.length == 0) {
        console.log('there is no sitemap url could found')
        url_list = crawlUrls(uniqdomains[i])

      } else {
        // url_list = await parseSitemap(sitemapurl[0])
        console.log('there is  sitemap url  found', sitemapurl[0])
        url_list = await parseSitemap(sitemapurl[0])
      }
      const log = fs.createWriteStream('sitemaps/' + filename + '-sitemap-urls.txt', { flags: 'a' });
      if (url_list.length > 1) {
        for (let i = 0; i < url_list.length; i++) {
          log.write(url_list[i] + '\n')
        }
      }
    }


  }
  // compress 
  // zip


}