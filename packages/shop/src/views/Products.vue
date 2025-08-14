<template>
  <div class="products-page">
    <div class="container">
      <div class="filters">
        <tiny-search
          v-model="searchQuery"
          placeholder="搜索"
          clearable
          class="search-input"
        >
          <template #prefix>
            <tiny-icon-search />
          </template>
        </tiny-search>
        <tiny-select v-model="selectedCategory" placeholder="分类" clearable>
          <tiny-option
            v-for="category in categories"
            :key="category"
            :label="categoryLabels[category]"
            :value="category"
          />
        </tiny-select>
        <tiny-select v-model="sortBy" placeholder="排序方式" clearable>
          <tiny-option label="价格从低到高" value="price-asc" />
          <tiny-option label="价格从高到低" value="price-desc" />
        </tiny-select>
      </div>

      <tiny-alert
        v-if="error"
        :title="error"
        type="error"
        :closable="false"
        show-icon
      />

      <div v-if="loading" class="loading-state">
        <tiny-skeleton :rows="3" animated />
      </div>

      <div v-else-if="filteredProducts.length" class="products-grid">
        <ProductCard
          v-for="product in filteredProducts"
          :key="product.id"
          :product="product"
        />
      </div>
      <div v-else class="empty-cart">暂无商品</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import ProductCard from '../components/ProductCard.vue';
import { useStore } from '../store';
import type { Product } from '../types';
import {
  TinySearch,
  TinySelect,
  TinyOption,
  TinyAlert,
  TinySkeleton,
} from '@opentiny/vue';
import { IconSearch } from '@opentiny/vue-icon';
const TinyIconSearch = IconSearch();

const store = useStore();
const searchQuery = ref('');
const selectedCategory = ref('');
const sortBy = ref('price-asc');

const products = computed(() => store.products || []);
const loading = computed(() => store.loading);
const error = computed(() => store.error);

// 初始化时获取商品数据
store.fetchProducts();

const categories = computed(() => {
  if (!products.value || !products.value.length) return [];
  const categorySet = new Set(products.value.map((p: Product) => p.category));
  return Array.from(categorySet);
});

const categoryLabels: Record<string, string> = {
  phones: '手机',
  laptops: '笔记本',
  tablets: '平板',
};

const filteredProducts = computed(() => {
  let result = [...products.value];

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query),
    );
  }

  if (selectedCategory.value) {
    result = result.filter((p) => p.category === selectedCategory.value);
  }

  if (sortBy.value === 'price-asc') {
    result.sort((a, b) => a.price - b.price);
  } else if (sortBy.value === 'price-desc') {
    result.sort((a, b) => b.price - a.price);
  }

  return result;
});
</script>

<style scoped lang="less">
@import '../styles/variables.less';

.products-page {
  padding-top: 16px;
  top: 60px;
  position: absolute;
  width: -webkit-fill-available;
  bottom: 20px;
  overflow: scroll;
  overflow-x: hidden;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 @spacing-medium;
}

.filters {
  display: flex;
  gap: @spacing-medium;
  margin-bottom: @spacing-large;
  align-items: center;
}

.loading-state {
  padding: @spacing-large;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: @spacing-medium;
}
:deep(.tiny-search) {
  .tiny-search__input-btn.tiny-icon-close a:after {
    opacity: 0;
  }
}
// 移除按钮点击时的黑色边框
:deep(button),
:deep(.tiny-button) {
  &:focus {
    outline: none !important;
    box-shadow: none !important;
  }
}

@media (max-width: @screen-sm) {
  .filters {
    .search-input {
      width: 100%;
    }
  }

  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: @spacing-small;
  }
}
</style>
