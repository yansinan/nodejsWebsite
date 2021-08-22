/*
 * @Author: doramart 
 * @Date: 2019-06-27 17:16:32 
 * @Last Modified by: dr
 * @Last Modified time: 2021-08-08 06:32:23
 */
const Controller = require('egg').Controller;
const xss = require("xss");
const _ = require('lodash');

const shortid = require('shortid');
const moment = require("moment");

// groupby相关函数
var ObjProto = Object.prototype;
function hasOwnProp(obj, k) {
    return ObjProto.hasOwnProperty.call(obj, k);
}
/**
 * @param {string|number} attr
 * @returns {(string|number)[]}
 * @private
 */
function _prepareAttributeParts(attr) {
    if (!attr) {
    return [];
    }

    if (typeof attr === 'string') {
    return attr.split('.');
    }

    return [attr];
}
function isFunction(obj) {
    return ObjProto.toString.call(obj) === '[object Function]';
}
    
/**
 * @param {string}   attribute      Attribute value. Dots allowed.
 * @returns {function(Object): *}
 */
function getAttrGetter(attribute) {
    const parts = _prepareAttributeParts(attribute);

    return function attrGetter(item) {
    let _item = item;

    for (let i = 0; i < parts.length; i++) {
        const part = parts[i];

        // If item is not an object, and we still got parts to handle, it means
        // that something goes wrong. Just roll out to undefined in that case.
        if (hasOwnProp(_item, part)) {
        _item = _item[part];
        } else {
        return undefined;
        }
    }

    return _item;
    };
}
// 数组分类排序成多维数组
function groupBy(obj, val, throwOnUndefined) {
    const result = new Array();
    const iterator = isFunction(val) ? val : getAttrGetter(val);
    for (let i = 0; i < obj.length; i++) {
        const value = obj[i];
        const key = iterator(value, i);
        if (key === undefined && throwOnUndefined === true) {
        throw new TypeError(`groupby: attribute "${val}" resolved to undefined`);
        }
        (result[key] || (result[key] = [])).push(value);
    }
    return result;
}

class APIController extends Controller {



    // 字段列表：
    getListFields (type = '') {
        const {
            ctx
        } = this;
        let files = null;
        if (type == 'normal') {
            files = '_id url name alias sImg date updateDate discription clickNum roofPlacement type videoImg state dismissReason categories isTop dateRelease'
        } else if (type == 'simple') {
            files = '_id url name alias sImg stitle date updateDate clickNum roofPlacement type videoImg state dismissReason';
        } else if (type == 'stage1') {
            files = '_id url name alias sImg date updateDate discription comments clickNum roofPlacement type videoImg state dismissReason categories isTop'
        } else if (type == 'timeline') {
            files = '_id url stitle title name alias sImg date discription roofPlacement state categories isTop listArtists tags dateTimeline dateYear'
        } else {
            files = '_id url stitle title name alias sImg date discription clickNum roofPlacement state categories isTop listArtists tags dateYear'
        }
        // console.log('--files----', files)
        return files;
    }

