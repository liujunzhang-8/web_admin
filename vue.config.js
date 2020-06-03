module.exports = {
    publicPath: './',
    assetsDir: 'static',
    productionSourceMap: false,
    devServer: {
        proxy: {
            '/api':{
                target:'http://172.29.240.8:8088/message-plat',
                changeOrigin:true,
                pathRewrite:{
                    '/api':''
                }
            }
        }
    }
}