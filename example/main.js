import Vue from 'vue/dist/vue.min.js';
import App from './App';

console.log(Vue.version);
/* eslint-disable no-new */
new Vue({
  el: '#app-wrap',
  render: h => h(App)
});
