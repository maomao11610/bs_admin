/*
 * @Author: your name
 * @Date: 2022-04-09 15:12:39
 * @LastEditTime: 2022-04-13 16:28:45
 * @LastEditors: your name
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \admin-server\models\CategoryModel.js
 */
/*
能操作categorys集合数据的Model  品牌管理
 */
// 1.引入mongoose
const mongoose = require('mongoose')

// 2.字义Schema(描述文档结构)
const categorySchema = new mongoose.Schema({
  name: {type: String, required: true},
  parentId: {type: String, required: true, default: '0'}
})

// 3. 定义Model(与集合对应, 可以操作集合)
const CategoryModel = mongoose.model('categorys', categorySchema)

// 4. 向外暴露Model
module.exports = CategoryModel