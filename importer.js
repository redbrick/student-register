const puppeteer = require('puppeteer');
const fs = require('fs-extra');
const util = require('util');

const sleep = util.promisify(setTimeout);
const maxTabs = process.env.NUM_TAB || 5;
let numTabs = 0;

const register = browser => async (studentID) => {
  try {
    while (maxTabs === numTabs) {
      await sleep(10000); // eslint-disable-line no-await-in-loop
    }
    numTabs += 1;
    const tab = await browser.newPage();
    await tab.goto('https://websvc.dcu.ie/clubs/socs/register', {
      waitUntil: 'networkidle',
    });
    await tab.waitForSelector('#form_id');
    await tab.click('#form_id');
    await tab.type(studentID);
    await tab.click('button[type="submit"]');
    await tab.waitForSelector('input[type="checkbox"]');
    await tab.click('input[type="checkbox"]');
    await tab.click('button[type="submit"]');
    await tab.close();
  } catch (err) {
    console.error(err);
    process.exit(1);
  } finally {
    numTabs -= 1;
  }
};

module.export = file => async (error, { username, password }) => {
  try {
    if (error) throw error;
    console.log('Adding users now. Please wait.');
    const data = await fs.readFile(file, 'utf-8');
    const users = data.split(/\r|\n/gi);
    const browser = await puppeteer.launch({
      headless: process.env.NODE_ENV !== 'dev',
      args: ['--single-process'],
    });
    const page = await browser.newPage();
    await page.goto('https://loop.dcu.ie', { waitUntil: 'networkidle' });
    const link = await page.$eval('.loginrow > a', ({ href }) => href);
    await page.goto(link, { waitUntil: 'networkidle' });
    await sleep(1000);
    await page.click('input[type="text"]');
    await page.type(username);
    await page.click('input[type="password"]');
    await page.type(password);
    await page.click('button[type="submit"]');
    await sleep(3000);
    await Promise.all(users.map(register(browser)));
    await page.close();
    await browser.close();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};
