/**
 * 暗色主题
 * 
 * 适合夜间使用的深色主题
 * 继承自 _base，只覆盖样式变量
 */

export const theme = {
  id: 'dark',
  name: '暗色主题',
  description: '适合夜间使用的深色主题',
  author: 'ToolShelf',
  
  // 继承 base 主题
  extends: '_base',
  
  // 页面（使用 base 的页面）
  pages: {},
  
  // 组件（使用 base 的组件）
  components: {},
  
  // 样式覆盖
  styles: {
    variables: './styles/variables.css',
  },
  
  // 颜色配置
  colors: {
    primary: '#818cf8',
    primaryHover: '#6366f1',
    primaryLight: '#312e81',
    textPrimary: '#f1f5f9',
    textSecondary: '#94a3b8',
    textMuted: '#64748b',
    bgPrimary: '#0f172a',
    bgSecondary: '#1e293b',
    bgCard: '#1e293b',
    bgInput: '#334155',
    border: '#334155',
    borderLight: '#1e293b',
    success: '#34d399',
    warning: '#fbbf24',
    danger: '#f87171',
    info: '#60a5fa',
    codeBg: '#020617',
    codeText: '#e2e8f0',
  },
  
  layout: {
    borderRadius: '8px',
    shadow: '0 1px 3px rgba(0, 0, 0, 0.3)',
    shadowHover: '0 4px 12px rgba(0, 0, 0, 0.4)',
    transition: 'all 0.2s ease',
    containerMaxWidth: '1200px',
    cardPadding: '20px',
  },
}

export default theme
