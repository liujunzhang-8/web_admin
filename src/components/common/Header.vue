<template>
    <div class="header">
        <!-- 折叠按钮 -->
        <div class="collapse-btn" @click="collapseChage">
            <i v-if="!collapse" class="el-icon-s-fold" style="color: #909399"></i>
            <i v-else class="el-icon-s-unfold" style="color: #909399"></i>
        </div>
        <div class="logo"><img src="./logo1.png" alt="logo" />长生人寿</div>
        <div class="header-right">
            <div class="header-user-con">
                <!-- 全屏显示 -->
                <div class="btn-fullscreen" @click="handleFullScreen">
                    <el-tooltip effect="dark" :content="fullscreen?`取消全屏`:`全屏`" placement="bottom">
                        <i class="el-icon-rank" style="color: #909399"></i>
                    </el-tooltip>
                </div>
                <!-- 用户头像 -->
                <!-- <div class="user-avator">
                    <img src="../../assets/img/logo1.png" />
                </div> -->
                <!-- 用户名下拉菜单 -->
                <el-dropdown class="user-name" trigger="click" @command="handleCommand">
                    <span class="el-dropdown-link">
                        {{username}}
                        <i class="el-icon-caret-bottom" style="color: #909399"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item>
                            <router-link to="/" style="color: #606266;">
                                <i class="el-icon-s-home"></i>系统首页
                            </router-link>
                        </el-dropdown-item>
                        <el-dropdown-item>
                            <router-link to="/personal" style="color: #606266;">
                                <i class="el-icon-s-custom"></i>个人主页
                            </router-link>
                        </el-dropdown-item>
                        <el-dropdown-item divided command="loginout">
                            <i class="el-icon-switch-button"></i>退出登录
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </div>
    </div>
</template>
<script>
import bus from '../common/bus';
export default {
    data() {
        return {
            collapse: true,
            fullscreen: false,
            name: 'admin',
            message: 2
        };
    },
    computed: {
        username() {
            let username = localStorage.getItem('userName');
            return username ? username : this.name;
        }
    },
    methods: {
        // 用户名下拉菜单选择事件
        async handleCommand(command) {
            if (command == 'loginout') {
                const { data:res } = await this.$http.post('/user/logout');
                this.$message.success('退出成功');
                localStorage.removeItem('userName');
                window.sessionStorage.clear();
                this.$router.push('/login');
            }
        },
        // 侧边栏折叠
        collapseChage() {
            this.collapse = !this.collapse;
            bus.$emit('collapse', this.collapse);
        },
        // 全屏事件
        handleFullScreen() {
            let element = document.documentElement;
            if (this.fullscreen) {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.webkitCancelFullScreen) {
                    document.webkitCancelFullScreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                }
            } else {
                if (element.requestFullscreen) {
                    element.requestFullscreen();
                } else if (element.webkitRequestFullScreen) {
                    element.webkitRequestFullScreen();
                } else if (element.mozRequestFullScreen) {
                    element.mozRequestFullScreen();
                } else if (element.msRequestFullscreen) {
                    // IE11
                    element.msRequestFullscreen();
                }
            }
            this.fullscreen = !this.fullscreen;
        }
    },
    mounted() {
        if (document.body.clientWidth < 1500) {
            this.collapseChage();
        }
    }
};
</script>

<style scoped>
.header {
    position: relative;
    box-sizing: border-box;
    width: 100%;
    height: 70px;
    font-size: 22px;
    color: #fff;
}
.collapse-btn {
    float: left;
    padding: 0 21px;
    cursor: pointer;
    line-height: 70px;
    color: #909399;
}
.header .logo {
  color: #fff !important;
  font-size: 20px;
  margin-left: 10px;
  display: inline-block;
  font-weight: bold;
  height: 100%;
  line-height: 70px;
}
.header .logo img {
    height: 36px;
    width: 36px;
    vertical-align: middle;
    margin-right: 8px;
    position: relative;
    top: -3px;
  }
.header-right {
    float: right;
    padding-right: 50px;
}
.header-user-con {
    display: flex;
    height: 70px;
    align-items: center;
}
.btn-fullscreen {
    transform: rotate(45deg);
    margin-right: 5px;
    font-size: 24px;
}
.btn-bell,
.btn-fullscreen {
    position: relative;
    width: 30px;
    height: 30px;
    text-align: center;
    border-radius: 15px;
    cursor: pointer;
}
.btn-bell-badge {
    position: absolute;
    right: 0;
    top: -2px;
    width: 8px;
    height: 8px;
    border-radius: 4px;
    background: #f56c6c;
    color: #fff;
}
.btn-bell .el-icon-bell {
    color: #fff;
}
.user-name {
    margin-left: 10px;
}
.user-avator {
    margin-left: 20px;
}
.user-avator img {
    display: block;
    width: 36px;
    height: 36px;
    border-radius: 50%;
}
.el-dropdown-link {
    color: #fff;
    cursor: pointer;
}
.el-dropdown-menu__item {
    text-align: center;
    margin: 6px 0;
}

i {
    color: #909399
}

</style>
