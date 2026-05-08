<template>
  <div class="tool-card" :class="{ 'has-inline': tool.inlineComponent }">
    <!-- 卡片头部 -->
    <div class="card-header" @click="handleClick">
      <span class="card-icon">{{ tool.icon }}</span>
      <div class="card-info">
        <h3>{{ tool.name }}</h3>
        <p class="desc">{{ tool.description }}</p>
      </div>
      <!-- 右侧箭头：仅页面跳转模式显示 -->
      <span v-if="mode === 'page'" class="arrow">→</span>
      <!-- 外链图标 -->
      <span v-else-if="mode === 'external'" class="arrow">↗</span>
    </div>

    <!-- 标签 -->
    <div class="tags" v-if="tool.tags?.length">
      <span v-for="tag in tool.tags" :key="tag" class="tag">{{ tag }}</span>
    </div>

    <!-- 内嵌组件：在卡片内展开/收起 -->
    <div v-if="tool.inlineComponent && showInline" class="inline-content">
      <component :is="tool.inlineComponent" />
    </div>

    <!-- 底部操作栏：根据模式显示不同按钮 -->
    <div class="actions" v-if="hasActions" :class="{ 'single-btn': actionBtnCount === 1 }">

      <!-- 模式1: 内嵌 → 展开/收起 -->
      <button
        v-if="tool.inlineComponent"
        class="action-btn primary"
        @click="showInline = !showInline"
      >
        {{ showInline ? '收起 ▲' : '展开使用 ▼' }}
      </button>

      <!-- 模式2: 页面跳转 → 打开按钮（component 模式 或 newtab 模式都显示） -->
      <button
        v-if="showPageBtn"
        class="action-btn"
        @click.stop="goToPage"
      >
        📄 打开
      </button>

      <!-- 模式3: 新标签页 → 新窗口打开（仅 newtab: true 时显示） -->
      <button
        v-if="tool.newtab === true"
        class="action-btn newtab"
        @click.stop="openInNewTab"
      >
        🔲 新标签页打开
      </button>

      <!-- 模式4: 外链 → 访问链接 -->
      <button
        v-if="mode === 'external'"
        class="action-btn external"
        @click.stop="visitExternal"
      >
        🌐 访问链接
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  tool: { type: Object, required: true },
})

const router = useRouter()
const showInline = ref(false)

/**
 * 判断工具的主要交互模式（优先级从高到低）
 * - external: 纯外链
 * - page:   有 component，点击跳转页面
 * - newtab: 标记了 newtab: true，新标签页打开
 * - inline: 有 inlineComponent，默认内嵌
 */
const mode = computed(() => {
  const t = props.tool
  if (t.externalUrl && !t.component && !t.inlineComponent) return 'external'
  if (t.component && !t.newtab) return 'page'
  if (t.newtab) return 'newtab'
  return 'inline'
})

const hasActions = computed(() => {
  const t = props.tool
  return !!(t.inlineComponent || t.component || t.externalUrl || t.newtab)
})

/** 当前卡片显示的按钮数量（用于单按钮时占满宽度） */
const actionBtnCount = computed(() => {
  const t = props.tool
  let count = 0
  if (t.inlineComponent) count++
  if (showPageBtn.value) count++
  if (t.newtab === true) count++
  if (mode.value === 'external') count++
  return count
})

/** 是否显示"打开"按钮：有 component 的工具都可以页面内跳转 */
const showPageBtn = computed(() => {
  return !!props.tool.component
})

function handleClick() {
  const m = mode.value
  if (m === 'external') {
    visitExternal()
  } else if (m === 'page') {
    goToPage()
  } else if (m === 'newtab') {
    openInNewTab()
  }
  // inline 模式不处理点击
}

function goToPage() {
  router.push(`/tool/${props.tool.id}`)
}

function openInNewTab() {
  const url = router.resolve({
    path: `/tool/${props.tool.id}`,
    query: { mode: 'newtab' },
  }).href
  window.open(url, '_blank')
}

function visitExternal() {
  window.open(props.tool.externalUrl, '_blank')
}
</script>

<style scoped>
.tool-card {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--layout-border-radius);
  padding: var(--layout-card-padding);
  transition: var(--layout-transition);
  cursor: default;
}
.tool-card:hover {
  border-color: var(--color-primary-light);
  box-shadow: var(--layout-shadow-hover);
}
.tool-card.has-inline { cursor: default; }

.card-header {
  display: flex;
  align-items: flex-start;
  gap: 14px;
  cursor: pointer;
}
.card-icon {
  font-size: 28px;
  flex-shrink: 0;
  margin-top: 2px;
}
.card-info { flex: 1; min-width: 0; }
.card-info h3 {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0 0 4px 0;
}
.desc {
  font-size: 13px;
  color: var(--color-text-secondary);
  margin: 0;
  line-height: 1.5;
}
.arrow {
  color: var(--color-primary-light);
  font-size: 18px;
  flex-shrink: 0;
  margin-top: 4px;
  transition: transform 0.15s;
}
.tool-card:hover .arrow {
  transform: translateX(4px);
  color: var(--color-primary);
}

.tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-top: 12px;
}
.tag {
  font-size: 11px;
  padding: 2px 8px;
  background: var(--color-bg-secondary);
  color: var(--color-text-secondary);
  border-radius: 10px;
}

.inline-content {
  margin-top: 14px;
  border-top: 1px dashed var(--color-border);
  padding-top: 12px;
}

.actions {
  display: flex;
  gap: 8px;
  margin-top: 12px;
  flex-wrap: wrap;
}
.actions.single-btn .action-btn {
  flex: 1;
  text-align: center;
}
.action-btn {
  padding: 8px 16px;
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: var(--layout-border-radius);
  cursor: pointer;
  font-size: 13px;
  color: var(--color-text-secondary);
  transition: var(--layout-transition);
}
.action-btn:hover {
  border-color: var(--color-primary-light);
  color: var(--color-primary);
  background: var(--color-bg-primary);
}
.action-btn.primary {
  background: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}
.action-btn.primary:hover {
  background: var(--color-primary-hover);
  color: white;
  border-color: var(--color-primary-hover);
}
.action-btn.newtab:hover {
  background: #fef3c7;
  border-color: var(--color-warning);
  color: #b45309;
}
.action-btn.external:hover {
  background: #ecfdf5;
  border-color: var(--color-success);
  color: #047857;
}
</style>
