const puppeteer = require('puppeteer');
const fs = require('fs-extra');

const users = fs.readFile('./users.csv').then

users.forEach(async studentID => {
	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	await page.goto('https://websvc.dcu.ie/club/socs/register', {waitUntil: 'networkidle'});
	// Type our query into the search bar
	await page.type('#form_id', studentID);
	await page.click('input[type="submit"]');
	await page.waitForSelector('form');
	await page.click('input[type="checkbox"]');
	await page.click('#form_save');
});
