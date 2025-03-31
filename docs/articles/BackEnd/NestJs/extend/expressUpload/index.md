# express文件上传multer

multer: 用于处理multipart/form-data类型的表单数据，主要用于上传文件
cors: 用于处理跨域请求

```ts
npm install express cors multer 
```

> 创建index

```ts [index.js]
const express = require('express')
const multer  = require('multer')
const cors = require('cors');

const app = express()
app.use(cors());

const upload = multer({ dest: 'uploads/' })

app.post('/aaa', upload.single('aaa'), function (req, res, next) {
  console.log('req.file', req.file);
  console.log('req.body', req.body);
})

app.listen(3333);

```

::: tip app.post参数

- 第一个参数是请求方法的路由
- 第二个参数是multer的中间件，用于处理上传文件
- 第三个参数是处理函数

第二个参数upload.single('aaa')表示上传的文件字段名为aaa
upload 是通过 Multer 初始化的一个 Multer 实例，single 表示只上传一个文件
:::
