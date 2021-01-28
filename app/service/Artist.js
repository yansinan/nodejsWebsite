/*
 * @Author: doramart 
 * @Date: 2019-06-24 13:20:49 
 * @Last Modified by: dr
 * @Last Modified time: 2020-5-11 14:02:45
 */

'use strict';
const path = require('path')
const BaseService = require('./Doc');//require(path.join(process.cwd(), 'lib/plugin/egg-dora-artist/app/service/Artist'));

// const Model_NAME=__filename.slice(__dirname.length + 1, -3);


class ServicePlugin extends BaseService {
    // 相关查询模板
    constListPopulate=[
        {
            path: 'listMembers',
            select: 'userName _id id logo'
        },
        {
            path: 'tags',
            select: 'name _id alias comments'
        },
    
    ]
    get model(){
        if(!this._model)this._model=this.ctx.model[__filename.slice(__dirname.length + 1, -3)];
        return this._model;
    }

}

module.exports = ServicePlugin;