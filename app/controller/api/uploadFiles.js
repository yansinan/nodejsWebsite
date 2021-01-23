/*
 * @Author: dr 
 * @Date: 2021-1-23 
 * @Description local 本地
 * @Last Modified by: dr
 * @Last Modified time: 2021-1-23 
 */
const Controller = require('egg').Controller;

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
        pathFormat.splice(pathFormat.findIndex(v=>(v=='images'))+1,0,uploadOptions.subdirMod);

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

class UserController extends Controller {

    /**
     * @api {post} /api/upload/files 文件上传
     * @apiDescription 文件上传，上传用户头像等，限单个文件
     * @apiName /api/upload/files
     * @apiGroup Normal
     * @apiParam {file} file 文件
     * @apiParam {string} action 文件类型 uploadimage:图片  uploadfile:文件
     * @apiParam {string} token 登录时返回的参数鉴权
     * @apiSuccess {json} result
     * @apiSuccessExample {json} Success-Response:
     *{
     *    "status": 200,
     *    "message": "get data success",
     *    "server_time": 1544167579835,
     *    "data": 
     *    {
     *       "path": "http://creatorchain.oss-cn-hongkong.aliyuncs.com/upload/images/img1544167579253.png" // 文件链接
     *    } 
     *}
     * @apiSampleRequest http://localhost:8080/api/upload/files
     * @apiVersion 1.0.0
     */
    async create() {
        const {
            ctx,
            app
        } = this;
        try {
            //存放路径
            let options = !_.isEmpty(app.config.doraUploadFile.uploadFileFormat) ? app.config.doraUploadFile.uploadFileFormat : {};
            
            let uploadPath, returnPath;
            let listReturenPath=[];
            // const stream = await ctx.getFileStream();//单个文件使用
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
                    console.log("field: " + part.fieldname);
                    console.log("filename: " + part.filename);
                    console.log("encoding: " + part.encoding);
                    console.log("mime: " + part.mime);
                    // 在upload/images下，按控制器分文件夹
                    options.subdirMod=parts.field.nameMod?parts.field.nameMod:'';
                    
                    let beforeUploadFileInfo = await getFileInfoByStream(ctx, options, part);                    
                    let {
                        uploadForder,
                        uploadFileName,
                        fileType
                    } = beforeUploadFileInfo;

                    const publicDir = options.upload_path || (process.cwd() + '/app/public');
                    uploadPath = `${publicDir}/${uploadForder}`
                    if (!fs.existsSync(uploadPath)) {
                        fs.mkdirSync(uploadPath,{recursive: true});
                    }
                    const target = path.join(uploadPath, `${uploadFileName+fileType}`)
                    const writeStream = fs.createWriteStream(target)

                    // const writePath = path.resolve(
                    //     "./src/",
                    //     `${new Date().getTime() + part.filename}`
                    // );
                    // console.log(writePath);
                    // if (!fs.existsSync(writePath)) {
                    //     fs.writeFileSync(writePath, "");
                    // }
                    // const writeStream = fs.createWriteStream(writePath);
                    

                    try {
                        // await awaitWriteStream(stream.pipe(writeStream));//单个文件使用
                        await part.pipe(writeStream);
                    } catch (err) {
                        // 必须将上传的文件流消费掉，要不然浏览器响应会卡死
                        // await sendToWormhole(stream);
                        await sendToWormhole(part)
                        throw err
                    }
                    listReturenPath.push(`${app.config.server_path}${app.config.static.prefix}/${uploadForder}/${uploadFileName+fileType}`);
                    
                }
            }
            

            // 设置响应内容和响应状态码
            ctx.helper.renderSuccess(ctx, {
                data: {
                    path: listReturenPath[0],
                    listPath:listReturenPath,
                }
            });

        } catch (error) {
            debugger;
            ctx.helper.renderFail(ctx, {
                message: error
            });
        }

    }
}

module.exports = UserController;