/*
用来定义路由的路由器模块
 */
const express = require('express')
const md5 = require('blueimp-md5')

const UserModel = require('../models/UserModel')
const CategoryModel = require('../models/CategoryModel')
const ProductModel = require('../models/ProductModel')
const RoleModel = require('../models/RoleModel')
//订单处理
const OrdertModel = require('../models/OrderModel')
// 内容单
const ExamineModel = require('../models/ExamineModel')
// 详情
const ContentModel = require('../models/ContentModel')
// APP首页信息model
const AindexlistModel = require('../models/AindexlistModel');
// APP点击后商品详情关联了productModel
const ProductDetailModel = require('../models/ProductDetailModel')
// 卖家进度
const CurrentModel=require('../models/CurrentModel');
// 得到路由器对象
const router = express.Router()
// console.log('router', router)

// 指定需要过滤的属性
const filter = { password: 0, __v: 0 }

const fs = require('fs')
router.get('/storage', (req, res) => {
  // 将roles.json文件里的数据传入mongodb中
  /*fs.readFile('./database/roles.json', 'utf8', (err, result) => {
    if (err) {
      console.log(err)
    } else {
      // console.log('异步读取数据：', JSON.parse(result))
      let data = JSON.parse(result)
      res.json(data)
      for(let i=0; i<data.length; i++) {
        let role = {
          name: data[i].name, // 角色名称
          auth_name: data[i].auth_name, // 授权人
          auth_time: data[i].auth_time, // 授权时间
          create_time: data[i].create_time, // 创建时间
          menus: data[i].menus // 所有有权限操作的菜单path的数组
        }
        // console.log(role)
        RoleModel.create(role)
            .then(role => {
              console.log(role)
            })
            .catch(error => {
              console.error('添加角色异常', error)
            })
      }
    }
  });*/

  // 将products.json文件里的数据传入mongodb中
  /*fs.readFile('./database/products.json', 'utf8', (err, result) => {
    if (err) {
      console.log(err)
    } else {
      // console.log('异步读取数据：', JSON.parse(result))
      let data = JSON.parse(result)
      res.json(data)
      for(let i=0; i<data.length; i++) {
        let product = {
          categoryId: data[i].categoryId, // 所属分类的id
          pCategoryId: data[i].pCategoryId, // 所属分类的父分类id
          name: data[i].name, // 名称
          price: data[i].price, // 价格
          desc: data[i].desc,
          status: data[i].status, // 商品状态: 1:在售, 2: 下架了
          imgs: data[i].imgs, // n个图片文件名的json字符串
          detail: data[i].detail
        }
        console.log(product)

        ProductModel.create(product)
            .then(product => {
              console.log(product)
            })
            .catch(error => {
              console.error('添加产品异常', error)
            })
      }
    }
  });*/


  // 将categorys.json文件里的数据传入mongodb中
  /*fs.readFile('./database/categorys.json', 'utf8', (err, result) => {
    if (err) { // 读取文件失败
      console.log(err)
    } else { // 读取文件成功
      // console.log('异步读取数据：', JSON.parse(result))
      let data = JSON.parse(result)
      res.json(data)
      for(let i=0; i<data.length; i++) {
        // console.log(data[i].name, data[i].parentId)
        CategoryModel.create({name: data[i].name, parentId: data[i].parentId || '0'})
            .then(category => {
              console.log(category)
            })
            .catch(error => {
              console.error('添加分类异常', error)
            })
      }
    }
  });*/
})


