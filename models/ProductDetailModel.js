/*
 * @Author: your name
 * @Date: 2022-04-20 16:35:31
 * @LastEditTime: 2022-05-09 16:22:59
 * @LastEditors: maomao11610 8696434+maomao11610@user.noreply.gitee.com
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \admin-server\models\ProductDetailModel.js
 */
// 商品详情
// 此处的name来自于父元素的name类似于mysql的主键
const mongoose = require('mongoose');
const productDetailSchema = new  mongoose.Schema({
    // 主键
    username:{type:String},
    swiperList: [{
        id: { type: Number },
        img: { type: String },

    }],
    spec:[],
    name:{type:String},
    explain:[],
    archives:[{
        title:{type:String},
        grade:{ type:Number }
    }],
    parameter:[{
        title:{type:String},
        value:{ type:String }
    }],
    carCondition:[{
        title:{type:String},
        value:{ type:String }
    }],
    realShooting:{type:String}

})
const ProductDetailModel=mongoose.model('productdetails',productDetailSchema);
module.exports=ProductDetailModel