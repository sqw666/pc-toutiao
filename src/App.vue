<template>
  <div id="app">
    <router-view />
  </div>
</template>
<script>
export default {
  name: "App",
  data() {
    return {
      num: 6,
    };
  },
  methods: {
    handleChange(value) {},
  },
  created() {},
};
</script>

<style lang="less">
</style>
