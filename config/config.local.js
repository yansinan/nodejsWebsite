'use strict';
const path = require('path')
const isDocker = process.env.BUILD_ENV == 'docker' ? true : false;
const mongohost = isDocker ? 'mongo:27017' : 'mongo:27017';//isDocker ? 'mongodb' : '127.0.0.1:27017';
const mongobin = isDocker ? '' : '/Users/dora/Documents/dora/softs/mongodb/bin/';
const domainRoot="http://rubyeyes.taihe.com";//"http://192.168.1.202";//'http://serverhome.local',//'http://wx.z-core.cn',
const port="80";//"8084";
module.exports = appInfo => {

    return {
        // 后台管理vue-cli模块的调试环境服务器路径，找到package.json时，dev_modules列表存在时使用
        admin_root_path: domainRoot,
        // DEV_CONFIG_MODULES_BEGIN
        dev_modules: [
            // 'navbar',
            //'dashboard', //8899
            // 'adminGroup',
            // 'adminUser',
            // 'adminResource',
            // 'systemConfig',
            // 'backUpData',
            // 'systemOptionLog',
            // 'announce',
            // 'systemNotify',
            // 'ads',
            // 'contentTemp',
            // 'templateConfig',
            // 'versionManage',
            //'content',//,8900,
            //'artist',//8888
            // 'record',//8899
            //'show',//8899
            // 'good',//8899
            // 'contentTags',
            // 'contentCategory',
            // 'contentMessage',
            //'regUser', //8899
            // 'helpCenter',
            // 'renderCms',
            // 'cmsTemplate',
            // 'plugin',
            // 'uploadFile',
            // 'mailTemplate',
            // 'mailDelivery',
        ],
        // DEV_CONFIG_MODULES_END
        mongoose: {
            client: {
                url: `mongodb://${mongohost}/doracms2`,
                options: {
                    useCreateIndex: true,
                    useUnifiedTopology: true,
                    keepAlive: 3000
                },
            },
        },
        // mongodb相关路径
        mongodb: {
            binPath: `${mongobin}`,
            backUpPath: path.join(appInfo.baseDir, 'databak/')
        },
        static: {
            prefix: '/static',
            dir: [path.join(appInfo.baseDir, 'app/public'), path.join(appInfo.baseDir, 'backstage/dist')],
            maxAge: 0,//31536000,
            buffer:false,//是否将缓存文件保存在内存中
            dynamic :true,// 如果当前访问的静态资源没有缓存，则缓存静态文件，和`preload`配合使用；
            preload: false,
        },
        logger: {
            dir: path.join(appInfo.baseDir, 'logs'),
        },
        server_path: domainRoot+":"+port,
        server_api: domainRoot+":"+port+'/api',//'http://wx.z-core.cn:8791/api',//
        server_neteaseCloudMusicApi:"http://ncm.node:3000",
        server_puppeteerApi:"http://puppeteer:8080",
    }
};