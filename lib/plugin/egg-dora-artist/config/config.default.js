'use strict'

/**
 * egg-dora-xxxx default config
 * @member Config#eggDoraXxxxx
 * @property {String} SOME_KEY - some description
 */

const pkgInfo = require('../package.json');
const API = pkgInfo.eggPlugin.alias;//xxxx

exports.configPlugin = {
    alias: pkgInfo.eggPlugin.alias, // 插件目录，必须为英文  xxxx
    pkgName: pkgInfo.name, // 插件包名  egg-dora-xxxx
    enName: pkgInfo.eggPlugin.name, // 插件名 doraXxxx
    name: '艺人管理', // 插件名称
    description: '提供艺人文档管理', // 插件描述
    isadm: 0, // 是否有后台管理，1：有，0：没有，入口地址:'/ext/devteam/admin/index'
    isindex: 0, // 是否需要前台访问，1：需要，0：不需要,入口地址:'/ext/devteam/index/index'
    version: pkgInfo.version, // 版本号
    iconName: 'icon_doc_fill', // 主菜单图标名称
    adminUrl: '/'+API+'/js/app.js',
    adminApi: [{
        url: API + '/getList',
        method: 'get',
        controllerName: 'list',
        details: '获取艺人列表',
    }, {
        url: API + '/getContent',
        method: 'get',
        controllerName: 'getOne',
        details: '获取单条文档信息',
    }, {
        url: API + '/get',
        method: 'get',
        controllerName: 'getOne',
        details: '获取单条文档信息',
    }, {
        url: API + '/addOne',
        method: 'post',
        controllerName: 'create',
        details: '添加单个文档',
    }, {
        url: API + '/updateOne',
        method: 'post',
        controllerName: 'update',
        details: '更新文档信息',
    }, {
        url: API + '/update',
        method: 'post',
        controllerName: 'updateMulti',
        details: '批量更新文档信息',
    }, {
        url: API + '/delete',
        method: 'get',
        controllerName: 'removes',
        details: '删除文档',
    }, {
        url: API + '/top',
        method: 'post',
        controllerName: 'updateToTop',
        details: '文档推荐',
    }, {
        url: API + '/roof',
        method: 'post',
        controllerName: 'roofPlacement',
        details: '文档置顶',
    }, ],
    fontApi: [
    {
        url: API + '/getMyFavorite',
        method: 'get',
        controllerName: 'getMyFavorite',
        details: '获取收藏的文档列表',
        authToken: true
    }, 
    {
        url: API + '/getUser',
        method: 'get',
        controllerName: 'list',
        details: '获取用户的文档列表',
    }, 
    {
        url: API + '/getList',
        method: 'get',
        controllerName: 'list',
        details: '获取文档列表',
    }, 
    {
        url: API + '/getRadom',
        method: 'get',
        controllerName: 'getRadom',
        details: '获取随机文档列表',
    }, 
    {
        url: API + '/getRandomImg',
        method: 'get',
        controllerName: 'getRandomImg',
        details: '获取随机文档首图',
    }, 
    {
        url: API + '/get',
        method: 'get',
        controllerName: 'getOne',
        details: '获取单个文档信息',
    }, 
    // {
    //     url: API + '/getWordHtml',
    //     method: 'post',
    //     controllerName: 'getWordHtml',
    //     details: '获取Word文档Html信息',
    // }, 
    {
        url: API + '/addOne',
        method: 'post',
        controllerName: 'add',
        details: '新增文档',
        authToken: true
    }, 
    {
        url: API + '/updateOne',
        method: 'post',
        controllerName: 'update',
        details: '更新文档',
        authToken: true
    }, 
    {
        url: API + '/getNearby',
        method: 'get',
        controllerName: 'getNearby',
        details: '上一篇/下一篇',
    }, 
    {
        url: API + '/getCoverList',
        method: 'get',
        controllerName: 'getCoverList',
        details: '获取封面列表',
    }, 
    {
        url: API + '/getCoverTypeList',
        method: 'get',
        controllerName: 'getCoverTypeList',
        details: '获取封面类别列表',
    }, 
    {
        url: API + '/getOneCover',
        method: 'get',
        controllerName: 'getOneCover',
        details: '获取单个封面信息',
    }, 
    {
        url: API + '/uploadCover',
        method: 'post',
        controllerName: 'uploadPreviewImgByBase64',
        details: '上传封面',
    }],

    initData: pkgInfo.eggPlugin.alias+'s.json', // 初始化数据脚本 xxxxs.json
    pluginsConfig: ` 
    exports.${pkgInfo.eggPlugin.name} = {\n
        enable: true,\n        package: '${pkgInfo.name}',
    };\n
    `, // 插入到 plugins.js 中的配置
    defaultConfig: `
    router:{\n
        match: [ctx => ctx.path.startsWith('/manage/${API}'), ctx => ctx.path.startsWith('/api/${API}')],\n
    },\n
    `, // 插入到 config.default.js 中的配置
}