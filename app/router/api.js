module.exports = app => {

    const {
        router,
        controller
    } = app;


    router.get('/api/getImgCode', controller.page.home.getImgCode);
    router.get('/api/createQRCode', controller.page.home.createQRCode);
    router.get(['/dr-admin', '/admin/login'], controller.api.admin.login);
    router.post('/api/admin/doLogin', controller.api.admin.loginAction);
    router.get('/api/systemConfig/getConfig', controller.api.systemConfig.list)

    //ApiRouters
    // 艺人
    let API="artist";
    let frontApi= [
        {
            url: API + '/getList',
            method: 'get',
            controllerName: 'list',
            details: '获取文档列表',
        }, 
        {
            url: API + '/get',
            method: 'get',
            controllerName: 'getOne',
            details: '获取单个文档信息',
        }, 
        {
            url: API + "/fetchNCMMV",
            method:"get",
            controllerName:"ncmGetAtistMV",
            details:"抓取网易云音乐中乐队的MV列表，并转格式返回list"
        }, 
        {
            url: API + "/fetchNCMArtist",
            method:"get",
            controllerName:"ncmGetAtist",
            details:"抓取网易云音乐中乐队，并转格式返回"
        },
    ]
    // router.get('/api/artist/getList', controller.api.artist.list);
    // router.get('/api/artist/get', controller.api.artist.getOne);
    frontApi.forEach(obj=>router[obj.method]('/api/'+obj.url, controller.api[API][obj.controllerName]))
    // 视频
    API="video";
    frontApi= [
        {
            url: API + '/item',
            method: 'get',
            controllerName: 'getNCMMVDetail',
            details: '获取MV详情idNCMMV',
        }, 
        {
            url: API + '/url',
            method: 'get',
            controllerName: 'getNCMMVURL',
            details: '获取播放地址',
        },
    ]    
    frontApi.forEach(obj=>router[obj.method]('/api/'+obj.url, controller.api[API][obj.controllerName]))

    // 专辑
    router.get('/api/record/getList', controller.api.record.list);
    router.get('/api/record/get', controller.api.record.getOne);

    // 时间线列表
    router.get("/api/timeline/getList", controller.api.timeline.list);
    /**
     * 上传文件blocb 多文件管理
     * 
     */
    router.post('/api/dr/uploadFiles', controller.api.uploadFiles.create)

}