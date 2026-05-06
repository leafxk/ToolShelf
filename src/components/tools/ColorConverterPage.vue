<template>
  <div class="color-converter-page">
    <h2>🎨 颜色转换器</h2>
    <p class="desc">在任意输入框输入颜色值，自动转换所有格式</p>

    <div class="preview-row">
      <div class="color-preview" :style="{ background: activeColor }"></div>
      <span class="color-text">{{ activeColor }}</span>
    </div>

    <div class="input-grid">
      <div class="field">
        <label>HEX</label>
        <input v-model="hex" @input="fromHex" placeholder="#6366f1" />
      </div>
      <div class="field">
        <label>RGB</label>
        <input v-model="rgb" @input="fromRgb" placeholder="rgb(99, 102, 241)" />
      </div>
      <div class="field">
        <label>HSL</label>
        <input v-model="hsl" @input="fromHsl" placeholder="hsl(239, 84%, 67%)" />
      </div>
    </div>

    <button @click="copyAll" class="copy-btn">📋 复制全部格式</button>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const hex = ref('#6366f1')
const rgb = ref('rgb(99, 102, 241)')
const hsl = ref('hsl(239, 84%, 67%)')

const activeColor = computed(() => hex.value || '#888')

function fromHex() {
  const h = hex.value.trim()
  if (!/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(h)) return
  const result = /^#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(h)
  if (!result) return
  const r = parseInt(result[1], 16)
  const g = parseInt(result[2], 16)
  const b = parseInt(result[3], 16)
  rgb.value = `rgb(${r}, ${g}, ${b})`
  const [hh, ss, ll] = rgbToHsl(r, g, b)
  hsl.value = `hsl(${hh}, ${ss}%, ${ll}%)`
}

function fromRgb() {
  const m = rgb.value.match(/(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/)
  if (!m) return
  const [, r, g, b] = m.map(Number)
  hex.value = '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('')
  const [hh, ss, ll] = rgbToHsl(r, g, b)
  hsl.value = `hsl(${hh}, ${ss}%, ${ll}%)`
}

function fromHsl() {
  const m = hsl.value.match(/(\d+)\s*,\s*(\d+)%?\s*,\s*(\d+)%?/)
  if (!m) return
  const [, h, s, l] = m.map(Number)
  const [r, g, b] = hslToRgb(h, s, l)
  hex.value = '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('')
  rgb.value = `rgb(${r}, ${g}, ${b})`
}

function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  let h = 0, s = 0
  const l = (max + min) / 2
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break
      case g: h = ((b - r) / d + 2) / 6; break
      case b: h = ((r - g) / d + 4) / 6; break
    }
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)]
}

function hslToRgb(h, s, l) {
  s /= 100; l /= 100
  const k = n => (n + h / 30) % 12
  const a = s * Math.min(l, 1 - l)
  const f = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))
  return [Math.round(f(0) * 255), Math.round(f(8) * 255), Math.round(f(4) * 255)]
}

async function copyAll() {
  const text = `HEX: ${hex.value}\nRGB: ${rgb.value}\nHSL: ${hsl.value}`
  await navigator.clipboard.writeText(text)
}
</script>

<style scoped>
.color-converter-page {
  max-width: 600px;
  margin: 0 auto;
  padding: 24px;
}
h2 { margin-bottom: 4px; }
.desc { color: #64748b; font-size: 14px; margin-bottom: 24px; }
.preview-row {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}
.color-preview {
  width: 64px;
  height: 64px;
  border-radius: 12px;
  border: 2px solid #e2e8f0;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
.color-text { font-family: monospace; font-size: 18px; font-weight: 600; }
.input-grid {
  display: grid;
  gap: 16px;
  margin-bottom: 20px;
}
.field label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #475569;
  margin-bottom: 6px;
}
.field input {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-family: monospace;
  font-size: 15px;
  box-sizing: border-box;
  transition: border-color 0.15s;
}
.field input:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
}
.copy-btn {
  width: 100%;
  padding: 12px;
  background: #6366f1;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 15px;
  transition: background 0.15s;
}
.copy-btn:hover { background: #4f46e5; }
</style>
