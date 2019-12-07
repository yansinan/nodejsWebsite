'use strict';
const path = require('path')
const pathApp="/home/node";
module.exports = appInfo => {

    return {
        // 插件路径
        admin_root_path: 'https://cdn.html-js.cn/cms/plugins/static/admin',
        // // 数据库连接
        // mongoose: {
        //     client: {
        //         url: 'mongodb://mongo:27017/doracms2',
        //         options: {
        //             useCreateIndex: true,
        //             useUnifiedTopology: true
        //         },
        //     },
        // },
        // 静态目录
        static: {
            prefix: '/static',
            dir: [path.join(appInfo.baseDir, 'app/public'), pathApp+'/uploadFiles/static'],
            maxAge: 31536000,
        },
        // 日志路径
        logger: {
            dir: pathApp+'/doraData/logsdir/doracms',
        },
        // 服务地址配置
        server_path: 'http://wx.z-core.cn:8084/',
        server_api: 'http://wx.z-core.cn:8084/api',

    }
};