// 登录
router.post('/login', (req, res) => {
  const { username, password } = req.body
  // 根据username和password查询数据库users, 如果没有, 返回提示错误的信息, 如果有, 返回登陆成功信息(包含user)
  UserModel.findOne({ username, password: md5(password) })
    .then(user => {
      if (user) { // 登陆成功
        // 生成一个cookie(userid: user._id), 并交给浏览器保存
        res.cookie('userid', user._id, { maxAge: 1000 * 60 * 60 * 24 })
        if (user.role_id) {
          RoleModel.findOne({ _id: user.role_id })
            .then(role => {
              user._doc.role = role
              console.log('role user', user)
              res.send({ status: 0, data: user })
            })
        } else {
          user._doc.role = { menus: [] }
          // 返回登陆成功信息(包含user)
          res.send({ status: 0, data: user })
        }

      } else {// 登陆失败
        res.send({ status: 1, msg: '用户名或密码不正确!' })
      }
    })
    .catch(error => {
      console.error('登陆异常', error)
      res.send({ status: 1, msg: '登陆异常, 请重新尝试' })
    })
})

// 添加用户
router.post('/manage/user/add', (req, res) => {
  // 读取请求参数数据
  const { username, password } = req.body
  // 处理: 判断用户是否已经存在, 如果存在, 返回提示错误的信息, 如果不存在, 保存
  // 查询(根据username)
  UserModel.findOne({ username })
    .then(user => {
      // 如果user有值(已存在)
      if (user) {
        // 返回提示错误的信息
        res.send({ status: 1, msg: '此用户已存在' })
        return new Promise(() => {
        })
      } else { // 没值(不存在)
        // 保存
        return UserModel.create({ ...req.body, password: md5(password || 'atguigu') })
      }
    })
    .then(user => {
      // 返回包含user的json数据
      res.send({ status: 0, data: user })
    })
    .catch(error => {
      console.error('注册异常', error)
      res.send({ status: 1, msg: '添加用户异常, 请重新尝试' })
    })
})


// 更新用户
router.post('/manage/user/update', (req, res) => {
  const user = req.body
  UserModel.findOneAndUpdate({ _id: user._id }, user)
    .then(oldUser => {
      const data = Object.assign(oldUser, user)
      // 返回
      res.send({ status: 0, data })
    })
    .catch(error => {
      console.error('更新用户异常', error)
      res.send({ status: 1, msg: '更新用户异常, 请重新尝试' })
    })
})

// 删除用户
router.post('/manage/user/delete', (req, res) => {
  const { userId } = req.body
  UserModel.deleteOne({ _id: userId })
    .then((doc) => {
      res.send({ status: 0 })
    })
})

// 获取用户信息的路由(根据cookie中的userid)
/*router.get('/user', (req, res) => {
  // 从请求的cookie得到userid
  const userid = req.cookies.userid
  // 如果不存在, 直接返回一个提示信息
  if (!userid) {
    return res.send({status: 1, msg: '请先登陆'})
  }
  // 根据userid查询对应的user
  UserModel.findOne({_id: userid}, filter)
    .then(user => {
      if (user) {
        res.send({status: 0, data: user})
      } else {
        // 通知浏览器删除userid cookie
        res.clearCookie('userid')
        res.send({status: 1, msg: '请先登陆'})
      }
    })
    .catch(error => {
      console.error('获取用户异常', error)
      res.send({status: 1, msg: '获取用户异常, 请重新尝试'})
    })
})*/

// 获取所有用户列表
router.get('/manage/user/list', (req, res) => {
  UserModel.find({ username: { '$ne': 'admin' } })
    .then(users => {
      RoleModel.find().then(roles => {
        res.send({ status: 0, data: { users, roles } })
      })
    })
    .catch(error => {
      console.error('获取用户列表异常', error)
      res.send({ status: 1, msg: '获取用户列表异常, 请重新尝试' })
    })
})


// 添加分类
router.post('/manage/category/add', (req, res) => {
  const { categoryName, parentId } = req.body
  CategoryModel.create({ name: categoryName, parentId: parentId || '0' })
    .then(category => {
      res.send({ status: 0, data: category })
    })
    .catch(error => {
      console.error('添加分类异常', error)
      res.send({ status: 1, msg: '添加分类异常, 请重新尝试' })
    })
})

