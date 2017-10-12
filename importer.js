require('dotenv').load();
const puppeteer = require('puppeteer');
const fs = require('fs-extra');


fs.readFile('./users.csv', 'utf-8').then(async data => {
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();
  await page.goto('https://loop.dcu.ie', {waitUntil: 'networkidle'});
  // Type our query into the search bar

  link = await page.$eval('.loginrow > a', el => el.href);

  await page.goto(link, {waitUntil: 'networkidle'});

  setTimeout(async cans => {
    await page.click('input[type="text"]');
    await page.type(process.env.un);
    await page.click('input[type="password"]');
    await page.type(process.env.pw);
    await page.click('button[type="submit"]');

    setTimeout(async cans => {
      data.split(/\r|\n/gi).forEach(async studentID => {
        await page.goto('https://google.com', {waitUntil: 'networkidle'});
        await page.goto('https://websvc.dcu.ie/clubs/socs/register', {waitUntil: 'networkidle'});
        await page.waitForSelector('#form_id');
        await page.click('#form_id');
        await page.type(studentID);
        await page.click('button[type="submit"]');
        await page.waitForSelector('input[type="checkbox"]');
        await page.click('input[type="checkbox"]');
        await page.click('button[type="submit"]');
      });
    }, 6000);
  }, 1000);
});
