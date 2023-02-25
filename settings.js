const path = require('path')


module.exports = {
    PROJECT_DIR : __dirname,
    TMP_DIR : path.join(__dirname, "/temp"),
    TMP_FILE : path.join(__dirname, "temp/screenshot.png"),
    OUT_FILE : path.join(__dirname, "/screenshot.mp4")
};