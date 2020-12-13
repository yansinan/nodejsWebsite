'use strict'

/**
 * egg-dora-artist default config
 * @member Config#eggDoraArtist
 * @property {String} SOME_KEY - some description
 */

const pkgInfo = require('../package.json');
exports.doraArtist = {
    alias: 'artist', // 插件目录，必须为英文
    pkgName: 'egg-dora-artist', // 插件包名
    enName: 'doraArtistt', // 插件名
    name: '艺人管理', // 插件名称
    description: '提供艺人文档管理', // 插件描述
    isadm: 0, // 是否有后台管理，1：有，0：没有，入口地址:'/ext/devteam/admin/index'
    isindex: 0, // 是否需要前台访问，1：需要，0：不需要,入口地址:'/ext/devteam/index/index'
    version: pkgInfo.version, // 版本号
    iconName: 'icon_doc_fill', // 主菜单图标名称
    adminUrl: '/artist/js/app.js',
    adminApi: [{
        url: 'artist/getList',
        method: 'get',
        controllerName: 'list',
        details: '获取艺人列表',
    }, {
        url: 'artist/get',
        method: 'get',
        controllerName: 'getOne',
        details: '获取单条文档信息',
    }, {
        url: 'artist/addOne',
        method: 'post',
        controllerName: 'create',
        details: '添加单个文档',
    }, {
        url: 'artist/updateOne',
        method: 'post',
        controllerName: 'update',
        details: '更新文档信息',
    }, {
        url: 'artist/update',
        method: 'post',
        controllerName: 'updateMulti',
        details: '批量更新文档信息',
    }, {
        url: 'artist/delete',
        method: 'get',
        controllerName: 'removes',
        details: '删除文档',
    }, {
        url: 'artist/top',
        method: 'post',
        controllerName: 'updateToTop',
        details: '文档推荐',
    }, {
        url: 'artist/roof',
        method: 'post',
        controllerName: 'roofPlacement',
        details: '文档置顶',
    }, {
        url: 'artist/redictToUsers',
        method: 'post',
        controllerName: 'redictToUsers',
        details: '分配用户',
    }, {
        url: 'artist/updateEditor',
        method: 'post',
        controllerName: 'updateEditor',
        details: '绑定编辑',
    }, {
        url: 'artist/moveCate',
        method: 'post',
        controllerName: 'moveCate',
        details: '更新类别',
    }],
    fontApi: [
    {
        url: 'artist/getMyFavorite',
        method: 'get',
        controllerName: 'getMyFavorite',
        details: '获取收藏的文档列表',
        authToken: true
    }, 
    {
        url: 'artist/getUser',
        method: 'get',
        controllerName: 'list',
        details: '获取用户的文档列表',
    }, 
    {
        url: 'artist/getList',
        method: 'get',
        controllerName: 'list',
        details: '获取文档列表',
    }, 
    {
        url: 'artist/getRadom',
        method: 'get',
        controllerName: 'getRadom',
        details: '获取随机文档列表',
    }, 
    {
        url: 'artist/getRandomImg',
        method: 'get',
        controllerName: 'getRandomImg',
        details: '获取随机文档首图',
    }, 
    {
        url: 'artist/get',
        method: 'get',
        controllerName: 'getOne',
        details: '获取单个文档信息',
    }, 
    // {
    //     url: 'artist/getWordHtml',
    //     method: 'post',
    //     controllerName: 'getWordHtml',
    //     details: '获取Word文档Html信息',
    // }, 
    {
        url: 'artist/addOne',
        method: 'post',
        controllerName: 'add',
        details: '新增文档',
        authToken: true
    }, 
    {
        url: 'artist/updateOne',
        method: 'post',
        controllerName: 'update',
        details: '更新文档',
        authToken: true
    }, 
    {
        url: 'artist/getNearby',
        method: 'get',
        controllerName: 'getNearby',
        details: '上一篇/下一篇',
    }, 
    {
        url: 'artist/getCoverList',
        method: 'get',
        controllerName: 'getCoverList',
        details: '获取封面列表',
    }, 
    {
        url: 'artist/getCoverTypeList',
        method: 'get',
        controllerName: 'getCoverTypeList',
        details: '获取封面类别列表',
    }, 
    {
        url: 'artist/getOneCover',
        method: 'get',
        controllerName: 'getOneCover',
        details: '获取单个封面信息',
    }, 
    {
        url: 'artist/uploadCover',
        method: 'post',
        controllerName: 'uploadPreviewImgByBase64',
        details: '上传封面',
    }],

    initData: 'artists.json', // 初始化数据脚本
    pluginsConfig: ` 
    exports.doraArtist = {\n
        enable: true,\n        package: 'egg-dora-artist',
    };\n
    `, // 插入到 plugins.js 中的配置
    defaultConfig: `
    router:{\n
        match: [ctx => ctx.path.startsWith('/manage/artist'), ctx => ctx.path.startsWith('/api/artist')],\n
    },\n
    `, // 插入到 config.default.js 中的配置
}