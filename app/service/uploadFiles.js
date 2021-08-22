/*
 * @Author: dr 
 * @Date: 2021-01-26 
 * @Last Modified by: dr
 * @Last Modified time: 2021-08-04 12:49:08
 */

'use strict';
const Service = require('egg').Service;
// const Model_NAME=__filename.slice(__dirname.length + 1, -3);

const _ = require('lodash');
const awaitWriteStream = require('await-stream-ready').write
const sendToWormhole = require('stream-wormhole')
const fs = require('fs')
const path = require('path')
const config = {
    /* 上传图片配置项 */
    "imageActionName": "uploadimage", /* 执行上传图片的action名称 */
    "imageFieldName": "upfile", /* 提交的图片表单名称 */
    "imageMaxSize": 2048000, /* 上传大小限制，单位B */
    "imageAllowFiles": [".png", ".jpg", ".jpeg", ".gif", ".bmp"], /* 上传图片格式显示 */
    "imageCompressEnable": true, /* 是否压缩图片,默认是true */
    "imageCompressBorder": 1600, /* 图片压缩最长边限制 */
    "imageInsertAlign": "none", /* 插入的图片浮动方式 */
    "imageUrlPrefix": "", /* 图片访问路径前缀 */
    "imagePathFormat": "/upload/images/{yyyy}{mm}{dd}/{time}{rand:6}", /* 上传保存路径,可以自定义保存路径和文件名格式 */
                                /* {filename} 会替换成原文件名,配置这项需要注意中文乱码问题 */
                                /* {rand:6} 会替换成随机数,后面的数字是随机数的位数 */
                                /* {time} 会替换成时间戳 */
                                /* {yyyy} 会替换成四位年份 */
                                /* {yy} 会替换成两位年份 */
                                /* {mm} 会替换成两位月份 */
                                /* {dd} 会替换成两位日期 */
                                /* {hh} 会替换成两位小时 */
                                /* {ii} 会替换成两位分钟 */
                                /* {ss} 会替换成两位秒 */
                                /* 非法字符 \ : * ? " < > | */
                                /* 具请体看线上文档: fex.baidu.com/ueditor/#use-format_upload_filename */

    /* 涂鸦图片上传配置项 */
    "scrawlActionName": "uploadscrawl", /* 执行上传涂鸦的action名称 */
    "scrawlFieldName": "upfile", /* 提交的图片表单名称 */
    "scrawlPathFormat": "/upload/images/{yyyy}{mm}{dd}/{time}{rand:6}", /* 上传保存路径,可以自定义保存路径和文件名格式 */
    "scrawlMaxSize": 2048000, /* 上传大小限制，单位B */
    "scrawlUrlPrefix": "", /* 图片访问路径前缀 */
    "scrawlInsertAlign": "none",

    /* 截图工具上传 */
    "snapscreenActionName": "uploadimage", /* 执行上传截图的action名称 */
    "snapscreenPathFormat": "/upload/images/{yyyy}{mm}{dd}/{time}{rand:6}", /* 上传保存路径,可以自定义保存路径和文件名格式 */
    "snapscreenUrlPrefix": "", /* 图片访问路径前缀 */
    "snapscreenInsertAlign": "none", /* 插入的图片浮动方式 */

    /* 抓取远程图片配置 */
    "catcherLocalDomain": ["127.0.0.1", "localhost", "img.baidu.com"],
    "catcherActionName": "catchimage", /* 执行抓取远程图片的action名称 */
    "catcherFieldName": "source", /* 提交的图片列表表单名称 */
    "catcherPathFormat": "/upload/images/{yyyy}{mm}{dd}/{time}{rand:6}", /* 上传保存路径,可以自定义保存路径和文件名格式 */
    "catcherUrlPrefix": "", /* 图片访问路径前缀 */
    "catcherMaxSize": 2048000, /* 上传大小限制，单位B */
    "catcherAllowFiles": [".png", ".jpg", ".jpeg", ".gif", ".bmp"], /* 抓取图片格式显示 */

    /* 上传视频配置 */
    "videoActionName": "uploadvideo", /* 执行上传视频的action名称 */
    "videoFieldName": "upfile", /* 提交的视频表单名称 */
    "videoPathFormat": "/upload/video/{yyyy}{mm}{dd}/{time}{rand:6}", /* 上传保存路径,可以自定义保存路径和文件名格式 */
    "videoUrlPrefix": "", /* 视频访问路径前缀 */
    "videoMaxSize": 102400000, /* 上传大小限制，单位B，默认100MB */
    "videoAllowFiles": [
        ".flv", ".swf", ".mkv", ".avi", ".rm", ".rmvb", ".mpeg", ".mpg",
        ".ogg", ".ogv", ".mov", ".wmv", ".mp4", ".webm", ".mp3", ".wav", ".mid"], /* 上传视频格式显示 */

    /* 上传文件配置 */
    "fileActionName": "uploadfile", /* controller里,执行上传视频的action名称 */
    "fileFieldName": "upfile", /* 提交的文件表单名称 */
    "filePathFormat": "/upload/file/{yyyy}{mm}{dd}/{time}{rand:6}", /* 上传保存路径,可以自定义保存路径和文件名格式 */
    "fileUrlPrefix": "", /* 文件访问路径前缀 */
    "fileMaxSize": 51200000, /* 上传大小限制，单位B，默认50MB */
    "fileAllowFiles": [
        ".png", ".jpg", ".jpeg", ".gif", ".bmp",
        ".flv", ".swf", ".mkv", ".avi", ".rm", ".rmvb", ".mpeg", ".mpg",
        ".ogg", ".ogv", ".mov", ".wmv", ".mp4", ".webm", ".mp3", ".wav", ".mid",
        ".rar", ".zip", ".tar", ".gz", ".7z", ".bz2", ".cab", ".iso",
        ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx", ".pdf", ".txt", ".md", ".xml"
    ], /* 上传文件格式显示 */

    /* 列出指定目录下的图片 */
    "imageManagerActionName": "listimage", /* 执行图片管理的action名称 */
    "imageManagerListPath": "/upload/images/", /* 指定要列出图片的目录 */
    "imageManagerListSize": 20, /* 每次列出文件数量 */
    "imageManagerUrlPrefix": "", /* 图片访问路径前缀 */
    "imageManagerInsertAlign": "none", /* 插入的图片浮动方式 */
    "imageManagerAllowFiles": [".png", ".jpg", ".jpeg", ".gif", ".bmp"], /* 列出的文件类型 */

    /* 列出指定目录下的文件 */
    "fileManagerActionName": "listfile", /* 执行文件管理的action名称 */
    "fileManagerListPath": "/upload/file/", /* 指定要列出文件的目录 */
    "fileManagerUrlPrefix": "", /* 文件访问路径前缀 */
    "fileManagerListSize": 20, /* 每次列出文件数量 */
    "fileManagerAllowFiles": [
        ".png", ".jpg", ".jpeg", ".gif", ".bmp",
        ".flv", ".swf", ".mkv", ".avi", ".rm", ".rmvb", ".mpeg", ".mpg",
        ".ogg", ".ogv", ".mov", ".wmv", ".mp4", ".webm", ".mp3", ".wav", ".mid",
        ".rar", ".zip", ".tar", ".gz", ".7z", ".bz2", ".cab", ".iso",
        ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx", ".pdf", ".txt", ".md", ".xml"
    ] /* 列出的文件类型 */

}

