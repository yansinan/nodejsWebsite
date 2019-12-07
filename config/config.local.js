'use strict';
const path = require('path')

module.exports = appInfo => {

    return {
        admin_root_path: 'http://localhost',
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
                url: "mongodb://mongo:27017/doracms2",//'mongodb://127.0.0.1:27017/doracms2',
                options: {
                    useCreateIndex: true,
                    useUnifiedTopology: true
                },
            },
        },
        static: {
            prefix: '/static',
            dir: [path.join(appInfo.baseDir, 'app/public'), path.join(appInfo.baseDir, 'backstage/dist')],
            maxAge: 31536000,
        },
        logger: {
            dir: path.join(appInfo.baseDir, 'logs'),
        },
        server_path: 'http://server.local:8084',
        server_api: 'http://server.local:8084/api',
        // server_path: 'http://wx.z-core.cn:8084/',
        // server_api: 'http://wx.z-core.cn:8084/api',

    }
};