/**
 * 主题注册中心
 * 
 * 所有主题在这里注册和管理。
 * 支持主题继承：子主题可以覆盖父主题的页面、组件和样式。
 */

import _baseTheme from './_base/index.js'

// 导入所有主题
import defaultTheme from './default/index.js'
import darkTheme from './dark/index.js'
import exampleMinimalTheme from './example-minimal/index.js'
import minimalTheme from './minimal/index.js'

/** @type {Record<string, Object>} */
export const themes = {
  _base: _baseTheme,
  default: defaultTheme,
  dark: darkTheme,
  'example-minimal': exampleMinimalTheme,
  minimal: minimalTheme,
}

/**
 * 获取主题列表
 * @returns {Object[]}
 */
export function getThemeList() {
  return Object.values(themes).filter(t => t.id !== '_base')
}

/**
 * 根据 ID 获取主题（已解析继承关系）
 * @param {string} id
 * @returns {Object|undefined}
 */
export function getTheme(id) {
  const theme = themes[id]
  if (!theme) return undefined
  
  // 如果主题有继承关系，合并父主题
  if (theme.extends) {
    const parentTheme = themes[theme.extends]
    if (!parentTheme) {
      console.warn(`主题 "${id}" 引用了不存在的父主题 "${theme.extends}"`)
      return theme
    }
    
    // 递归获取已解析的父主题
    const resolvedParent = getTheme(theme.extends)
    
    // 合并主题资源（子主题覆盖父主题）
    return mergeThemes(resolvedParent, theme)
  }
  
  return theme
}

/**
 * 合并两个主题，子主题的属性优先
 * @param {Object} parent - 父主题
 * @param {Object} child - 子主题
 * @returns {Object} 合并后的主题
 */
function mergeThemes(parent, child) {
  return {
    // 基本信息：优先使用子主题的，否则使用父主题的
    id: child.id || parent.id,
    name: child.name || parent.name,
    description: child.description || parent.description,
    author: child.author || parent.author,
    
    // 页面：深度合并（空对象不覆盖父主题）
    pages: {
      ...parent.pages,
      ...(Object.keys(child.pages || {}).length > 0 ? child.pages : {}),
    },
    
    // 组件：深度合并（空对象不覆盖父主题）
    components: {
      ...parent.components,
      ...(Object.keys(child.components || {}).length > 0 ? child.components : {}),
    },
    
    // 样式：深度合并（空对象不覆盖父主题）
    styles: {
      ...parent.styles,
      ...(Object.keys(child.styles || {}).length > 0 ? child.styles : {}),
    },
    
    // 颜色：子主题完全覆盖（如果有定义）
    colors: child.colors || parent.colors,
    
    // 布局：子主题完全覆盖（如果有定义）
    layout: child.layout || parent.layout,
  }
}

/** 默认主题 ID */
export const DEFAULT_THEME_ID = 'default'

/**
 * 检测系统是否使用暗色模式
 * @returns {string}
 */
export function detectSystemTheme() {
  if (typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark'
  }
  return 'default'
}

/**
 * 获取主题资源的绝对路径
 * @param {string} themeId - 主题 ID
 * @param {string} resourcePath - 相对于主题目录的资源路径
 * @returns {string} 绝对路径
 */
export function resolveThemePath(themeId, resourcePath) {
  if (!resourcePath) return ''
  
  // 如果是绝对路径（以 / 开头），直接返回
  if (resourcePath.startsWith('/')) {
    return resourcePath
  }
  
  // 相对于 themes/[themeId]/ 目录
  return `/src/themes/${themeId}/${resourcePath}`
}

/**
 * 加载主题的 CSS 变量文件
 * 会按顺序加载 base 的样式，然后是主题的样式（后者覆盖前者）
 * @param {Object} theme - 已解析的主题对象
 * @param {string} themeId - 主题 ID
 */
export async function loadThemeStyles(theme, themeId) {
  const root = document.documentElement
  
  // 1. 首先加载 base 的样式（如果主题不是 base）
  if (themeId !== '_base' && _baseTheme.styles.variables) {
    await loadCssVariableFile(_baseTheme.styles.variables)
  }
  
  // 2. 然后加载主题的样式（覆盖 base）
  if (theme.styles && theme.styles.variables) {
    await loadCssVariableFile(theme.styles.variables)
  }
}

/**
 * 动态加载 CSS 变量文件
 * @param {string} path - CSS 文件路径
 */
async function loadCssVariableFile(path) {
  try {
    const response = await fetch(path)
    if (!response.ok) return
    
    const cssText = await response.text()
    
    // 解析 CSS 变量并应用到 :root
    const root = document.documentElement
    const varRegex = /(--[\w-]+)\s*:\s*([^;]+);/g
    let match
    
    while ((match = varRegex.exec(cssText)) !== null) {
      const [, varName, varValue] = match
      root.style.setProperty(varName.trim(), varValue.trim())
    }
  } catch (e) {
    console.warn(`加载样式文件失败: ${path}`, e)
  }
}

/**
 * 应用主题颜色到 CSS 变量
 * @param {Object} theme - 已解析的主题对象
 */
export function applyThemeColors(theme) {
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
