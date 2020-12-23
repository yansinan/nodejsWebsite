/**
 * Created by Dr on 2020/12/19.
 * 唱片信息
 */

module.exports =app=>{
    {
        const mongoose = app.mongoose
        var Schema = mongoose.Schema;
        var moment = require('moment')
        // 继承自Doc        
        let Doc=app.model.Doc || require("./Doc")(app) || INIT_DOC(app);//
        
        let optionsSchema={
            toJSON:{
                getters: true,
                virtuals: true
            },
            toObject:{
                getters: true,
                virtuals: true
            },
        }
        var schema = new Schema({
            listArtists:[{
                type: String,
                ref: 'Artist'
            }],//乐队成员
            listFormatTags:[{
                type: String,
                ref:'ContentTag',
            }],//发行介质
            dateRelease:{
                type: Date,
                default: Date.now,
            },//发行日期
            catalog:{
                type: String,
                default:"CD",
            },//发行编号
            listShopLink:[{
                url:{type:String},
                name:{type:String},
                icon:{type:String},
                type:{type:String,default:"购买"},
            }],//购买链接
        });        
        schema.path('dateRelease').get(function (v) {
            return moment(v).format("YYYY-MM-DD");
        });
        schema.virtual('dateTimeline').get(function () {
            return moment(this.dateRelease).format("YYYY-MM-DD");
        });
        // url地址
        schema.virtual('url').get(function () {
            return `/record/${this._id}.html`;
        });
        let model=app.model.Show || Doc.discriminator("Record", schema);
    
        return model
    }

}
