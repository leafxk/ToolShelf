/**
 * 示例主题：极简风格
 * 
 * 这是一个完全自定义的示例主题，展示了如何：
 * 1. 只覆盖样式变量（colors/layout）
 * 2. 覆盖页面组件
 * 3. 覆盖组件
 * 
 * 使用方法：
 * 1. 在 src/config/theme.js 中设置 CURRENT_THEME = 'example-minimal'
 * 2. 刷新页面即可看到效果
 */

export const theme = {
  id: 'example-minimal',
  name: '极简风格',
  description: '一个极简风格的主题示例，展示如何自定义主题',
  author: 'Your Name',
  
  // 继承 base 主题
  extends: '_base',
  
  // 页面覆盖（可选）
  // 不定义则使用 base 的页面
  // 如需完全重写页面，创建 ./pages/HomePage.vue 等文件
  pages: {
    // 示例：使用自定义首页
    // HomePage: './pages/MyCustomHomePage.vue',
  },
  
  // 组件覆盖（可选）
  // 不定义则使用 base 的组件
  components: {},
  
  // 样式覆盖
  styles: {
    variables: './styles/variables.css',
  },
  
  // 颜色配置 - 极简风格（绿松石色 + 浅灰）
  colors: {
    primary: '#14b8a6',
    primaryHover: '#0d9488',
    primaryLight: '#ccfbf1',
    textPrimary: '#134e4a',
    textSecondary: '#5eead4',
    textMuted: '#99f6e4',
    bgPrimary: '#f0fdfa',
    bgSecondary: '#ccfbf1',
    bgCard: '#ffffff',
    bgInput: '#ffffff',
    border: '#5eead4',
    borderLight: '#f0fdfa',
    success: '#22c55e',
    warning: '#f59e0b',
    danger: '#ef4444',
    info: '#06b6d4',
    codeBg: '#134e4a',
    codeText: '#f0fdfa',
  },
  
  layout: {
    borderRadius: '4px',
    shadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
    shadowHover: '0 4px 6px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.15s ease',
    containerMaxWidth: '960px',
    cardPadding: '16px',
  },
}

export default theme