// 获取分类列表
router.get('/manage/category/list', (req, res) => {
  const parentId = req.query.parentId || '0'
  CategoryModel.find({ parentId })
    .then(categorys => {
      res.send({ status: 0, data: categorys })
    })
    .catch(error => {
      console.error('获取分类列表异常', error)
      res.send({ status: 1, msg: '获取分类列表异常, 请重新尝试' })
    })
})

// 更新分类名称
router.post('/manage/category/update', (req, res) => {
  const { categoryId, categoryName } = req.body
  CategoryModel.findOneAndUpdate({ _id: categoryId }, { name: categoryName })
    .then(oldCategory => {
      res.send({ status: 0 })
    })
    .catch(error => {
      console.error('更新分类名称异常', error)
      res.send({ status: 1, msg: '更新分类名称异常, 请重新尝试' })
    })
})

// 根据分类ID获取分类
router.get('/manage/category/info', (req, res) => {
  const categoryId = req.query.categoryId
  CategoryModel.findOne({ _id: categoryId })
    .then(category => {
      res.send({ status: 0, data: category })
    })
    .catch(error => {
      console.error('获取分类信息异常', error)
      res.send({ status: 1, msg: '获取分类信息异常, 请重新尝试' })
    })
})


// 添加产品
router.post('/manage/product/add', (req, res) => {
  const product = req.body
  ProductModel.create(product)
    .then(product => {
      res.send({ status: 0, data: product })
    })
    .catch(error => {
      console.error('添加产品异常', error)
      res.send({ status: 1, msg: '添加产品异常, 请重新尝试' })
    })
})

// 获取产品分页列表
router.get('/manage/product/list', (req, res) => {
  const { pageNum, pageSize } = req.query
  ProductModel.find({})
    .then(products => {
      res.send({ status: 0, data: pageFilter(products, pageNum, pageSize) })
    })
    .catch(error => {
      console.error('获取商品列表异常', error)
      res.send({ status: 1, msg: '获取商品列表异常, 请重新尝试' })
    })
})

// 搜索产品列表
router.get('/manage/product/search', (req, res) => {
  const { pageNum, pageSize, searchName, productName, productMilleage, productPrice } = req.query
  console.log(productName)
  let contition = {}
  if (productName) {
    contition = { name: new RegExp(`^.*${productName}.*$`) }
  } else if (productPrice) {
    contition = { price: productPrice }
  } else if (productMilleage) {
    contition = { milleage: productMilleage }
  }
  ProductModel.find(contition)
    .then(products => {
      res.send({ status: 0, data: pageFilter(products, pageNum, pageSize) })
    })
    .catch(error => {
      console.error('搜索商品列表异常', error)
      res.send({ status: 1, msg: '搜索商品列表异常, 请重新尝试' })
    })
})

// 更新产品
router.post('/manage/product/update', (req, res) => {
  const product = req.body
  ProductModel.findOneAndUpdate({ _id: product._id }, product)
    .then(oldProduct => {
      res.send({ status: 0 })
    })
    .catch(error => {
      console.error('更新商品异常', error)
      res.send({ status: 1, msg: '更新商品名称异常, 请重新尝试' })
    })
})

// 更新产品状态(上架/下架)
router.post('/manage/product/updateStatus', (req, res) => {
  const { productId, status } = req.body
  ProductModel.findOneAndUpdate({ _id: productId }, { status })
    .then(oldProduct => {
      res.send({ status: 0 })
    })
    .catch(error => {
      console.error('更新产品状态异常', error)
      res.send({ status: 1, msg: '更新产品状态异常, 请重新尝试' })
    })
})


// 添加角色
router.post('/manage/role/add', (req, res) => {
  const { roleName } = req.body
  RoleModel.create({ name: roleName })
    .then(role => {
      res.send({ status: 0, data: role })
    })
    .catch(error => {
      console.error('添加角色异常', error)
      res.send({ status: 1, msg: '添加角色异常, 请重新尝试' })
    })
})

