'use strict';
const path = require('path')
const isDocker = process.env.BUILD_ENV == 'docker' ? true : false;
const mongohost = isDocker ? 'mongo:27017' : 'mongo:27017';//isDocker ? 'mongodb' : '127.0.0.1:27017';
const mongobin = isDocker ? '' : '/Users/dora/Documents/dora/softs/mongodb/bin/';

module.exports = appInfo => {

    return {
        // 后台管理vue-cli模块的调试环境服务器路径，找到package.json时，dev_modules列表存在时使用
        admin_root_path: "http://wx.z-core.cn",//'http://serverhome.local',//'http://wx.z-core.cn',
        // DEV_CONFIG_MODULES_BEGIN
        dev_modules: [
            // 'navbar',
            // 'dashboard',
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
            // 'content',
            'artist',
            'record',
            // 'contentTags',
            // 'contentCategory',
            // 'contentMessage',
            // 'regUser',
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
            buffer:false,
            dynamic :true,
            preload: false,
        },
        logger: {
            dir: path.join(appInfo.baseDir, 'logs'),
        },
        server_path: 'http://wx.z-core.cn:8791',
        server_api: 'http://wx.z-core.cn:8791/api',


    }
};