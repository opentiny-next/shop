# 接入 NEXT SDK，改造成智能应用

安装依赖：

```shell
pnpm -F shop-admin i @opentiny/next-sdk @opentiny/next-remoter
```

在 packages/shop-admin/src/App.vue 中添加以下代码：

```diff
<template>
  <tiny-config-provider :design="design">
    <router-view />
  </tiny-config-provider>
+ <tiny-remoter session-id="5f8edea7-e3ae-4852-a334-1bb6b3a1cfa9" />
</template>
<script setup>
+ import { onMounted, provide } from 'vue'
import { TinyConfigProvider } from '@opentiny/vue';
+ import { WebMcpClient, createMessageChannelPairTransport } from '@opentiny/next-sdk'
+ import { TinyRemoter } from '@opentiny/next-remoter'
+ import '@opentiny/next-remoter/dist/style.css'

+ const [serverTransport, clientTransport] = createMessageChannelPairTransport()
+ provide('serverTransport', serverTransport)

+ onMounted(async () => {
+   const client = new WebMcpClient()
+   await client.connect(clientTransport)
+   const { sessionId } = await client.connect({
+     agent: true,
+     url: 'https://agent.opentiny.design/api/v1/mcp-proxy-trial/mcp',
+     sessionId: '5f8edea7-e3ae-4852-a334-1bb6b3a1cfa9'
+   })
+ })

const design = {
  name: 'x-design', // 设计规范名称
  version: '1.0.0', // 设计规范版本号
  components: {
    Button: {
      props: {
        resetTime: 0,
        round: true,
      },
    },
  },
};
</script>
```

在 packages/shop-admin/src/views/Products.vue 中添加以下代码：

```diff
<script setup lang="ts">
- import { ref, computed, onMounted } from 'vue';
+ import { ref, computed, onMounted, inject } from 'vue'
+ import { WebMcpServer, z } from '@opentiny/next-sdk'

+ const serverTransport = inject('serverTransport')
+ const server = new WebMcpServer()

// 组件挂载时获取商品列表
onMounted(async () => {
  await store.fetchProducts();
+  server.registerTool('demo-tool', {
+    title: '演示工具',
+    description: '一个简单工具',
+    inputSchema: { foo: z.string() },
+  }, async (params) => {
+    console.log('params:', params)
+    return { content: [{ type: 'text', text: `收到: ${params.foo}` }] }
+  })
+  await server.connect(serverTransport)
});

...
</script>
```
