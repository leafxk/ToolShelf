<template>
  <div class="json-formatter-inline">
    <textarea
      v-model="input"
      placeholder="粘贴 JSON 这里..."
      rows="4"
      class="json-input"
    ></textarea>
    <div class="btn-row">
      <button @click="format" class="btn btn-primary">✨ 格式化</button>
      <button @click="compress" class="btn">📦 压缩</button>
      <button @click="copy" class="btn">📋 复制</button>
    </div>
    <pre v-if="output" class="json-output"><code>{{ output }}</code></pre>
    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const input = ref('')
const output = ref('')
const error = ref('')

function format() {
  error.value = ''
  try {
    const obj = JSON.parse(input.value)
    output.value = JSON.stringify(obj, null, 2)
  } catch (e) {
    error.value = '❌ JSON 格式有误：' + e.message
    output.value = ''
  }
}

function compress() {
  error.value = ''
  try {
    const obj = JSON.parse(input.value)
    output.value = JSON.stringify(obj)
  } catch (e) {
    error.value = '❌ JSON 格式有误：' + e.message
    output.value = ''
  }
}

async function copy() {
  if (!output.value) return
  await navigator.clipboard.writeText(output.value)
}
</script>

<style scoped>
.json-formatter-inline {
  padding: 12px;
}
.json-input {
  width: 100%;
  border: 1px solid var(--color-border);
  border-radius: var(--layout-border-radius);
  padding: 10px;
  font-family: 'Fira Code', monospace;
  font-size: 13px;
  resize: vertical;
  box-sizing: border-box;
  background: var(--color-bg-input);
  color: var(--color-text-primary);
}
.btn-row {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}
.btn {
  padding: 6px 14px;
  border: 1px solid var(--color-border);
  border-radius: var(--layout-border-radius);
  background: var(--color-bg-card);
  cursor: pointer;
  font-size: 13px;
  transition: all 0.15s;
  color: var(--color-text-secondary);
}
.btn:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}
.btn-primary {
  background: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}
.btn-primary:hover {
  background: var(--color-primary-hover);
  color: white;
}
.json-output {
  margin-top: 10px;
  background: var(--color-code-bg);
  color: var(--color-code-text);
  padding: 12px;
  border-radius: var(--layout-border-radius);
  overflow-x: auto;
  font-size: 12px;
  max-height: 200px;
  overflow-y: auto;
}
.error {
  color: var(--color-danger);
  font-size: 13px;
  margin-top: 8px;
}
</style>
