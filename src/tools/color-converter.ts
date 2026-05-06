/**
 * 🎨 示例工具 B：颜色转换器（独立页面模式）
 *
 * 功能较复杂，需要独立的完整页面
 */
import PageComp from "../components/tools/ColorConverterPage.vue";

export default {
  id: "color-converter",
  name: "颜色转换器",
  description: "HEX / RGB / HSL 互相转换，带取色预览",
  icon: "🎨",
  category: "开发工具",
  order: 2,
  tags: ["颜色", "CSS", "设计"],
  component: PageComp,
  newtab: true,
};
