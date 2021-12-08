module.exports = app => {
    const {
        router,
        controller
    } = app;

    const authPage = app.middleware.authPage({});
    //配置站点地图和robots抓取
    router.get("/sitemap.xml", controller.page.home.getSiteMapPage);

    router.get("/robots.txt", controller.page.home.getRobotsPage);

    router.get("/sitemap.html", controller.page.home.getDataForSiteMap);

    // 测试新的复杂滚动首页
    router.get(["/", "/index/*" ,"/zh-CN", "/zh-TW", "/en"], controller.page.index.getDataForIndexPage);

    // router.get("/page/:current.html", controller.page.home.getDataForIndexPage);

    // 静态介绍入口
    router.get([
        //"/about___",
        "/about___.html",
        "/about___:typeId?",
        "/about___:typeId?.html",
    ],controller.page.detail.getDataAbout);

    // 内容详情入口
    // router.get("/details/:id.html", controller.page.home.getDataForContentDetails);
    // 艺术家详情
    router.get("/artist___:id.html", controller.page.detail.getDataForArtistDetails);
    router.get("/:service?___:id.html", controller.page.detail.getDataForDocDetails);
    //检索艺术家的专辑
    router.get("/record/artist/:idArtist", controller.api.record.list);
    // 专辑详情
    // router.get("/record/:id.html", controller.page.home.getDataForRecordDetails);

    // 艺术家列表；类别入口
    //router.get([
    //    "/artists___:typeId?",
    //    "/artists___:typeId?/:current.html",
    //    "/artists/:cate1?___:typeId?",
    //    "/artists/:cate1?___:typeId?/:current.html"
    //], controller.page.home.getDataForArtistsPage);
    //// 专辑列表；类别入口
    //router.get([
    //    "/records___:typeId?",
    //    "/records___:typeId?/:current.html",
    //    "/records/:cate1?___:typeId?",
    //    "/records/:cate1?___:typeId?/:current.html"
    //], controller.page.home.getDataForRecordsPage);
    //// 时间线
    //router.get([
    //    "/timeline___:typeId?",
    //    "/timeline___:typeId?/:current.html",
    //    "/timeline___/:cate1?___:typeId?",
    //    "/timeline___/:cate1?___:typeId?/:current.html"
    //], controller.page.home.getDataForTimelinePage);
    //// 类别入口
    //router.get([
    //    "/:cate1?___:typeId?",
    //    "/:cate1?___:typeId?/:current.html",
    //    "/:cate0/:cate1?___:typeId?",
    //    "/:cate0/:cate1?___:typeId?/:current.html"
    //], controller.page.home.getDataForCatePage);

    // 搜索
    // router.get(["/search/:searchkey", "/search/:searchkey/:current.html"], controller.page.index.getDomSearch);
    router.get(["/search"], controller.page.index.getDomSearch);
    // 相关
    router.get(["/relative"], controller.page.detail.getRelativeDocs);
    //// 标签
    //router.get(["/tag/:tagName", "/tag/:tagName/:current.html"], controller.page.home.getDataForTagPage);
    //// 作者
    //router.get(["/author/:userId", "/author/:userId/:current.html"], controller.page.home.getDataForAuthorPage);

    //// 移动端
    //router.get("/phone-fenlei.html", controller.page.home.getDataForPhoneCategory);
    //router.get("/phone-list.html", controller.page.home.getDataForPhoneList);
    //router.get("/phone-user.html", authPage, controller.page.home.getDataForPhoneUser);

}