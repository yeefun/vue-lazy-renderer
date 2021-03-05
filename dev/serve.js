import Vue from 'vue';
import LazyRenderer from '@/entry.js';
import Dev from './serve.vue';

Vue.config.productionTip = false;

Vue.use(LazyRenderer, {
  tagName: 'ul',
  preLoad: 0.5,
});

new Vue({
  render: (h) => h(Dev),
}).$mount('#app');
