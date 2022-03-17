'use strict';
const path = require('path')
const isDocker = true;//process.env.BUILD_ENV == 'docker' ? true : false;
const mongohost = isDocker ? 'mongo:27017' : 'mongo:27017';//isDocker ? 'mongodb' : '127.0.0.1:27017';
const mongobin = isDocker ? '' : '/Users/dora/Documents/dora/softs/mongodb/bin/';
const domainRoot="http://rubyeyes.taihe.com";//"http://192.168.1.202";//'http://serverhome.local',//'http://wx.z-core.cn',
const port="80";//"8084";

module.exports = appInfo => {

    return {
        // 插件路径
        admin_root_path: domainRoot,
        // 数据库连接
        mongoose: {
            client: {
                // url: "mongodb://mongo:27017/doracms2",//'mongodb://127.0.0.1:27017/doracms2',
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
            // binPath: '/usr/local/mongodb/mongodb-linux-x86_64-ubuntu1604-4.0.0/bin/',
            // backUpPath: '/home/database/doracms/'
            binPath: `${mongobin}`,
            backUpPath: path.join(appInfo.baseDir, 'databak/')
        },
        // 静态目录
        static: {
            prefix: '/static',
            dir: [path.join(appInfo.baseDir, 'app/public'), path.join(appInfo.baseDir, 'backstage/dist'), ], //'/home/doraData/uploadFiles/static'
            // maxAge: 31536000,
            maxAge: 0,//31536000,
            buffer:false,//是否将缓存文件保存在内存中
            dynamic :true,// 如果当前访问的静态资源没有缓存，则缓存静态文件，和`preload`配合使用；
            preload: false,

        },
        // 日志路径
        logger: {
            // dir: '/home/doraData/logsdir/doracms',
            dir: path.join(appInfo.baseDir, 'logs'),
        },
        // 服务地址配置
        // server_path: 'http://wx.z-core.cn:8084',//'http://192.168.1.202:8084',//
        // server_api: 'http://wx.z-core.cn:8084/api',//'http://192.168.1.202:8084/api',//
        // server_neteaseCloudMusicApi:"http://192.168.1.202:3000",
        server_path: domainRoot+":"+port,
        server_api: domainRoot+":"+port+'/api',//'http://wx.z-core.cn:8791/api',//
        server_neteaseCloudMusicApi:"http://ncm.node:3000",
        server_puppeteerApi:"http://puppeteer:8080",
    }
};