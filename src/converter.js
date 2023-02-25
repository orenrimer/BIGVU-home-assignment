const AWS = require("aws-sdk");
const s3 = new AWS.S3();
const fs = require("fs");

const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
ffmpeg.setFfmpegPath(ffmpegPath);

const settings = require('../settings')


function convertToMp4() {

    // create a 10 seconds mp4 video showing the screenshot given in path
    ffmpeg(settings.TMP_FILE)
    .toFormat('mp4')
    .videoCodec('libx264')
    .size('640x?')
    .loop(10)
    .output(settings.OUT_FILE)
    .on('error',(err) => { throw err })
    .on('end',async () => {
        // i have also uploaded the final result to a s3 bucket 
        const fileContent = fs.readFileSync(settings.OUT_FILE);
        var params = {
            Bucket: process.env.BUCKET_NAME,
            Key: `${new Date().toISOString()}_screenshot.mp4`,
            Body: fileContent
        };

        await s3.upload(params).promise();
    })
    .run();
    // return a path to the final product
}


module.exports = convertToMp4;