import Vue from 'vue';
import App from './App.vue';
import router from './router';
import ElementUI from 'element-ui';
import axios from 'axios'
import 'element-ui/lib/theme-chalk/index.css';
import './assets/css/icon.css';
import './components/common/directives';
import 'babel-polyfill';
import md5 from 'js-md5';
import { Loading, Message } from 'element-ui'
import echarts from 'echarts'

// 配置请求的根路径
// axios.defaults.baseURL = 'http://172.18.200.65:8088/message-plat'
axios.defaults.baseURL = 'http://172.29.240.8:8088/message-plat'
// axios.defaults.baseURL = 'http://172.17.101.215:8088/message-plat'
// axios.defaults.baseURL = 'http://172.17.101.3:8088/message-plat' 
Vue.prototype.$http = axios;
Vue.prototype.$md5 = md5;
Vue.prototype.$echarts = echarts
Vue.config.productionTip = false;
Vue.use(ElementUI, {
    size: 'small'
});

// 在全局请求和响应拦截器中添加请求状态
let loading = null
let needLoadingRequestCount = 0 // 声明一个对象用于存储请求个数
// 请求拦截器
axios.interceptors.request.use(
    config => {
        if (needLoadingRequestCount == 0) {
            loading = Loading.service({ text: '加载中...' ,
            target: document.querySelector('.content')})//.el-dialog__body   .content-box
            needLoadingRequestCount++;
        }
        config.headers.token = window.sessionStorage.getItem('token');
        return config
    },
    error => {
        return Promise.reject(error)
    }
)
// 响应拦截器
axios.interceptors.response.use(
    response => {
        needLoadingRequestCount=0;
        if (loading) {
            loading.close()
        }
        const code = response.status
        if ((code >= 200 && code < 300) || code === 304) {
            if (response.data.code == '0000') {
                return Promise.resolve(response);
            } else if (response.data.code == '2012') {
                Message.error("请重新登录！");
                router.replace({
                    path: '/login',
                    query: {
                        redirect: router.currentRoute.fullPath
                    }
                });
            } else {
                Message.error(response.data.message);
            }
            return Promise.reject(response);
        } else {
            return Promise.reject(response);
        }
    },
    error => {
        needLoadingRequestCount=0;
        if (loading) {
            loading.close()
        }
        if (error.response) {
            switch (error.response.status) {
                case 404:
                    Message.error('网络请求服务不存在')
                    break
                default:
                    Message.error(error.response.data.message)
            }
        } else {
            // 请求超时或者网络有问题
            if (error.message.includes('timeout')) {
                Message.error('请求超时！请检查网络是否正常')
            } else {
                Message.error('请求失败，请检查网络是否已连接')
            }
        }
        return Promise.reject(error)
    }
)

new Vue({
    router,
    render: h => h(App)
}).$mount('#app');
