/*
 * @Author: doramart 
 * @Date: 2019-08-15 10:51:41 
 * @Last Modified by: dr
 * @Last Modified time: 2019-12-08 
 */

const form = (res) => {
    return {
        title: {
            type: "string",
            required: true,
            min: 2,
            max: 50,
            message: res.__("validate_error_field", {
                label: res.__("label_content_title")
            })
        },
        stitle: {
            type: "string",
            required: true,
            min: 2,
            max: 50,
            message: res.__("validate_error_field", {
                label: res.__("label_content_stitle")
            })
        },
        sImg: {
            type: "string",
            required: true,
            message: res.__("validate_error_field", {
                label: res.__("lc_small_images")
            })
        },
        discription: {
            type: "string",
            required: true,
            min: 3,
            max: 300,
            message: res.__("validate_error_field", {
                label: res.__("label_content_dis")
            })
        },
        comments: {
            type: "string",
            required: true,
            min: 5,
            max: 100000,
            message: res.__("validate_inputCorrect", {
                label: res.__("label_content_comments")
            })
        }
    }
};

module.exports = form