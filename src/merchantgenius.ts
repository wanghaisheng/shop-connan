
const http = require('http');
const express = require('express');
import { Request, Response, Application } from 'express';
const cors = require("cors");
const fs = require("fs");

const app: Application = express();
app.use(cors());


import{homepage,leibiexiangqing,upsertFile,get_shopify_defaut_sitemap,parseSitemap} from './app';

app.get("/merchantgenius", async (req: Request, res: Response) => {


  try {

    const diff_cato = await homepage('')
    if (diff_cato.length > 1) {
      const uniqdomains = await leibiexiangqing(diff_cato)
      // const catohistory = fs.readFileSync('shopify-merchantgenius.txt').toString().replace(/\r\n/g, '\n').split('\n');
      for (let i = 0; i < uniqdomains.length; i++) {
        await upsertFile('sitemaps/' + uniqdomains[i] + '-sitemap-urls.txt')
        // const url_list = await get_shopify_defaut_sitemap(uniqdomains[i])
        const sitemapurl = await get_shopify_defaut_sitemap(uniqdomains[i])
        const url_list = await parseSitemap(sitemapurl[0])
        const log = fs.createWriteStream('sitemaps/' + uniqdomains[i] + '-sitemap-urls.txt', { flags: 'a' });
        if (url_list.length > 1) {
          for (let i = 0; i < url_list.length; i++) {
            log.write(url_list[i] + '\n')
          }
        }
      }

    }
  } catch (error) {
    console.log('error===', error)


  }
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
        console.log("server started");
  
        // cron.schedule("* * * * *", function () {
        //   // API call goes here
        //   console.log("running a task every minute");
        const optionstop500 = {
          hostname: 'localhost',
          port: port,
          // path: '/top500',
          path: '/merchantgenius',
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
  