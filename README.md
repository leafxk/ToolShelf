# ToolShelf - 可扩展的个人工具集

> 🛠️ 每一个工具都是一个文件，新增零侵入

## 核心特性

- **🔮 自动发现** — 在 `src/tools/` 新建文件即自动出现在主页
- **📦 三种模式** — 内嵌组件 / 独立页面 / 外部链接，按需选择
- **🏷️ 分类标签** — 自动分组，一键过滤
- **📱 响应式** — 手机 / 平板 / 桌面自适应
- **🚀 零配置部署** — push 到 main 分支自动发布 GitHub Pages

## 项目结构

```
toolshelf/
├── src/
│   ├── tools/                  # ⭐ 工具定义目录（核心）
│   │   ├── types.ts            #  ToolMeta 接口类型定义
│   │   ├── json-formatter.ts   #  示例：JSON格式化（内嵌模式）
│   │   └── color-converter.ts  #  示例：颜色转换器（独立页面）
│   ├── components/
│   │   ├── ToolCard.vue        #  卡片组件
│   │   └── tools/              #  各工具的实际 Vue 组件
│   │       ├── JsonFormatterInline.vue
│   │       └── ColorConverterPage.vue
│   ├── pages/
│   │   └── HomePage.vue        #  主页（自动渲染所有工具卡片）
│   ├── App.vue                 #  根组件
│   ├── main.js                 #  入口（含自动发现逻辑）
│   └── style.css               #  全局样式
├── .github/workflows/
│   └── deploy.yml              #  GitHub Actions 自动部署
├── index.html
├── package.json
└── vite.config.js
```

## 如何新增一个工具 C

只需 **3 步**，**不需要改动任何已有代码**：

### 第 1 步：在 `src/tools/` 下创建 `my-tool-c.ts`

```typescript
import InlineComp from '../components/tools/MyToolCInline.vue'
// 或 import PageComp from '../components/tools/MyToolCPage.vue'

export default {
  id: 'my-tool-c',           // 唯一标识（URL 中使用）
  name: '我的工具C',         // 显示名称
  description: '一句话描述这个工具做什么',
  icon: '🔧',                // emoji 或 SVG
  category: '效率工具',       // 分类（可选）
  order: 3,                  // 排序（越小越靠前，可选）

  // ===== 三选一（或组合）=====
  
  // 方式 A：内嵌模式（轻量工具，在主页卡片内展开）
  inlineComponent: InlineComp,

  // 方式 B：独立页面模式（复杂工具，跳转到新页面）
  // component: PageComp,

  // 方式 C：外部链接模式（直接跳转外链）
  // externalUrl: 'https://example.com/my-tool',
}
```

### 第 2 步：创建对应的 Vue 组件

在 `src/components/tools/` 下创建 `.vue` 文件：

```vue
<template>
  <div class="my-tool-c">
    <!-- 你的工具 UI -->
    <h3>这是工具 C</h3>
  </div>
</template>

<script setup>
// 你的工具逻辑
</script>

<style scoped>
/* 你的样式 */
</style>
```

### 第 3 步：提交 & Push

```bash
git add .
git commit -m "feat: 新增工具 C"
git push
```

GitHub Actions 会自动构建并部署。几秒后你的新工具就上线了 ✅

---

## 三种工具模式对比

| 模式 | 字段 | 场景 | 用户体验 |
|------|------|------|----------|
| **内嵌** | `inlineComponent` | 轻量小工具（计算器、转换器等） | 主页卡片内展开/收起 |
| **独立页面** | `component` | 功能复杂需要完整页面的工具 | 点击卡片 → 跳转到 `/tool/xxx` |
| **外部链接** | `externalUrl` | 已有外部服务或第三方工具 | 点击卡片 → 新窗口打开 |

## 本地开发

```bash
cd toolshelf
npm install
npm run dev      # 启动开发服务器
npm run build    # 构建生产版本到 dist/
npm run preview  # 预览构建结果
```

## 部署到 GitHub Pages

1. Fork / 创建仓库 `leafxk/toolshelf`
2. 进入仓库 Settings → Pages → Source 选 **GitHub Actions**
3. 推送到 main 分支，自动部署
4. 访问 `https://leafxk.github.io/toolshelf/`

## 设计原则

1. **约定优于配置** — 文件位置和导出格式就是全部"配置"
2. **开闭原则** — 对扩展开放（加文件），对修改封闭（不改旧代码）
3. **单一职责** — 每个工具一个文件，互不干扰