// 获取角色列表
router.get('/manage/role/list', (req, res) => {
  RoleModel.find()
    .then(roles => {
      res.send({ status: 0, data: roles })
    })
    .catch(error => {
      console.error('获取角色列表异常', error)
      res.send({ status: 1, msg: '获取角色列表异常, 请重新尝试' })
    })
})

// 更新角色(设置权限)
router.post('/manage/role/update', (req, res) => {
  const role = req.body
  role.auth_time = Date.now()
  RoleModel.findOneAndUpdate({ _id: role._id }, role)
    .then(oldRole => {
      // console.log('---', oldRole._doc)
      res.send({ status: 0, data: { ...oldRole._doc, ...role } })
    })
    .catch(error => {
      console.error('更新角色异常', error)
      res.send({ status: 1, msg: '更新角色异常, 请重新尝试' })
    })
})

// 获取订单列表
router.get('/order/list', async (req, res) => {
  const { pageNum, pageSize } = req.query
  OrdertModel.find({})
    .then(result => {
      res.send({ status: 0, data: pageFilter(result, pageNum, pageSize) })
    })
    .catch(error => {
      console.error('获取订单列表异常', error)
      res.send({ status: 1, msg: '获取订单列表异常, 请重新尝试' })
    })
})
// 根据订单号搜索订单列表搜素功能接口
router.get('/order/list/search', (req, res) => {
  const { pageNum, pageSize, searchName } = req.query
  let contition = {}
  if (searchName) {
    contition = { orderId: new RegExp(`^.*${searchName}.*$`) }
  }
  OrdertModel.find(contition)
    .then(order => {
      console.log('搜查');
      res.send({ status: 0, data: pageFilter(order, pageNum, pageSize) })
    })
    .catch(error => {
      console.error('搜索商品列表异常', error)
      res.send({ status: 1, msg: '搜索商品列表异常, 请重新尝试' })
    })
})


// 内容审核table
router.get('/order/examine', async (req, res) => {
  const { pageSize, pageNum } = req.query
  ExamineModel.find({})
    .then(result => {
      res.send({ status: 0, data: pageFilter(result, pageNum, pageSize) })
    })
    .catch(error => {
      console.error('获内容列表异常', error)
      res.send({ status: 1, msg: '获取内容列表异常, 请重新尝试' })
    })

})
// 根据内容单编号获取资料详情
router.get('/order/examine/detail', (req, res) => {
  const saleId = req.query.saleId
  ContentModel.findOne({ saleId: saleId })
    .then(result => {
      res.send({ status: 0, data: result })
    })
    .catch(error => {
      console.error('获取资料详情异常', error)
      res.send({ status: 1, msg: '获取资料详情异常, 请重新尝试' })
    })
})
/*
得到指定数组的分页信息对象
 */
function pageFilter(arr, pageNum, pageSize) {
  pageNum = pageNum * 1
  pageSize = pageSize * 1
  const total = arr.length
  const pages = Math.floor((total + pageSize - 1) / pageSize)
  const start = pageSize * (pageNum - 1)
  const end = start + pageSize <= total ? start + pageSize : total
  const list = []
  for (var i = start; i < end; i++) {
    list.push(arr[i])
  }

  return {
    pageNum,
    total,
    pages,
    pageSize,
    list
  }
}
// 审核后更新
// 更新审核状态
router.post('/order/examine/update', async (req, res) => {
  const { saleId } = req.body;
  await ExamineModel.update({ saleId: saleId }, { status: 1 })
    .then(oldResult => {
      res.send({ status: 1 })
    })
    .catch(error => {
      console.error('更新状态异常', error)
      res.send({ status: 1, msg: '更新状态异常, 请重新尝试' })
    })
  console.log('更新接口')
})














