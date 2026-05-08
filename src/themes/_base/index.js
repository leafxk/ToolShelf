/**
 * 基础主题（Base Theme）
 * 
 * 这是所有主题的父级，提供了默认的页面、组件和样式。
 * 其他主题通过继承 base 并覆盖部分资源来实现差异化。
 * 
 * 注意：_base 不应该被直接使用，只作为继承链的起点。
 */

export const theme = {
  id: '_base',
  name: '基础主题',
  description: '所有主题的父级，提供默认的页面、组件和样式',
  author: 'ToolShelf',
  
  // 主题资源映射
  // 键名：资源标识符
  // 值：相对于主题目录的路径，或 null（表示该资源不存在）
  pages: {
    HomePage: './pages/HomePage.vue',
    ToolPage: './pages/ToolPage.vue',
  },
  
  components: {
    // 通用组件
    ToolCard: './components/ToolCard.vue',
    
    // 工具组件
    'tools/ColorConverterPage': './components/tools/ColorConverterPage.vue',
    'tools/JsonFormatterInline': './components/tools/JsonFormatterInline.vue',
    'tools/SeatArrangementPage': './components/tools/SeatArrangementPage.vue',
  },
  
  // 样式文件路径（相对于主题目录）
  // 会按顺序加载：base 的样式 → 主题的样式（后者覆盖前者）
  styles: {
    variables: './styles/variables.css',
    global: './styles/global.css',
  },
  
  // 颜色配置（用于 JS 中动态访问主题颜色）
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
  
  // 布局配置
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
