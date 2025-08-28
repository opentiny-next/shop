<template>
  <div class="products-page">
    <!-- 添加/编辑商品弹窗 -->
    <tiny-dialog-box v-model:visible="dialogVisible" :title="dialogTitle" width="600px" @close="handleDialogClose">
      <tiny-form ref="productFormRef" :model="form" :rules="rules" class="form-card" label-width="100px">
        <tiny-form-item label="商品名称" prop="name">
          <tiny-input v-model="form.name" placeholder="请输入商品名称" />
        </tiny-form-item>

        <tiny-form-item label="商品价格" prop="price">
          <tiny-numeric v-model="form.price" :min="0" :precision="2" :step="0.01" style="width: 200px" />
        </tiny-form-item>

        <tiny-form-item label="商品库存" prop="stock">
          <tiny-numeric v-model="form.stock" :min="0" :precision="0" style="width: 200px" />
        </tiny-form-item>

        <tiny-form-item label="商品分类" prop="category">
          <tiny-select v-model="form.category" placeholder="请选择商品分类">
            <tiny-option label="手机" value="手机" />
            <tiny-option label="笔记本" value="笔记本" />
            <tiny-option label="平板" value="平板" />
          </tiny-select>
        </tiny-form-item>

        <tiny-form-item label="商品状态" prop="status">
          <tiny-radio-group v-model="form.status">
            <tiny-radio label="on">上架</tiny-radio>
            <tiny-radio label="off">下架</tiny-radio>
          </tiny-radio-group>
        </tiny-form-item>

        <tiny-form-item label="商品图片" prop="image">
          <tiny-input v-model="form.image" placeholder="请输入商品图片URL" />
          <div class="image-preview" v-if="form.image" :z-index="3000">
            <tiny-image :src="form.image" :preview-src-list="[form.image]" />
          </div>
        </tiny-form-item>

        <tiny-form-item label="商品描述" prop="description">
          <tiny-input v-model="form.description" type="textarea" :rows="4" placeholder="请输入商品描述" />
        </tiny-form-item>
      </tiny-form>
      <template #footer>
        <tiny-button round @click="dialogVisible = false">取消</tiny-button>
        <tiny-button round type="primary" @click="handleFormSubmit" :loading="loading">确定</tiny-button>
      </template>
    </tiny-dialog-box>

    <div class="page-header">
      <h3>商品管理</h3>
    </div>
    <div :class="{ 'tool-active': false }">
      <div class="page-content">
        <div class="button-box">
          <div class="button-box-left">
            <tiny-input v-model="searchQuery" placeholder="搜索商品名称" clearable />
            <tiny-select v-model="statusFilter" placeholder="商品状态" clearable>
              <tiny-option label="上架" value="on" />
              <tiny-option label="下架" value="off" />
            </tiny-select>
            <tiny-select v-model="categoryFilter" placeholder="商品分类" clearable>
              <tiny-option label="手机" value="手机" />
              <tiny-option label="笔记本" value="笔记本" />
              <tiny-option label="平板" value="平板" />
            </tiny-select>
          </div>
          <tiny-button type="primary" class="button-box-right" round @click="handleAddProduct"> 添加商品 </tiny-button>
        </div>
        <tiny-grid
          :data="
            filteredProducts.slice(
              (custPager.currentPage - 1) * custPager.pageSize,
              custPager.currentPage * custPager.pageSize
            )
          "
          height="560"
          style="width: 100%"
        >
          <tiny-grid-column title="商品图片" width="100">
            <template #default="{ row }">
              <tiny-image :src="row.image" :preview-src-list="[row.image]" class="product-image">
                <template #error>
                  <tiny-image :src="errorImage" :preview-src-list="[errorImage]" class="product-image"></tiny-image>
                </template>
              </tiny-image>
            </template>
          </tiny-grid-column>
          <!-- <tiny-grid-column field="id" title="商品ID" /> -->
          <tiny-grid-column field="name" title="商品名称" />
          <tiny-grid-column field="price" title="价格">
            <template #default="{ row }"> ¥{{ row.price }} </template>
          </tiny-grid-column>
          <tiny-grid-column field="stock" title="库存" />
          <tiny-grid-column field="category" title="分类"> </tiny-grid-column>
          <tiny-grid-column field="status" title="状态">
            <template #default="{ row }">
              <tiny-tag :type="row.status === 'on' ? 'success' : 'warning'">
                {{ row.status === 'on' ? '上架' : '下架' }}
              </tiny-tag>
            </template>
          </tiny-grid-column>

          <tiny-grid-column title="操作" width="200" fixed="right">
            <template #default="{ row }">
              <tiny-button-group>
                <tiny-button type="info" size="mini" round plain @click="handleEditProduct(row)">
                  <template #icon>
                    <tiny-icon name="edit" />
                  </template>
                  编辑
                </tiny-button>
                <tiny-button type="danger" size="mini" round plain @click="handleDelete(row)">
                  <template #icon>
                    <tiny-icon name="delete" />
                  </template>
                  删除
                </tiny-button>
              </tiny-button-group>
            </template>
          </tiny-grid-column>
        </tiny-grid>
        <tiny-pager
          :current-page="custPager.currentPage"
          :page-size="custPager.pageSize"
          :total="filteredProducts.length"
          :page-sizes="[5, 10, 20, 50]"
          @current-change="currentChange"
          @size-change="sizeChange"
          layout="total, sizes, prev, pager, next, jumper"
        ></tiny-pager>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, inject } from 'vue'
