# shopify-connan



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

  