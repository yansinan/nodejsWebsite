const xss = require("xss");
const _ = require('lodash');

const regUserRule = (ctx) => {
    return {
        userName: {
            type: "string",
            required: true,
            min: 2,
            max: 30,
            message: ctx.__("validate_error_field", [ctx.__("label_user_userName")])
        },
        // email: {
        //     type: "email",
        //     required: false,
        //     message: ctx.__("validate_inputCorrect", [ctx.__("label_user_email")])
        // },
        // phoneNum: {
        //     type: "string",
        //     required: false,
        //     message: "invalid phoneNum"
        // },
    }
}


//中文转拼音
const getPinYin = require('../../utils/modPinYin.js').getPinYin;

let RegUserController = {
    async addOneName(ctx, app){    
        console.debug("regUser.addOneName==>",ctx.request,ctx.query);
        try {
            // let fields = req.body || {};
            let fields = ctx.request.body || ctx.query || {};

            const formObj = {
                name: fields.name,
                userName:fields.userName || getPinYin(fields.name),
                group:fields.group || "乐手",
            }
            // let errInfo = validateForm(res, 'contentTag', formObj)
    
            // if (!_.isEmpty(errInfo)) {
            //     throw new Error(errInfo.errors[0].message)
            // }
    
            let resAdd=await ctx.service.user.create(formObj);
            // renderSuccess 第三个参数,可以在返回结果中获得result.data.data._id{}
            ctx.helper.renderSuccess(ctx,{
                data:resAdd,
            });
    
        } catch (err) {
            ctx.helper.renderFail(ctx, {
                message: err
            });
        }
    },
    async findByName (ctx, app) {
        try {
            // let payload = req.query;
            let payload = ctx.query;
            let userlist = await ctx.service.user.find(payload);
            // console.log("regUser.findByName::=>",payload,userlist);
            ctx.helper.renderSuccess(ctx, {
                data: userlist
            });
        } catch (err) {
            ctx.helper.renderFail(ctx, {
                message: err
            });
        }
    },
    async list(ctx, app) {

        try {

            let payload = ctx.query;
            let userlist = await ctx.service.user.find(payload);

            ctx.helper.renderSuccess(ctx, {
                data: userlist
            });

        } catch (err) {

            ctx.helper.renderFail(ctx, {
                message: err
            });

        }
    },


    async getOne(ctx, app) {

        try {
            let _id = ctx.query.id;

            let targetUser = await ctx.service.user.item(ctx, {
                query: {
                    _id: _id
                }
            });

            ctx.helper.renderSuccess(ctx, {
                data: targetUser
            });

        } catch (err) {
            ctx.helper.renderFail(ctx, {
                message: err
            });
        }

    },


    async update(ctx, app) {


        try {

            let fields = ctx.request.body || {};

            ctx.validate(regUserRule(ctx), {
                userName: fields.userName,
                email: fields.email,
                phoneNum: fields.phoneNum,
            });

            const userObj = {};

            if (fields.enable != 'undefined' && fields.enable != undefined) {
                userObj.enable = fields.enable;
            }
            if (fields.userName) {
                userObj.userName = fields.userName;
            }
            if (fields.phoneNum || fields.phoneNum==="") {
                userObj.phoneNum = fields.phoneNum;
            }
            if (fields.email || fields.email==="") {
                userObj.email = fields.email;
            }
            if (fields.name) {
                userObj.name = fields.name;
            }
            if (fields.gender) {
                userObj.gender = fields.gender;
            }

            if (fields.logo) {
                userObj.logo = fields.logo;
            }

            if (fields.confirm) {
                userObj.confirm = fields.confirm;
            }
            if (fields.group) {
                userObj.group = fields.group;
            }
            if (fields.category) {
                userObj.category = fields.category;
            }
            if (fields.comments) {
                userObj.comments = xss(fields.comments);
            }
            if (fields.introduction) {
                userObj.introduction = xss(fields.introduction);
            }
            if (fields.company) {
                userObj.company = fields.company;
            }
            if (fields.province) {
                userObj.province = fields.province;
            }
            if (fields.city) {
                userObj.city = fields.city;
            }
            if (fields.birth) {
                // 生日日期不能大于当前时间
                if (new Date(fields.birth).getTime() > new Date().getTime()) {
                    throw new Error(ctx.__('validate_error_params'));
                }
                userObj.birth = fields.birth;
            }
            if (fields.industry) {
                userObj.industry = xss(fields.industry);
            }
            if (fields.profession) {
                userObj.profession = xss(fields.profession);
            }
            if (fields.experience) {
                userObj.experience = xss(fields.experience);
            }
            if (fields.password) {
                userObj.password = fields.password;
            }
            if (fields.dateIn) userObj.dateIn = fields.dateIn;//加入时间
            if (fields.dateOut) userObj.dateOut = fields.dateOut;//离开时间

            // console.log('--userObj--', userObj)
            await ctx.service.user.update(ctx, fields._id, userObj);

            ctx.helper.renderSuccess(ctx);


        } catch (err) {

            ctx.helper.renderFail(ctx, {
                message: err
            });

        }

    },


    async removes(ctx, app) {

        try {

            let targetIds = ctx.query.ids;
            await ctx.service.user.safeDelete(ctx, targetIds);
            ctx.helper.renderSuccess(ctx);

        } catch (err) {

            ctx.helper.renderFail(ctx, {
                message: err
            });
        }
    },

}

module.exports = RegUserController;