import {
  TinyImage,
  TinyButtonGroup,
  TinyModal,
  TinyInput,
  TinySelect,
  TinyGrid,
  TinyGridColumn,
  TinyButton,
  TinyOption,
  TinyTag,
  TinyNotify,
  TinyPager,
  TinyDialogBox,
  TinyForm,
  TinyFormItem,
  TinyAlert,
  TinyNumeric,
  TinyRadioGroup,
  TinyRadio
} from '@opentiny/vue'
import { useStore } from '../store'
import type { Product, ProductForm } from '../types'
import { WebMcpServer, z } from '@opentiny/next-sdk'
import errorImage from '../assets/error-image.jpg'

const store = useStore()
const searchQuery = ref('')
const statusFilter = ref('')
const categoryFilter = ref('')
const custPager = ref({
  currentPage: 1,
  pageSize: 10
})

// 工具调用状态
const isToolActive = ref(false)

// 弹窗相关
const dialogVisible = ref(false)
const dialogTitle = ref('添加商品')
const productFormRef = ref<InstanceType<typeof ProductForm> | null>(null)
const loading = computed(() => store.loading)
const isEdit = ref(false)
const currentEditProductId = ref<number | null>(null) // 用于记录当前编辑的商品ID

// 表单数据
const form = ref<ProductForm>({
  name: '',
  price: 0,
  description: '',
  image: 'https://picsum.photos/300/300',
  category: '',
  stock: 0,
  status: 'on'
})

const error = computed(() => store.error)

const mcpServer = inject('mcpServer') as { transport: any; capabilities: any }
const server = new WebMcpServer({ name: 'base-config', version: '1.0.0' }, { capabilities: mcpServer.capabilities })

// 注册获取所有数据工具
server.registerTool(
  'list-products',
  {
    description: '获取所有商品列表',
    inputSchema: {}
  },
  async () => {
    await store.fetchProducts()
    return {
      content: [
        {
          type: 'text',
          text: `当前共有 ${store.products.length} 件商品`
        }
      ]
    }
  }
)

// 注册添加商品工具，支持所有商品属性
server.registerTool(
  'add-product',
  {
    description: '添加商品，上架',
    inputSchema: {
      id: z.number().describe('商品ID'),
      name: z.string().describe('商品名称'),
      price: z.number().describe('商品价格'),
      description: z.string().describe('商品描述'),
      image: z.string().describe('商品图片URL'),
      category: z.string().describe('商品分类, 例如：手机、笔记本、平板'),
      stock: z.number().describe('商品库存，数量'),
      status: z.enum(['on', 'off']).describe('商品状态，on为上架，off为下架')
    }
  },
  async (productData: ProductForm) => {
    // 设置工具激活状态
    isToolActive.value = true

    // 显示添加商品弹窗并填充数据
    productData.id = productData.id || new Date().getTime()
    const success = await store.addProduct(productData)

    return {
      content: [
        {
          type: 'text',
          text: `商品数据: ${productData.name}，价格: ${productData.price}，库存: ${productData.stock}`
        }
      ]
    }
  }
)