    renderList(ctx, inList = []) {

        return new Promise(async (resolve, reject) => {
            try {

                let newContentList = JSON.parse(JSON.stringify(inList));


                for (let contentItem of newContentList) {
                    contentItem.id = contentItem._id;
                    contentItem.hasPraised = false;
                    contentItem.hasComment = false;
                    contentItem.hasFavorite = false;
                    contentItem.hasDespise = false;

                    if (contentItem.simpleComments) {
                        contentItem.simpleComments = JSON.parse(contentItem.simpleComments);
                    }

                }

                resolve(newContentList);
            } catch (error) {
                resolve([]);
            }
        })

    }
    async list() {
        const {
            ctx,
            app
        } = this;
        try {

            let payload = ctx.query;
            let model = ctx.query.model;
            let sortby = ctx.query.sortby;
            let tagName = ctx.query.tagName;
            let filesType = 'timeline'; // 查询模式 full/normal/simple
            let isSingerPage = false; // 是否是单页面
            let dateStart=(new Date(ctx.query.dateStart)) || (new Date());
            let idArtist=ctx.query.idArtist || ctx.params.idArtist;//某乐队的时间线
            // 请求类型page 整页；dom 局部;
            let type = payload.type || "page";
            // 基础时间排序
            let sortDate={
                // dateRelease: -1,
                date: -1,
                // dateStart: -1
            }
            // 计算365*2天之内
            let rangeTime = getDateStr(-365*2,dateStart);
            let queryObj = {
                    state: '2',
                    // date: {
                    //     "$gte": new Date(rangeTime.startTime),
                    //     "$lte": new Date(rangeTime.endTime)
                    // }
                },
                sortObj = sortDate;
            // 首页推荐
            if (ctx.query.pageType == 'index') {
                sortObj.roofPlacement=-1
            }
            // 是否置顶
            if (model == '1') {
                queryObj.isTop = 1;
            }
            //特定 标签
            if (tagName) {
                let targetTag = await ctx.service.contentTag.item(ctx, {
                    query: {
                        name: tagName
                    }
                });
                if (!_.isEmpty(targetTag)) {
                    queryObj.tags = targetTag._id;
                    delete queryObj.categories;
                }
            }

            // 按乐队检索时间线
            // if(idArtist){
            //     let target = await ctx.service.artist.item(ctx, {
            //         query: {
            //             _id: idArtist
            //         }
            //     });
            //     if (!_.isEmpty(target)) {
            //         queryObj.listArtists = target._id;
            //         delete queryObj.categories;
            //     }
            // }
            // （赤瞳所有）按年文章列表
            // let listContents = (await ctx.service.content.find(payload, {
            //     sort: sortObj,
            //     query: queryObj,
            //     // searchKeys: ['userName', 'title', 'comments', 'discription'],
            //     files: this.getListFields(filesType)
            // })).docs;
            // // 所有乐队按年时间线
            // let listArtists = (await ctx.service.artist.find(payload, {
            //     sort: sortObj,
            //     query: queryObj,
            //     // searchKeys: ['keywords', 'name', 'comments', 'discription'],
            //     files: this.getListFields(filesType)
            // })).docs;
            // // 所有唱片按年时间线
            // let listRecords = (await ctx.service.record.find(payload, {
            //     sort: sortObj,
            //     query: queryObj,
            //     // searchKeys: ['keywords', 'name', 'comments', 'discription'],
            //     files: this.getListFields(filesType)
            // })).docs;
            // // 所有演出按年时间线
            // let listShows = (await ctx.service.show.find(payload, {
            //     sort: sortObj,
            //     query: queryObj,
            //     // searchKeys: ['keywords', 'name', 'comments', 'discription'],
            //     files: this.getListFields(filesType)
            // })).docs;

            // // 合并
            // let listTimeline=[...listArtists || [] , ...listRecords || [],...listContents || [],...listShows || []];

            // // 排序
            // listTimeline=listTimeline.sort((a,b)=>{
            //     let timeA=new Date(a.date);
            //     let timeB=new Date(b.date);
            //     return timeB.getTime()-timeA.getTime();
            // })
            let resDocs = await ctx.service.doc.find(payload, {
                sort: sortObj,
                query: queryObj,
                // searchKeys: ['keywords', 'name', 'comments', 'discription'],
                files: this.getListFields(filesType)
            });
            let listTimeline = resDocs.docs;
            let listRes = listTimeline.map(v=>{
                let source=v.url.split("/")[1];//artist,show,record,detail
                let strDefault="";
                let widthTemp=6;
                switch(source) {
                    case "record":
                        strDefault="作品"
                        widthTemp=4;
                        break;
                    case "show":
                        strDefault="演出"
                        widthTemp=8;
                        break;
                    case "artist":
                        strDefault="乐队"
                        widthTemp=6;
                        break;
                    case "details":
                        strDefault="消息"
                        widthTemp=10;
                        break;
                    default:
                        strDefault=""
                } 
                // TODO：根据文章分类设置strDefault
                return {
                    _id:v._id,
                    strCate : source,
                    strCateTip : strDefault,
                    // strAlt:
                    name: ( ((v.stitle && v.stitle!="") ? v.stitle : v.title) || v.title || v.name || v.sTitle || v.alias ),
                    alias:(v.stitle || v.sTitle || v.alias || '' ),//副标题
                    date:moment(new Date(v.date)).format("YYYY-MM-DD"),
                    dateTimeline: moment(new Date(v.date)).format("MM-DD"),
                    dateYear: v.dateYear || moment(new Date(v.date)).format("YYYY")+" ",
                    url:v.url,
                    sImg:v.sImg,
                    discription:v.discription,
                    tags:v.tags,
                    listArtists:v.listArtists,
                    widthTemp:widthTemp,//时间轴显示模块的宽度
                }
            })
            // 组合页面信息和数组
            let resObj = {
                docs : (await this.renderList(ctx, listRes)),
                pageInfo:Object.assign({itemTemplate:"timeline",},resDocs.pageInfo),//对象模板使用时间轴模板                
            }
            //这里直接渲染模板?
            let path="../view/dorawhite/2-stage-timeline/listTempTimeline.html";//app/view/dorawhite/2-stage-timeline/listTempTimeline.html
            if(type=="dom")resObj.docs=await ctx.renderView(path,{posts:resObj.docs});
            // debugger;
            ctx.helper.renderSuccess(ctx, {
                data: resObj
            });

        } catch (err) {

            ctx.helper.renderFail(ctx, {
                message: err
            });

        }
    }

}

module.exports = APIController;