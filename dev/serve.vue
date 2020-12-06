<template>
  <div id="app">
    <lazy-renderer />
  </div>
</template>

<script>
import Vue from 'vue';
import LazyRenderer from '@/lazy-renderer.vue';

export default Vue.extend({
  name: 'ServeDev',
  components: {
    LazyRenderer,
  },
});
</script>
