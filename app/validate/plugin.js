/*
 * @Author: doramart 
 * @Date: 2019-08-15 10:52:18 
 * @Last Modified by: doramart
 * @Last Modified time: 2019-09-29 17:58:46
 */


const form = (ctx) => {
    return {
        name: {
            type: "string",
            required: true,
            min: 1,
            max: 50,
            message: ctx.__("validate_error_field", [ctx.__("label_tag_name")])
        },
        description: {
            type: "string",
            required: true,
            min: 2,
            max: 50,
            message: ctx.__("validate_inputCorrect", [ctx.__("label_comments")])
        }
    }
}



module.exports = {
    form
};