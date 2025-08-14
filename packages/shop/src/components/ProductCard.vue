<template>
  <div class="product-card">
    <router-link :to="'/product/' + product.id" class="product-link">
      <img :src="product.image" :alt="product.name" class="product-image" />
      <div class="product-info">
        <h3 class="product-name">{{ product.name }}</h3>
        <p class="product-description">{{ product.description }}</p>
        <p class="product-price">¥{{ product.price }}</p>
      </div>
    </router-link>
    <tiny-button type="danger" @click="addToCart" class="add-to-cart-btn">
      加入购物车
    </tiny-button>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import { useStore } from '../store';
import type { Product } from '../types';
import { TinyButton, Modal } from '@opentiny/vue';

const props = defineProps<{
  product: Product;
}>();

const store = useStore();

const addToCart = () => {
  store.addToCart(props.product);
  Modal.message({ message: '已添加到购物车', status: 'success' });
};
</script>

<style scoped lang="less">
@import '../styles/variables.less';

.product-card {
  background: #fff;
  border-radius: @border-radius;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: scale(1.05);
  }
}

.product-link {
  text-decoration: none;
  color: inherit;
  flex: 1;
}

.product-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.product-info {
  padding: @spacing-medium;
}

.product-name {
  margin: 0 0 @spacing-small;
  font-size: @font-size-lg;
  color: @text-color;
}

.product-description {
  margin: 0 0 @spacing-small;
  font-size: @font-size-base;
  color: @text-color-secondary;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.product-price {
  margin: 0;
  font-size: @font-size-lg;
  color: @danger-color;
  font-weight: bold;
}

.add-to-cart-btn {
  margin: @spacing-small;
}

@media (max-width: @screen-sm) {
  .product-image {
    height: 150px;
  }

  .product-info {
    padding: @spacing-small;
  }

  .product-name {
    font-size: @font-size-base;
  }

  .product-description {
    font-size: @font-size-sm;
  }

  .product-price {
    font-size: @font-size-base;
  }
}
</style>
