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
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 10px;
  font-family: 'Fira Code', monospace;
  font-size: 13px;
  resize: vertical;
  box-sizing: border-box;
  background: #f8fafc;
}
.btn-row {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}
.btn {
  padding: 6px 14px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  background: white;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.15s;
}
.btn:hover {
  border-color: #6366f1;
  color: #6366f1;
}
.btn-primary {
  background: #6366f1;
  color: white;
  border-color: #6366f1;
}
.btn-primary:hover {
  background: #4f46e5;
  color: white;
}
.json-output {
  margin-top: 10px;
  background: #1e293b;
  color: #e2e8f0;
  padding: 12px;
  border-radius: 8px;
  overflow-x: auto;
  font-size: 12px;
  max-height: 200px;
  overflow-y: auto;
}
.error {
  color: #ef4444;
  font-size: 13px;
  margin-top: 8px;
}
</style>
