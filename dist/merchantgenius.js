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
Object.defineProperty(exports, "__esModule", { value: true });
const http = require('http');
const express = require('express');
const cors = require("cors");
const fs = require("fs");
const app = express();
app.use(cors());
const app_1 = require("./app");
app.get("/merchantgenius", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const diff_cato = yield (0, app_1.homepage)('');
        if (diff_cato.length > 1) {
            const uniqdomains = yield (0, app_1.leibiexiangqing)(diff_cato);
            // const catohistory = fs.readFileSync('shopify-merchantgenius.txt').toString().replace(/\r\n/g, '\n').split('\n');
            for (let i = 0; i < uniqdomains.length; i++) {
                yield (0, app_1.upsertFile)('sitemaps/' + uniqdomains[i] + '-sitemap-urls.txt');
                // const url_list = await get_shopify_defaut_sitemap(uniqdomains[i])
                const sitemapurl = yield (0, app_1.get_shopify_defaut_sitemap)(uniqdomains[i]);
                const url_list = yield (0, app_1.parseSitemap)(sitemapurl[0]);
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
app.listen(8081, () => {
    console.log("server started");
    // cron.schedule("* * * * *", function () {
    //   // API call goes here
    //   console.log("running a task every minute");
    const optionstop500 = {
        hostname: 'localhost',
        port: 8081,
        // path: '/top500',
        path: '/merchantgenius',
        method: 'GET'
    };
    http.get(optionstop500, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(body); // Print the google web page.
        }
    });
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
});
