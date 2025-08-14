<script lang="ts" setup>
import { TinyConfigProvider } from '@opentiny/vue';
import { defineComponent } from 'vue';
import Header from './components/Header.vue';
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

<template>
  <div class="app">
    <tiny-config-provider :design="design">
      <Header />
      <router-view />
    </tiny-config-provider>
  </div>
</template>

<style lang="less">
@import './styles/common.less';

.app {
  min-height: 100vh;
  background-color: #f5f7fa;
}
</style>
