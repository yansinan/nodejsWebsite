/**
 * Created by Dr on 2020/12/19.
 * 演出信息
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

        });        

        // url地址
        schema.virtual('url').get(function () {
            return `/video___${this._id}.html`;
        });
        // 演出标题
        schema.virtual('title').get(function () {
            return this.name;
        }).set(function(v){
            this.name=v;
        });
        // 演出短标题
        schema.virtual('sTitle').get(function () {
            return this.alias;
        }).set(function(v){
            this.alias=v;
        });
        schema.virtual('listArtists').get(function () {
            return this.listRefs;
        });
        // 搜索结果类名:
        schema.virtual('docAliasSearch').get(function () {
            return "影像";
        });

        let model=app.model.Video || Doc.discriminator("Video", schema);
    
        return model
    }

}
