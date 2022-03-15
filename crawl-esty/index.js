const request=require("request-promise"); 
const cheerio=require("cheerio");
const fs = require('fs');
// const writeStream = fs.createWriteStream('data/data.csv');

const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const csvWriter = createCsvWriter({
  path: 'data/data.csv',
  header: [
    {id: 'stt', title: 'STT'},
    {id: 'name', title: 'Name'},
    {id: 'dealer', title: 'Dealer'},
    {id: 'image', title: 'Image'},
    {id: 'price', title: 'Price'},
    {id: 'reviews', title: 'Reviews'},
  ]
});

const CRAWLED_URL = "https://www.etsy.com/c/clothing/mens-clothing/shirts-and-tees?ref=catnav-10923";

// Write Headers
// writeStream.write(`STT,Name,Dealer,Image,Price,Reviews \n`);

let stt = 0;
let data=[];
request(CRAWLED_URL, (error, response, html) => {
    if (!error && response.statusCode == 200) {
        const $ = cheerio.load(html);

        $('li.wt-list-unstyled').each((index, el) => {
            stt++;
            const name = $(el).find('.v2-listing-card__info div h3').text().trimStart().trimEnd().replace(",",";");
            const dealer = $(el).find('.v2-listing-card__shop p.text-gray-lighter').text().trimStart().trimEnd();
            const price = $(el).find('.n-listing-card__price span.currency-value').first().text().trimStart().trimEnd();
            const image = $(el).find('.v2-listing-card__img img').attr('data-src') || $(el).find('.v2-listing-card__img img').attr('src');
            const reviews = $(el).find('.v2-listing-card__shop span.text-body-smaller').text().replace("(","").replace(")","");

            const item={
                stt,
                name,
                dealer,
                price,
                image,
                reviews,
            }

            data.push(item);

            // Write Row To CSV
            //   writeStream.write(`${stt},${name},${dealer},${image},${price},${reviews} \n`);
        });

        csvWriter
        .writeRecords(data)
        .then(()=> console.log('The CSV file was written successfully'));
    }

});

console.log('Scraping Done...');


