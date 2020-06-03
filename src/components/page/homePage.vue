<template>
    <div class="info_container" ref="info_container">
        <el-row class="info_row row" :gutter="10">
            <el-col :span="8">
                <el-card>
                    <el-form
                        class="form"
                        :model="infoForm"
                        :rules="infoRules"
                        ref="infoFormRef"
                        label-width="100px"
                    >
                        <el-form-item label="用户姓名：">
                            <span>{{infoForm.userName}}</span>
                        </el-form-item>
                        <el-form-item label="真实姓名：">
                            <span>{{infoForm.userRealName}}</span>
                        </el-form-item>
                        <el-form-item label="手机号码：">
                            <span>{{infoForm.userPhone}}</span>
                        </el-form-item>
                        <el-form-item label="电子邮箱：">
                            <span>{{infoForm.userEmail}}</span>
                        </el-form-item>
                        <el-form-item label="分公司：">
                            {{infoForm.companyName}}
                        </el-form-item>
                        <el-form-item label="更新时间：">
                            <span>{{infoForm.updatedDate}}</span>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="editDialogVisible = true">修改信息</el-button>
                            <el-button type="danger" @click="pwdDialogVisible = true">修改密码</el-button>
                        </el-form-item>
                    </el-form>
                </el-card>
            </el-col>
        </el-row>
        <!-- 修改密码弹出框 -->
        <el-dialog
            title="修改密码"
            :visible.sync="pwdDialogVisible"
            @close="pwdDialogClosed()"
            width="40%"
        >
            <el-form
                class="form"
                :model="pwdForm"
                :rules="pwdRules"
                ref="pwdFormRef"
                label-width="80px"
            >
                <el-form-item label="原密码" prop="userPassword">
                    <el-input
                        class="input"
                        type="password"
                        v-model="pwdForm.userPassword"
                        auto-complete="off"
                        size="mini"
                        placeholder="请输入原密码"
                    ></el-input>
                </el-form-item>
                <el-form-item label="新密码" prop="userNewPassword">
                    <el-input
                        class="input"
                        type="password"
                        v-model="pwdForm.userNewPassword"
                        auto-complete="off"
                        size="mini"
                        placeholder="请输入新密码"
                    ></el-input>
                </el-form-item>
            </el-form>
            <!-- 底部区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitPwdForm">提交</el-button>
                <el-button @click="pwdDialogVisible=false">取消</el-button>
            </span>
        </el-dialog>
        <!-- 修改个人信息弹出框 -->
        <el-dialog
            title="修改个人信息"
            :visible.sync="editDialogVisible"
            @close="editResetForm()"
            width="40%"
        >
            <el-form
                class="form"
                :model="infoForm"
                :rules="infoRules"
                ref="infoFormRef"
                label-width="80px"
            >
                <el-form-item label="用户姓名">
                    <!-- {{infoForm.userName}} -->
                    <el-input size="mini" disabled v-model="infoForm.userName"></el-input>
                </el-form-item>
                <el-form-item label="真实姓名" prop="userRealName">
                    <el-input size="mini" v-model="infoForm.userRealName"></el-input>
                </el-form-item>
                <el-form-item label="手机号码" prop="userPhone">
                    <el-input size="mini" v-model="infoForm.userPhone"></el-input>
                </el-form-item>
                <el-form-item label="电子邮箱" prop="userEmail">
                    <el-input size="mini" v-model="infoForm.userEmail"></el-input>
                </el-form-item>
                <el-form-item label="分公司" prop="companyId">
                    <el-select v-model="infoForm.companyId" value-key="companynum" disabled>
                        <el-option
                            v-for="item in companyId"
                            :key="item.companynum"
                            :value="item.companynum"
                            :label="item.companyname"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="更新时间">
                    <el-input size="mini" v-model="infoForm.updatedDate" disabled></el-input>
                </el-form-item>
            </el-form>
            <!-- 底部区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="editInfoForm()">提交</el-button>
                <el-button @click="editDialogVisible=false">取消</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        let validateEmail = (rule, value, callback) => {
            if (value == '') {
                callback(new Error('请输入邮箱~'));
                return;
            }
            let emailRegex = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
            if (!emailRegex.test(value)) {
                callback(new Error('邮箱格式不正确！'));
            } else {
                callback();
            }
        };
        let validatePhone = (rule, value, callback) => {
            if (value == '') {
                callback(new Error('请输入手机号码~'));
            }
            {
                let phoneRegex = /^1[34578]\d{9}$/;
                if (!phoneRegex.test(value)) {
                    callback(new Error('手机号码格式不正确！'));
                } else {
                    callback();
                }
            }
        };
        // validateField:对部分表单字段进行校验的方法
        let validateNewpassword = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请输入新密码'));
            } else {
                if (this.pwdForm.surepassword !== '') {
                    this.$refs.pwdForm.validateField('surepassword');
                }
                callback();
            }
        };
        return {
            // 获取个人信息
            infoForm: {},
            // 获取分公司
            companyId: [],
            pwdForm: {
                userPassword: '',
                userNewPassword: ''
            },
            pwdRules: {
                userPassword: [{ required: true, message: '请输入原密码', trigger: 'blur' }],
                userNewPassword: [{ required: true, message: '请输入新密码', trigger: 'blur' }]
            },
            infoRules: {
                userRealName: [
                    { required: true, message: '请输入真实姓名', trigger: 'blur' },
                    { min: 5, max: 10, message: '长度在 2 到 8 个字符', trigger: 'blur' }
                ],
                userPhone: [{ required: true, validator: validatePhone, trigger: 'blur' }],
                userEmail: [{ required: true, validator: validateEmail, trigger: 'blur' }]
            },
            // 控制修改个人信息的显示与隐藏
            editDialogVisible: false,
            // 控制修改密码的显示与隐藏
            pwdDialogVisible: false
        };
    },
    created() {
        this.getUserInfo();
        this.companyInfo();
    },
    methods: {
        // 获取个人信息
        async getUserInfo() {
            const { data: res } = await this.$http.post('/user/userInfo');
            console.log(res);
            if (res.code !== '0000') {
                return this.$message.error('获取个人信息失败！');
            } else {
                this.infoForm = res.data;
            }
        },
        // 修改密码
        submitPwdForm() {
            this.$refs.pwdFormRef.validate(async valid => {
                if (!valid) {
                    return;
                } else {
                    // 可以发起修改密码的网络请求
                    const { data: res } = await this.$http.post('/user/updatePassword', {
                        userPassword: this.$md5(this.pwdForm.userPassword),
                        userNewPassword: this.$md5(this.pwdForm.userNewPassword)
                    });
                    console.log(res.data);
                    if (res.code !== '0000') {
                        this.$message.error('修改密码失败！');
                    } else {
                        this.$message.success('修改密码成功！');
                        this.pwdDialogVisible = false;
                    }
                }
            });
        },
        // 获取分公司
        async companyInfo() {
            const { data: res } = await this.$http.post('/companyInfo/getAllCompanys');
            if (res.code !== '0000') {
                return this.$message('获取分公司失败');
            } else {
                this.companyId = res.data;
            }
        },
        // 修改个人信息
        editInfoForm() {
            this.$refs.infoFormRef.validate(async valid => {
                console.log(valid);
                if (!valid) {
                    return;
                } else {
                    const { data: res } = await this.$http.post('/user/updateLoginUserInfo', this.infoForm);
                    if (res.code !== '0000') {
                        this.$message.error('修改信息失败');
                    } else {
                        this.$message.success('修改信息成功！');
                        this.editDialogVisible = false;
                    }
                }
            });
        },
        // 监听修改密码关闭事件
        pwdDialogClosed() {
            this.$refs.pwdFormRef.resetFields();
        },
        // 监听修改个人信息关闭事件
        editResetForm() {
            this.$refs.infoFormRef.resetFields();
        }
    }
};
</script>

<style lang="less" scoped>
.info_container {
    padding: 20px;
    background: #fff;
    box-sizing: border-box;
    overflow: auto;
}
.title {
    text-align: center;
    width: 100%;
    height: 30px;
    line-height: 30px;
    cursor: pointer;
    background-color: #3bc5ff;
    border: 1px solid #3bc5ff;
    color: white;
    display: block;
}
.info_row {
    .area {
        border: 1px solid #dfdfdf;
        height: 100%;
        font-size: 14px;
        padding: 10px;
        .form {
            width: 90%;
            margin-top: 20px;
        }
    }
}
.el-input {
    width: 300px;
}
.el-select {
    width: 300px;
}
</style>
