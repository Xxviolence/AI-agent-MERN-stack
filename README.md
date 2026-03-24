# 📚 CampusBookShare — 校园电子书共享平台

一个基于 MERN (MongoDB + Express + React + Node.js) 技术栈的校园电子书共享平台。

## ✨ 功能

- 🔐 用户注册 / 登录（JWT 认证）
- 📤 上传电子书（支持 PDF, EPUB, MOBI, TXT, DOC）
- 🔍 搜索电子书（按书名、作者、描述）
- 📂 分类浏览（文学、理工、经管、外语、考试、其他）
- ⬇️ 下载电子书
- ⭐ 评论 & 评分
- ❤️ 收藏电子书
- 👤 个人中心（我的上传 / 我的收藏）

## 🛠️ 前期准备

### 必须安装的软件

| 软件 | 版本要求 | 下载地址 |
|------|----------|----------|
| **Node.js** | >= 18.x | https://nodejs.org/ |
| **MongoDB** | >= 6.x | https://www.mongodb.com/try/download/community |
| **Git** | 任意版本 | https://git-scm.com/ |

> MongoDB 也可以使用 [MongoDB Atlas](https://www.mongodb.com/atlas) 云数据库（免费），修改 `.env` 中的连接字符串即可。

### 可选工具

- **MongoDB Compass** — 可视化数据库管理工具
- **Postman** — API 调试工具

## 🚀 快速启动

### 1. 启动 MongoDB

```bash
# Windows：确保 MongoDB 服务已启动
# 方法 A：通过系统服务（安装时勾选了 Install as Service）
# 方法 B：手动启动
mongod --dbpath="D:\data\db"
```

### 2. 启动后端服务

```bash
cd D:\CampusBookShare\server
npm run dev
```

服务启动后会看到:
```
🚀 Server running on http://localhost:5000
✅ MongoDB Connected: 127.0.0.1
📚 CampusBookShare API ready!
```

### 3. 启动前端

```bash
cd D:\CampusBookShare\client
npm run dev
```

在浏览器中打开 `http://localhost:3000`

## 📁 项目结构

```
CampusBookShare/
├── client/                    # React 前端
│   ├── src/
│   │   ├── api/              # Axios API 调用
│   │   ├── components/       # 可复用组件
│   │   ├── context/          # React Context
│   │   ├── pages/            # 页面组件
│   │   ├── App.jsx           # 路由
│   │   └── App.css           # 全局样式
│   └── package.json
├── server/                    # Express 后端
│   ├── config/               # 数据库配置
│   ├── controllers/          # 业务逻辑
│   ├── middleware/            # 中间件
│   ├── models/               # 数据模型
│   ├── routes/               # API 路由
│   ├── uploads/              # 文件存储
│   ├── app.js                # Express 配置
│   └── server.js             # 启动入口
└── .gitignore
```

## 📡 API 端点

| 模块 | 方法 | 路径 | 说明 |
|------|------|------|------|
| 认证 | POST | `/api/auth/register` | 注册 |
| 认证 | POST | `/api/auth/login` | 登录 |
| 认证 | GET | `/api/auth/me` | 获取当前用户 🔒 |
| 书籍 | GET | `/api/books` | 书籍列表（搜索/分页） |
| 书籍 | GET | `/api/books/:id` | 书籍详情 |
| 书籍 | POST | `/api/books` | 上传书籍 🔒 |
| 书籍 | GET | `/api/books/:id/download` | 下载书籍 🔒 |
| 评论 | GET | `/api/comments?book=:id` | 评论列表 |
| 评论 | POST | `/api/comments` | 添加评论 🔒 |
| 收藏 | GET | `/api/favorites` | 收藏列表 🔒 |
| 收藏 | POST | `/api/favorites` | 添加收藏 🔒 |
| 收藏 | DELETE | `/api/favorites/:bookId` | 取消收藏 🔒 |
