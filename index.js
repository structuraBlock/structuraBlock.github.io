// 提供http网络服务
const express = require('express');
const path = require('path');

const app = express();

// 设置静态文件目录，假设你的静态文件放在public文件夹下
app.use(express.static(path.join(__dirname, '.')));

// 基本路由，可选，用于测试服务器是否运行正常
app.get('/', (req, res) => {
  res.send('Hello, your static web server is running!');
});

// 启动服务器，监听3000端口
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});