const BaseController = require('./doc');
const _ = require('lodash');
const SERVICE_NAME=__filename.slice(__dirname.length + 1, -3);

class APIController extends BaseController {

    get SERVICE(){ return this.ctx.service[__filename.slice(__dirname.length + 1, -3)]; }

    // 继承自service.doc在create和update中使用;
    async funGetData(fields){
        const {ctx}=this;
        let formObj=await super.funGetData(fields);

        Object.assign(formObj,{
            listLinks:fields.listLinks,
            listFormatTags:fields.listFormatTags,
            dateRelease:fields.dateRelease,
            catalog:fields.catalog,
        });
        // 网易云音乐的专辑id
        if(fields.idAlbumNCM)formObj.idAlbumNCM=fields.idAlbumNCM
        // 变更date为dateRelease
        if(formObj.dateRelease)formObj.date=formObj.dateRelease;
        
        return formObj;        
    }
    // getOne改为传query，可查name,_id等
    async getOne(){
        await super.item();
    }
}

module.exports = APIController;
