/*
 * @Author: your name
 * @Date: 2022-04-11 19:33:22
 * @LastEditTime: 2022-04-12 19:42:01
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \admin-server\models\ContentDetails.js
 */
// 卖家发布的需要审核的内容详情model

// 1.引入mongoose
const mongoose = require('mongoose')

// 2.字义Schema(描述文档结构)
const contentSchema = new mongoose.Schema({
saleId:{type:String,required:true},//该内容单编号：点击后根据这个号查询到详情
  sallerName: {type: String, required: true}, // 卖家name
  sallerId: {type: String, required: true}, // 身份证号
  cardPic: {type: String, required: true}, // 身份证原件路径
  carPic:{type:String,required:true},//车封面
  mileage:{type:Number},//里程
  listingTime:{type:Number},//挂牌日期 1646901370673,
  repair:{type:Number},//是否维修
  reviewPic:{type:String,required:true},//必须有才能审核，否则直接退回
  reviewerNumber:{type:String,required:true},//复核员工号
})


// 3. 定义Model(与集合对应, 可以操作集合)
const ContentModel = mongoose.model('contents', contentSchema)

// 4. 向外暴露Model
module.exports = ContentModel