// 注册编辑商品工具，支持所有商品属性
server.registerTool(
  'edit-product',
  {
    description: '编辑商品',
    inputSchema: {
      id: z.number().optional().describe('更新修改表格中指定行数据，需要传递需要更新的数据，要求数据中包含"id"字段'),
      name: z.string().optional().describe('商品名称， 商品'),
      price: z.number().optional().describe('商品价格'),
      description: z.string().optional().describe('商品描述'),
      image: z.string().optional().describe('商品图片URL'),
      category: z.string().optional().describe('商品分类, 例如：手机、笔记本、平板'),
      stock: z.number().optional().describe('商品库存、数量'),
      status: z.enum(['on', 'off']).optional().describe('商品状态，on为上架，off为下架')
    }
  },
  async (productData: Partial<Product> & { id?: number; name?: string }) => {
    // 设置工具激活状态
    isToolActive.value = true
    // 验证参数：必须提供id或name中的一个
    if (productData.id === undefined && productData.name === undefined) {
      isToolActive.value = false

      return {
        content: [
          {
            type: 'text',
            text: '编辑商品失败：必须提供商品ID或商品名称'
          }
        ]
      }
    }

    // 根据ID或名称查找商品
    let productToEdit: Product | undefined

    if (productData.id !== undefined) {
      // 根据ID查找
      productToEdit = store.products.find((p) => p.id === productData.id)
    } else if (productData.name !== undefined) {
      // 根据名称查找
      productToEdit = store.products.find((p) => p.name === productData.name)
    }

    // 如果未找到商品
    if (!productToEdit) {
      isToolActive.value = false

      return {
        content: [
          {
            type: 'text',
            text: `编辑商品失败：未找到ID为${productData.id || '未知'}或名称为"${productData.name || '未知'}"的商品`
          }
        ]
      }
    }

    // 合并现有商品数据和更新数据
    const updatedProductData = {
      ...productToEdit,
      ...productData
    }

    // 调用更新方法
    const success = await store.updateProduct(productToEdit.id, {
      name: updatedProductData.name,
      price: updatedProductData.price,
      description: updatedProductData.description,
      image: updatedProductData.image,
      category: updatedProductData.category,
      stock: updatedProductData.stock,
      status: updatedProductData.status
    })
    isToolActive.value = false

    if (success) {
      await store.fetchProducts()

      return {
        content: [
          {
            type: 'text',
            text: `成功编辑商品: ${updatedProductData.name}，ID: ${productToEdit.id}`
          }
        ]
      }
    } else {
      return {
        content: [
          {
            type: 'text',
            text: `编辑商品失败: ${updatedProductData.name}`
          }
        ]
      }
    }
  }
)

// 注册删除商品工具，支持根据ID或名称删除
server.registerTool(
  'delete-product',
  {
    description: '删除商品',
    inputSchema: {
      name: z.string().optional().describe('删除表格中指定行，需要传递需要删除的数据，要求数据中包含"name"字段')
    }
  },
  async (productData: { name?: string }) => {
    // 设置工具激活状态
    isToolActive.value = true

    // 验证参数：必须提供id或name中的一个
    if (productData.name === undefined) {
      // 重置工具激活状态
      isToolActive.value = false

      return {
        content: [
          {
            type: 'text',
            text: '删除商品失败：必须提供商品名称'
          }
        ]
      }
    }

    // 根据名称查找
    productToDelete = store.products.find((p) => p.name === productData.name)

    // 如果未找到商品
    if (!productToDelete) {
      // 重置工具激活状态
      isToolActive.value = false

      return {
        content: [
          {
            type: 'text',
            text: `删除商品失败：未找到名称为"${productData.name || '未知'}"的商品`
          }
        ]
      }
    }

    // 执行删除操作
    const success = await store.deleteProduct(productToDelete.id)

    if (success) {
      await store.fetchProducts()

      // 重置工具激活状态
      isToolActive.value = false

      return {
        content: [
          {
            type: 'text',
            text: `成功删除商品: ${productToDelete.name}，ID: ${productToDelete.id}`
          }
        ]
      }
    } else {
      // 重置工具激活状态
      isToolActive.value = false

      return {
        content: [
          {
            type: 'text',
            text: `删除商品失败: ${productToDelete.name}`
          }
        ]
      }
    }
  }
)

// 注册查询最贵手机和最便宜笔记本工具
server.registerTool(
  'find-most-expensive-phone-and-cheapest-laptop',
  {
    description: '在商品列表中查询最贵、最便宜的手机、笔记本、平板',
    inputSchema: {
      category: z.string().describe('商品分类, 例如: 手机、笔记本, 平板'),
      priceType: z
        .enum(['most_expensive', 'cheapest'])
        .describe('价格类型，most_expensive表示最贵，价格最高，cheapest表示最便宜，价格最低')
    }
  },
  async (params) => {
    const { category, priceType } = params
    // 筛选出所有分类为category的商品
    const filters = store.products.filter((product) => product.category.trim() === category.trim())
    console.info('筛选商品:', category, priceType, filters, store.products)
    // 如果没有手机商品或笔记本商品，返回提示信息
    if (filters.length === 0) {
      return {
        content: [
          {
            type: 'text',
            text: `未找到分类为${category}的商品`
          }
        ]
      }
    }

    // 查找最贵或最便宜的商品
    const product = filters.reduce((prev, current) => {
      if (priceType === 'most_expensive') {
        return prev.price > current.price ? prev : current
      } else {
        return prev.price < current.price ? prev : current
      }
    })

    let resultText = `最${priceType === 'most_expensive' ? '贵' : '便宜'}的${product.category} 
                    : ${product.name} ID: ${product.id}，价格: ¥${product.price}，库存: ${product.stock}`

    return {
      content: [
        {
          type: 'text',
          text: resultText
        }
      ]
    }
  }
)

