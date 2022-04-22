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
const aindexSchema=new mongoose.Schema({
        swiperList:[{
                id:{type:Number},
                src:{type:String},
                img:{type:String},

        }],
        brandList:[{
                id:{type:Number},
                name:{type:String},
                img:{type:String},

        }],
        priceList:[{
                id:{type:Number},
                name:{type:String},
                min:{type:Number},
                max:{type:Number},
        }],
        promotion:[{
                title:{type:String},
                ad:{type:String},
                img:{type:String}
        }]
        // swiperList: [Schema.Types.Mixed] ,
        // brandList:[Schema.Types.Mixed] ,
        // priceList:[Schema.Types.Mixed],
        // promotion:[Schema.Types.Mixed],
        
     
           
})

const AindexlistModel=mongoose.model('aindexlists',aindexSchema);

module.exports=AindexlistModel;