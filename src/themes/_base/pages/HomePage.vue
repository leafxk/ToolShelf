<template>
  <div class="home-page">
    <!-- 顶部导航 -->
    <header class="top-bar">
      <div class="brand">
        <span class="brand-icon">🛠️</span>
        <h1>ToolShelf</h1>
      </div>
      <span class="tool-count">共 {{ tools.length }} 个工具</span>
    </header>

    <!-- 搜索栏 -->
    <div class="search-bar">
      <span class="search-icon">🔍</span>
      <input
        v-model="searchQuery"
        type="text"
        placeholder="搜索工具名称、描述或标签..."
        class="search-input"
        @input="onSearch"
      />
      <button v-if="searchQuery" class="clear-btn" @click="searchQuery = ''">
        ✕
      </button>
    </div>

    <!-- 分类过滤标签（搜索时隐藏） -->
    <div class="category-tabs" v-if="categories.length > 1 && !searchQuery">
      <button
        v-for="cat in categories"
        :key="cat"
        :class="['tab', { active: activeCategory === cat }]"
        @click="activeCategory = cat"
      >
        {{ cat }}
      </button>
    </div>

    <!-- 搜索结果提示 -->
    <div v-if="searchQuery" class="search-hint">
      搜索 "{{ searchQuery }}" → 找到 {{ filteredTools.length }} 个结果
    </div>

    <!-- 工具卡片网格 -->
    <div class="tool-list">
      <ToolCard v-for="tool in filteredTools" :key="tool.id" :tool="tool" />
    </div>

    <!-- 空状态 -->
    <div v-if="filteredTools.length === 0" class="empty-state">
      <p v-if="searchQuery">未找到匹配 "{{ searchQuery }}" 的工具</p>
      <p v-else>该分类下暂无工具</p>
      <p class="hint">在 src/tools/ 下新建 .ts 文件即可添加工具 ✨</p>
    </div>

    <!-- 底部 -->
    <footer class="footer">
      <p>📦 新增工具 = 新建一个文件，零改动其他代码</p>
    </footer>
  </div>
</template>

<script setup>
import { computed, ref, shallowRef, getCurrentInstance, onMounted } from "vue";
import defaultToolCard from "../../../components/ToolCard.vue";

// 自动提取所有分类
const app = getCurrentInstance();
const tools = computed(() => {
  return app?.appContext.config.globalProperties.$tools || [];
});

// 从主题注册表获取 ToolCard
const ToolCard = shallowRef(defaultToolCard);

onMounted(async () => {
  const themeComponents =
    app?.appContext.config.globalProperties.$themeComponents || {};
  if (themeComponents.ToolCard) {
    const module = await themeComponents.ToolCard();
    ToolCard.value = module.default || module;
  }
});

const categories = computed(() => {
  const cats = [...new Set(tools.value.map((t) => t.category).filter(Boolean))];
  return ["全部", ...cats];
});

const activeCategory = ref("全部");
const searchQuery = ref("");

/** 搜索过滤：匹配名称、描述、标签 */
const filteredTools = computed(() => {
  let list = tools.value;

  // 分类过滤
  if (activeCategory.value !== "全部" && !searchQuery.value) {
    list = list.filter((t) => t.category === activeCategory.value);
  }

  // 搜索关键词
  const q = searchQuery.value.trim().toLowerCase();
  if (q) {
    list = list.filter((t) => {
      return (
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        (t.tags && t.tags.some((tag) => tag.toLowerCase().includes(q))) ||
        (t.category && t.category.toLowerCase().includes(q))
      );
    });
  }

  return list;
});

function onSearch() {
  // 搜索时自动切换到"全部"分类以显示所有匹配结果
  if (searchQuery.value) {
    activeCategory.value = "全部";
  }
}
</script>

<style scoped>
.home-page {
  max-width: 960px;
  margin: 0 auto;
  padding: 24px 16px;
  /* 新增：使用 Flex 布局实现 Sticky Footer */
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.brand {
  display: flex;
  align-items: center;
  gap: 12px;
}
.brand-icon {
  font-size: 28px;
}
.brand h1 {
  font-size: 24px;
  font-weight: 700;
  background: linear-gradient(135deg, var(--color-primary), #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0;
}
.tool-count {
  font-size: 13px;
  color: var(--color-text-muted);
  background: var(--color-bg-secondary);
  padding: 4px 12px;
  border-radius: 20px;
}

/* 搜索栏 */
.search-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  background: var(--color-bg-input);
  border: 1px solid var(--color-border);
  border-radius: var(--layout-border-radius);
  padding: 10px 16px;
  margin-bottom: 20px;
  transition: var(--layout-transition);
}
.search-bar:focus-within {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.08);
}
.search-icon {
  font-size: 16px;
  flex-shrink: 0;
}
.search-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 14px;
  color: var(--color-text-primary);
  background: transparent;
}
.search-input::placeholder {
  color: var(--color-text-muted);
}
.clear-btn {
  flex-shrink: 0;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: none;
  background: var(--color-bg-secondary);
  color: var(--color-text-muted);
  cursor: pointer;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--layout-transition);
}
.clear-btn:hover {
  background: var(--color-border);
  color: var(--color-text-secondary);
}

.search-hint {
  font-size: 13px;
  color: var(--color-text-secondary);
  margin-bottom: 16px;
}

.category-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}
.tab {
  padding: 6px 16px;
  border: 1px solid var(--color-border);
  border-radius: 20px;
  background: var(--color-bg-card);
  cursor: pointer;
  font-size: 13px;
  transition: var(--layout-transition);
}
.tab:hover {
  border-color: var(--color-primary-light);
}
.tab.active {
  background: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}
.tool-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
  align-items: start;
}
.tool-list {
  display: flex;
  flex-direction: column;
  max-width: var(--layout-container-max-width);
  /* 新增：让工具列表占据剩余空间，将 footer 推到底部 */
  flex: 1;
}
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: var(--color-text-muted);
  /* 新增：让空状态页也占据剩余空间，确保 footer 在底部 */
  flex: 1;
}
.empty-state .hint {
  font-size: 13px;
  margin-top: 8px;
}
.footer {
  text-align: center;
  margin-top: 48px;
  padding-top: 24px;
  border-top: 1px solid var(--color-border-light);
  color: var(--color-text-muted);
  font-size: 13px;
}

@media (max-width: 640px) {
  .tool-grid {
    grid-template-columns: 1fr;
  }
}
</style>
