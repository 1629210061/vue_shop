// vue脚手架的自定义配置，有两种方式
// 方式1在package.json中进行配置，但是不推荐使用，因为package.json主要用来管理包的配置信息。
// 方式2 将vue脚手架相关的配置，单独定义到vue.config.js配置文件中，也就是当前方式
module.exports={
    devServer:{
        open:true,
        port:8888
    }
}