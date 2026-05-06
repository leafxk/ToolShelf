/**
 * 📊 示例工具 A：JSON 格式化器（内嵌 + 新标签页双模式）
 *
 * 演示：inlineComponent 提供内嵌展开，newtab: true 同时支持新标签页
 */
import InlineComp from "../components/tools/JsonFormatterInline.vue";

export default {
  id: "json-formatter",
  name: "JSON 格式化",
  description: "美化/压缩 JSON 数据，支持语法高亮",
  icon: "📋",
  category: "开发工具",
  order: 1,
  tags: ["JSON", "格式化", "开发"],
  inlineComponent: InlineComp,
};
