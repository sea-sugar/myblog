import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import ElementPlus from 'element-plus';
import 'element-plus/theme-chalk/index.css';
import axios from 'axios';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';


const app = createApp(App);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component);
}
app.use(store);
app.use(router);
app.use(ElementPlus);
app.config.globalProperties.$axios = axios; // 将 $axios 添加到全局属性中
app.mount('#app');