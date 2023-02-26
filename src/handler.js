'use strict';

const playwright = require('playwright-aws-lambda');
const AWS = require("aws-sdk");
const fs = require("fs");

const createMP4 = require('./converter');
const settings = require('../settings')
const s3 = new AWS.S3();


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

    // wait for output file to be created
    await createMP4();

    // i have also uploaded the final result to a s3 bucket 
    const fileContent = fs.readFileSync(settings.OUT_FILE);
    var params = {
        Bucket: process.env.BUCKET_NAME,
        Key: `${new Date().toISOString()}_screenshot.mp4`,
        Body: fileContent
    };

    await s3.upload(params).promise();

    // return the path to the output file in the response
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
