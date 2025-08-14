<template>
  <div class="home">
    <tiny-carousel :interval="4000" type="card" class="banner" autoplay>
      <tiny-carousel-item v-for="item in bannerItems" :key="item.id">
        <img :src="item.image" :alt="item.title" class="banner-image" />
        <div class="banner-content">
          <h2>{{ item.title }}</h2>
          <p>{{ item.description }}</p>
        </div>
      </tiny-carousel-item>
    </tiny-carousel>

    <div class="container">
      <h2 class="section-title">热门商品</h2>

      <tiny-alert
        v-if="error"
        :title="error"
        type="error"
        :closable="false"
        show-icon
        class="mb-4"
      />

      <div v-if="loading" class="loading-state">
        <tiny-skeleton :rows="3" animated />
      </div>

      <div v-else-if="products.length" class="products-grid">
        <ProductCard
          v-for="product in products"
          :key="product.id"
          :product="product"
        />
      </div>
      <div v-else class="empty-cart">暂无商品</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import ProductCard from '../components/ProductCard.vue';
import { useStore } from '../store';
import {
  TinyCarousel,
  TinyCarouselItem,
  TinySkeleton,
  TinyAlert,
} from '@opentiny/vue';

const store = useStore();
const products = computed(() => store.products);
const loading = computed(() => store.loading);
const error = computed(() => store.error);

// 组件挂载时获取商品数据
onMounted(() => {
  store.fetchProducts();
});

const bannerItems = [
  {
    id: 1,
    title: '新品上市',
    description: '发现最新科技产品',
    image: 'https://picsum.photos/600/300',
  },
  {
    id: 2,
    title: '限时特惠',
    description: '精选商品低至5折',
    image: 'https://picsum.photos/600/301',
  },
  {
    id: 3,
    title: '品质保证',
    description: '正品行货 假一赔十',
    image: 'https://picsum.photos/600/302',
  },
];
</script>

<style scoped lang="less">
@import '../styles/variables.less';

.home {
  padding-top: 70px;
  max-width: 1200px;
  margin: 0 auto;
}

.banner-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.banner-content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: @spacing-medium;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
  color: white;

  h2 {
    margin: 0 0 @spacing-small;
    font-size: 24px;
  }

  p {
    margin: 0;
    font-size: @font-size-base;
  }
}

.section-title {
  margin: 5px 0;
  text-align: center;
  font-size: 28px;
  color: #333;
}

:deep(button),
:deep(.tiny-button) {
  &:focus {
    outline: none !important;
    box-shadow: none !important;
  }
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: @spacing-medium;
  margin-bottom: 5px;
}

.loading-state {
  padding: @spacing-medium;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.mb-4 {
  margin-bottom: 16px;
}

@media (max-width: @screen-sm) {
  .home {
    padding-top: 50px;
  }

  :deep(.tiny-carousel__container) {
    height: 160px;
  }

  .section-title {
    font-size: 24px;
    margin: @spacing-medium 0;
  }

  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: @spacing-small;
  }

  .banner-content {
    h2 {
      font-size: 20px;
    }

    p {
      font-size: @font-size-sm;
    }
  }
}
</style>
