import { defineStore } from 'pinia';
import type { Product, CartItem } from '../types';

// 后端API基础URL
const API_BASE_URL = '/api';

interface State {
  products: Product[];
  cart: CartItem[];
  loading: boolean;
  error: string | null;
}

export const useStore = defineStore('main', {
  state: (): State => ({
    products: [],
    cart: [],
    loading: false,
    error: null
  }),

  actions: {
    // 获取商品列表
    async fetchProducts() {
      this.loading = true;
      this.error = null;
      try {
        const response = await fetch(`${API_BASE_URL}/products`);
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const result = await response.json();
        if (result.success) {
          this.products = result.data;
        } else {
          throw new Error(result.message || 'Failed to fetch products');
        }
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Unknown error';
        // 如果API请求失败，使用默认数据
        this.products = [
          {
            id: 1,
            name: 'iPhone 13',
            price: 5999,
            description: '最新款iPhone手机',
            image: 'https://picsum.photos/300/300',
            category: 'phones'
          },
          {
            id: 2,
            name: 'MacBook Pro',
            price: 12999,
            description: '专业级笔记本电脑',
            image: 'https://picsum.photos/300/300',
            category: 'laptops'
          }
        ];
      } finally {
        this.loading = false;
      }
    },

    // 创建商品
    async createProduct(product: Omit<Product, 'id'>) {
      try {
        const response = await fetch(`${API_BASE_URL}/products`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(product)
        });

        if (!response.ok) {
          throw new Error('Failed to create product');
        }

        const result = await response.json();
        if (!result.success) {
          throw new Error(result.message || 'Failed to create product');
        }

        return result.data;
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Unknown error';
        throw error;
      }
    },

    // 更新商品
    async updateProduct(product: Product) {
      try {
        const response = await fetch(`${API_BASE_URL}/products/${product.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(product)
        });

        if (!response.ok) {
          throw new Error('Failed to update product');
        }

        const result = await response.json();
        if (!result.success) {
          throw new Error(result.message || 'Failed to update product');
        }

        return result.data;
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Unknown error';
        throw error;
      }
    },

    // 购物车相关操作
    addToCart(product: Product) {
      const existingItem = this.cart.find(
        (item) => item.product.id === product.id
      );
      if (existingItem) {
        existingItem.quantity++;
      } else {
        this.cart.push({ product, quantity: 1 });
      }
    },

    removeFromCart(productId: number) {
      const index = this.cart.findIndex(
        (item) => item.product.id === productId
      );
      if (index > -1) {
        this.cart.splice(index, 1);
      }
    },

    updateCartItemQuantity(productId: number, quantity: number) {
      const item = this.cart.find((item) => item.product.id === productId);
      if (item) {
        item.quantity = quantity;
      }
    }
  },

  getters: {
    cartTotal(): number {
      return this.cart.reduce((total, item) => {
        return total + item.product.price * item.quantity;
      }, 0);
    },

    cartItemCount(): number {
      return this.cart.reduce((count, item) => count + item.quantity, 0);
    }
  }
});
