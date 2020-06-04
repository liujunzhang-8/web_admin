<template>
    <div>
        <el-button
            type="text"
            icon="el-icon-edit"
            @click="userRole(scope.row),userRoles(),companyInfo(),editUserInfo(scope.$index, scope.row)"
        >编辑</el-button>

        <!-- 编辑对话框 -->
        <el-dialog
            title="编辑用户"
            :visible.sync="editDialogVisible"
            width="40%"
            @close="editDialogClosed"
        >
            <div class="dialogDiv">
                <el-form
                    :rules="editFormRules"
                    ref="editFormRef"
                    :model="editForm"
                    label-width="80px"
                >
                    <el-form-item label="用户名">
                        <el-input v-model="editForm.userName" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="真实姓名">
                        <el-input v-model="editForm.userRealName"></el-input>
                    </el-form-item>
                    <el-form-item label="手机号码" prop="userPhone">
                        <el-input v-model="editForm.userPhone"></el-input>
                    </el-form-item>
                    <el-form-item label="电子邮箱" prop="userEmail">
                        <el-input v-model="editForm.userEmail"></el-input>
                    </el-form-item>
                    <el-form-item label="用户角色">
                        <template>
                            <el-checkbox-group v-model="currRoleIds">
                                <el-checkbox
                                    v-for="role in roleData"
                                    :label="role.roleId"
                                    :key="role.roleId"
                                >{{role.roleName}}</el-checkbox>
                            </el-checkbox-group>
                        </template>
                    </el-form-item>
                    <el-form-item label="分公司">
                        <el-select
                            v-model="editForm.companyId"
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
                    <el-form-item label="用户描述">
                        <el-input v-model="editForm.userSummary"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="editUser()">确 定</el-button>
                <el-button @click="editDialogVisible = false">取 消</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
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
            // 编辑用户
            editForm: {
                userName: '',
                userRealName: '',
                userPhone: '',
                userEmail: '',
                roles: [],
                companyId: '',
                userSummary: ''
            },
            // 编辑对话框的显示与隐藏
            editDialogVisible: false,
            // 编辑表单的验证规则对象
            editFormRules: {
                userPhone: [
                    { required: true, message: '请输入用户手机', trigger: 'blur' },
                    { validator: checkMobile, trigger: 'blur' }
                ],
                userEmail: [
                    { required: true, message: '请输入用户邮箱', trigger: 'blur' },
                    { validator: checkEmail, trigger: 'blur' }
                ]
            }
        };
    },
    methods: {
        // 打开编辑
        async editUserInfo(index, row) {
            const { data: res } = this.$http.get('/user/info/' + row.userId);
            this.editForm = row;
            let that = this;
            setTimeout(function() {
                that.editDialogVisible = true;
            }, 1200);
        },
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
        // 编辑用户
        editUser() {
            this.editForm.roles = this.currRoleIds;
            this.$refs.editFormRef.validate(async valid => {
                console.log(valid);
                if (!valid) {
                    return;
                } else {
                    // 可以发起编辑用户的网络请求
                    const { data: res } = await this.$http.post('/user/change', this.editForm);
                    if (res.code !== '0000') {
                        this.$message.error('编辑用户失败');
                    } else {
                        this.$message.success('编辑用户成功！');
                        // 隐藏添加用户的对话框
                        this.editDialogVisible = false;
                        // 重新获取用户列表数据
                        this.getUserList();
                    }
                }
            });
        },
        // 监听编辑用户对话框的关闭事件
        editDialogClosed() {
            this.$refs.editFormRef.resetFields();
        }
    }
};
</script>