import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import App from './App.vue'
import './styles/variables.css'

// ============================================================
// 🔮 工具自动发现
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
// 🖼️ 主题系统
// ============================================================
import { CURRENT_THEME, FOLLOW_SYSTEM_THEME } from './config/theme.js'
import { getTheme, detectSystemTheme } from './themes/index.js'

// 预声明所有页面（Vite glob 键格式是 /src/...）
const basePages = import.meta.glob('/src/themes/_base/pages/*.vue')
const themePages = import.meta.glob('/src/themes/*/pages/*.vue')
const rootPages = import.meta.glob('/src/pages/*.vue')

// 预声明所有 ToolCard 组件
const baseToolCards = import.meta.glob('/src/themes/_base/components/ToolCard.vue')
const themeToolCards = import.meta.glob('/src/themes/*/components/ToolCard.vue')
const rootToolCards = import.meta.glob('/src/components/ToolCard.vue')

function getActiveThemeId() {
  if (FOLLOW_SYSTEM_THEME) {
    return detectSystemTheme()
  }
  return CURRENT_THEME
}

const activeThemeId = getActiveThemeId()
const activeTheme = getTheme(activeThemeId)

/**
 * 获取主题页面组件
 */
function getThemePage(pageName) {
  // 如果主题没有配置页面，回退到 root
  if (!activeTheme || !activeTheme.pages || !activeTheme.pages[pageName]) {
    return rootPages[`/src/pages/${pageName}.vue`]
  }
  
  const relativePath = activeTheme.pages[pageName]
  
  // 如果路径是相对路径（以 ./ 开头），来自 _base 主题
  if (relativePath.startsWith('./')) {
    return basePages[`/src/themes/_base/${relativePath}`]
  }
  
  // 使用当前主题的路径
  return themePages[`/src/themes/${activeThemeId}/${relativePath}`]
}

/**
 * 获取 ToolCard 组件
 */
function getToolCard() {
  if (!activeTheme || !activeTheme.components || !activeTheme.components.ToolCard) {
    return baseToolCards['/src/themes/_base/components/ToolCard.vue']
  }
  
  const toolCardPath = activeTheme.components.ToolCard
  
  if (toolCardPath.startsWith('./')) {
    return themeToolCards[`/src/themes/${activeThemeId}/${toolCardPath}`]
  }
  
  return themeToolCards[`/src/themes/${activeThemeId}/${toolCardPath}`]
}

// 获取实际的组件
const HomePage = getThemePage('HomePage')
const ToolPage = getThemePage('ToolPage')
const ToolCardImporter = getToolCard()

// 自动生成路由
const toolRoutes = tools
  .filter(t => t.component || t.inlineComponent)
  .map(t => ({
    path: `/tool/${t.id}`,
    name: t.id,
    component: ToolPage,
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
      component: HomePage,
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
app.config.globalProperties.$themeComponents = {
  ToolCard: ToolCardImporter,
}

app.mount('#app')
