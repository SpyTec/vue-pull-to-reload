<template>
    <div id="app">
        <app-header></app-header>
        <div class="view-wrapper">
            <simple-pull-to-refresh></simple-pull-to-refresh>
        </div>
    </div>
</template>

<script>
import AppHeader from './components/AppHeader.vue';
// import RouterView from './components/RouterView.vue';
import SimplePullToRefresh from './pages/SimplePullToRefresh.vue';

export default {
  data () {
    return {
      currentRoute: window.location.pathname
    };
  },
  components: {
    AppHeader,
    // RouterView
    SimplePullToRefresh
  },
  created () {
    window.addEventListener('popstate', () => {
      this.currentRoute = window.location.pathname;
    });
  }
};
</script>
