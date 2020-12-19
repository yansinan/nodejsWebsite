/**
 * Created by Administrator on 2015/4/15.
 * 管理员用户组对象
 */
const pluginInfo = require('../../package.json').eggPlugin;

module.exports = app => {
    const mongoose = app.mongoose


    return app.model[pluginInfo.model];

}