<template>
  <div class="cart-page">
    <div class="container">
      <h2 class="page-title">购物车</h2>
      <div v-if="cartItems.length" class="cart-content">
        <div class="cart-items">
          <div
            v-for="item in cartItems"
            :key="item.product.id"
            class="cart-item"
          >
            <img
              :src="item.product.image"
              :alt="item.product.name"
              class="item-image"
            />
            <div class="item-info">
              <h3 class="item-name">{{ item.product.name }}</h3>
              <p class="item-price">¥{{ item.product.price }}</p>
            </div>
            <div class="item-quantity">
              <tiny-numeric
                v-model="item.quantity"
                :min="1"
                :max="99"
                @change="updateQuantity(item.product.id, $event)"
              />
            </div>
            <div class="item-total">
              <p>小计: ¥{{ item.product.price * item.quantity }}</p>
            </div>
            <tiny-button
              type="danger"
              :icon="TinyIconDel"
              circle
              @click="removeFromCart(item.product.id)"
            >
            </tiny-button>
          </div>
        </div>
        <div class="cart-summary card">
          <h3>订单摘要</h3>
          <div class="summary-item">
            <span>商品总数:</span>
            <span>{{ cartItemCount }}件</span>
          </div>
          <div class="summary-item">
            <span>总计:</span>
            <span class="total-price">¥{{ cartTotal }}</span>
          </div>
          <tiny-button type="danger" class="checkout-btn">结算</tiny-button>
        </div>
      </div>
      <div v-else class="empty-cart">购物车是空的</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useStore } from '../store';
import { TinyNumeric, TinyButton } from '@opentiny/vue';
import { IconDel } from '@opentiny/vue-icon';
const store = useStore();
const TinyIconDel = IconDel();
const cartItems = computed(() => store.cart);
const cartTotal = computed(() => store.cartTotal);
const cartItemCount = computed(() => store.cartItemCount);

const updateQuantity = (productId: number, quantity: number | undefined) => {
  if (quantity !== undefined) {
    store.updateCartItemQuantity(productId, quantity);
  }
};

const removeFromCart = (productId: number) => {
  store.removeFromCart(productId);
};
</script>

<style scoped lang="less">
@import '../styles/variables.less';
.cart-page {
  padding: 80px 0;
}

.page-title {
  margin-bottom: @spacing-large;
  font-size: @font-size-xl;
  color: @text-color;
}

.cart-content {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: @spacing-large;

  @media (max-width: @screen-sm) {
    grid-template-columns: 1fr;
  }
}
:deep(button),
:deep(.tiny-button) {
  &:focus {
    outline: none !important;
    box-shadow: none !important;
  }
}
.empty-cart {
  text-align: center;
  color: @text-color-secondary;
  font-size: @font-size-lg;
}

.cart-items {
  background: #fff;
  border-radius: @border-radius;
  box-shadow: @box-shadow;
  padding: @spacing-medium;
}

.cart-item {
  display: grid;
  grid-template-columns: 100px 1fr auto auto auto;
  gap: @spacing-medium;
  align-items: center;
  padding: @spacing-medium;
  border-bottom: 1px solid @border-color;

  &:last-child {
    border-bottom: none;
  }

  @media (max-width: @screen-sm) {
    grid-template-columns: 80px 1fr;
    grid-template-areas:
      'image info'
      'image quantity'
      'total actions';
    gap: @spacing-small;

    .item-image {
      grid-area: image;
    }

    .item-info {
      grid-area: info;
    }

    .item-quantity {
      grid-area: quantity;
    }

    .item-total {
      grid-area: total;
    }

    .remove-btn {
      grid-area: actions;
      justify-self: end;
    }
  }
}

.item-image {
  width: 100%;
  height: 100px;
  object-fit: cover;
  border-radius: @border-radius;
}

.item-info {
  .item-name {
    margin: 0 0 @spacing-small;
    font-size: @font-size-lg;
    color: @text-color;
  }

  .item-price {
    color: @text-color-secondary;
  }
}

.item-total {
  color: @primary-color;
  font-weight: bold;
}

.cart-summary {
  height: fit-content;

  h3 {
    margin-bottom: @spacing-medium;
    font-size: @font-size-lg;
    color: @text-color;
  }
}

.summary-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: @spacing-small;
  color: @text-color-secondary;

  &:last-of-type {
    margin-bottom: @spacing-medium;
    padding-top: @spacing-small;
    border-top: 1px solid @border-color;
    color: @text-color;
    font-weight: bold;

    .total-price {
      color: @primary-color;
      font-size: @font-size-lg;
    }
  }
}

.checkout-btn {
  width: 100%;
}

@media (max-width: @screen-sm) {
  .cart-page {
    padding: 60px 0;
  }

  .page-title {
    font-size: @font-size-lg;
    margin-bottom: @spacing-medium;
  }

  .cart-items {
    padding: @spacing-small;
  }

  .cart-item {
    padding: @spacing-small;
  }

  .item-image {
    height: 80px;
  }

  .item-name {
    font-size: @font-size-base;
  }
}
</style>
