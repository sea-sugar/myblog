const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const md5 = require('js-md5')
const fs = require('fs');
const  crypto  = require('crypto');
const multer = require('multer');
const path = require('path');
// 定义用户模型
const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    email: String
  }, {
    collection: 'userinfo'
  });
  
  const User = mongoose.model('User', userSchema);
  
  // 处理POST请求的中间件
  router .use(express.json());
    // 加载和解析私钥
    const privateKeyData = fs.readFileSync('../rsakeyconfig/private.pem', 'utf8');
    const privateKey = crypto.createPrivateKey({
      key: privateKeyData,
      format: 'pem',
    });
  
  // 处理注册请求的路由接口
  router .post('/register', async (req, res) => {
    const { username, rsapassword, email } = req.body;
    try {
      // 检查用户名是否已经存在
      const existingUser = await User.findOne({ username });
      // console.log('前端传输来的密码',rsapassword);
      if (existingUser) {
        return res.json({ success: false, error: '用户名已存在' });
      } else {
        
        // 解密密码
        const password = crypto.privateDecrypt(
          {
            key: privateKey,
            padding: crypto.constants.RSA_PKCS1_PADDING,
          },
          Buffer.from(rsapassword, 'base64')
        ).toString('utf8');
        console.log('注册后端解密后密码',password);

        // 创建新用户
        const newUser = new User({
          username,
          password: md5(password), // md5密码
          email,
        });
        await newUser.save();
        res.json({ success: true,message:'用户注册成功'});
      }
    } catch (error) {
      console.error('注册时发生错误：', error);
      res.status(500).json({ success: false, error: '注册失败' });
    }
  });
  
  // 处理登录请求的路由接口
  router .post('/login', async (req, res) => {
    const { username, rsapassword } = req.body;
    const password = crypto.privateDecrypt(
      {
        key: privateKey,
        padding: crypto.constants.RSA_PKCS1_PADDING,
      },
      Buffer.from(rsapassword, 'base64')
    ).toString('utf8');
    console.log('登录后端解密后密码',password);
    try {
      // 在数据库中查找匹配的用户
      const user = await User.findOne({ username:username, password: md5(password)});
      console.log('当前登录用户为：',user);
      if (user) {
        const token = jwt.sign({ username }, 'lhyskey', { expiresIn: '1h' });
        console.log('当前登录用户token:',token);
        res.json({ success: true ,token: token});//返回token给前端
      } else {
        res.json({ success: false, error: '用户名或密码错误' });
      }
    } catch (error) {
      console.error('登录时发生错误：', error);
      res.status(500).json({ success: false, error: '登录失败' });
    }
  });
  
  // 处理忘记密码请求的路由接口
  router .post('/forgot',async(req,res) =>{  //req 和res 分别是什么？
    const {username,email} = req.body;
    try {
      // 检查用户名和邮箱是否存在数据库中
      const existingUser = await User.findOne({username:username,email:email});
      console.error('existingUseris',existingUser);
      if(!existingUser){
        res.json({success:false,error:'该用户不存在'});
      }else {
        // 生成随机密码
        const randomPassword = md5('Lhy.com');
        const backrandomPassword = md5(md5('Lhy.com'));
        
        await User.updateOne(
          { username: username }, // 使用username进行匹配
          { $set: { password: backrandomPassword } } // 使用 $set 设置字段值
        );
  
        console.log("existingUser_is",existingUser);
        // 查询到该用户，返回密码给前端
        res.json({success:true, Password:randomPassword });
      }
    }catch(error){
      // 找回密码时发生错误
      console.error(error);
      res.status(500).json({
        success: false,
        error: '找回密码失败'
      });
    }
  })
  

  // 处理修改密码的接口
  router.post('/modifypassword', async (req, res) => {
    const { username, oldrsapassword ,newrsapassword} = req.body;
    const token = req.headers.authorization;
    console.log('token is', token);
    const oldpassword = crypto.privateDecrypt(
      {
        key: privateKey,
        padding: crypto.constants.RSA_PKCS1_PADDING,
      },
      Buffer.from(oldrsapassword, 'base64')
    ).toString('utf8');
    const newpassword = crypto.privateDecrypt(
      {
        key: privateKey,
        padding: crypto.constants.RSA_PKCS1_PADDING,
      },
      Buffer.from(newrsapassword, 'base64')
    ).toString('utf8');
    console.log('修改密码后端解密后密码',newpassword);
    const user = await User.findOne({ username: username, password: md5(oldpassword) });
    if (!user) { 
      return res.status(401).json({ success:false, message: '原密码错误' });
    } else if (!token) {
      return res.status(401).json({ success:false,message: '未提供身份令牌' });
    }

    try {
      const decodedToken = jwt.verify(token.replace(/^Bearer\s/, ''), 'lhyskey'); // 使用密钥解析 token，并移除 "Bearer " 前缀
      const { exp, role } = decodedToken;
      console.log('exp is', exp);
      console.log('role is', role);

      // 验证过期时间
      const currentTime = Math.floor(Date.now() / 1000);
      if (currentTime > exp) {
        return res.status(401).json({ message: '身份验证令牌已过期' });
      }
      // 身份验证通过，继续处理请求
      await User.updateOne(
        { username: username, password: md5(oldpassword) },
        { $set: { password: md5(newpassword) } }
      );
      console.log("用户", username, "密码修改为", newpassword, "成功");
      res.json({ success: true, message: '您已成功修改数据' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: '更改用户名失败' });
    }
  })

  //处理修改用户名的接口
router.post('/modifyusername',async(req,res)=>{
  const{newusername,username}=req.body;
  try{
    // 检查用户名是否已经存在
    const existingUser = await User.findOne({ newusername });
    if (existingUser) {
      res.json({ success: false, error: '用户名已存在' });
    }else {
      await User.updateOne(
        {username:username},
        {$set:{username : newusername}}
      );
      console.log("用户修改名称为",newusername,"成功");
      res.json({success:true});
    };
  }catch(error){
    // 更改用户名时发生错误
    console.error(error);
    res.status(500).json({
      success: false,
      error: '更改用户名失败'
    });}
  })

  router.post('/uploadavatar', (req, res) => {
    const upload = multer({ dest: './avatar' }); // 指定文件保存的目录
  
    // 处理上传的文件
    // req.file 包含上传的文件信息
    // 将文件保存到适当的位置
    // 返回响应
    upload.single('file')(req, res, err => {
      if (err) {
        // 处理上传文件失败的情况
        console.error('上传文件失败', err);
        res.status(500).json({ error: '上传文件失败' });
      } else {
        const file = req.file;
        const filePath = file.path;
        const fileName = req.body.username +'.jpg'; //把名字保存为用户名.jpg
        const newFilePath = path.join(__dirname, 'avatar', fileName); // 保存的新路径
  
        // 将文件从临时路径移动到新路径
        fs.rename(filePath, newFilePath, err => {
          if (err) {
            // 处理保存文件失败的情况
            console.error('保存文件失败', err);
            res.status(500).json({ error: '保存文件失败' });
          } else {
            // 处理保存文件成功的情况
            const imageUrl = `http://10.117.32.70:3000/avatar/${fileName}`; // 返回图片的URL
            res.json({ imageUrl });
            console.log('图片上传成功 imageUrl is',imageUrl);
          }
        });
      }
    });
  });


module.exports = router;