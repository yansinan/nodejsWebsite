/*
 * @Author: doramart 
 * @Date: 2019-06-20 18:55:40 
 * @Last Modified by: doramart
 * @Last Modified time: 2019-08-16 16:51:30
 */
const Controller = require('egg').Controller;


const {
    adminGroupRule
} = require('@validate')

const _ = require('lodash');

class AdminGroupController extends Controller {
    async list() {
        const {
            ctx,
            service
        } = this;
        try {

            let payload = ctx.query;
            let adminGroupList = await ctx.service.adminGroup.find(payload);

            ctx.helper.renderSuccess(ctx, {
                data: adminGroupList
            });

        } catch (err) {

            ctx.helper.renderFail(ctx, {
                message: err
            });

        }
    }

    async create() {

        const {
            ctx,
            service
        } = this;
        try {


            let fields = ctx.request.body || {};

            const formObj = {
                name: fields.name,
                comments: fields.comments
            }


            ctx.validate(adminGroupRule.form(ctx), formObj);

            

            await ctx.service.adminGroup.create(formObj);

            ctx.helper.renderSuccess(ctx);

        } catch (err) {
            ctx.helper.renderFail(ctx, {
                message: err
            });
        }

    }



    async getOne() {
        const {
            ctx,
            service
        } = this;
        try {
            let _id = ctx.query.id;

            let targetUser = await ctx.service.adminGroup.item(ctx, {
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

    }


    async update() {

        const {
            ctx,
            service
        } = this;
        try {

            let fields = ctx.request.body || {};
            const formObj = {
                name: fields.name,
                comments: fields.comments,
                power: fields.power
            }


            ctx.validate(adminGroupRule.form(ctx), formObj);

            

            await ctx.service.adminGroup.update(ctx, fields._id, formObj);

            ctx.helper.renderSuccess(ctx);

        } catch (err) {

            ctx.helper.renderFail(ctx, {
                message: err
            });

        }


    }


    async removes() {
        const {
            ctx,
            service
        } = this;
        try {
            let targetIds = ctx.query.ids;
            await ctx.service.adminGroup.removes(ctx, targetIds);
            ctx.helper.renderSuccess(ctx);

        } catch (err) {

            ctx.helper.renderFail(ctx, {
                message: err
            });
        }
    }
}

module.exports = AdminGroupController;