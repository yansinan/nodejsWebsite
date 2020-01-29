'use strict';
const path = require('path')

module.exports = appInfo => {

    return {
        // 后台管理vue-cli模块的调试环境服务器路径，找到package.json时，dev_modules列表存在时使用
        admin_root_path: 'http://wx.z-core.cn',
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
            // 'contentTags',
            // 'contentCategory',
            // 'contentMessage',
            // 'regUser',
            // 'helpCenter',
            // 'renderCms',
            // 'cmsTemplate',
            // 'plugin'
        ],
        // DEV_CONFIG_MODULES_END
        mongoose: {
            client: {
                url: 'mongodb://mongo:27017/doracms2',
                options: {
                    useCreateIndex: true,
                    useUnifiedTopology: true
                },
            },
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
        server_path: 'http://wx.z-core.cn:8084',
        server_api: 'http://wx.z-core.cn:8084/api',


    }
};