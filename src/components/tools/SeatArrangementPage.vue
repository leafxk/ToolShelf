<template>
  <div class="seat-arrangement">
    <!-- 操作面板 -->
    <div class="control-panel" :class="{ 'no-print': true }">
      <h2>🪑 座次表生成器</h2>

      <div class="control-row">
        <!-- Excel 导入 -->
        <div class="control-group">
          <label>1. 导入名单（Excel）</label>
          <input
            ref="fileInput"
            type="file"
            accept=".xlsx,.xls,.csv"
            @change="handleFileChange"
            class="file-input"
          />
          <button
            v-if="names.length > 0"
            class="btn btn-sm btn-outline"
            @click="clearNames"
          >
            清空名单 ({{ names.length }} 人)
          </button>
        </div>

        <!-- 列选择 -->
        <div class="control-group" v-if="excelHeaders.length > 0">
          <label>2. 选择姓名列</label>
          <select v-model="selectedColumn" @change="extractNames">
            <option value="">-- 请选择 --</option>
            <option
              v-for="header in excelHeaders"
              :key="header"
              :value="header"
            >
              {{ header }}
            </option>
          </select>
        </div>

        <!-- 排序方式 -->
        <div class="control-group" v-if="names.length > 0">
          <label>3. 排列方式</label>
          <div class="radio-group">
            <label
              ><input type="radio" value="order" v-model="sortMode" />
              顺序排列</label
            >
            <label
              ><input type="radio" value="shuffle" v-model="sortMode" />
              随机打乱</label
            >
          </div>
          <button
            v-if="sortMode === 'shuffle'"
            class="btn btn-sm btn-primary"
            @click="shuffleNames"
          >
            重新随机
          </button>
        </div>

        <!-- 布局设置 -->
        <div class="control-group" v-if="names.length > 0">
          <label>4. 每行人数</label>
          <select v-model.number="colsPerRow">
            <option v-for="n in [1, 2, 3, 4, 5, 6]" :key="n" :value="n">
              {{ n }}
            </option>
          </select>
          <span class="hint"
            >共 {{ Math.ceil(names.length / colsPerRow) }} 行</span
          >
        </div>

        <!-- 标题 -->
        <div class="control-group" v-if="names.length > 0">
          <label>5. 座次表标题（可选）</label>
          <input
            type="text"
            v-model="tableTitle"
            placeholder="如：XX 会议座次表"
          />
        </div>

        <!-- 操作按钮 -->
        <div class="action-buttons" v-if="names.length > 0">
          <button class="btn btn-primary" @click="handlePrint">🖨️ 打印</button>
          <button class="btn btn-secondary" @click="downloadPDF">
            📄 下载 PDF
          </button>
        </div>
      </div>
    </div>

    <!-- 名单预览 -->
    <div class="name-preview no-print" v-if="names.length > 0">
      <span>当前名单：</span>
      <span v-for="(name, idx) in displayNames" :key="idx" class="name-tag">{{
        name
      }}</span>
    </div>

    <!-- 座次表打印区域 -->
    <div id="seat-table-print-area" ref="printArea" class="print-area">
      <div class="page-a4">
        <!-- 标题 -->
        <h3 v-if="tableTitle" class="table-title">{{ tableTitle }}</h3>

        <!-- 座次表网格 -->
        <div
          class="seat-grid"
          :style="{ gridTemplateColumns: `repeat(${colsPerRow}, 1fr)` }"
        >
          <div v-for="(name, idx) in displayNames" :key="idx" class="seat-card">
            <div class="sc-label sc-label-no">座位号</div>
            <div class="sc-val sc-val-no">{{ idx + 1 }}</div>
            <div class="sc-label sc-label-name">姓名</div>
            <div class="sc-val sc-val-name">{{ name }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div class="empty-state no-print" v-if="names.length === 0">
      <div class="empty-icon">📋</div>
      <p>请导入包含姓名的 Excel 文件开始生成座次表</p>
      <p class="hint">支持 .xlsx / .xls / .csv 格式，自动识别列名</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import * as XLSX from "xlsx";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

// ===== 状态 =====
const fileInput = ref(null);
const printArea = ref(null);

const names = ref([]);
const rawNames = ref([]);
const excelHeaders = ref([]);
const selectedColumn = ref("");
const sortMode = ref("order"); // order | shuffle
const colsPerRow = ref(4);
const tableTitle = ref("");
const shuffledSeed = ref(1);

// ===== 计算属性：展示用的名字列表 =====
const displayNames = computed(() => {
  const list = [...names.value];
  if (list.length === 0) return list;
  return list;
});

// ===== 文件处理 =====
function handleFileChange(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (evt) => {
    try {
      const data = new Uint8Array(evt.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const firstSheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[firstSheetName];

      const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      if (jsonData.length === 0) {
        alert("Excel 文件为空");
        return;
      }

      const headers = jsonData[0]
        .map((h) => String(h || "").trim())
        .filter(Boolean);
      excelHeaders.value = headers;

      if (headers.length > 0) {
        selectedColumn.value = headers[0];
        extractNamesFromData(jsonData);
      }
    } catch (err) {
      console.error(err);
      alert("解析 Excel 失败：" + err.message);
    }
  };
  reader.readAsArrayBuffer(file);
}

function extractNamesFromData(data) {
  const headerIdx = data[0].findIndex(
    (h) => String(h || "").trim() === selectedColumn.value,
  );
  if (headerIdx === -1) return;

  const extracted = [];
  for (let i = 1; i < data.length; i++) {
    const val = data[i][headerIdx];
    if (val !== undefined && val !== null && String(val).trim() !== "") {
      extracted.push(String(val).trim());
    }
  }

  rawNames.value = [...extracted];
  applySort();
}

function extractNames() {
  if (!selectedColumn.value) return;
  if (fileInput.value?.files[0]) {
    handleFileChange({ target: fileInput.value });
  }
}

// ===== 排序逻辑 =====
watch(sortMode, () => applySort());

function applySort() {
  if (rawNames.value.length === 0) return;
  if (sortMode.value === "order") {
    names.value = [...rawNames.value];
  } else {
    names.value = shuffleArray([...rawNames.value]);
  }
}

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function shuffleNames() {
  applySort();
}

function clearNames() {
  names.value = [];
  rawNames.value = [];
  excelHeaders.value = [];
  selectedColumn.value = "";
  tableTitle.value = "";
  if (fileInput.value) fileInput.value.value = "";
}

// ===== 打印 =====
function handlePrint() {
  window.print();
}

async function downloadPDF() {
  if (!printArea.value || names.value.length === 0) {
    alert("没有内容可导出");
    return;
  }

  try {
    const printStyles = `
      .page-a4 {
        box-shadow: none !important;
        margin: 0 !important;
        padding: 8mm 10mm !important;
        width: 210mm !important;
        min-height: auto !important;
        height: auto !important;
      }
      .table-title {
        font-size: 22pt !important;
        margin-bottom: 12pt !important;
      }
      .seat-grid {
        gap: 5pt !important;
      }
      .seat-card {
        border-width: 1.2pt !important;
        grid-template-columns: 58pt 1fr !important;
        page-break-inside: avoid !important;
      }
      .sc-label {
        font-size: 13pt !important;
        padding-left: 10pt !important;
        padding-top: 7pt !important;
        padding-bottom: 7pt !important;
        border-right-width: 1.2pt !important;
        border-bottom-width: 1.2pt !important;
      }
      .sc-val {
        font-size: 16pt !important;
        padding: 8pt 12pt !important;
        border-bottom-width: 1.2pt !important;
      }
      .sc-label-name,
      .sc-val-name {
        border-bottom: none !important;
      }
    `;

    const cloneWrapper = document.createElement("div");
    cloneWrapper.style.position = "fixed";
    cloneWrapper.style.top = "0";
    cloneWrapper.style.left = "0";
    cloneWrapper.style.width = "210mm";
    cloneWrapper.style.zIndex = "9999";
    cloneWrapper.style.background = "#ffffff";
    cloneWrapper.style.padding = "0";
    cloneWrapper.style.margin = "0";
    cloneWrapper.style.overflow = "visible";
    cloneWrapper.style.boxSizing = "border-box";

    const styleTag = document.createElement("style");
    styleTag.textContent = printStyles;
    cloneWrapper.appendChild(styleTag);

    const clone = printArea.value.cloneNode(true);
    clone.style.width = "210mm";
    clone.style.boxShadow = "none";
    clone.style.margin = "0";
    clone.style.padding = "0";

    const clonePage = clone.querySelector(".page-a4");
    if (clonePage) {
      clonePage.style.boxShadow = "none";
      clonePage.style.margin = "0";
      clonePage.style.padding = "8mm 10mm";
      clonePage.style.width = "210mm";
      clonePage.style.minHeight = "auto";
      clonePage.style.height = "auto";
    }

    cloneWrapper.appendChild(clone);
    document.body.appendChild(cloneWrapper);

    const pxPerMm = cloneWrapper.offsetWidth / 210;
    const scale = 2;
    const pageHeightMm = 297;
    const bottomMarginMm = 10;
    const pageHeightPx = Math.floor(pageHeightMm * pxPerMm * scale);
    const sliceHeightPx = Math.floor(
      (pageHeightMm - bottomMarginMm) * pxPerMm * scale,
    );

    const seatGrid = clone.querySelector(".seat-grid");
    const seatCard = clone.querySelector(".seat-card");
    const rowGap = seatGrid
      ? parseFloat(getComputedStyle(seatGrid).rowGap.replace("px", "") || "0")
      : 0;
    const rowHeightCanvas = seatCard
      ? Math.round((seatCard.offsetHeight + rowGap) * scale)
      : Math.round(70 * scale);
    const gridTopCanvas = seatGrid ? Math.round(seatGrid.offsetTop * scale) : 0;

    const canvas = await html2canvas(cloneWrapper, {
      scale,
      backgroundColor: "#ffffff",
      logging: false,
      useCORS: true,
      width: cloneWrapper.offsetWidth,
      height: cloneWrapper.scrollHeight,
      windowWidth: cloneWrapper.offsetWidth,
      windowHeight: cloneWrapper.scrollHeight,
      scrollX: -window.scrollX,
      scrollY: -window.scrollY,
    });

    document.body.removeChild(cloneWrapper);

    const pdf = new jsPDF("p", "mm", "a4");
    let position = 0;

    const adjustSliceHeight = (targetBottom) => {
      if (!seatGrid || !seatCard) return targetBottom;
      if (targetBottom <= gridTopCanvas) return targetBottom;

      const relative = targetBottom - gridTopCanvas;
      const fullRows = Math.floor(relative / rowHeightCanvas);
      return gridTopCanvas + fullRows * rowHeightCanvas;
    };

    while (position < canvas.height) {
      const remaining = canvas.height - position;
      const maxHeight = Math.min(sliceHeightPx, remaining);
      const adjustedBottom = adjustSliceHeight(position + maxHeight);
      let currentHeight;

      if (remaining <= maxHeight) {
        currentHeight = remaining;
      } else if (adjustedBottom <= position) {
        if (position === 0) {
          currentHeight = Math.min(rowHeightCanvas, remaining);
        } else {
          pdf.addPage();
          continue;
        }
      } else {
        currentHeight = adjustedBottom - position;
      }

      const pageCanvas = document.createElement("canvas");
      const ctx = pageCanvas.getContext("2d");
      pageCanvas.width = canvas.width;
      pageCanvas.height = currentHeight;

      ctx.drawImage(
        canvas,
        0,
        position,
        canvas.width,
        pageCanvas.height,
        0,
        0,
        canvas.width,
        pageCanvas.height,
      );

      const pageImg = pageCanvas.toDataURL("image/jpeg", 0.95);
      const pageImgHeight = pageCanvas.height / (pxPerMm * scale);
      pdf.addImage(pageImg, "JPEG", 0, 0, 210, pageImgHeight);

      position += pageCanvas.height;
      if (position < canvas.height) {
        pdf.addPage();
      }
    }

    pdf.save("seating-arrangement.pdf");
  } catch (err) {
    console.error("PDF 生成失败:", err);
    alert("PDF 下载失败，请重试");
  }
}
</script>

<style scoped>
.seat-arrangement {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
  font-family:
    -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue",
    Arial, sans-serif;
}

/* ========== 操作面板 ========== */
.control-panel {
  background: var(--color-bg-secondary);
  border-radius: var(--layout-border-radius);
  padding: 24px;
  margin-bottom: 20px;
  border: 1px solid var(--color-border);
}

.control-panel h2 {
  margin: 0 0 20px 0;
  font-size: 1.3rem;
  color: var(--color-text-primary);
}

.control-row {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.control-group {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.control-group label {
  font-weight: 600;
  color: var(--color-text-secondary);
  min-width: 100px;
  font-size: 0.9rem;
}

.control-group select,
.control-group input[type="text"] {
  padding: 8px 12px;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  font-size: 0.9rem;
  background: var(--color-bg-input);
  color: var(--color-text-primary);
  min-width: 140px;
}

.control-group select:focus,
.control-group input[type="text"]:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
}

.file-input {
  padding: 6px 0;
  min-width: auto;
}

.radio-group {
  display: flex;
  gap: 16px;
}

.radio-group label {
  min-width: auto;
  font-weight: 400;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
}

.hint {
  color: var(--color-text-muted);
  font-size: 0.85rem;
}

/* 按钮 */
.btn {
  padding: 8px 18px;
  border: none;
  border-radius: var(--layout-border-radius);
  font-size: 0.88rem;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
  font-weight: 500;
}

.btn:hover {
  transform: translateY(-1px);
}

.btn:active {
  transform: translateY(0);
}

.btn-primary {
  background: var(--color-primary);
  color: #fff;
}
.btn-primary:hover {
  background: var(--color-primary-hover);
}

.btn-secondary {
  background: var(--color-text-secondary);
  color: #fff;
}
.btn-secondary:hover {
  background: var(--color-text-muted);
}

.btn-outline {
  background: transparent;
  border: 1px solid var(--color-border);
  color: var(--color-text-secondary);
}
.btn-outline:hover {
  background: var(--color-bg-secondary);
  border-color: var(--color-text-muted);
}

.btn-sm {
  padding: 5px 12px;
  font-size: 0.82rem;
}

.action-buttons {
  display: flex;
  gap: 10px;
  margin-top: 8px;
}

/* ========== 名单预览 ========== */
.name-preview {
  background: var(--color-primary-light);
  border-radius: var(--layout-border-radius);
  padding: 12px 16px;
  margin-bottom: 20px;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
  line-height: 1.8;
  font-size: 0.88rem;
}

.name-tag {
  background: var(--color-bg-card);
  color: var(--color-primary);
  padding: 2px 10px;
  border-radius: 12px;
  font-weight: 500;
}

/* ========== 打印区域 / A4 页面 ========== */
.print-area {
  width: 100%;
  display: flex;
  justify-content: center;
}

.page-a4 {
  width: 210mm;
  /* 不再强制 min-height:297mm，让内容自然撑开 */
  padding: 12mm 12mm;
  background: #fff;
  box-sizing: border-box;
  box-shadow: var(--layout-shadow);
}

.table-title {
  text-align: center;
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 16px;
  letter-spacing: 2px;
  color: #111;
}

/* ========== 座次表网格 — 核心：2列 x 2行 表格布局 ========== */
.seat-grid {
  display: grid;
  gap: 6px;
}

/* 单个座位卡片：固定 2x2 表格布局 */
.seat-card {
  border: 1.5px solid #222;
  background: #fff;
  display: grid;
  grid-template-columns: 70px 1fr;
  grid-template-rows: auto auto;
  overflow: hidden;
}

.sc-label {
  font-size: 15px;
  font-weight: 400;
  color: #333;
  background: #fafafa;
  display: flex;
  align-items: center;
  padding-left: 14px;
  padding-top: 8px;
  padding-bottom: 8px;
  border-right: 1.5px solid #222;
  border-bottom: 1.5px solid #222;
  user-select: none;
}

.sc-val {
  font-size: 18px;
  font-weight: 700;
  color: #111;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 14px;
  border-bottom: 1.5px solid #222;
}

/* 底部两格去掉下边框 */
.sc-label-name {
  border-bottom: none;
}

.sc-val-name {
  border-bottom: none;
}

/* ========== 空状态 ========== */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: var(--color-text-muted);
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 12px;
}

.empty-state p {
  margin: 6px 0;
  font-size: 1rem;
}

.empty-state .hint {
  font-size: 0.88rem;
  color: var(--color-border);
}

/* ========== 打印样式（全局，非 scoped — 必须覆盖父组件 ToolPage） ========== */
</style>

<style>
/* 全局打印样式：隐藏导航栏等非座次表内容 */

/* 响应式：小屏幕下操作面板纵向排列（屏幕预览用，保留在 scoped 中更好但放这里也行） */
@media (max-width: 640px) {
  .seat-arrangement .control-group {
    flex-direction: column;
    align-items: flex-start;
  }
  .seat-arrangement .control-group label {
    min-width: auto;
  }
  .seat-arrangement .action-buttons {
    width: 100%;
  }
  .seat-arrangement .action-buttons .btn {
    flex: 1;
    text-align: center;
  }
  .seat-arrangement .page-a4 {
    width: 100% !important;
    min-height: auto !important;
    transform: scale(0.55);
    transform-origin: top center;
  }
}

/* ====== 打印样式 ====== */
@media print {
  /* 1) 隐藏 ToolPage 的导航和标题元素 */
  .tool-page > .nav-btn,
  .tool-page > .page-title {
    display: none !important;
  }

  /* 2) tool-content 不再 display:none，而是去掉装饰样式（内容保留可见） */
  .tool-page > .tool-content {
    background: none !important;
    border: none !important;
    border-radius: 0 !important;
    padding: 0 !important;
    max-width: none !important;
  }

  /* 3) 隐藏座次表工具内的操作面板和名单预览 */
  .seat-arrangement > .control-panel,
  .seat-arrangement > .name-preview,
  .seat-arrangement > .empty-state {
    display: none !important;
  }

  /* 3) 让 seat-arrangement 容器去掉约束 */
  .seat-arrangement {
    max-width: none !important;
    margin: 0 !important;
    padding: 0 !important;
  }

  /* 4) ToolPage 也去掉约束 */
  .tool-page {
    max-width: none !important;
    padding: 0 !important;
    margin: 0 !important;
  }

  /* 5) 打印区域铺满 */
  #seat-table-print-area {
    position: absolute !important;
    top: 0 !important;
    left: 0 !important;
    width: 100% !important;
  }

  /* 6) A4 页面样式 */
  #seat-table-print-area .page-a4 {
    box-shadow: none !important;
    margin: 0 !important;
    padding: 8mm 10mm !important;
    width: 100% !important;
    min-height: auto !important;
    height: auto !important;
  }

  #seat-table-print-area .table-title {
    font-size: 22pt !important;
    margin-bottom: 12pt !important;
  }

  #seat-table-print-area .seat-grid {
    gap: 5pt !important;
  }

  #seat-table-print-area .seat-card {
    border-width: 1.2pt !important;
    grid-template-columns: 58pt 1fr !important;
    page-break-inside: avoid !important;
  }

  #seat-table-print-area .sc-label {
    font-size: 13pt !important;
    padding-left: 10pt !important;
    padding-top: 7pt !important;
    padding-bottom: 7pt !important;
    border-right-width: 1.2pt !important;
    border-bottom-width: 1.2pt !important;
  }

  #seat-table-print-area .sc-val {
    font-size: 16pt !important;
    padding: 8pt 12pt !important;
    border-bottom-width: 1.2pt !important;
  }

  #seat-table-print-area .sc-label-name,
  #seat-table-print-area .sc-val-name {
    border-bottom: none !important;
  }

  @page {
    size: A4 portrait;
    margin: 6mm;
  }
}
</style>
