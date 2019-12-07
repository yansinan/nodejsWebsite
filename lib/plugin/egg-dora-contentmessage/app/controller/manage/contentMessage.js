const xss = require("xss");
const _ = require('lodash');

const {
    siteFunc,
} = require('../../utils');

const messageRule = (ctx) => {
    return {
        content: {
            type: "string",
            required: true,
            min: 5,
            max: 200,
            message: ctx.__("validate_rangelength", [ctx.__("label_messages_content"), 5, 200])
        }
    }
}

let ContentMessageController = {

    async list(ctx, app) {

        try {

            let payload = ctx.query;

            let messageList = await ctx.service.message.find(payload, {
                searchKeys: ['content']
            });

            ctx.helper.renderSuccess(ctx, {
                data: messageList
            });

        } catch (err) {

            ctx.helper.renderFail(ctx, {
                message: err
            });

        }
    },

    async create(ctx, app) {


        try {

            let fields = ctx.request.body || {};
            if (_.isEmpty(ctx.session.user) && _.isEmpty(ctx.session.adminUserInfo)) {
                throw new Error(ctx.__("validate_error_params"))
            }

            const formObj = {
                contentId: fields.contentId,
                content: xss(fields.content),
                replyAuthor: fields.replyAuthor,
                adminReplyAuthor: fields.adminReplyAuthor,
                relationMsgId: fields.relationMsgId,
                utype: fields.utype || '0'
            }


            ctx.validate(messageRule(ctx), formObj);



            if (fields.utype === '1') { // 管理员
                formObj.adminAuthor = ctx.session.adminUserInfo._id;
            } else {
                formObj.author = ctx.session.user._id;
            }

            let targetMessage = await ctx.service.message.create(formObj);


            // 发送消息给客户端
            let contentInfo = await ctx.service.content.item(ctx, {
                query: {
                    _id: fields.contentId
                },
                files: 'uAuthor'
            });
            let passiveUser = fields.replyAuthor ? fields.replyAuthor : contentInfo.uAuthor;
            siteFunc.addSiteMessage('3', ctx.session.user, passiveUser, targetMessage._id, {
                targetMediaType: '1'
            });

            let returnMessage = await ctx.service.message.item(ctx, {
                query: {
                    _id: targetMessage._id
                }
            })

            ctx.helper.renderSuccess(ctx, {
                data: returnMessage
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

            let targetItem = await ctx.service.message.item(ctx, {
                query: {
                    _id: _id
                }
            });

            ctx.helper.renderSuccess(ctx, {
                data: targetItem
            });

        } catch (err) {
            ctx.helper.renderFail(ctx, {
                message: err
            });
        }

    },



    async removes(ctx, app) {

        try {
            let targetIds = ctx.query.ids;
            await ctx.service.message.removes(ctx, targetIds);
            ctx.helper.renderSuccess(ctx);

        } catch (err) {

            ctx.helper.renderFail(ctx, {
                message: err
            });
        }
    }

}

module.exports = ContentMessageController;