# 🎨 ToolShelf 主题系统

支持完全自定义的模板主题系统，让开发者可以创建全新的网站外观。

## 目录结构

```
src/themes/
├── _base/                    # 🏗️ 基础模板（永远不直接使用）
│   ├── index.js              # 主题配置
│   ├── pages/                # 页面组件
│   │   ├── HomePage.vue
│   │   └── ToolPage.vue
│   ├── components/           # 基础组件
│   │   ├── ToolCard.vue
│   │   └── tools/
│   └── styles/
│       ├── variables.css     # CSS 变量
│       └── global.css        # 全局样式
│
├── default/                  # 🌟 默认主题（蓝色调）
│   ├── index.js
│   └── styles/
│       └── variables.css
│
├── dark/                     # 🌙 暗色主题
│   ├── index.js
│   └── styles/
│       └── variables.css
│
└── example-minimal/         # 📝 示例主题（极简风格）
    ├── index.js
    └── styles/
        └── variables.css
```

## 快速开始

### 切换主题

修改 `src/config/theme.js`：

```javascript
// 当前使用的主题
export const CURRENT_THEME = 'default'  // 可选: default, dark, example-minimal

// 是否跟随系统主题
export const FOLLOW_SYSTEM_THEME = false
```

然后刷新页面即可看到效果。

## 创建自定义主题

### 1. 创建主题目录

在 `src/themes/` 下创建新目录，例如 `my-theme/`：

```
src/themes/my-theme/
├── index.js
├── pages/        # 可选：覆盖页面
├── components/   # 可选：覆盖组件
└── styles/
    └── variables.css
```

### 2. 创建主题配置文件

```javascript
// src/themes/my-theme/index.js

export const theme = {
  id: 'my-theme',
  name: '我的自定义主题',
  description: '描述你的主题',
  author: '你的名字',
  
  // 继承 base 主题
  extends: '_base',
  
  // 页面覆盖（可选）
  // 不定义则使用 base 的页面
  pages: {},
  
  // 组件覆盖（可选）
  components: {},
  
  // 样式覆盖
  styles: {
    variables: './styles/variables.css',
  },
  
  // 颜色配置
  colors: {
    primary: '#your-color',
    primaryHover: '#your-hover-color',
    primaryLight: '#your-light-color',
    textPrimary: '#your-text-color',
    textSecondary: '#your-secondary-text',
    textMuted: '#your-muted-text',
    bgPrimary: '#your-bg-color',
    bgSecondary: '#your-secondary-bg',
    bgCard: '#your-card-bg',
    bgInput: '#your-input-bg',
    border: '#your-border-color',
    borderLight: '#your-light-border',
    success: '#your-success-color',
    warning: '#your-warning-color',
    danger: '#your-danger-color',
    info: '#your-info-color',
    codeBg: '#your-code-bg',
    codeText: '#your-code-text',
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
```

### 3. 创建 CSS 变量文件

```css
/* src/themes/my-theme/styles/variables.css */

:root {
  /* 主色系 */
  --color-primary: #your-color;
  --color-primary-hover: #your-hover-color;
  --color-primary-light: #your-light-color;

  /* 文字色系 */
  --color-text-primary: #your-text-color;
  --color-text-secondary: #your-secondary-text;
  --color-text-muted: #your-muted-text;

  /* 背景色系 */
  --color-bg-primary: #your-bg-color;
  --color-bg-secondary: #your-secondary-bg;
  --color-bg-card: #your-card-bg;
  --color-bg-input: #your-input-bg;

  /* 边框色系 */
  --color-border: #your-border-color;
  --color-border-light: #your-light-border;

  /* 状态色 */
  --color-success: #your-success-color;
  --color-warning: #your-warning-color;
  --color-danger: #your-danger-color;
  --color-info: #your-info-color;

  /* 代码高亮 */
  --color-code-bg: #your-code-bg;
  --color-code-text: #your-code-text;

  /* 布局变量 */
  --layout-border-radius: 8px;
  --layout-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  --layout-shadow-hover: 0 4px 12px rgba(0, 0, 0, 0.15);
  --layout-transition: all 0.2s ease;
  --layout-container-max-width: 1200px;
  --layout-card-padding: 20px;
}
```

### 4. 注册主题

在 `src/themes/index.js` 中导入并注册：

```javascript
import myTheme from './my-theme/index.js'

export const themes = {
  _base: _baseTheme,
  default: defaultTheme,
  dark: darkTheme,
  'my-theme': myTheme,  // 添加你的主题
}
```

### 5. 使用主题

在 `src/config/theme.js` 中切换：

```javascript
export const CURRENT_THEME = 'my-theme'
```

然后重新构建或刷新页面。

## 高级用法：覆盖页面组件

如果你想完全重写首页，可以：

1. 在主题目录下创建页面组件：

```
src/themes/my-theme/
├── index.js
└── pages/
    └── HomePage.vue    # 自定义首页
```

2. 在 `index.js` 中引用：

```javascript
pages: {
  HomePage: './pages/HomePage.vue',
},
```

3. 首页会自动使用你的自定义版本。

## 高级用法：覆盖组件

类似地，你可以覆盖 ToolCard 或其他组件：

```
src/themes/my-theme/
├── index.js
└── components/
    └── ToolCard.vue    # 自定义工具卡片
```

```javascript
components: {
  ToolCard: './components/ToolCard.vue',
},
```

## CSS 变量参考

| 变量名 | 用途 | 示例值 |
|--------|------|--------|
| `--color-primary` | 主色调 | `#6366f1` |
| `--color-primary-hover` | 主色悬停 | `#4f46e5` |
| `--color-primary-light` | 主色浅色 | `#e0e7ff` |
| `--color-text-primary` | 主文字色 | `#1e293b` |
| `--color-text-secondary` | 次要文字色 | `#64748b` |
| `--color-text-muted` | 弱化文字色 | `#94a3b8` |
| `--color-bg-primary` | 主背景色 | `#f8fafc` |
| `--color-bg-secondary` | 次要背景色 | `#f1f5f9` |
| `--color-bg-card` | 卡片背景色 | `#ffffff` |
| `--color-bg-input` | 输入框背景色 | `#ffffff` |
| `--color-border` | 边框色 | `#e2e8f0` |
| `--color-border-light` | 浅边框色 | `#f1f5f9` |
| `--layout-border-radius` | 圆角大小 | `8px` |
| `--layout-shadow` | 阴影效果 | `0 1px 3px rgba(0,0,0,0.1)` |
| `--layout-shadow-hover` | 悬停阴影 | `0 4px 12px rgba(0,0,0,0.15)` |
| `--layout-transition` | 过渡动画 | `all 0.2s ease` |

## 继承机制

主题支持一级继承：
- 子主题继承 `_base` 的所有资源
- 子主题可以覆盖页面、组件和样式
- 未覆盖的部分自动使用 `_base` 的内容

## 打包

主题是开发时固定的。打包后网站使用配置的主题，不会运行时切换。

```bash
npm run build
```

构建产物只包含当前配置的主题资源。