// APP接口配置
// 1.按名称搜索到达商品列表
router.get('/aproduct/search', (req, res) => {
  const { name } = req.query
  let contition = {}
  if (name) {
    contition = { name: new RegExp(`^.*${name}.*$`) }
  }
  ProductModel.find(contition).sort({'sortKey':'-1'})
    .then(products => {
      res.send({ status: 0, data: products })
    })
    .catch(error => {
      console.error('APP搜索商品异常', error)
      res.send({ status: 1, msg: 'APP搜索商品异常, 请重新尝试' })
    })
})
// 2.按照品牌查询商品（首页点击每个品牌logo跳转）
router.get('/aproduct/brandSearch', (req, res) => {
  const { brand } = req.query
  let contition = { brand: brand }
  ProductModel.find(contition).sort({'sortKey':'-1'})
    .then(products => {
      res.send({ status: 0, data: products })
    })
    .catch(error => {
      console.error('APP搜索商品异常', error)
      res.send({ status: 1, msg: 'APP搜索商品异常, 请重新尝试' })
    })
})
// 3.根据商品点击获取详情，进行name匹配
router.get('/aproduct/detail', (req, res) => {
  const {name}=req.query;
  let contition = { name: name }
  ProductDetailModel.find(contition)
    .then(detail => {
      res.send({ status: 0, data: detail[0] })
    })
    .catch(error => {
      console.error('APP搜索商品异常', error)
      res.send({ status: 1, msg: 'APP搜索商品异常, 请重新尝试' })
    })

})
// 4.APP首页信息模块
router.get('/aindex', (req, res) => {
  AindexlistModel.find().then(list => {
    res.send({ status: 0, data: list[0] })
  }).catch(error => {
    console.error('首页数据接口挂掉', error)
    res.send({ status: 1, msg: '首页数据接口挂掉,请检查！' })
  })
})
// 5.根据价格区间锁定车
router.get('/aproduct/priceSearch', (req, res) => {
  const {min,max}=req.query;
  let contition={price:{$gte:min,$lte:max}}
  ProductModel.find(contition).sort({'sortKey':'-1'})
    .then(products => {
      res.send({ status: 0, data: products })
    })
    .catch(error => {
      console.error('APP搜索商品异常', error)
      res.send({ status: 1, msg: 'APP搜索商品异常, 请重新尝试' })
    })
})
// 6.APP卖车第一个接口   点击提交单，提交到后台examin
router.post('/asale/apply',(req,res)=>{
console.log('申请接口')
  const { saleId,carName,status,location } = req.body
  ExamineModel.create({ saleId:saleId,carName:carName,status:status,location:location })
    .then(examine => {
      res.send({ status: 0, data: examine })
    })
    .catch(error => {
      console.error('申请异常', error)
      res.send({ status: 1, msg: '申请异常, 请重新尝试' })
    })
})
// 7.第二个审核后线下核查后生成一个content，提交到后台
router.post('/asale/setContet',(req,res)=>{
    const { saleId,sallerName,sallerId,cardPic,carPic,mileage,listingTime,repair,reviewPic,reviewerNumber } = req.body
    console.log(saleId);
    ContentModel.create({ saleId:saleId,sallerName:sallerName,sallerId:sallerId,cardPic:cardPic,carPic:carPic,mileage:mileage, listingTime:listingTime,repair:repair,reviewPic:reviewPic,reviewerNumber:reviewerNumber})
      .then(content => {
        res.send({ status: 0, data: content })
      })
      .catch(error => {
        console.error('审核提交异常', error)
        res.send({ status: 1, msg: '审核提交异常, 请重新尝试' })
      })
  })
