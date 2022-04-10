/*
 * @Author: your name
 * @Date: 2022-04-09 15:12:39
 * @LastEditTime: 2022-04-09 15:16:45
 * @LastEditors: your name
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \admin-server\server.js
 */
/*
应用的启动模块
1. 通过express启动服务器
2. 通过mongoose连接数据库
  说明: 只有当连接上数据库后才去启动服务器
3. 使用中间件
 */
const mongoose = require('mongoose')
const express = require('express')
const app = express() // 产生应用对象

// 声明使用静态中间件
app.use(express.static('public'))
// 声明使用解析post请求的中间件
app.use(express.urlencoded({extended: true})) // 请求体参数是: name=tom&pwd=123
app.use(express.json()) // 请求体参数是json结构: {name: tom, pwd: 123}
// 声明使用解析cookie数据的中间件
const cookieParser = require('cookie-parser')
app.use(cookieParser())
// 声明使用路由器中间件
const indexRouter = require('./routers')
app.use('/api', indexRouter)  //


/*
前台BrowserRouter模式刷新404的问题
    a. 问题: 刷新某个路由路径时, 会出现404的错误
    b. 原因: 项目根路径后的path路径会被当作后台路由路径, 去请求对应的后台路由, 但没有
    c. 解决: 使用自定义中间件去读取返回index页面展现
    d. 注意: 前端路由的路径不要与后台路由路径相同(并且请求方式也相同)
*/
const fs = require('fs')
// 必须在路由器中间之后声明使用
app.use((req, res) => {
  fs.readFile(__dirname + '/public/index.html', (err, data)=>{
    if(err){
      console.log(err)
      res.send('后台错误')
    } else {
      res.writeHead(200, {
        'Content-Type': 'text/html; charset=utf-8',
      });
      res.end(data)
    }
  })
})



// 通过mongoose连接数据库
mongoose.connect("mongodb://admin:123456@127.0.0.1:27017/react_easyAdmin?authSource=admin", {useNewUrlParser: true})
  .then(() => {
    console.log('连接数据库成功!!!')
    // 只有当连接上数据库后才去启动服务器
    app.listen('5000', () => {
      console.log('服务器启动成功, 请访问: http://localhost:5000')
    })
  })
  .catch(error => {
    console.error('连接数据库失败', error)
  })

