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

    // checkRule(){
    //     const {ctx}=this;
    //     return {
    //         name: {
    //             type: "string",
    //             required: true,
    //             min: 2,
    //             max: 50,
    //             message: ctx.__("validate_error_field", [ctx.__("label_content_title")])
    //         },
    //         alias: {
    //             type: "string",
    //             required: true,
    //             min: 2,
    //             max: 50,
    //             message: ctx.__("validate_error_field", [ctx.__("label_content_stitle")])
    //         },
    //         sImg: {
    //             type: "string",
    //             required: true,
    //             message: ctx.__("validate_error_field", [ctx.__("lc_small_images")])
    //         },
    //         discription: {
    //             type: "string",
    //             required: true,
    //             min: 3,
    //             max: 300,
    //             message: ctx.__("validate_error_field", [ctx.__("label_content_dis")])
    //         },
    //         comments: {
    //             type: "string",
    //             required: true,
    //             min: 5,
    //             max: 100000,
    //             message: ctx.__("validate_inputCorrect", [ctx.__("label_content_comments")])
    //             // message: res.__("validate_inputCorrect", {
    //             //     label: res.__("label_content_comments")
    //             // })
    //         }
    //     }
    // }

    // 继承自service.doc在create和update中使用;
    async funGetData(fields){
        const {ctx}=this;
        let formObj=await super.funGetData(fields);

        // 友情链接图标
        if(fields.listLinks && fields.listLinks.length > 0 ){
            fields.listLinks.forEach(objLink => {
                if(objLink.icon=="" && objLink.url.indexOf("weibo.com")!=-1)objLink.icon="/static/themes/images/link/logo_sina_32x32.png";
                if(objLink.icon=="" && objLink.url.indexOf("douban.com")!=-1)objLink.icon="/static/themes/images/link/logo_douban_32x32.png"
                if(objLink.icon=="" && objLink.url.indexOf("music.163.com")!=-1)objLink.icon="/static/themes/images/link/logo_163_32x32.png"
            });
        }

        Object.assign(formObj , {
            listLinks:fields.listLinks,
            idWeiDian:fields.idWeiDian,
        });
        return formObj;        
    }

}

module.exports = APIController;
