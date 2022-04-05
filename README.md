# shopify-connan


[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/wanghaisheng/shop-connan/tree/main)

```
https://github.com/Neeraj2212/web-gallery

https://github.com/guerrerocarlos/db-google-spreadsheets


https://github.com/franciscop/drive-db

cnpm i sheetquery
https://github.com/vlucas/sheetquery


const query = sheetQuery()
  .from('Transactions')
  .where((row) => row.Category === 'Shops');

// query.getRows() => [{ Amount: 95, Category: 'Shops', Business: 'Walmart'}]


sheetQuery()
  .from('Transactions')
  .where((row) => row.Business.toLowerCase().includes('starbucks'))
  .updateRows((row) => {
    row.Category = 'Coffee Shops';
  });
```



sheetQuery()
  .from('Transactions')
  .insertRows([
    {
      Amount: -554.23,
      Name: 'BigBox, inc.',
    },
    {
      Amount: -29.74,
      Name: 'Fast-n-greasy Food Spot',
    },
  ]);




https://docs.google.com/spreadsheets/d/1Q87cvlpPBr5Viu9Nxd3PjqBvX_aPCd1_ZOEgdXYGP5w/edit#gid=0

merchantgenius

url,domainscount,updatedate
https://www.merchantgenius.io/shop/date/2022/04/03,0,2022/04/03



https://docs.google.com/spreadsheets/d/1FDnff04yl9dN7QOmJooC_5hESHRhFmKUUN1DPvoVrEU/edit#gid=0
shopify-stores
id from b64('shop.bbc.com')
id,domain,rank,sitemapindex,sitemapurl,urls,updatedate
http://shop.bbc.com,top500,
http://row.gymshark.com,top500,
http://www.gymshark.com
http://www.jbhifi.com.au
http://www.cettire.com
http://www.puravidabracelets.com
http://www.usatuan.com
http://www.colourpop.com


