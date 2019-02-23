// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import store from './store/index.js';

import ElementUI from 'element-ui';
// import 'element-ui/lib/theme-chalk/index.css';//原蓝色皮肤路径
import '../theme/index.css';//绿色皮肤路径

import Util from '@/helpers/util.js';//插件

Vue.use(ElementUI);
Vue.use(Util);
Vue.config.productionTip = false;//阻止 vue 在启动时生成生产提示

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router: router,
  store: store,
  components: {
    App: App
  },
  template: '<app></app>'
});