// 处理Ueditor上传保存路径
function setFullPath(dest) {
    const date = new Date()

    const map = {
        't': date.getTime(), // 时间戳
        'm': date.getMonth() + 1, // 月份
        'd': date.getDate(), // 日
        'h': date.getHours(), // 时
        'i': date.getMinutes(), // 分
        's': date.getSeconds(), // 秒
    };

    dest = dest.replace(/\{([ymdhis])+\}|\{time\}|\{rand:(\d+)\}/g, function (all, t, r) {
        let v = map[t];
        if (v !== undefined) {
            if (all.length > 1) {
                v = '0' + v
                v = v.substr(v.length - 2)
            }
            return v;
        } else if (t === 'y') {
            return (date.getFullYear() + '').substr(6 - all.length);
        } else if (all === '{time}') {
            return map['t']
        } else if (r >= 0) {
            return Math.random().toString().substr(2, r)
        }
        return all
    });

    return dest
}

// 上传前获取文件基础信息
let getFileInfoByStream = (ctx, uploadOptions, stream) => {

    const {
        conf,
        uploadType
    } = getUploadConfig(uploadOptions);
    let fileParams = stream.fields || stream.fieldname;
    let askFileType = fileParams.action || 'uploadimage'; // 默认上传图片
    if (Object.keys(uploadType).includes(askFileType)) {
        const actionName = uploadType[askFileType]
        let pathFormat = setFullPath(conf[actionName + 'PathFormat']).split('/')
        let newFileName = pathFormat.pop()
        // 在upload/images下，按控制器分文件夹
        pathFormat.splice(pathFormat.findIndex(v=>(v=='images'))+1,0,uploadOptions.subdirMod,uploadOptions.subPath);

        let uploadForder = path.join('.', ...pathFormat);
        // 所有表单字段都能通过 `stream.fields` 获取到
        const fileName = path.basename(stream.filename) // 文件名称
        const extname = path.extname(stream.filename).toLowerCase() // 文件扩展名称
        if (!extname) {
            throw new Error(res.__('validate_error_params'));
        }
        // 生成文件名
        // let ms = (new Date()).getTime().toString() + extname;
        return {
            uploadForder,
            uploadFileName: newFileName,
            fileName,
            fileType: extname
        }

    } else {
        throw new Error(ctx.__('validate_error_params'));
    }

}

