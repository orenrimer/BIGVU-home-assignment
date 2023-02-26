const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
ffmpeg.setFfmpegPath(ffmpegPath);

const settings = require('../settings')


function createMP4(){
    return new Promise((resolve,reject) => {
        ffmpeg(settings.TMP_FILE)
        .toFormat('mp4')
        .videoCodec('libx264')
        .size('640x?')
        .loop(10)
        .save(settings.OUT_FILE)
        .on('error',(err) => { reject(new Error(err)) })
        .on('end', () => { resolve() })
    })
}

module.exports = createMP4;