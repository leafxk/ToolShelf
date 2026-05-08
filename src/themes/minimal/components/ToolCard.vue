<template>
  <div class="tool-item">
    <div class="tool-main">
      <span class="tool-icon">{{ tool.icon }}</span>
      <div class="tool-info">
        <div class="tool-name-row">
          <span class="tool-name">{{ tool.name }}</span>
          <span class="tool-category" v-if="tool.category">{{ tool.category }}</span>
        </div>
        <p class="tool-desc">{{ tool.description }}</p>
      </div>
    </div>
    <a class="tool-link" :href="`#/tool/${tool.id}`">打开</a>
  </div>
</template>

<script setup>
defineProps({
  tool: { type: Object, required: true },
})
</script>

<style scoped>
.tool-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid var(--color-border);
}

.tool-item:last-child {
  border-bottom: none;
}

.tool-main {
  display: flex;
  gap: 16px;
  flex: 1;
  min-width: 0;
}

.tool-icon {
  font-size: 24px;
  flex-shrink: 0;
  line-height: 1;
}

.tool-info {
  flex: 1;
  min-width: 0;
}

.tool-name-row {
  display: flex;
  align-items: baseline;
  gap: 12px;
  margin-bottom: 4px;
}

.tool-name {
  font-size: 15px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.tool-category {
  font-size: 12px;
  color: var(--color-text-muted);
}

.tool-desc {
  font-size: 13px;
  color: var(--color-text-secondary);
  margin: 0;
  line-height: 1.5;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tool-link {
  flex-shrink: 0;
  font-size: 13px;
  color: var(--color-text-muted);
  text-decoration: none;
  padding: 6px 12px;
  margin-left: 16px;
}

.tool-link:hover {
  color: var(--color-primary);
}

@media (max-width: 640px) {
  .tool-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .tool-link {
    margin-left: 40px;
  }
  
  .tool-desc {
    white-space: normal;
  }
}
</style>
