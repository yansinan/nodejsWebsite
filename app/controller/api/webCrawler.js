/*
 * @Author: dr 
 * @Date: 2021-02-16 22:53:59 
 * @Last Modified by: dr
 * @Last Modified time: 2021-08-31 09:54:53
 */

const Controller = require('egg').Controller;
const SERVICE_NAME=__filename.slice(__dirname.length + 1, -3);
const Axios = require("axios");

class UserController extends Controller {
    async fetchWXArticle(){
        const {
            ctx,
            app
        } = this;
        let service=ctx.service[SERVICE_NAME];
        let strSearch=ctx.search;
        
        try {
            // if (!idNCMMV) throw new Error(ctx.__('validate_error_params')+idNCMMV);

            let res=await Axios.get(this.app.config.server_puppeteerApi,{ params:ctx.query,});

            if(res && res.status=="200" && res.data.status=="success" && res.data.data){
                // 设置响应内容和响应状态码
                ctx.helper.renderSuccess(ctx, {
                    resAxios:res.status,
                    resPuppeteer:res.data,
                    data:res.data.data,
                });
            }else {
                let msg=""
                if(res.status!="200" && res.status!="success")msg="puppeteer服务:响应错:"+res.status;
                else if(!res.data || !res.data.data){
                    msg="puppeteer服务:无数据:"+ (JSON.stringify(res.data) || "");
                    msg="puppeteer服务:"+res.data.message;
                    
                }else if(res.data.message=='链接过期')msg="puppeteer服务:链接过期:"+ (JSON.stringify(res.data) || "");
                else {
                    debugger;
                    msg="其他未定义错误"+res.data.message;
                }
                throw new Error(msg);
            }

        } catch (error) {
            debugger;
            ctx.helper.renderFail(ctx, {
                message: error.message,
                error,
            });
        }
            
    }
    async fetchWXImg(){
        const {
            ctx,
            app
        } = this;
        let service=ctx.service[SERVICE_NAME];
        try {
            let params=ctx.params;
            let request=ctx.req;
            let search=new URL(request.url, `http://${request.headers.host}`).search.split("?")[1];
            // ctx.redirect(this.app.config.server_puppeteerApi+"/getImg/"+ctx.params[0])
            
            let res=await Axios.get(this.app.config.server_puppeteerApi+`/getImg/${params.typeId}/${params.id}/${params.size}?${search}`,{ params:ctx.query,responseType: 'arraybuffer'});

            ctx.set('Content-Type', res.headers["content-type"]);
            // this.ctx.set('Content-Type', 'image/jpeg');
            // debugger
            ctx.body = res.data;
        } catch (error) {
            debugger;
            ctx.helper.renderFail(ctx, {
                message: error.message,
                error,
            });
        }        
    }

    // 微店
    async fetchArticle(){////curl "http://puppeteer:8080/weidian?itemID=2844646196&spider_token=52c33"
        const {
            ctx,
            app
        } = this;
        let service=ctx.service[SERVICE_NAME];
        let strSearch=ctx.search;
        let {site}=ctx.params;//网站名标识weidian  weixin

        try {
            // if (!idNCMMV) throw new Error(ctx.__('validate_error_params')+idNCMMV);

            let res=await Axios.get(this.app.config.server_puppeteerApi+"/"+site,{ params:ctx.query,});////curl "http://puppeteer:8080/weidian?itemID=2844646196&spider_token=52c33"

            if(res && res.status=="200" && res.data.status=="success" && res.data.data){
                // 设置响应内容和响应状态码
                ctx.helper.renderSuccess(ctx, {
                    resAxios:res.status,
                    resPuppeteer:res.data,
                    data:res.data.data,
                });
            }else {
                let msg=""
                if(res.status!="200" && res.status!="success")msg="puppeteer服务:响应错:"+res.status;
                else if(!res.data || !res.data.data){
                    msg="puppeteer服务:无数据:"+ (JSON.stringify(res.data) || "");
                    msg="puppeteer服务:"+res.data.message;
                    
                }else if(res.data.message=='链接过期')msg="puppeteer服务:链接过期:"+ (JSON.stringify(res.data) || "");
                else {
                    debugger;
                    msg="其他未定义错误"+res.data.message;
                }
                throw new Error(msg);
            }

        } catch (error) {
            debugger;
            ctx.helper.renderFail(ctx, {
                message: error.message,
                error,
            });
        }
            
    }
    async fetchImg(){
        const {
            ctx,
            app
        } = this;
        let service=ctx.service[SERVICE_NAME];
        try {
            let params=ctx.params;
            let request=ctx.req;
            let search=new URL(request.url, `http://${request.headers.host}`).search.split("?")[1];
            let url=this.app.config.server_puppeteerApi+`/${params.site}/getImg/${params.path}?${search}`
            // debugger
            //curl "http://puppeteer:8080/weidian/getImg/wdseller1368580659-05140000016b8dc835140a21924a_1440_1080.jpg.webp?w=640&h=640"
            let res=await Axios.get(url,{ params:ctx.query,responseType: 'arraybuffer'});

            ctx.set('Content-Type', res.headers["content-type"]);
            // this.ctx.set('Content-Type', 'image/jpeg');
            // debugger
            ctx.body = res.data;
        } catch (error) {
            debugger;
            ctx.helper.renderFail(ctx, {
                message: error.message,
                error,
            });
        }        
    }
}

module.exports = UserController;