/*
 * @Author: your name
 * @Date: 2022-04-11 19:34:02
 * @LastEditTime: 2022-04-11 20:37:27
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \admin-server\models\Examine.js
 */
// 内容审核首页model

const mongoose=require('mongoose');
const examineSchema=new mongoose.Schema({
    saleId:{
        type:String,
        required:true,
    },
    carName:{
        type:String,
        required:true,
    },
    location:{
        type:String,
        required:true
    },
    status:{
        type:Number,
        required:true
    }
})
// 3. 定义Model(与集合对应, 可以操作集合)
const ExamineModel = mongoose.model('examines', examineSchema)

// 4. 向外暴露Model
module.exports = ExamineModel