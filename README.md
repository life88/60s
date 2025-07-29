# 60s API 接口测试平台

这是一个基于 React + TypeScript + Tailwind CSS + shadcn/ui 构建的API接口测试平台，专为 60s API 服务设计。

## 功能特点

- 🎨 **现代化UI设计**: 使用 shadcn/ui 和 Tailwind CSS 构建的简洁美观界面
- 📱 **移动端友好**: 完全响应式设计，支持手机和平板设备访问
- 🚀 **实时接口测试**: 支持所有 60s API 端点的在线测试
- 🔍 **智能搜索**: 快速搜索和过滤API接口
- 📋 **一键复制**: 轻松复制API URL和响应数据
- 💡 **示例参数**: 内置常用参数示例，快速上手
- 🌓 **主题支持**: 内置明暗主题切换

## 支持的API接口

包含所有 60s API v2 版本接口：

- **信息资讯**: 60s、今日头条、微博热搜、知乎热榜等
- **娱乐工具**: 段子笑话、发病语录、一言、运势查询等
- **实用工具**: 翻译、IP查询、汇率查询、哈希计算等
- **平台服务**: B站、抖音、猫眼电影等第三方平台接口

## 技术栈

- **前端框架**: React 19 + TypeScript
- **构建工具**: Vite
- **样式方案**: Tailwind CSS
- **UI组件**: shadcn/ui
- **路由管理**: React Router
- **图标库**: Lucide React
- **包管理**: pnpm

## 快速开始

### 环境要求

- Node.js 18+
- pnpm (推荐) 或 npm

### 安装依赖

```bash
pnpm install
```

### 启动开发服务器

```bash
pnpm dev
```

服务器将在 `http://localhost:5173` 启动。

### 构建生产版本

```bash
pnpm build
```

## 使用说明

1. **浏览接口**: 在首页查看所有可用的API接口
2. **搜索过滤**: 使用搜索框快速找到需要的接口
3. **测试接口**: 点击"测试接口"进入详情页面
4. **配置参数**: 根据接口要求填入相应参数
5. **发送请求**: 点击发送按钮查看响应结果
6. **复制数据**: 一键复制URL或响应数据

## 项目结构

```
src/
├── components/          # 通用组件
│   ├── ui/             # shadcn/ui 组件
│   ├── LoadingSpinner.tsx
│   └── MobileMenu.tsx
├── pages/              # 页面组件
│   ├── HomePage.tsx    # 首页
│   └── EndpointPage.tsx # 接口详情页
├── lib/                # 工具函数
│   └── utils.ts
├── App.tsx             # 应用入口
└── main.tsx           # 应用启动
```

## 自定义配置

### 修改API地址

如果需要连接到不同的API服务器，请修改以下文件中的API地址：

- `src/pages/HomePage.tsx` (第25行)
- `src/pages/EndpointPage.tsx` (第87行)

### 添加新接口

在 `src/pages/EndpointPage.tsx` 的 `getEndpointConfig` 函数中添加新的接口配置。

## 移动端适配

- 使用 Tailwind CSS 的响应式工具类
- 针对小屏幕优化的布局和交互
- 触摸友好的按钮和输入框尺寸
- 横向滚动和文本换行处理

## 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 开启 Pull Request

## 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 相关链接

- [60s API 文档](https://docs.60s-api.viki.moe)
- [GitHub 仓库](https://github.com/vikiboss/60s)
- [shadcn/ui](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com)

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
