const path = require('path');
var Cache = require('js-cache');
class AppBootHook {


    constructor(app) {
        this.app = app;
    }

    beforeStart() {
        this.app.runSchedule('backup_data');
    }

    configWillLoad() {

        this.app.loader.loadFile(path.join(this.app.config.baseDir, 'app/bootstrap/index.js'));
        const ctx = this.app.createAnonymousContext();
        this.app.nunjucks.addExtension('remote', new remote(ctx));

    }

    async didLoad() {
        // const directory = path.join(this.app.config.baseDir, 'app/model');
        // this.app.loader.loadToContext(directory, 'model');
        
        // 获取所有的 loadUnit
        // const servicePaths = this.app.loader.getLoadUnits().map(unit => path.join(unit.path, 'app/model'));

        // this.app.loader.loadToContext(servicePaths, 'model', {
        //     // service 需要继承 app.Service，所以要拿到 app 参数
        //     // 设置 call 在加载时会调用函数返回 UserService
        //     call: true,
        //     // 将文件加载到 app.model
        //     fieldClass: 'model',
        // });
    }

    async willReady() {

        // 请将你的应用项目中 app.beforeStart 中的代码置于此处。
    }

    async didReady() {
        this.app.cache = new Cache();
    }
}

module.exports = AppBootHook;