<template>
  <div id="app">
    <div class="stuff" />
    <lazy-renderer tagName="span" :preLoad="1">
      <div class="target" />
    </lazy-renderer>

    <div class="stuff" />
    <lazy-renderer>
      <div class="target" />
    </lazy-renderer>
    <div class="stuff" />
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

<style scoped>
.stuff {
  width: 100px;
  height: 200vh;
  background-color: green;
}

.target {
  width: 100px;
  height: 100px;
  background-color: red;
}
</style>
