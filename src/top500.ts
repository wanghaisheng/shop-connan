
const http = require('http');
const express = require('express');
import { Request, Response, Application } from 'express';
const cors = require("cors");
const fs = require("fs");

const app: Application = express();
app.use(cors());
import {top500,upsertFile,get_shopify_defaut_sitemap,crawlUrls,parseSitemap} from './app'
app.get("/scrapetop500", async (req: Request, res: Response) => {
  await top500()
})
app.get("/top500", async (req: Request, res: Response) => {
  let uniqdomains: Array<string> = await upsertFile("shopify-top-500-afership.txt")
  uniqdomains = uniqdomains.map((item) => item.split(',')[0]).filter(a => a)
  uniqdomains = Array.from(new Set(uniqdomains))
  console.log(uniqdomains)
  let url_list: Array<string> = []

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
  // zipper.sync.zip('./sitemaps').compress().save('./sitemaps-500.zip')
  // upload
})

app.listen(8081, () => {
        console.log("server started");
  
        // cron.schedule("* * * * *", function () {
        //   // API call goes here
        //   console.log("running a task every minute");
        const optionstop500 = {
          hostname: 'localhost',
          port: 8081,
          path: '/top500',
          // path: '/merchantgenius',
          method: 'GET'
        }
        http.get(optionstop500, function (error: any, response: { statusCode: number; }, body: any) {
          if (!error && response.statusCode == 200) {
            console.log(body) // Print the google web page.
          }
        })
  
  
  
        // const optionsmerchantgenius = {
        //   hostname: 'localhost',
        //   port: 8083,
        //   // path: '/top500',
        //   path: '/merchantgenius',
        //   method: 'GET'
        // }
        // http.get(optionsmerchantgenius, function (error: any, response: { statusCode: number; }, body: any) {
        //   if (!error && response.statusCode == 200) {
        //     console.log(body) // Print the google web page.
        //   }
        // })
  
  
  
        // const optionsupwork = {
        //   hostname: 'localhost',
        //   port: 8083,
        //   path: '/upwork',
        //   method: 'GET'
        // }
        // http.get(optionsupwork, function (error: any, response: { statusCode: number; }, body: any) {
        //   if (!error && response.statusCode == 200) {
        //     console.log(body) // Print the google web page.
        //   }
        // })      
  
  
  
        // })
      })
  