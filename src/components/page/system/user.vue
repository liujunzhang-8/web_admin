<template>
    <div>
        <el-card>
            <!-- 搜索与添加区域 -->
            <Search></Search>
            <el-button
                type="primary"
                icon="el-icon-circle-plus-outline"
                size="mini"
                @click="userRoles(),companyInfo(),addDialogVisible = true"
            >添加</el-button>
            <!-- 用户列表区域 -->
            <Table></Table>
            <!-- 分页 -->
            <Page></Page>
        </el-card>
        <!-- 添加对话框 -->
        <el-dialog
            title="添加用户"
            :visible.sync="addDialogVisible"
            @close="addDialogClosed()"
            width="40%"
        >
            <div class="dialogDiv">
                <!-- 内容主体区域 -->
                <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="80px">
                    <el-form-item label="用户名" prop="userName">
                        <el-input v-model="addForm.userName"></el-input>
                    </el-form-item>
                    <el-form-item label="真实姓名" prop="userRealName">
                        <el-input v-model="addForm.userRealName"></el-input>
                    </el-form-item>
                    <el-form-item label="手机号码" prop="userPhone">
                        <el-input v-model="addForm.userPhone"></el-input>
                    </el-form-item>
                    <el-form-item label="电子邮箱" prop="userEmail">
                        <el-input v-model="addForm.userEmail"></el-input>
                    </el-form-item>
                    <el-form-item label="用户角色" prop="roles">
                        <template>
                            <el-checkbox-group v-model="addForm.roles" value-key="roleId">
                                <el-checkbox
                                    v-for="role in roleData"
                                    :label="role.roleId"
                                    :key="role.roleId"
                                >{{role.roleName}}</el-checkbox>
                            </el-checkbox-group>
                        </template>
                    </el-form-item>
                    <el-form-item label="分公司" prop="companyId">
                        <el-select
                            v-model="addForm.companyId"
                            placeholder="请选择"
                            value-key="companynum"
                        >
                            <el-option
                                v-for="item in companyId"
                                :key="item.companynum"
                                :value="item.companynum"
                                :label="item.companyname"
                            ></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="用户描述" prop="userSummary">
                        <el-input rows="5" v-model="addForm.userSummary"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <!-- 底部区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addUser()">提 交</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import Search from './user/search'
import Table from './user/table'
import Page from './user/page'
export default {
    data() {
        // 验证邮箱的规则
        var checkEmail = (rule, value, cb) => {
            // 验证邮箱的正则表达式
            const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;

            if (regEmail.test(value)) {
                // 合法的邮箱
                return cb();
            }

            cb(new Error('请输入合法的邮箱'));
        };
        // 验证手机号的规则
        var checkMobile = (rule, value, cb) => {
            // 验证手机号的正则表达式
            const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;

            if (regMobile.test(value)) {
                return cb();
            }

            cb(new Error('请输入合法的手机号'));
        };
        return {
            // 默认选中的id值
            currRoleIds: [],
            // 角色数据总量
            roleData: [],
            // 分公司
            companyId: [],
            // 添加用户
            addForm: {
                userName: '',
                userRealName: '',
                userPhone: '',
                userEmail: '',
                roles: [],
                companyId: [],
                userSummary: ''
            },
            // 添加对话框的显示与隐藏
            addDialogVisible: false,
            // 添加表单的验证规则对象
            addFormRules: {
                userName: [
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    {
                        min: 0,
                        max: 10,
                        message: '用户名的长度在~10个字符之间',
                        trigger: 'blur'
                    }
                ],
                userRealName: [
                    { required: true, message: '请输入真实姓名', trigger: 'blur' },
                    {
                        min: 0,
                        max: 10,
                        message: '真实姓名的长度在3~10个字符之间',
                        trigger: 'blur'
                    }
                ],
                userEmail: [
                    { required: true, message: '请输入邮箱', trigger: 'blur' },
                    { validator: checkEmail, trigger: 'blur' }
                ],
                userPhone: [
                    { required: true, message: '请输入手机号', trigger: 'blur' },
                    { validator: checkMobile, trigger: 'blur' }
                ]
            },
        };
    },
    methods: {
        // 获取用户角色
        async userRoles() {
            const { data: res } = await this.$http.post('/role/getAllRoles', {
                roleName: this.roleName
            });
            // console.log(res);
            if (res.code !== '0000') {
                return this.$message('获取用户角色失败');
            } else {
                this.roleData = res.data;
            }
        },
        // 获取默认选中的角色值
        async userRole(row) {
            this.currRoleIds = [];
            const { data: res } = await this.$http.get('/role/getRoleByUser/' + row.userId);
            // console.log(res);
            if (res.code !== '0000') {
                return this.$message('获取默认角色失败');
            } else {
                this.currRoleIds = res.data;
            }
        },
        // 获取分公司
        async companyInfo() {
            const { data: res } = await this.$http.post('/companyInfo/getAllCompanys');
            if (res.code !== '0000') {
                return this.$message('获取分公司失败');
            } else {
                this.companyId = res.data;
                // console.log(res.data[5].companynum);
            }
        },
        // 添加新用户
        addUser() {
            this.$refs.addFormRef.validate(async valid => {
                console.log(valid);
                if (!valid) {
                    return;
                } else {
                    // 可以发起添加用户的网络请求
                    const { data: res } = await this.$http.post('/user/add', this.addForm);
                    // console.log(res.data)
                    if (res.code !== '0000') {
                        this.$message.error('添加用户失败');
                    } else {
                        this.$message.success('添加用户成功！');
                        // 隐藏添加用户的对话框
                        this.addDialogVisible = false;
                        // 重新获取用户列表数据
                        this.getUserList();
                    }
                }
            });
        },
        // 监听添加用户对话框的关闭事件
        addDialogClosed() {
            this.$refs.addFormRef.resetFields();
        },
    },
    components: {
        Search,
        Table,
        Page,
    }
};
</script>

<style scoped>
span {
    color: #606266;
    font-size: 14px;
    padding-right: 10px;
}
.el-input {
    width: 216px;
    display: inline-block;
}
.dialogDiv {
    height: 300px;
    overflow: auto;
}
</style>
