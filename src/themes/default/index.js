/**
 * 默认主题
 * 
 * 清新的蓝色调，适合日常使用
 * 继承自 _base，只覆盖样式变量
 */

export const theme = {
  id: 'default',
  name: '默认主题',
  description: '清新的蓝色调，适合日常使用',
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
    primary: '#6366f1',
    primaryHover: '#4f46e5',
    primaryLight: '#e0e7ff',
    textPrimary: '#1e293b',
    textSecondary: '#64748b',
    textMuted: '#94a3b8',
    bgPrimary: '#f8fafc',
    bgSecondary: '#f1f5f9',
    bgCard: '#ffffff',
    bgInput: '#ffffff',
    border: '#e2e8f0',
    borderLight: '#f1f5f9',
    success: '#34d399',
    warning: '#fbbf24',
    danger: '#ef4444',
    info: '#60a5fa',
    codeBg: '#1e293b',
    codeText: '#e2e8f0',
  },
  
  layout: {
    borderRadius: '8px',
    shadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    shadowHover: '0 4px 12px rgba(0, 0, 0, 0.15)',
    transition: 'all 0.2s ease',
    containerMaxWidth: '1200px',
    cardPadding: '20px',
  },
}

export default theme
