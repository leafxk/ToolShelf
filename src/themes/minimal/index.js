/**
 * 极简主题
 * 
 * 纯文字列表形式，简洁不花哨
 */

export const theme = {
  id: 'minimal',
  name: '极简列表',
  description: '纯文字列表，极简风格',
  author: 'ToolShelf',

  // 继承 base 主题
  extends: '_base',

  // 使用 base 的页面
  pages: {},
  // 组件覆盖
  components: {
    ToolCard: './components/ToolCard.vue',
  },
  styles: {
    variables: './styles/variables.css',
  },

  // 颜色配置 - 纯黑白灰
  colors: {
    primary: '#333333',
    primaryHover: '#000000',
    primaryLight: '#f5f5f5',
    textPrimary: '#1a1a1a',
    textSecondary: '#666666',
    textMuted: '#999999',
    bgPrimary: '#ffffff',
    bgSecondary: '#fafafa',
    bgCard: '#ffffff',
    bgInput: '#ffffff',
    border: '#e5e5e5',
    borderLight: '#f0f0f0',
    success: '#22c55e',
    warning: '#f59e0b',
    danger: '#ef4444',
    info: '#3b82f6',
    codeBg: '#1a1a1a',
    codeText: '#e5e5e5',
  },

  layout: {
    borderRadius: '2px',
    shadow: 'none',
    shadowHover: 'none',
    transition: 'none',
    containerMaxWidth: '800px',
    cardPadding: '0',
  },
}

export default theme
