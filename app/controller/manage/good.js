const Controller = require('egg').Controller;
const BaseController = require('./doc');

const xss = require("xss");
const _ = require('lodash');
const shortid = require('shortid');
const SERVICE_NAME=__filename.slice(__dirname.length + 1, -3);
const {
    siteFunc
} = require('../../utils');

class APIController extends BaseController {
    get SERVICE(){ return this.ctx.service[__filename.slice(__dirname.length + 1, -3)]; }


    // 继承自service.doc在create和update中使用;
    async funGetData(fields){
        const {ctx}=this;
        let formObj=await super.funGetData(fields);

        Object.assign(formObj , {
            listLinks:fields.listLinks,
            idWeiDian:fields.idWeiDian,
        });
        return formObj;        
    }

}

module.exports = APIController;
