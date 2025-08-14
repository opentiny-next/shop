<template>
  <div class="product-detail">
    <div class="container">
      <div class="product-content" v-if="product">
        <div class="product-gallery">
          <tiny-image
            :src="product.image"
            :alt="product.name"
            fit="cover"
            :preview-src-list="[product.image]"
          />
        </div>
        <div class="product-info">
          <h1 class="product-name">{{ product.name }}</h1>
          <div class="product-price">¥{{ product.price }}</div>
          <div class="product-description">{{ product.description }}</div>

          <div class="product-actions">
            <tiny-numeric v-model="quantity" :min="1" :max="99" size="medium" />
            <tiny-button
              type="danger"
              size="medium"
              @click="addToCart"
              class="add-to-cart-btn"
            >
              加入购物车
            </tiny-button>
          </div>

          <div class="product-details">
            <h3>商品详情</h3>

            <div class="detail-list">
              <div class="detail-item">
                <div class="detail-item-label">商品分类</div>
                <div class="detail-item-value">
                  {{ categoryLabels[product.category] }}
                </div>
              </div>
              <div class="detail-item">
                <div class="detail-item-label">商品编号</div>
                <div class="detail-item-value">{{ product.id }}</div>
              </div>
              <div class="detail-item">
                <div class="detail-item-label">配送说明</div>
                <div class="detail-item-value">全国包邮</div>
              </div>
              <div class="detail-item">
                <div class="detail-item-label">售后服务</div>
                <div class="detail-item-value">7天无理由退换</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="empty-cart">商品不存在</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from '../store';
import { ElMessage } from 'element-plus';
import { TinyImage, TinyNumeric, TinyButton } from '@opentiny/vue';

const route = useRoute();
const store = useStore();
const quantity = ref(1);

const product = computed(() => {
  const productId = Number(route.params.id);
  return store.products.find((p) => p.id === productId);
});

const categoryLabels: Record<string, string> = {
  phones: '手机',
  laptops: '笔记本',
  tablets: '平板',
};

const addToCart = () => {
  if (product.value) {
    for (let i = 0; i < quantity.value; i++) {
      store.addToCart(product.value);
    }
    ElMessage.success(`已将 ${quantity.value} 件商品添加到购物车`);
  }
};
</script>

<style scoped lang="less">
@import '../styles/variables.less';

.product-detail {
  padding: 80px 0;
}

.product-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: @spacing-large;
  background: #fff;
  border-radius: @border-radius;
  padding: @spacing-large;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.product-gallery {
  .el-image {
    width: 100%;
    height: 400px;
    border-radius: @border-radius;
  }
}

.product-info {
  display: flex;
  flex-direction: column;
  gap: @spacing-medium;
}

.product-name {
  font-size: 28px;
  color: #333;
  margin: 0;
}

.product-price {
  font-size: 32px;
  color: @danger-color;
  font-weight: bold;
}

.product-description {
  font-size: @font-size-base;
  color: #666;
  line-height: 1.6;
}

:deep(button),
:deep(.tiny-button) {
  &:focus {
    outline: none !important;
    box-shadow: none !important;
  }
}

.product-actions {
  display: flex;
  gap: @spacing-medium;
  margin: @spacing-medium 0;

  .quantity-input {
    width: 150px;
  }

  .add-to-cart-btn {
    flex: 1;
  }
}

.product-details {
  margin-top: @spacing-medium;

  h3 {
    margin-bottom: @spacing-medium;
    font-size: @font-size-lg;
    color: #333;
  }

  .detail-list {
    display: flex;
    flex-direction: column;
  }

  .detail-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: @spacing-small;
    border-bottom: @border-width solid @border-color;

    .detail-item-label {
      font-weight: bold;
      width: 50%;
    }

    .detail-item-value {
      color: #666;
      width: 50%;
    }
  }
}

@media (max-width: @screen-md) {
  .product-content {
    grid-template-columns: 1fr;
  }

  .product-detail {
    padding: 60px 0;
  }

  .product-gallery {
    .el-image {
      height: 300px;
    }
  }

  .product-name {
    font-size: 24px;
  }

  .product-price {
    font-size: 28px;
  }

  .product-actions {
    .quantity-input {
      width: 100%;
    }
  }
}
</style>
