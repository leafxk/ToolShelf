/**
 * 主题配置文件
 * 
 * 使用说明：
 * 1. 在下方 CURRENT_THEME 设置当前使用的主题 ID
 *    - 可选值：'default'（默认主题）、'dark'（暗色主题）
 *    - 自定义主题：在 src/themes/ 下创建主题目录即可使用
 * 2. 设置 FOLLOW_SYSTEM_THEME 控制是否跟随系统主题
 * 3. 保存后刷新页面即可生效
 * 
 * 创建自定义主题：
 * 1. 在 src/themes/ 下创建新主题目录（如 src/themes/my-theme/）
 * 2. 在目录中创建 index.js，导出 theme 对象
 * 3. 设置 CURRENT_THEME 为新主题 ID
 * 4. 刷新页面即可看到新主题效果
 * 
 * 主题结构：
 * - pages/: 页面组件（可选，覆盖 base 的页面）
 * - components/: 组件（可选，覆盖 base 的组件）
 * - styles/variables.css: CSS 变量覆盖
 */

// 当前使用的主题（在此处切换）
export const CURRENT_THEME = 'defalut'

// 是否允许跟随系统主题自动切换
// true: 当系统切换到暗色模式时自动切换到暗色主题
// false: 始终使用上方 CURRENT_THEME 设置的主题
export const FOLLOW_SYSTEM_THEME = false
