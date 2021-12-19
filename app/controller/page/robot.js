/*
 * @Author: dr 
 * @Date: 2021-12-18 22:27:19 
 * @Last Modified by: dr
 * @Last Modified time: 2021-12-19 01:21:55
 */
const Controller = require('egg').Controller;
const _ = require('lodash');
// const shortid = require('shortid');
// const pkg = require('@root/package.json')
// const validator = require('validator')
// const captcha = require('trek-captcha')
const path = require('path')
const fs = require('fs')
// const qr = require('qr-image')
const moment = require('moment')

class RobotController extends Controller {
    async getSiteMapXML() {
        let payload = this.ctx.params;
        // 获取站点配置
        let configs = await this.ctx.getSiteConfig();
        let root_path = configs.siteDomain;
        let priority = 0.8;
        let freq = "weekly";
        let lastMod = moment().format("YYYY-MM-DD");
        let xml =
            '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
        xml += "<url>";
        xml += "<loc>" + root_path + "</loc>";
        xml += "<changefreq>daily</changefreq>";
        xml += "<lastmod>" + lastMod + "</lastmod>";
        xml += "<priority>" + 1 + "</priority>";
        xml += "</url>";

        // 类别地图
        let allCategories = await this.service.uploadFiles.cacheJSON(`${(process.cwd() + '/app/public')}/cache/objNavigation.json`,{tar:this,fun:this.ctx.helper.reqJsonData, params:['contentCategory/getList', payload] },true,true);
        allCategories.forEach(function (cate) {
            if (cate.parentId != '0')return;
            xml += "<url>";
            // xml += "<loc>" + root_path + cate.url + "</loc>";
            xml += "<loc>" + root_path + "/timeline/"+cate.defaultUrl+"/" + "</loc>";
            xml += "<changefreq>weekly</changefreq>";
            xml += "<lastmod>" + lastMod + "</lastmod>";
            xml += "<priority>0.8</priority>";
            xml += "</url>";
        });

        // 文档地图
        let allContents = await this.ctx.service.doc.find({
            isPaging: '0'
        });
        allContents.forEach(function (post) {
            xml += "<url>";
            xml += "<loc>" + root_path +"timeline/" + post.docAlias + post.url + "</loc>";
            xml += "<changefreq>weekly</changefreq>";
            xml += "<lastmod>" + lastMod + "</lastmod>";
            xml += "<priority>0.5</priority>";
            xml += "</url>";
        });
        xml += "</urlset>";
        this.ctx.set('Content-Type', 'application/xml');
        this.ctx.body = xml;
    }
    async getRobotsTXT(){
        let stream = fs.readFileSync(path.join(__dirname, '../../../robots.txt'), 'utf-8');
        this.ctx.body = stream;
    }
}

module.exports = RobotController;