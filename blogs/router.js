var express = require('express')
var User = require('./models/user')
var md5 = require('blueimp-md5')


var router = express.Router()

router.get('/',function(req,res){
  console.log(req.session.user)
  res.render('index.html',{
    user:req.session.user
  });
})

router.get('/login',function(req,res){
  res.render('login.html');
})

router.post('/login',function(req,res){
  //获取表单数据
  //查询数据库
  //发送响应数据
  console.log(req.body);
  var body = req.body;
  User.findOne({
    email:body.email,
    password:md5(md5(body.password))
  },function(err,user){
    if(err){
      return res.status(500).json({
        err_code:500,
        message: err.message
      })
    }else if(!user){
      return res.status(200).json({
        err_code: 1,
        message:'email or password is invalid'
      })
    }else{//用户存在，登陆成功，记录登录状态
      req.session.user = user

      res.status(200).json({
        err_code:0,
        message:'ok'
      })

    }
  })

})


router.get('/register',function(req,res){
  res.render('register.html');
})

router.post('/register',function(req,res){
  //获取表单提交的数据
  //连接数据库
    //判断该用户是否存在，如果存在不允许注册，如果不存在则可以注册
  //发送响应
  console.log(req.body);
  var body = req.body;
  User.findOne({
    $or:[
      {
        email: body.email
      },{
        nickname:body.nickname
      }
    ]
  },function(err,data){
    if(err){
      return res.status(500).json({
        err_code: 500,
        message:'Server Error'
      });
    }else if(data){
      //邮箱或者用户名已存在
      return res.status(200).json({
        err_code: 1,
        message:'email or nickname is exists'
      })

      // return res.render('register.html',{
      //   err_message:'邮箱或者密码已存在',
      //   form: body
      // });
    }else{

      //对密码进行重复加密
      body.password = md5(md5(body.password));
      new User(body).save(function(err,user){
        if(err){
          return res.status(500).json({
            err_code: 500,
            message:'Server Error'
          });
        }else{

           // 注册成功，使用 Session 记录用户的登陆状态
            req.session.user = user

          //express 提供的一个方法 json，自动把对象转成字符串
          res.status(200).json({
            err_code: 0,
            message:'ok'
          });
        }
      })

      
    }
  })
})

router.get('/logout',function(req,res){
  //清除登录状态
  //重定向到登录页面
  req.session.user = null
  res.redirect('/login')
})

module.exports = router
