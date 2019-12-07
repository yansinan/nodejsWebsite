const xss = require("xss");
const _ = require('lodash');

const contentTagRule = (ctx) => {
    return {
        name: {
            type: "string",
            required: true,
            min: 1,
            max: 12,
            message: ctx.__("validate_error_field", [ctx.__("label_tag_name")])
        },
        comments: {
            type: "string",
            required: true,
            min: 2,
            max: 30,
            message: ctx.__("validate_inputCorrect", [ctx.__("label_comments")])
        }
    }
}



let ContentTagController = {

    async list(ctx, app) {

        try {

            let payload = ctx.query;
            let contentTagList = await ctx.service.contentTag.find(payload, {
                searchKeys: ['name']
            });

            ctx.helper.renderSuccess(ctx, {
                data: contentTagList
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
            const formObj = {
                name: fields.name,
                alias: fields.alias,
                comments: fields.comments
            }


            ctx.validate(contentTagRule(ctx), formObj);



            await ctx.service.contentTag.create(formObj);

            ctx.helper.renderSuccess(ctx);

        } catch (err) {
            ctx.helper.renderFail(ctx, {
                message: err
            });
        }
    },



    async getOne(ctx, app) {

        try {
            let _id = ctx.query.id;

            let targetItem = await ctx.service.contentTag.item(ctx, {
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


    async update(ctx, app) {


        try {

            let fields = ctx.request.body || {};
            const formObj = {
                name: fields.name,
                alias: fields.alias,
                comments: fields.comments
            }


            ctx.validate(contentTagRule(ctx), formObj);



            await ctx.service.contentTag.update(ctx, fields._id, formObj);

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
            await ctx.service.contentTag.removes(ctx, targetIds);
            ctx.helper.renderSuccess(ctx);

        } catch (err) {

            ctx.helper.renderFail(ctx, {
                message: err
            });
        }
    }
}

module.exports = ContentTagController;