/**
 * 🪑 座次表生成器（独立页面模式）
 *
 * 导入 Excel 读取姓名，生成座次表，支持顺序/乱序排列，可打印或导出 PDF
 */
import PageComp from '../components/tools/SeatArrangementPage.vue'

export default {
  id: 'seat-arrangement',
  name: '座次表生成',
  description: '导入 Excel 生成座次表，支持顺序/乱序排列、打印及 PDF 导出，适配 A4 纸打印',
  icon: '🪑',
  category: '效率工具',
  order: 3,
  tags: ['座次表', 'Excel', '打印', 'PDF'],
  component: PageComp,
}