// 8.完全线下交易完成进行线上形成订单
// 9.买车接口-全部车
router.get('/aproduct/all', (req, res) => {
  ProductModel.find().sort({'sortKey':'-1'})
    .then(products => {
      res.send({ status: 0, data: products })
    })
    .catch(error => {
      console.error('APP搜索商品异常', error)
      res.send({ status: 1, msg: 'APP搜索商品异常, 请重新尝试' })
    })
})
// 10.买车-筛选-级联
router.get('/aproduct/select', (req, res) => {
  const { brand,min,max,milleage } = req.query
  const contition= { brand: brand,price:{$gte:min,$lte:max},milleage:{$lt:milleage} }
  ProductModel.find(contition).sort({'sortKey':'-1'})
    .then(products => {
      console.log(products)
      res.send({ status: 0, data: products })
    })
    .catch(error => {
      console.error('APP搜索商品异常', error)
      res.send({ status: 1, msg: 'APP搜索商品异常, 请重新尝试' })
    })
})
// 11.个人中心登录
// 登录
// router.post('/alogin', (req, res) => {
//   const { username, password } = req.body
//   // 根据username和password查询数据库users, 如果没有, 返回提示错误的信息, 如果有, 返回登陆成功信息(包含user)
//   UserModel.findOne({ username, password: md5(password) })
//     .then(user => {
//       if (user) { // 登录成功
//         // 生成一个cookie(userid: user._id), 并交给浏览器保存
//         res.cookie('userid', user._id, { maxAge: 1000 * 60 * 60 * 24 })
//         if (user.role_id) {
//           RoleModel.findOne({ _id: user.role_id })
//             .then(role => {
//               user._doc.role = role
//               console.log('role user', user)
//               res.send({ status: 0, data: user })
//             })
//         } else {
//           user._doc.role = { menus: [] }
//           // 返回登录成功信息(包含user)
//           res.send({ status: 0, data: user })
//         }

//       } else {// 登录失败
//         res.send({ status: 1, msg: '用户名或密码不正确!' })
//       }
//     })
//     .catch(error => {
//       console.error('登录异常', error)
//       res.send({ status: 1, msg: '登录异常, 请重新尝试' })
//     })
// })
// // 注册
router.post('/aregister', (req, res) => {
  // 读取请求参数数据
  const { username, password } = req.body
  // 处理: 判断用户是否已经存在, 如果存在, 返回提示错误的信息, 如果不存在, 保存
  // 查询(根据username)
  UserModel.findOne({ username })
    .then(user => {
      // 如果user有值(已存在)
      if (user) {
        // 返回提示错误的信息
        res.send({ status: 1, msg: '此用户已存在' })
        return new Promise(() => {
        })
      } else { // 没值(不存在)
        // 保存
        return UserModel.create({ ...req.body, password: md5(password || 'atguigu') })
      }
    })
    .then(user => {
      // 返回包含user的json数据
      res.send({ status: 0, data: user })
    })
    .catch(error => {
      console.error('注册异常', error)
      res.send({ status: 1, msg: '注册异常, 请联系管理员13891123308' })
    })
})
// APP登录获取卖车进度current
router.get('/asale/current',(req,res)=>{
  const {username}=req.query;
  let contition = { username: username }
  CurrentModel.find(contition)
    .then(current => {
      res.send({ status: 0, data: current[0] })
    })
    .catch(error => {
      console.error('卖家进度未获取到', error)
      res.send({ status: 1, msg: '卖家进度未获取到, 请重新尝试' })
    })
})
// APP即时通讯与登录接口联调-拿到用户数据
router.get('/alogin/getUserData',(req,res)=>{
  UserModel.find().then(data=>{
    res.send({ status: 0, data: user })
  }).catch(err=>{
    res.send({ status: 1, msg: '用户获取异常, 请重新尝试' })
  })
})
// 订单生成完成后台统计
router.post('/aConfirm', (req, res) => {
  const confirm = req.body
  OrdertModel.create(confirm)
    .then(confirm => {
      res.send({ status: 0, data: confirm })
    })
    .catch(error => {
      console.error('生成订单异常', error)
      res.send({ status: 1, msg: '生成订单异常, 请重新尝试' })
    })
})



require('./file-upload')(router)

module.exports = router
