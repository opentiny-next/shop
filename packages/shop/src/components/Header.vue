<template>
  <header class="header">
    <div class="headers flex justify-between items-center">
      <router-link to="/" class="logo">
        <h1>电商商城</h1>
      </router-link>
      <nav class="nav">
        <router-link to="/" class="nav-item">首页</router-link>
        <router-link to="/products" class="nav-item">商品</router-link>
        <router-link to="/cart" class="nav-item cart-link">
          <tiny-badge
            :value="cartItemCount"
            :hidden="cartItemCount === 0"
            data="购物车"
          ></tiny-badge>
        </router-link>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useStore } from '../store';
import { TinyBadge } from '@opentiny/vue';

const store = useStore();
const cartItemCount = computed(() => store.cartItemCount);
</script>

<style scoped lang="less">
@import '../styles/variables.less';

.header {
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  height: 60px;
  display: flex;
  align-items: center;
  .headers {
    width: 100%;
    margin: 0 auto;
    padding: 0 16px;
  }
}

.logo {
  text-decoration: none;
  color: #333333;
  h1 {
    font-size: 24px;
    margin: 0;
  }
}

.nav {
  display: flex;
  gap: 20px;

  .nav-item {
    text-decoration: none;
    color: #333;
    font-size: @font-size-base;
    position: relative;
    padding: 5px 0;

    &:hover {
      color: @primary-color;
    }

    &.router-link-active {
      color: @primary-color;
      &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 2px;
        background-color: @primary-color;
      }
    }
  }
}

.cart-link {
  display: flex;
  align-items: center;
  gap: 5px;
}

@media (max-width: @screen-sm) {
  .header {
    height: 50px;
  }

  .logo h1 {
    font-size: 20px;
  }

  .nav {
    gap: 15px;
  }
}
</style>
