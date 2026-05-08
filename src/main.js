import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import App from './App.vue'
import './styles/variables.css'

// ============================================================
// 🔮 核心机制：工具自动发现
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

// ============================================================
// 🖼️ 主题系统：动态加载页面组件
// ============================================================

import { CURRENT_THEME, FOLLOW_SYSTEM_THEME } from './config/theme.js'
import { getTheme, resolveThemePath, detectSystemTheme, themes } from './themes/index.js'

function getActiveThemeId() {
  if (FOLLOW_SYSTEM_THEME) {
    return detectSystemTheme()
  }
  return CURRENT_THEME
}

const activeThemeId = getActiveThemeId()
const activeTheme = getTheme(activeThemeId)

/**
 * 获取主题页面组件路径
 * 优先使用当前主题的页面，否则回退到 _base 主题
 */
function getThemePagePath(pageName) {
  if (!activeTheme || !activeTheme.pages) {
    return `./pages/${pageName}.vue`
  }
  
  const relativePath = activeTheme.pages[pageName]
  
  if (!relativePath) {
    // 回退到 _base 主题
    const baseTheme = themes['_base']
    const basePath = baseTheme?.pages?.[pageName]
    if (basePath) {
      return `/src/themes/_base/${basePath}`
    }
    return `./pages/${pageName}.vue`
  }
  
  // 如果路径是相对路径（以 ./ 开头），说明来自 _base
  if (relativePath.startsWith('./')) {
    return `/src/themes/_base/${relativePath}`
  }
  
  // 否则使用当前主题的路径
  return `/src/themes/${activeThemeId}/${relativePath}`
}

const HomePagePath = getThemePagePath('HomePage')
const ToolPagePath = getThemePagePath('ToolPage')

// 自动生成路由
const toolRoutes = tools
  .filter(t => t.component || t.inlineComponent)
  .map(t => ({
    path: `/tool/${t.id}`,
    name: t.id,
    component: () => import(/* @vite-ignore */ ToolPagePath),
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
      component: () => import(/* @vite-ignore */ HomePagePath),
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
})

const app = createApp(App)
app.use(router)

// 注入工具列表
app.config.globalProperties.$tools = tools

// 注入主题信息
app.config.globalProperties.$theme = activeTheme
app.config.globalProperties.$themeId = activeThemeId

// 注入主题组件注册表
// 页面组件可以从这里获取主题特定的组件
const themeComponents = {}

// 预加载主题组件（ToolCard）
if (activeTheme && activeTheme.components) {
  const toolCardPath = activeTheme.components.ToolCard
  if (toolCardPath) {
    let importPath
    // 如果路径是相对路径（以 ./ 开头），相对于当前主题目录
    if (toolCardPath.startsWith('./')) {
      importPath = `/src/themes/${activeThemeId}/${toolCardPath}`
    } else {
      importPath = `/src/themes/${activeThemeId}/${toolCardPath}`
    }
    importPath = importPath.replace(/^\/src\//, './')
    themeComponents.ToolCard = () => import(/* @vite-ignore */ importPath)
  }
}

// 如果主题没有覆盖 ToolCard，使用默认的
if (!themeComponents.ToolCard) {
  themeComponents.ToolCard = () => import('./components/ToolCard.vue')
}

app.config.globalProperties.$themeComponents = themeComponents

app.mount('#app')
