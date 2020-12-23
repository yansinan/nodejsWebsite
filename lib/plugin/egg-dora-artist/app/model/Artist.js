/**
 * Created by Administrator on 2015/4/15.
 * 管理员用户组对象
 */
const MODEL_NAME=__filename.slice(__dirname.length + 1, -3)
module.exports = app => {
    const mongoose = app.mongoose


    return app.model[MODEL_NAME];

}