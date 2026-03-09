# CrossClip (跨端剪贴板) 设计文档

## 概述

CrossClip 是一个跨设备剪贴板共享工具，用户可以通过短码分享文本内容，支持可选的密码保护。

## Redis 依赖

项目 **必须依赖 Redis** 才能运行，没有任何降级或替代存储方案。

- 服务端通过 `ioredis` 连接 Redis（`packages/server/src/redis.ts`）
- 所有 API 端点（创建、读取、删除剪贴板）都通过 Redis hash 操作实现
- 默认连接 `127.0.0.1:6379`，可通过环境变量配置：
  - `REDIS_HOST`（默认 `127.0.0.1`）
  - `REDIS_PORT`（默认 `6379`）

## 架构

pnpm monorepo，分两个包：

```
packages/
├── server/   — Koa.js 后端 (端口 3001)
└── client/   — React + Vite 前端 (端口 3000，代理 /api 到后端)
```

## 后端设计

`packages/server/src/` 目录结构：

| 文件 | 职责 |
|------|------|
| `index.ts` | Koa 应用初始化、中间件注册、启动监听 |
| `router.ts` | RESTful API 路由（CRUD 剪贴板） |
| `redis.ts` | Redis 客户端初始化 |
| `utils.ts` | 工具函数 |

### 关键依赖

| 包 | 用途 |
|----|------|
| koa | HTTP 服务框架 |
| @koa/router | 路由中间件 |
| @koa/cors | 跨域支持 |
| koa-bodyparser | JSON 请求体解析 |
| ioredis | Redis 客户端 |
| nanoid | 生成 6 位唯一短码 |
| bcryptjs | 密码哈希与验证 |

### 核心流程

1. 用户提交内容 → `nanoid` 生成 6 位短码
2. 密码用 `bcryptjs` 哈希后与内容一起存入 Redis（key: `clip:{code}`）
3. 接收方凭短码取回内容，有密码则需验证

### API 端点

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/api/clip` | 创建剪贴板 |
| GET | `/api/clip/:code` | 获取内容（无密码） |
| POST | `/api/clip/:code` | 获取内容（需密码验证） |
| DELETE | `/api/clip/:code` | 删除剪贴板 |

## 前端设计

`packages/client/src/` 目录结构：

```
src/
├── main.tsx              — React 入口
├── App.tsx               — 主组件，Tab 路由
├── components/
│   ├── PasteView.tsx     — 粘贴/创建剪贴板
│   ├── FetchView.tsx     — 获取剪贴板内容
│   └── JsonTools.tsx     — JSON 格式化/压缩工具
├── hooks/
│   └── useClip.ts        — API 交互逻辑
└── styles/
    └── index.css         — Tailwind 样式入口
```

### 关键依赖

| 包 | 用途 |
|----|------|
| react | UI 框架 |
| vite | 构建工具与开发服务器 |
| tailwindcss | 原子化 CSS |
| typescript | 类型检查 |

### 功能特性

- Tab 切换：PasteView（粘贴/创建）和 FetchView（获取）
- `useClip` hook 封装所有 API 调用
- JSON 格式化/压缩工具（仅对有效 JSON 显示）
- 暗色主题，主题色 `#6c63ff`
- 支持 URL 参数 `?code=xxxxx` 自动加载内容

## 运行方式

### 前提条件

1. Node.js + pnpm
2. Redis 服务运行中

### 环境变量

| 变量 | 默认值 | 说明 |
|------|--------|------|
| `PORT` | `3001` | 服务端监听端口 |
| `REDIS_HOST` | `127.0.0.1` | Redis 地址 |
| `REDIS_PORT` | `6379` | Redis 端口 |

### 命令

```bash
# 安装依赖
pnpm install

# 开发模式（同时启动前后端）
pnpm dev

# 仅启动后端
pnpm dev:server

# 仅启动前端
pnpm dev:client

# 构建
pnpm build
```
