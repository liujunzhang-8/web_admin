import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

/**
 * 路由相关属性说明
 * hidden: 当设置hidden为true时，意思不在sideBars侧边栏中显示
 * mete{
 * title: xxx,  设置sideBars侧边栏名称
 * icon: xxx,  设置ideBars侧边栏图标
 * noCache: true  当设置为true时不缓存该路由页面
 * }
 */

const router = new Router({
    mode: 'hash',
    base: '/dist/',
    routes: [
        {
            path: '/',
            redirect: '/dashboard'
        },
        {
            path: '/home',
            component: () => import(/* webpackChunkName: "home" */ '../components/common/Home.vue'),
            meta: { title: '自述文件' },
            children: [
                {
                    path: '/dashboard',
                    component: () => import(/* webpackChunkName: "dashboard" */ '../components/page/dashboard/dashboard'),
                    meta: { title: '系统首页' }
                },
                {
                    path: '/personal',
                    component: () => import(/* webpackChunkName: "tabs" */ '../components/page/personal.vue'),
                    meta: { title: '我的主页' }
                },
                {
                    path: '/user',
                    component: () => import('../components/page/system/user.vue'),
                    meta: { title: '用户管理' }
                },
                {
                    path: '/role',
                    component: () => import('../components/page/system/role.vue'),
                    meta: { title: '角色管理' }
                },
                {
                    path: '/menu',
                    component: () => import('../components/page/system/menu.vue'),
                    meta: { title: '菜单管理' }
                },
                {
                    path: '/parameter',
                    component: () => import('../components/page/system/parameter.vue'),
                    meta: { title: '参数管理' }
                },
                {
                    path: '/operation',
                    component: () => import('../components/page/system/operation.vue'),
                    meta: { title: '权限管理' }
                },
                {
                    path: '/sending',
                    component: () => import('../components/page/sms/sms_Sending.vue'),
                    meta: { title: '短信发送' }
                },
                {
                    path: '/tCode',
                    component: () => import('../components/page/sms/sms_Parameter.vue'),
                    meta: { title: '短信参数' }
                },
                {
                    path: '/sms_query',
                    component: () => import('../components/page/sms/smsQuery.vue'),
                    meta: { title: '短信查询' }
                },
                {
                    path: '/template',
                    component: () => import('../components/page/template/template.vue'),
                    meta: { title: '模板查询' }
                },
                {
                    path: '/template_sort',
                    component: () => import('../components/page/template/templateSort.vue'),
                    meta: { title: '模板分类' }
                },
                {
                    path: '/template_keywords',
                    component: () => import('../components/page/template/templateKeywords.vue'),
                    meta: { title: '模板关键字' }
                },
                {
                    path: '/wechat_query',
                    component: () => import('../components/page/wechat/wechatQuery.vue'),
                    meta: { title: '微信查询' }
                },
                {
                    path: '/wechat_sending',
                    component: () => import('../components/page/wechat/wechatSending.vue'),
                    meta: { title: '微信发送' }
                }
                // {
                //     path: '/404',
                //     component: () => import(/* webpackChunkName: "404" */ '../components/page/404.vue'),
                //     meta: { title: '404' }
                // },
                // {
                //     path: '/403',
                //     component: () => import(/* webpackChunkName: "403" */ '../components/page/403.vue'),
                //     meta: { title: '403' }
                // },
            ]
        },
        {
            path: '/login',
            component: () => import('../components/page/login.vue'),
            meta: { title: '登录' }
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
});

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
    if(to.path === '/login') return next()
    // 获取token
    const tokenStr = window.sessionStorage.getItem('token')
    if(!tokenStr) return next('/login')
    next()
  })

export default router