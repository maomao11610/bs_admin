/*
 * @Author: your name
 * @Date: 2022-05-02 15:13:23
 * @LastEditTime: 2022-05-02 15:16:58
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \admin-server\models\CurrentModel.js
 */
/*
 * @Author: your name
 * @Date: 2022-04-19 16:24:44
 * @LastEditTime: 2022-04-22 17:07:55
 * @LastEditors: Please set LastEditors
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \admin-server\models\AindexlistModel.js
 */
// APP首页请求的数据库模板
const mongoose=require('mongoose');
const currentSchema=new mongoose.Schema({
       username:{type:String},
       current:{type:Number},
})

const CurrentModel=mongoose.model('currents',currentSchema);

module.exports=CurrentModel;