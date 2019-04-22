<template>
  <header class="app-header">
    <h2>vue-pull-to-examples</h2>
  </header>
</template>

<style scoped lang="scss">
  .app-header {
    position: absolute;
    left: 0;
    top: 0;
    box-sizing: border-box;
    align-items: center;
    width: 100%;
    height: 50px;
    z-index: 500;
    background: #35495e;
    color: #fff;
  }

  h2 {
    font-size: 20px;
    font-weight: 300;
    line-height: 50px;
    text-align: center;
    margin: 0;
  }
</style>

<script type="text/babel">
export default {
  name: 'app-header',
  data () {
    return {
    };
  },
  props: {
    isBack: {
      type: Boolean,
      default: true
    }
  },
  methods: {},
  watch: {}
};
</script>
