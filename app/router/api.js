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