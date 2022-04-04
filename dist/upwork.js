"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http = require('http');
const express = require('express');
const cors = require("cors");
const app_1 = require("./app");
const app = express();
app.use(cors());
app.get("/upwork", async (req, res) => {
    await (0, app_1.upwork)();
});
app.listen(8081, () => {
    console.log("server started");
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
        port: 8081,
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
