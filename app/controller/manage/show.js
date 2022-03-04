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

        // 友情链接图标
        if(fields.listLinks && fields.listLinks.length > 0 ){
            fields.listLinks.forEach(objLink => {
                if(objLink.icon=="" && objLink.url.indexOf("weibo.com")!=-1)objLink.icon="/static/themes/images/link/logo_sina_32x32.png";
                if(objLink.icon=="" && objLink.url.indexOf("douban.com")!=-1)objLink.icon="/static/themes/images/link/logo_douban_32x32.png";
                if(objLink.icon=="" && objLink.url.indexOf("music.163.com")!=-1)objLink.icon="/static/themes/images/link/logo_163_32x32.png";
                if(objLink.icon=="" && objLink.url.indexOf("weidian.com")!=-1)objLink.icon="/static/themes/images/link/logo_weidian_32x32.png";
            });
        }
        if(fields.listTicketLink && fields.listTicketLink.length > 0 ){
            fields.listTicketLink.forEach(objLink => {
                if(objLink.icon=="" && objLink.url.indexOf("weibo.com")!=-1)objLink.icon="/static/themes/images/link/logo_sina_32x32.png";
                if(objLink.icon=="" && objLink.url.indexOf("douban.com")!=-1)objLink.icon="/static/themes/images/link/logo_douban_32x32.png";
                if(objLink.icon=="" && objLink.url.indexOf("music.163.com")!=-1)objLink.icon="/static/themes/images/link/logo_163_32x32.png";
                if(objLink.icon=="" && objLink.url.indexOf("weidian.com")!=-1)objLink.icon="/static/themes/images/link/logo_weidian_32x32.png";
            });
        }
        // 购票链接？？
        Object.assign(formObj , {
            listLinks:fields.listLinks,
            listTicketLink:fields.listTicketLink,
        });
        
        return formObj;        
    }

}

module.exports = APIController;
