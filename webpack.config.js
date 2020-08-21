// if (process.env.NODE_MODULE === 'stock') 
//     module.exports = require('./webpack/webpack.config.stock.js')
if (process.env.NODE_MODULE === 'stock-web') 
    module.exports = require('./webpack/webpack.config.stock.web.js')