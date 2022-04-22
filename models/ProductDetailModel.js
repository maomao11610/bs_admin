/*
 * @Author: your name
 * @Date: 2022-04-20 16:35:31
 * @LastEditTime: 2022-04-21 15:21:06
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \admin-server\models\ProductDetailModel.js
 */
// 商品详情
// 此处的name来自于父元素的name类似于mysql的主键
const mongoose = require('mongoose');
const productDetailSchema = new  mongoose.Schema({
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