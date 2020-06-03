<template>
    <div class="login-wrap">
        <div class="ms-login">
            <div class="ms-title">
                <img src="../common/logo1.png" alt="">长生人寿
            </div>
            <el-form :model="loginForm" :rules="rules" ref="login" label-width="0px" class="ms-content">
                <!-- 用户名 -->
                <el-form-item prop="userName">
                    <el-input v-model="loginForm.userName" placeholder="userName">
                        <el-button slot="prepend" icon="el-icon-user"></el-button>
                    </el-input>
                </el-form-item>
                <!-- 密码 -->
                <el-form-item prop="userPassword">
                    <el-input
                        type="password"
                        placeholder="userPassword"
                        v-model="loginForm.userPassword"
                        @keyup.enter.native="submitForm"
                    >
                        <el-button slot="prepend" icon="el-icon-lock"></el-button>
                    </el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click.native.prevent="submitForm()">登录</el-button>
                </div>
            </el-form>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            loginForm: {
                userName: '',
                userPassword: ''
            },
            rules: {
                // 验证用户名是否合法
                userName: [
                    { required: true, message: '请输入登录名称', trigger: 'blur' },
                    { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                ],
                // 验证密码是否合法
                userPassword: [
                    { required: true, message: '请输入登录密码', trigger: 'blur' },
                    { min: 6, message: '长度在 6 到 30 个字符', trigger: 'blur' }
                ]
            }
        };
    },
    methods: {
        submitForm() {
            this.$refs.login.validate(async valid => {
                if (!valid) return;
                const { data:res } = await this.$http.post('/user/login', {
                    userName: this.loginForm.userName,
                    userPassword: this.$md5(this.loginForm.userPassword)
                });
                if ( res.code !== '0000' ) {
                    return this.$message.error('登录失败！');
                }else {
                    this.$message.success('登录成功');
                    localStorage.setItem('userName', this.loginForm.userName)
                    window.sessionStorage.setItem('token', res.data.token);
                    this.$router.push('/dashboard');
                }
            });
        }
    }
};
</script>

<style scoped>
.login-wrap {
    position: relative;
    width: 100%;
    height: 100%;
    background-image: url(../../assets/img/login-bg.jpg);
    background-size: 100%;
}
.ms-title {
    width: 100%;
    line-height: 50px;
    text-align: center;
    font-size: 22px;
    color: #606266;
    font-weight: 700;
    border-bottom: 1px solid #ccc;
}
.ms-login {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 350px;
    margin: -190px 0 0 -175px;
    border-radius: 5px;
    background: rgba(255, 255, 255, 0.4);
    overflow: hidden;
}
img {
    width: 32px;
    height: 32px;
    vertical-align: middle;
    margin-right: 10px;
}
.ms-content {
    padding: 30px 30px;
}
.login-btn {
    text-align: center;
}
.login-btn button {
    width: 100%;
    height: 36px;
    margin-bottom: 10px;
}
</style>