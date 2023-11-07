const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const userRoutes = require('./userRoutes');

const app = express();

// 启用CORS中间件
app.use(cors());

// 暴露静态资源
app.use('/avatar', express.static('./avatar'));

// 连接到MongoDB数据库
mongoose.connect('mongodb://127.0.0.1:27017/user', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('连接MongoDB成功');
}).catch((error) => {
  console.error('连接MongoDB失败', error);
});

// 处理POST请求的中间件
app.use(express.json());

// 挂载用户相关路由
app.use('/api/user', userRoutes);

// 启动服务器
const port = 3000;
app.listen(port, () => {
  console.log(`服务器已启动，正在监听端口 ${port}`);
});