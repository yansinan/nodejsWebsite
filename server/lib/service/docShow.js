/*
 * @Author: doramart 
 * @Date: 2019-06-24 13:20:49 
 * @Last Modified by: doramart
 * @Last Modified time: 2019-07-27 14:02:45
 */


'use strict';
// const _ = require('lodash')
// const {
//     _list,
//     _item,
//     _count,
//     _create,
//     _update,
//     _removes,
//     _safeDelete,
//     _updateMany,
//     _inc,
// } = require('./general');
const docService = require('./doc');

const {
    DocShow,
} = require('../models/index');

// const constListPopulate=[{
//         path: 'author',
//         select: 'userName _id id logo'
//     },
//     {
//         path: 'uAuthor',
//         select: 'userName name logo _id group'
//     },
//     {
//         path: 'tags',
//         select: 'name _id'
//     },
//     {
//         path: 'categories',
//         select: 'name _id contentTemp enable defaultUrl',
//         populate: {
//             path: 'contentTemp'
//         }
//     }
// ]

module.exports = new docService.Service(DocShow);