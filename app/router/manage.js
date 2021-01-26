module.exports = app => {

    const {
        router,
        controller
    } = app;


    // 后台管理界面
    router.get(['/admin/:page', '/admin/:page/:page1', '/admin/:page/:page1/:id'], controller.manage.adminUser.dashboard);

    // 管理员退出
    router.get('/manage/logout', controller.manage.adminUser.logOutAction);

    // 获取管理员信息
    router.get('/manage/getUserSession', controller.manage.adminUser.getUserSession)

    // 获取后台基础信息
    router.get('/manage/getSitBasicInfo', controller.manage.adminUser.getBasicSiteInfo)

    /**
     * 管理员管理
     */
    router.get('/manage/adminUser/getList', controller.manage.adminUser.list)

    router.get('/manage/adminUser/getOne', controller.manage.adminUser.getOne)

    router.post('/manage/adminUser/addOne', controller.manage.adminUser.create)

    router.post('/manage/adminUser/updateOne', controller.manage.adminUser.update)

    router.get('/manage/adminUser/deleteUser', controller.manage.adminUser.removes)


    /**
     * 角色管理
     */
    router.get('/manage/adminGroup/getList', controller.manage.adminGroup.list)

    router.get('/manage/adminGroup/getOne', controller.manage.adminGroup.getOne)

    router.post('/manage/adminGroup/addOne', controller.manage.adminGroup.create)

    router.post('/manage/adminGroup/updateOne', controller.manage.adminGroup.update)

    router.get('/manage/adminGroup/deleteGroup', controller.manage.adminGroup.removes)


    /**
     * 资源管理
     * 
     */

    router.get('/manage/adminResource/getList', controller.manage.adminResource.list)

    router.get('/manage/adminResource/getOne', controller.manage.adminResource.getOne)

    router.post('/manage/adminResource/addOne', controller.manage.adminResource.create)

    router.post('/manage/adminResource/updateOne', controller.manage.adminResource.update)

    router.post('/manage/adminResource/updateParentId', controller.manage.adminResource.updateParentId)

    router.get('/manage/adminResource/deleteResource', controller.manage.adminResource.removes)

    router.get('/manage/adminResource/getListByPower', controller.manage.adminResource.listByPower)
  

    /**
     * 系统配置
     * 此api名称尽量不要改
     */
    router.get('/manage/systemConfig/getConfig', controller.manage.systemConfig.list)

    router.post('/manage/systemConfig/updateConfig', controller.manage.systemConfig.update)


    /**
     * 插件管理
     */

    //  获取已安装插件列表
    router.get('/manage/plugin/getList', controller.manage.plugin.list);

    //  安装
    router.get('/manage/plugin/installPlugin', controller.manage.plugin.installPlugin);

    // 卸载
    router.get('/manage/plugin/unInstallPlugin', controller.manage.plugin.unInstallPlugin);

    // 升级
    router.get('/manage/plugin/updatePlugin', controller.manage.plugin.updatePlugin);

    // 启用插件
    router.post('/manage/plugin/enablePlugin', controller.manage.plugin.enablePlugin);

    // 心跳
    router.get('/manage/plugin/pluginHeartBeat', controller.manage.plugin.pluginHeartBeat);

    // 获取插件市场列表
    router.get('/manage/plugin/getPluginShopList', controller.manage.plugin.getPluginShopList);

    // 获取插件市场插件详情
    router.get('/manage/plugin/getOneShopPlugin', controller.manage.plugin.getPluginShopItem);

    // 预创建订单
    router.post('/manage/plugin/createInvoice', controller.manage.plugin.createInvoice);

    // 订单校验
    router.post('/manage/plugin/checkInvoice', controller.manage.plugin.checkInvoice);

    /**
     * 钩子管理
     */
    router.get('/manage/hook/getList', controller.manage.hook.list)

    router.get('/manage/hook/getOne', controller.manage.hook.getOne)

    router.post('/manage/hook/addOne', controller.manage.hook.create)

    router.post('/manage/hook/updateOne', controller.manage.hook.update)

    router.get('/manage/hook/deleteUser', controller.manage.hook.removes)


    /**
     * 唱片管理
     * 
     */
    router.get('/manage/record/getList', controller.manage.record.list)
    router.get('/manage/record/getOne', controller.manage.record.getOne)

    router.post('/manage/record/addOne', controller.manage.record.create)
    router.post('/manage/record/updateOne', controller.manage.record.update)
    router.post('/manage/record/top', controller.manage.record.updateToTop)
    router.post('/manage/record/roof', controller.manage.record.roofPlacement)

    router.get('/manage/record/delete', controller.manage.record.removes)

    // router.get('/artist/findByName',UserController.findArtistByName)
    
    /**
     * 唱片管理
     * 
     */
    router.get('/manage/show/getList', controller.manage.show.list)
    router.get('/manage/show/getOne', controller.manage.show.getOne)

    router.post('/manage/show/addOne', controller.manage.show.create)
    router.post('/manage/show/updateOne', controller.manage.show.update)
    router.post('/manage/show/top', controller.manage.show.updateToTop)
    router.post('/manage/show/roof', controller.manage.show.roofPlacement)

    router.get('/manage/show/delete', controller.manage.show.removes)
    /**
     * 上传文件blocb 多文件管理
     * 
     */
    router.post('/manage/dr/uploadFiles', controller.manage.uploadFiles.create)
    //ManageRouters

}