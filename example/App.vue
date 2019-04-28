<template>
    <div>
        <app-header></app-header>
        <div class="view-wrapper">
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
import AppHeader from './components/AppHeader.vue';

export default {
  components: {
    AppHeader
  }
};
</script>