let getUploadConfig = (userUploadConfig) => {
    const conf = Object.assign({}, config, userUploadConfig || {})
    const uploadType = {
        [conf.imageActionName]: 'image',
        [conf.scrawlActionName]: 'scrawl',
        [conf.catcherActionName]: 'catcher',
        [conf.videoActionName]: 'video',
        [conf.fileActionName]: 'file',
    }
    const listType = {
        [conf.imageManagerActionName]: 'image',
        [conf.fileManagerActionName]: 'file',
    }
    return {
        conf,
        uploadType,
        listType
    }
}

class ServicePlugin extends Service {
    async create() {
        const {
            ctx,
            app
        } = this;            
        //存放路径
        let options = !_.isEmpty(app.config.doraUploadFile.uploadFileFormat) ? app.config.doraUploadFile.uploadFileFormat : {};
        
        let uploadPath, returnPath;
        let listReturenPath=[];
        let listObjImage=[];//返回的文件信息对象数组

        const parts = ctx.multipart({ autoFields: true });
        let part;
        while ((part = await parts()) != null) {
            if (part.length) {
                console.log("field: " + part[0]);
                console.log("value: " + part[1]);
            } else {
                if (!part.filename) {
                    continue;
                }
                console.log("uploadFiles.service=>uploading fileInfo from part: " , part);
                // 在upload/images下，按控制器分文件夹
                options.subdirMod=parts.field.nameMod?parts.field.nameMod:'';
                //控制器文件夹下是否按id分文件夹
                options.subPath=parts.field.subPath?parts.field.subPath:'';
                
                let beforeUploadFileInfo = await getFileInfoByStream(ctx, options, part);                    
                let {
                    uploadForder,
                    uploadFileName,
                    fileName,
                    fileType
                } = beforeUploadFileInfo;

                const publicDir = options.upload_path || (process.cwd() + '/app/public');
                uploadPath = `${publicDir}/${uploadForder}`
                if (!fs.existsSync(uploadPath)) {
                    fs.mkdirSync(uploadPath,{recursive: true});
                }
                const target = path.join(uploadPath, `${uploadFileName+fileType}`)
                const writeStream = fs.createWriteStream(target)
               

                try {
                    await part.pipe(writeStream);
                } catch (err) {
                    // 必须将上传的文件流消费掉，要不然浏览器响应会卡死
                    await sendToWormhole(part)
                    throw err
                }
                returnPath=`${app.config.server_path}${app.config.static.prefix}/${uploadForder}/${uploadFileName+fileType}`;
                listReturenPath.push(returnPath);
                listObjImage.push({
                    name:fileName+fileType,
                    url:returnPath,
                    type:part.mime,
                })
            }
        }
        ctx.request.body=Object.assign(ctx.request.body,parts.field);
        let res={
            path: listReturenPath[0] || returnPath,
            listPath:listReturenPath,
            listInfoImage:listObjImage,
            field:ctx.request.body,
        }
        // 设置响应内容和响应状态码
        return res
    }
    // 删除单个文件
    async delete(inPayload) {
        const {
            ctx,
            app
        } = this;            
        // if (!checkCurrentId(ids)) {
        //     throw new Error(ctx.__("validate_error_params"));
        // } else {
        //     ids = ids.split(',');
        // }
        let payload=inPayload || ctx.request.body || ctx.query || {} ;
        let urlFile=payload.url;
        //存放路径
        let options = !_.isEmpty(app.config.doraUploadFile.uploadFileFormat) ? app.config.doraUploadFile.uploadFileFormat : {};
        const publicDir = options.upload_path || (process.cwd() + '/app/public');
        let res={
            status:"fail",
            message:"",
            data:payload,
        }
        if(urlFile){
            res.urlFile=urlFile;
            // 文件本地路径：
            let pathFile=urlFile.split(`${app.config.server_path}${app.config.static.prefix}/`);
            pathFile=`${publicDir}/`+pathFile[1];

            res.pathFile=pathFile;
            // 文件是否存在;
            if (!fs.existsSync(pathFile)) {
                res.status="fail:no-exist";
                res.message="no-exist:"+pathFile;
                return res;
            }
            fs.unlinkSync(pathFile);
            res.status="success";
            return res;
        }
        res.status="fail:no-url";
        res.message="no-url:"+ JSON.stringify(payload)
        return res;
    }

