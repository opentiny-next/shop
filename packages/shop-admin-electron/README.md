# Console Electron - 电商管理系统

这是一个基于Electron的桌面应用，集成了电商管理系统和原有的MCP功能。

## 功能特性

### 电商管理系统

- **用户认证**: 登录/登出功能
- **仪表板**: 商品统计、图表展示
- **商品管理**: 商品的增删改查操作
- **响应式设计**: 现代化的UI界面

### MCP功能

- **模型上下文协议**: 支持AI模型交互
- **公司数据管理**: 公司信息的展示和操作

## 快速开始

### 安装依赖

```bash
pnpm install
```

### 开发模式

```bash
# 启动Vue开发服务器
pnpm run dev

# 启动Electron应用
pnpm run electron:dev
```

### 构建应用

```bash
# 构建Vue应用
pnpm run build

# 构建Electron应用并打包成exe
pnpm run electron:build
```

## 项目结构

```
src/
├── components/          # 通用组件
├── layouts/            # 布局组件
│   └── AdminLayout.vue # 主布局
├── views/              # 页面组件
│   ├── Dashboard.vue   # 仪表板
│   ├── Login.vue       # 登录页面
│   ├── Products.vue    # 商品列表
│   ├── ProductForm.vue # 商品表单
│   └── MCP.vue        # MCP功能页面
├── store/              # 状态管理
│   └── index.ts        # Pinia store
├── router/             # 路由配置
│   └── index.ts        # Vue Router配置
├── types/              # 类型定义
│   └── index.ts        # TypeScript类型
├── App.vue             # 主应用组件
└── main.ts             # 应用入口
```

## 路由说明

- `/` - 重定向到仪表板
- `/login` - 登录页面
- `/dashboard` - 仪表板页面
- `/products` - 商品列表页面
- `/products/add` - 添加商品页面
- `/products/edit/:id` - 编辑商品页面
- `/mcp` - MCP功能页面

## 默认账号

- 用户名: `admin`
- 密码: `admin`

## 技术栈

- **前端框架**: Vue 3 + TypeScript
- **UI组件库**: OpenTiny Vue
- **状态管理**: Pinia
- **路由**: Vue Router 4
- **桌面应用**: Electron
- **构建工具**: Vite
- **图表库**: ECharts

## 注意事项

1. 确保后端API服务运行在 `http://localhost:3001`
2. 开发模式下API请求会通过Vite代理转发
3. 打包后的应用需要配置正确的API地址

## 开发说明

### 添加新功能

1. 在 `src/views/` 目录下创建新的页面组件
2. 在 `src/router/index.ts` 中添加路由配置
3. 在 `src/layouts/AdminLayout.vue` 中添加导航菜单

### 状态管理

使用Pinia进行状态管理，主要store位于 `src/store/index.ts`

### 样式规范

- 使用Less预处理器
- 遵循OpenTiny设计规范
- 响应式设计，支持不同屏幕尺寸

## 打包配置

Electron应用使用electron-builder进行打包，配置位于 `package.json` 的 `build` 字段中。

支持Windows平台，生成NSIS安装包。
