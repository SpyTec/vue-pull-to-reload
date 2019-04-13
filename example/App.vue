<template>
    <div id="app">
        test
        <app-header></app-header>
        <div class="view-wrapper">
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
    import AppHeader from './components/AppHeader.vue';
    import RouterView from './components/RouterView.vue';

    export default {
      data() {
        return {
          currentRoute: window.location.pathname
        };
      },
      components: {
        AppHeader,
        RouterView
      },
      created() {
        window.addEventListener('popstate', () => {
          this.currentRoute = window.location.pathname;
        });
      }
    };
</script>
