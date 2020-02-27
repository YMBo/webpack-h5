const autoprefixer = require('autoprefixer')
const px2rem = require('postcss-px2rem')
const { PSWD } = require("./config/config.js");
module.exports = {
    plugins: [
        autoprefixer({
            flexbox: 'no-2009',
        }),
        px2rem({ remUnit: PSWD / 10 })
    ]
}