// 组件挂载时获取商品列表
onMounted(async () => {
  await store.fetchProducts()
  await server.connect(mcpServer.transport)
})

function currentChange(current) {
  custPager.value.currentPage = current
}

function sizeChange(size) {
  custPager.value.pageSize = size
}

// 过滤商品列表
const filteredProducts = computed(() => {
  let data = store.products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesStatus = !statusFilter.value || product.status === statusFilter.value
    const matchesCategory = !categoryFilter.value || product.category === categoryFilter.value
    return matchesSearch && matchesStatus && matchesCategory
  })
  return data
})

// 处理删除商品
const handleDelete = async (product: Product) => {
  TinyModal.confirm({
    message: `您确定要删除商品 "${product.name}" 吗？`,
    title: '删除商品',
    status: 'warning',
    events: {
      async confirm(ev) {
        const success = await store.deleteProduct(product.id)
        if (success) {
          TinyModal.message({
            message: '删除成功',
            status: 'success'
          })
        } else {
          TinyModal.message({
            message: '删除失败',
            status: 'error'
          })
        }
      }
    }
  })
}

// 处理添加商品
const handleAddProduct = (productData?: ProductForm) => {
  dialogTitle.value = '添加商品'
  isEdit.value = false
  currentEditProductId.value = null
  dialogVisible.value = true

  // 根据是否有传入数据决定是否启用打字效果
  if (productData) {
    // 启用打字效果
    // 填充表单数据
    form.value = { ...productData }
  } else {
    // 重置表单
    form.value = {
      name: '',
      price: 0,
      description: '',
      image: 'https://picsum.photos/300/300',
      category: '',
      stock: 0,
      status: 'on'
    }
  }
}

// 处理编辑商品
const handleEditProduct = (product: Product) => {
  dialogTitle.value = '编辑商品'
  isEdit.value = true
  currentEditProductId.value = product.id
  dialogVisible.value = true

  // 禁用打字效果（编辑时不需要）

  // 填充表单数据
  form.value = {
    name: product.name,
    price: product.price,
    description: product.description,
    image: product.image,
    category: product.category,
    stock: product.stock,
    status: product.status
  }
}

// 处理弹窗关闭
const handleDialogClose = () => {
  form.value = {
    name: '',
    price: 0,
    description: '',
    image: 'https://picsum.photos/300/300',
    category: '',
    stock: 0,
    status: 'on'
  }

  currentEditProductId.value = null
}
// 处理表单提交
const handleFormSubmit = async () => {
  if (!productFormRef.value) return

  const valid = await productFormRef.value.validate()
  if (valid) {
    let success

    // 根据是否有currentEditProductId判断是添加还是编辑
    if (currentEditProductId.value !== null) {
      // 编辑商品
      success = await store.updateProduct(currentEditProductId.value, form.value)
    } else {
      // 添加商品
      success = await store.addProduct(form.value)
    }

    if (success) {
      // 重新获取商品列表
      await store.fetchProducts()
      dialogVisible.value = false
      TinyModal.message({
        message: currentEditProductId.value !== null ? '编辑成功' : '添加成功',
        status: 'success'
      })
    }
  }
}
</script>

<style scoped lang="less">
.products-page {
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    height: 32px;
  }
}

.button-box {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
  justify-content: space-between;
}
.button-box-left {
  display: flex;
  gap: 8px;
}

.loading-state {
  padding: 20px;
}

.product-image {
  width: 40px;
  height: 40px;
  border-radius: 4px;
}
.page-content {
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.03);
}
// 工具调用时的彩色呼吸灯效果
.tool-active {
  animation: rainbow-glow 2s ease-in-out infinite alternate;
  border-radius: 8px;
  padding: 5px;
  background: linear-gradient(45deg, #ff0000, #ff7300, #fffb00, #48ff00, #00ffd5, #002bff, #7a00ff, #ff00c8, #ff0000);
  background-size: 400% 400%;
}
</style>
