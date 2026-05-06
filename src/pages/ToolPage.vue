<template>
  <div class="tool-page">
    <!-- 固定定位导航按钮（不占文档流空间） -->

    <!-- 右上角：关闭页面（新标签页模式） -->
    <button
      v-if="isNewTabMode"
      class="nav-btn close-btn"
      @click="closePage"
      title="关闭页面"
    >
      x
    </button>

    <!-- 左上角：返回主页（非新标签页模式时显示） -->
    <router-link v-else to="/" class="nav-btn back-btn" title="返回主页"
      >🔙返回主页</router-link
    >

    <!-- 页面标题（紧凑居中） -->
    <h2 v-if="currentTool" class="page-title">
      {{ currentTool.icon }} {{ currentTool.name }}
    </h2>

    <!-- 工具内容区 -->
    <div class="tool-content" v-if="currentTool">
      <component v-if="currentTool.component" :is="currentTool.component" />
      <component
        v-else-if="currentTool.inlineComponent"
        :is="currentTool.inlineComponent"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getCurrentInstance } from "vue";

const route = useRoute();
const router = useRouter();
const app = getCurrentInstance();
const tools = app.appContext.config.globalProperties.$tools || [];

const currentTool = computed(() => {
  return tools.find((t) => t.id === route.meta.toolId);
});

/**
 * 判断是否为新标签页模式
 * 仅通过 URL query ?mode=newtab 判断
 * - openInNewTab() 会带上此参数 → 显示 ✕ 关闭
 * - router.push() 不会带此参数 → 显示 ← 返回主页
 */
const isNewTabMode = computed(() => {
  return route.query.mode === "newtab";
});

function closePage() {
  window.close();
  setTimeout(() => {
    router.push("/");
  }, 100);
}
</script>

<style scoped>
.tool-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px 16px;
  position: relative;
}

/* 统一悬浮导航按钮 */
.nav-btn {
  position: fixed;
  top: 16px;
  z-index: 100;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s;
  text-decoration: none;
}

/* 左上角：返回 */
.back-btn {
  left: 16px;
  background: white;
  color: #6366f1;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  border: 1px solid #e2e8f0;
  width: 100px;
}
.back-btn:hover {
  background: #eef2ff;
  border-color: #a5b4fc;
}

/* 右上角：关闭 */
.close-btn {
  right: 16px;
  background: #fef2f2;
  color: #dc2626;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  border: 1px solid #fecaca;
}
.close-btn:hover {
  background: #fee2e2;
  border-color: #fca5a5;
}

/* 页面标题 - 紧凑，只占一行文字 */
.page-title {
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
  margin: 4px 0 16px 0;
  text-align: center;
}
.tool-content {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 24px;
}
</style>
