/*
 * @Author: dr 
 * @Date: 2021-1-23 
 * @Description local 本地
 * @Last Modified by: dr
 * @Last Modified time: 2021-1-23 
 */
const Controller = require('egg').Controller;
const SERVICE_NAME=__filename.slice(__dirname.length + 1, -3);


class UserController extends Controller {

    /**
     * @api {post} /manage/dr/uploadFiles 文件上传
     * @apiDescription 文件上传，上传用户头像等，支持多文件
     * @apiName /manage/dr/uploadFiles
     * @apiGroup Normal
     * @apiParam {file} file 文件
     * @apiParam {string} action 文件类型 uploadimage:图片  uploadfile:文件
     * @apiParam {string} nameMod 控制器名称，用于创建文件路径
     * @apiParam {string} subPath 控制器目录下的子文件夹，用于创建文件路径，例如:$nameMod/$id/xxx.jpg
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
     *       "listPath":[]
     *       "listInfoImage":{
     *          name,url,type
     *       }
     *    } 
     *}
     * @apiSampleRequest http://localhost:8080/manage/dr/uploadFiles
     * @apiVersion 1.0.0
     */
    async create() {
        const {
            ctx,
            app
        } = this;
        try {
            let service=ctx.service[SERVICE_NAME];
            let res = await service.create();

            // 设置响应内容和响应状态码
            ctx.helper.renderSuccess(ctx, {
                data: {
                    path: res.path,
                    listPath:res.listPath,
                    listInfoImage:res.listInfoImage,
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