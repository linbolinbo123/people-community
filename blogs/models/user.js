var mongoose = require('mongoose')

//连接数据库
mongoose.connect('mongodb://localhost/test', { useMongoClient: true })

var Schema = mongoose.Schema

var userSchema = new Schema({
  email:{
    type:String,
    required:true
  },
  nickname:{
    type:String,
    required:true
  },
  password:{
    type:String,
    required:true
  },
  created_time:{
    type:Date,
    //这里不能写Date.now() 因为会直接调用
    //这里当你去new Model的时候，如果你没有传递creat_time，会自动得到当前执行时间
    default:Date.now
  },
  last_modified_time:{
    type:Date,
    default:Date.now
  },
  avatar:{
    type:String,
    default:'/public/img/avatar-default.png'
  },
  bio:{
    type:String,
    default:''
  },
  gender:{
    type:Number,
    enum:[-1,0,1],
    default: -1
  },
  birthday:{
    type:Date
  },
  status:{
    type:Number,
    //0 没有权限限制
    //1 不可以评论
    //2 不可以登录
    enum:[1,2],
    default: 0
  }
})

module.exports = mongoose.model('User',userSchema)