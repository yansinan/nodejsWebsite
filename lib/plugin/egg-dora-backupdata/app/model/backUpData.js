/**
 * Created by Administrator on 2015/4/15.
 * 数据操作记录
 */
module.exports = app => {
    const mongoose = app.mongoose
    var shortid = require('shortid');
    var Schema = mongoose.Schema;
    var moment = require('moment')

    var BackUpDataSchema = new Schema({
        _id: {
            type: String,

            'default': shortid.generate
        },
        date: {
            type: Date,
            default: Date.now
        },
        fileName: {
            type: String
        },
        path: {
            type: String
        },
        logs: String
    });

    BackUpDataSchema.set('toJSON', {
        getters: true,
        virtuals: true
    });
    BackUpDataSchema.set('toObject', {
        getters: true,
        virtuals: true
    });

    BackUpDataSchema.path('date').get(function (v) {
        return moment(v).format("YYYY-MM-DD HH:mm:ss");
    });

    return mongoose.model("BackUpData", BackUpDataSchema, 'backupdatas');

}