/*
 * @Author: doramart 
 * @Date: 2019-09-24 15:34:24 
 * @Last Modified by: doramart
 * @Last Modified time: 2019-10-03 10:58:46
 */

var siteFunc = {


    buildTree(list) {
        let currentArr = [];
        let temp = {};
        let tree = {};
        for (let i in list) {
            temp[list[i]._id] = list[i];
        }
        for (let i in temp) {
            if (temp[i].parentId && temp[i].parentId != '0') {
                if (!temp[temp[i].parentId].children) {
                    temp[temp[i].parentId].children = new Array();
                }
                let currentTemp = temp[i];
                temp[temp[i].parentId].children.push(currentTemp);
            } else {
                tree[temp[i]._id] = temp[i];
            }
        }
        for (var item in tree) {
            currentArr.push(tree[item]);
        }
        return currentArr;
    },


    // OPTION_DATABASE_END
};
module.exports = siteFunc;