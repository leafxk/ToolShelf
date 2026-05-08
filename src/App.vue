<template>
  <div class="app">
    <router-view />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { getTheme, detectSystemTheme } from './themes/index.js'
import { CURRENT_THEME, FOLLOW_SYSTEM_THEME } from './config/theme.js'

/**
 * 获取当前主题 ID
 */
function getActiveThemeId() {
  if (FOLLOW_SYSTEM_THEME) {
    return detectSystemTheme()
  }
  return CURRENT_THEME
}

/**
 * 应用主题颜色到 CSS 变量
 */
function applyThemeColors(theme) {
  const root = document.documentElement
  const { colors, layout } = theme
  
  if (colors) {
    root.style.setProperty('--color-primary', colors.primary)
    root.style.setProperty('--color-primary-hover', colors.primaryHover)
    root.style.setProperty('--color-primary-light', colors.primaryLight)
    root.style.setProperty('--color-text-primary', colors.textPrimary)
    root.style.setProperty('--color-text-secondary', colors.textSecondary)
    root.style.setProperty('--color-text-muted', colors.textMuted)
    root.style.setProperty('--color-bg-primary', colors.bgPrimary)
    root.style.setProperty('--color-bg-secondary', colors.bgSecondary)
    root.style.setProperty('--color-bg-card', colors.bgCard)
    root.style.setProperty('--color-bg-input', colors.bgInput)
    root.style.setProperty('--color-border', colors.border)
    root.style.setProperty('--color-border-light', colors.borderLight)
    root.style.setProperty('--color-success', colors.success)
    root.style.setProperty('--color-warning', colors.warning)
    root.style.setProperty('--color-danger', colors.danger)
    root.style.setProperty('--color-info', colors.info)
    root.style.setProperty('--color-code-bg', colors.codeBg)
    root.style.setProperty('--color-code-text', colors.codeText)
  }
  
  if (layout) {
    root.style.setProperty('--layout-border-radius', layout.borderRadius)
    root.style.setProperty('--layout-shadow', layout.shadow)
    root.style.setProperty('--layout-shadow-hover', layout.shadowHover)
    root.style.setProperty('--layout-transition', layout.transition)
    root.style.setProperty('--layout-container-max-width', layout.containerMaxWidth)
    root.style.setProperty('--layout-card-padding', layout.cardPadding)
  }
}

// 初始化主题
onMounted(() => {
  const themeId = getActiveThemeId()
  const theme = getTheme(themeId)
  
  if (theme) {
    applyThemeColors(theme)
  }
  
  // 监听系统主题变化
  if (FOLLOW_SYSTEM_THEME) {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    mediaQuery.addEventListener('change', (e) => {
      const newThemeId = e.matches ? 'dark' : 'default'
      const newTheme = getTheme(newThemeId)
      if (newTheme) {
        applyThemeColors(newTheme)
      }
    })
  }
})
</script>

<style>
/* 导入 CSS 变量文件 */
@import './styles/variables.css';

/* 全局重置与基础样式 */
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    'Helvetica Neue', Arial, 'Noto Sans SC', sans-serif;
  -webkit-font-smoothing: antialiased;
  background: var(--color-bg-primary);
  color: var(--color-text-primary);
  line-height: 1.6;
}

#app {
  min-height: 100vh;
}
</style>
