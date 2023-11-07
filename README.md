# myblog

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Starting Backend-http

```
node ./bin/wwww
```




##### 前端主要使用以下技术：

1. Vue.js - 前端框架
2. Vue Router - 路由管理
3. Vuex - 状态管理
4. Element Plus - UI组件库
5. Axios - HTTP客户端,发请求到后端API
6. Composition API - Vue3组合式API
7. ESLint/Prettier - 代码规范与格式化
8. Scoped CSS - 组件级CSS

###### 技术栈：？

- 使用Vue3+Composition API开发单页面应用
- 引入Element Plus实现UI组件
- 使用Vuex管理状态
- Vue Router实现路由
- Axios调用后端接口



##### 后端主要使用以下技术：

1. Express - Node.js的Web应用框架
2. MongoDB - 用于数据库层,采用Mongoose ODM操作数据库
3. CORS - 跨域资源共享中间件,用于解决跨域问题
4. mongoose.model - 定义了用户数据模型
5. express.json() - 处理POST请求体(req.body)
6. RESTful API - 定义了注册、登录、找回密码等路由接口
7. MongoDB数据操作 - 如查询、更新文档等
8. res.json() - 响应JSON数据格式
9. try/catch - 捕获并处理接口错误
10. Node.js - 作为服务器运行环境
11. jsonwebtoken - 在客户端和服务器之间进行安全的身份验证和授权

###### 技术栈：？

- Express 框架
- MongoDB数据库
- Mongoose 操作数据库
- CORS解决跨域
- Node.js运行

整体采用了Node.js+Express+MongoDB+Mongoose等主流技术开发简易的后端API服务。

##### 接口文档

- /api/register  注册请求
- /api/login  登录请求
- /api/forgot  忘记密码
- /api/modifyusername  修改用户名



See [Configuration Reference](https://cli.vuejs.org/config/).
