/**
 * 工具元数据接口
 *
 * 每个工具文件必须导出一个符合此接口的对象
 */
export interface ToolMeta {
  /** 唯一标识，用于 URL 路由（如 'json-formatter'） */
  id: string

  /** 显示名称 */
  name: string

  /** 一句话描述 */
  description: string

  /** 图标（可以是 emoji、SVG 字符串、或图标库的组件名） */
  icon: string

  /** 分类标签，用于分组显示 */
  category?: string

  /** 排序权重，越小越靠前，默认 99 */
  order?: number

  /** 标签列表 */
  tags?: string[]

  // ========== 四种展示模式（可组合使用）==========

  /**
   * 📦 内嵌模式：工具内容轻量，在主页卡片内展开/收起
   * 导入一个 Vue 组件 (.vue 文件)
   */
  inlineComponent?: any

  /**
   * 🔗 页面跳转模式：点击卡片 → 当前页面内跳转到 /tool/:id
   * 导入一个 Vue 组件 (.vue 文件)
   * 页面顶部显示"← 返回主页"
   */
  component?: any

  /**
   * 🔲 新标签页模式：点击卡片 → window.open 新标签页打开
   * 使用 ToolPage 容器渲染 component 或 inlineComponent
   * 页面顶部显示"✕ 关闭"按钮
   *
   * 若未指定 component/inlineComponent，此项无效
   */
  newtab?: boolean

  /** 🌐 外部链接模式：点击卡片直接跳转外部地址 */
  externalUrl?: string
}
