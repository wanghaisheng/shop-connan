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

