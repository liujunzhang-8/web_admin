<template>
    <div class="sidebar">
        <el-menu
            class="sidebar-el-menu"
            :default-active="onRoutes"
            :collapse="collapse"
            background-color="#324157"
            text-color="#fff"
            active-text-color="#20a0ff"
            unique-opened
            router
        >
            <template v-for="item in menuList">
                <template v-if="item.subs">
                    <el-submenu :index="item.index" :key="item.index">
                        <template slot="title">
                            <i :class="item.icon"></i>
                            <span slot="title">{{ item.title }}</span>
                        </template>
                        <template v-for="subItem in item.subs">
                            <el-submenu
                                v-if="subItem.subs"
                                :index="subItem.index"
                                :key="subItem.index"
                            >
                                <template slot="title">{{ subItem.title }}</template>
                                <el-menu-item
                                    v-for="(threeItem,i) in subItem.subs"
                                    :key="i"
                                    :index="threeItem.index"
                                >{{ threeItem.title }}</el-menu-item>
                            </el-submenu>
                            <el-menu-item
                                v-else
                                :index="subItem.index"
                                :key="subItem.index"
                            >
                            <i class="el-icon-menu"></i>
                            <span class="item2">{{ subItem.title }}</span>
                            </el-menu-item>
                        </template>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.index" :key="item.index">
                        <i :class="item.icon"></i>
                        <span slot="title">{{ item.title }}</span>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
import bus from '../common/bus';
export default {
    data() {
        return {
            collapse: false,
            menuList: []
        };
    },
    computed: {
        onRoutes() {
            return this.$route.path.replace('/', '');
        }
    },
    created() {
        // 通过 Event Bus 进行组件间通信，来折叠侧边栏
        bus.$on('collapse', msg => {
            this.collapse = msg;
            bus.$emit('collapse-content', msg);
        });
        this.getMenuList();
    },
    methods: {
        // 获取所有菜单
        async getMenuList() {
            const { data: res } = await this.$http.post('/role/getMenus');
            console.log(res.data);
            this.menuList = [];
            var shouye_obj = {
                icon: 'el-icon-s-home',
                index: 'dashboard',
                title: '系统首页'
            };
            this.menuList.push(shouye_obj);
            res.data.forEach(value => {
                var menu_level1 = {};
                menu_level1.icon = value.menuSummary;
                menu_level1.title = value.menuName;
                menu_level1.index = value.menuUrl;
                var subs = [];
                value.cMenus.forEach(value2 => {
                    var menu_level2 = {};
                    menu_level2.title = value2.menuName;
                    menu_level2.index = value2.menuUrl;

                    subs.push(menu_level2);
                });
                menu_level1.subs = subs;
                this.menuList.push(menu_level1);
            });
        }
    }
};
</script>

<style scoped>
.sidebar {
    display: block;
    position: absolute;
    left: 0;
    top: 70px;
    bottom: 0;
    overflow-y: scroll;
}
.sidebar::-webkit-scrollbar {
    width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
    width: 200px;
}
.sidebar > ul {
    height: 100%;
}
/* .item2 {
    margin: 0 20px;
} */
</style>
