
const http = require('http');
const express = require('express');
import { Request, Response, Application } from 'express';
const cors = require("cors");
import {upwork,getgoogleonesheet} from "./app"
import Sheet from './models/sheets';

const app: Application = express();
app.use(cors());


app.get("/upwork", async (req: Request, res: Response) => {

  let obj=getgoogleonesheet('1eXeaUurrqHsS0thkKzyDQdhCMeNYmt9a3pdLa0tPy44','0')
  console.log('===',obj)
  obj=JSON.parse(obj)
  const sheet: Sheet = JSON.parse(obj);  

  const items=sheet.data
  console.log(items,'=======')

  for (let item of ['tiktok','youtube']) {

  await upwork(item)
}
})
const port = process.env.PORT || 3000;

app.listen(port, () => {
        console.log("server started",port);
  
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
        }
        http.get(optionsupwork, function (error: any, response: { statusCode: number; }, body: any) {
          if (!error && response.statusCode == 200) {
            console.log(body) // Print the google web page.
          }
        })      
  
  
  
        // })
      })
  