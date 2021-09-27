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
            date: {
                type: Date,
                default: Date.now,
                alias: 'dateRelease',
            },//发行日期
            // listArtists:[{
            //     type: String,
            //     ref: 'Artist'
            // }],//乐队成员
            listFormatTags:[{
                type: String,
                ref:'ContentTag',
            }],//发行介质
            // dateRelease:{
            //     type: Date,
            //     default: Date.now,
            // },//发行日期
            catalog:{
                type: String,
                default:"CD",
            },//发行编号
            listLinks:[{
                url:{type:String},
                name:{type:String},
                icon:{type:String},
                type:{type:String,default:"购买"},
            }],//购买链接
            idAlbumNCM:{
                type: String,
                default:"",
            },//网易云专辑id
        });        
        // schema.path('dateRelease').get(function (v) {
        //     return moment(v || new Date()).format("YYYY-MM-DD");
        // }).set(v=>{
        //     this.date=v || Date.now;
        //     return v
        // });
        // schema.path('date').get(function (v) {
        //     return (this.dateRelease || v);
        // }).set(function (v) {
        //     if ((this instanceof mongoose.Document ) && v != null) {
        //         return (this.dateRelease || v);
        //     }
        //     return v;
        // });
        //schema.virtual('dateTimeline').get(function () {
        //    return moment(this.dateRelease).format("YYYY-MM-DD");
        //});
        // url地址
        schema.virtual('url').get(function () {
            return `/record___${this._id}.html`;
        });
        schema.virtual('nameTimeline').get(function (){
            return "专辑《"+this.name + "》发布";
        })
        schema.virtual('listArtists').get(function () {
            return this.listRefs;
        });
        schema.virtual('nameArtists').get(function () {
            let listName=this.listRefs.map(v=>(v.name));
            return listName.join();
        });
        // 搜索结果类名:
        schema.virtual('docAliasSearch').get(function () {
            return "唱片";
        });

        let model=app.model.Record || Doc.discriminator("Record", schema);
    
        return model
    }

}
