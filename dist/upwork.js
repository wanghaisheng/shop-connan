"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http = require('http');
const express = require('express');
const cors = require("cors");
const app_1 = require("./app");
const app = express();
app.use(cors());
app.get("/upwork", async (req, res) => {
    let obj = (0, app_1.getgoogleonesheet)('1eXeaUurrqHsS0thkKzyDQdhCMeNYmt9a3pdLa0tPy44', '0');
    console.log(obj);
    obj = JSON.parse(obj);
    const sheet = JSON.parse(obj);
    const items = sheet.data;
    console.log(items, '=======');
    for (let item of ['tiktok', 'youtube']) {
        await (0, app_1.upwork)(item);
    }
});
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log("server started", port);
    // cron.schedule("* * * * *", function () {
    //   // API call goes here
    //   console.log("running a task every minute");
    // const optionstop500 = {
    //   hostname: 'localhost',
    //   port: 8083,
    //   path: '/top500',
    //   // path: '/merchantgenius',
    //   method: 'GET'
    // }
    // http.get(optionstop500, function (error: any, response: { statusCode: number; }, body: any) {
    //   if (!error && response.statusCode == 200) {
    //     console.log(body) // Print the google web page.
    //   }
    // })
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
    const optionsupwork = {
        hostname: 'localhost',
        port: port,
        path: '/upwork',
        method: 'GET'
    };
    http.get(optionsupwork, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            console.log(body); // Print the google web page.
        }
    });
    // })
});
