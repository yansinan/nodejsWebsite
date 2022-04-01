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

            listLinks:[{
                url:{type:String},
                name:{type:String},
                icon:{type:String},
                type:{type:String,default:"购买"},
            }],//购买链接
            idWeiDian:{
                type: String,
                default:"",
            },//微店id
        });        
        // url地址
        schema.virtual('url').get(function () {
            return `/good___${this._id}.html`;
            return this.listLinks && this.listLinks[0]?this.listLinks[0].url : `/good___${this._id}.html`;
        });
        schema.virtual('nameTimeline').get(function (){
            return "周边 "+this.name + "";
        })
        schema.virtual('listArtists').get(function () {
            return this.listRefs;
        });
        // 搜索结果类名:
        schema.virtual('docAliasSearch').get(function () {
            return "周边";
        });
    
        let model=app.model.Good || Doc.discriminator("Good", schema);
    
        return model
    }

}
