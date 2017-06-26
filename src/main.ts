import * as Vue from 'vue';
import App from './App.vue';
import router from './router';
import 'whatwg-fetch';
Vue.config.productionTip = false;

new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App },
  render: h => h(App, {
    props: {  }
  })
})

router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title
  }
  next()
})
