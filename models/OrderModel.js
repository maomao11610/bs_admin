/*
 * @Author: your name
 * @Date: 2022-04-10 14:40:13
 * @LastEditTime: 2022-05-09 21:59:36
 * @LastEditors: maomao11610 8696434+maomao11610@user.noreply.gitee.com
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \admin-server\models\OrderModel.js
 */
/*
能操作订单集合数据的Model
 */
// 1.引入mongoose
const mongoose = require('mongoose')

// 2.字义Schema(描述文档结构)
const orderSchema = new mongoose.Schema({
  orderId: {type: String}, // 商品ID
  brand: {type: String}, // 品牌
  price: {type: Number}, // 价格
  series:{type:String},//车系
  sellerName:{type:String,},//卖家
  color: {type: String},//颜色
  displacement:{type:Number},//排量
  transmissionCase: {type: Number, default: 1}, // 变速箱: 1:自动挡, 2: 手动挡
  pic:{type:String},
  mileage:{type:Number},//里程,
  orderTime:{type:Number},//下单日期
  listingTime:{type:Number},//挂牌日期 1646901370673,
})


// 3. 定义Model(与集合对应, 可以操作集合)
const OrdertModel = mongoose.model('orders', orderSchema)

// 4. 向外暴露Model
module.exports = OrdertModel