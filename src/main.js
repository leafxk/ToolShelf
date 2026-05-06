import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import App from './App.vue'
import './style.css'

// ============================================================
// 🔮 核心机制：工具自动发现
// ============================================================
// 约定：
//   1. 每个工具放在 src/tools/ 目录下，一个工具 = 一个 .ts 文件
//   2. 文件必须默认导出一个 ToolMeta 对象（见 ToolMeta 接口）
//   3. 导出 component / inlineComponent 决定工具的展示能力
//
// 四种模式：
//   - inlineComponent → 内嵌（卡片内展开）
//   - component       → 页面跳转（当前页跳转，← 返回主页）
//   - newtab          → 新标签页打开（✕ 关闭页面）
//   - externalUrl     → 外部链接
//
// 新增工具步骤：
//   ① 在 src/tools/ 下新建 xxx.ts
//   ② 导出符合 ToolMeta 的对象
//   ③ ✅ 完成！主页自动发现，无需改动任何其他文件
// ============================================================

const toolModules = import.meta.glob('./tools/*.ts', { eager: true })

const tools = Object.entries(toolModules)
  .map(([path, mod]) => {
    const meta = mod.default
    if (!meta || !meta.id) return null
    return meta
  })
  .filter(Boolean)
  .sort((a, b) => (a.order ?? 99) - (b.order ?? 99))

// 自动生成路由：所有有组件的工具都注册路由
// 统一使用 ToolPage 容器，由容器内部根据 toolId 查找并渲染对应组件 + 导航栏
const toolRoutes = tools
  .filter(t => t.component || t.inlineComponent)
  .map(t => ({
    path: `/tool/${t.id}`,
    name: t.id,
    component: () => import('./pages/ToolPage.vue'),
    meta: {
      title: t.name,
      toolId: t.id,
    },
  }))

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    ...toolRoutes,
    {
      path: '/',
      name: 'home',
      component: () => import('./pages/HomePage.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
})

const app = createApp(App)
app.use(router)

// 把工具列表注入全局，所有组件都可访问
app.config.globalProperties.$tools = tools

app.mount('#app')
