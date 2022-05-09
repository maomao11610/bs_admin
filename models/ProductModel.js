/*
 * @Author: your name
 * @Date: 2022-04-09 15:12:39
 * @LastEditTime: 2022-05-09 17:03:22
 * @LastEditors: maomao11610 8696434+maomao11610@user.noreply.gitee.com
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \admin-server\models\ProductModel.js
 */
/*
能操作products集合数据的Model\商品管理
 */
// 1.引入mongoose
const mongoose = require('mongoose')

// 2.字义Schema(描述文档结构)
const productSchema = new mongoose.Schema({
  categoryId: {type: String, required: true}, // 所属车系的id
  pCategoryId: {type: String, required: true}, // 所属品牌id
  name: {type: String, required: true}, // 名称
  price: {type: Number, required: true}, // 价格
  desc: {type: String},
  status: {type: Number, default: 1}, // 商品状态: 1:在售, 2: 下架了
  imgs: {type: Array, default: []}, // n个图片文件名的json字符串
  milleage:{type:Number},//里程
  detail: {type: String},
  brand:{type:String},
 
})
// 中间件
// productSchema.pre('save', function (next) {
//   this.sortKey = this.get('_id'); // considering _id is input by client
//   next();
// });

// 虚拟字段
productSchema.virtual('sortKey')
    .get(function(){
        return 0.4*(this.price)+0.6*(this.milleage)
})
// 3. 定义Model(与集合对应, 可以操作集合)
const ProductModel = mongoose.model('products', productSchema)

// 4. 向外暴露Model
module.exports = ProductModel