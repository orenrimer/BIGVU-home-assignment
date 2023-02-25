'use strict';

const playwright = require('playwright-aws-lambda');
const convertToMp4 = require('./converter');
const settings = require('../settings')
const fs = require("fs");


exports.handler =  async(event, context, callback) => {  
  const data = JSON.parse(event.body);
  // check if valid payload
  if (!data || !data.hasOwnProperty('url')) return {
      statusCode: 400,
      body: JSON.stringify({message : 'Must specify a url!'})
  };

  let browser = null;

  try {
    // user playwright to take a screenshot of the given url
    browser = await playwright.launchChromium();
    const page = await browser.newPage();
    await page.goto(data.url);
    
    // store the screenshot in a temp folder
    await page.screenshot({path : settings.TMP_FILE});
    convertToMp4();

    return {
      statusCode: 200,
      body: JSON.stringify({file: settings.OUT_FILE})
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({message : error})
    }
  } finally {
    if (browser) await browser.close();
    // delete temp folder
    fs.rmSync(settings.TMP_DIR, { recursive: true, force: true });
  }
};