    // 遍历文件
    listUrlImg(){
        const {
            ctx,
            app
        } = this;            
        //存放路径
        // let options = !_.isEmpty(app.config.doraUploadFile.uploadFileFormat) ? app.config.doraUploadFile.uploadFileFormat : {};
        // const root = options.upload_path || (process.cwd() + '/app/public/upload/images');
        const root = (process.cwd() + '/app/public/upload/images');

        let listFilePathTree=[];
        listFilePathTree=getListFile(root,listFilePathTree);
        function getListFile(dir,list){
            var arr = fs.readdirSync(dir);
            arr.forEach(function(item){
                var fullpath = path.join(dir,item);
                var stats = fs.statSync(fullpath);
                if(stats.isDirectory()){
                    getListFile(fullpath,list);
                }else{
                    let urlRoot=`${app.config.server_path}${app.config.static.prefix}/upload/images`;
                    list.push(fullpath.replace(root,urlRoot));
                }
            });
            return list;
        }
        return listFilePathTree;
    }
    
    //缓存json数据
    async cacheJSON(pathFile,objCallBack,isLocalFirst=true,isUpdateAfter=true){
        let folder=path.dirname(pathFile);
        let data=false;
        let res = false;
        if (!fs.existsSync(folder)) {
            fs.mkdirSync(folder,{recursive: true});
        }
        // 强制更新
        if(isLocalFirst){            
            if (fs.existsSync(pathFile)) {
                // 同步读取:TODO错误处理
                data = JSON.parse(fs.readFileSync(pathFile, 'utf-8'));
            }            
        }
        if((!isLocalFirst || !data)){// 如果强制更新，或者没有缓存，或者强制后更新 
            
            data=await objCallBack.fun.call(objCallBack.tar || this,...(objCallBack.params || []));//:TODO错误处理
            // 写入缓存目录:TODO错误处理
            res = fs.writeFileSync(pathFile, JSON.stringify(data));
        }
        if(isUpdateAfter){
            new Promise((resolve,reject)=>{
                return this.cacheJSON(pathFile,objCallBack,false,false);
            }).then(res=>{
                console.info("service.uploadFiles.cacheJSON 事后更新",res);
            })
        }
        return data || res;
    }
    get model(){
        if(!this._model)this._model=this.ctx.model[__filename.slice(__dirname.length + 1, -3)];
        return this._model;
    }
}

module.exports = ServicePlugin;
