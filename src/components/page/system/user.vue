<template>
    <div>
        <el-card>
            <!-- 搜索与添加区域 -->
            <el-form
                :inline="true"
                ref="queryRef"
                :model="query"
                :rules="queryRules"
                class="demo-form-inline"
            >
                <el-form-item label="用户名称" prop="userName">
                    <el-input v-model="query.userName" placeholder="用户名称" clearable></el-input>
                </el-form-item>
                <el-form-item label="真实姓名" prop="userRealName">
                    <el-input v-model="query.userRealName" placeholder="真实姓名" clearable></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button
                        type="primary"
                        icon="el-icon-search"
                        size="mini"
                        @click="searchUser()"
                    >搜索</el-button>
                    <el-button
                        type="warning"
                        icon="el-icon-refresh-left"
                        size="mini"
                        @click="resetForm()"
                    >清空</el-button>
                </el-form-item>
            </el-form>
            <el-button
                class="btn"
                type="primary"
                icon="el-icon-circle-plus-outline"
                size="mini"
                @click="userRoles(),companyInfo(),addDialogVisible = true"
            >添加</el-button>
            <!-- 用户列表区域 -->
            <el-table :data="userlist" border stripe>
                <el-table-column prop="userId" label="ID" align="center" width="50"></el-table-column>
                <el-table-column prop="userName" label="用户名" align="center"></el-table-column>
                <el-table-column prop="userRealName" label="真实姓名" align="center"></el-table-column>
                <el-table-column prop="userPhone" label="手机号码" align="center"></el-table-column>
                <el-table-column
                    prop="userEmail"
                    label="电子邮箱"
                    align="center"
                    width="160"
                    show-overflow-tooltip
                ></el-table-column>
                <el-table-column prop="userSummary" label="用户描述" align="center"></el-table-column>
                <el-table-column prop="createdDate" label="创建时间" align="center" width="160"></el-table-column>
                <el-table-column label="操作" width="220px" align="center">
                    <template slot-scope="scope">
                        <!-- 查看按钮 -->
                        <el-button
                            type="text"
                            icon="el-icon-view"
                            @click="userRole(scope.row),userRoles(),companyInfo(),handleView(scope.row)"
                        >查看</el-button>
                        <!-- 修改按钮 -->
                        <el-button
                            type="text"
                            icon="el-icon-edit"
                            @click="userRole(scope.row),userRoles(),companyInfo(),editUserInfo(scope.$index, scope.row)"
                        >编辑</el-button>
                        <!-- 删除按钮 -->
                        <el-button
                            type="text"
                            icon="el-icon-delete"
                            class="red"
                            @click="deleteUser(scope.$index, scope.row)"
                        >删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页 -->
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="query.pageNum"
                :page-sizes="[5, 10, 15, 20]"
                :page-size="query.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
            ></el-pagination>
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

        <!-- 查看弹出框 -->
        <el-dialog title="查看用户" :visible.sync="viewVisible" class="diaForm" width="40%">
            <div class="dialogDiv">
                <el-form ref="form" :model="form" label-width="80px">
                    <el-form-item label="用户名">
                        <el-input v-model="form.userName" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="真实姓名">
                        <el-input v-model="form.userRealName" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="手机号码">
                        <el-input v-model="form.userPhone" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="电子邮箱">
                        <el-input v-model="form.userEmail" class="handle-input" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="用户角色">
                        <template>
                            <el-checkbox-group v-model="currRoleIds" disabled>
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
                            v-model="form.companyId"
                            placeholder="请选择"
                            value-key="companynum"
                            disabled
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
                        <el-input v-model="form.userSummary" disabled></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="viewVisible = false">返 回</el-button>
            </span>
        </el-dialog>

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
            // 用户总量
            total: 0,
            // 用户列表
            userlist: [],
            // 默认选中的id值
            currRoleIds: [],
            // 角色数据总量
            roleData: [],
            // 分公司
            companyId: [],
            // 搜索用户
            query: {
                userName: '',
                userRealName: '',
                pageSize: 5
            },
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
            queryRules: {
                userName: [{ required: false, message: '请输入用户名称', trigger: 'blur' }],
                userRealName: [{ required: false, message: '请输入真实姓名', trigger: 'blur' }]
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
            // 查看用户
            form: {},
            // 查看对话框的显示与隐藏
            viewVisible: false,
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
            },
            // 获取操作功能点
            // operationList: []
        };
    },
    created() {
        this.getUserList();
        // this.searchOperation();
    },
    methods: {
        // 获取用户列表
        async getUserList() {
            this.searchUser();
        },
        // 搜索用户
        async searchUser() {
            const { data: res } = await this.$http.post('/user/list', this.query);
            // console.log(res);
            if (res.code !== '0000') {
                return this.$message('获取用户列表失败');
            } else {
                this.userlist = res.data;
                this.total = res.page.total;
            }
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
        // 清空搜索区域数据
        resetForm() {
            this.$refs.queryRef.resetFields();
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
        // 查看操作
        async handleView(row) {
            const { data: res } = this.$http.get('/user/info/' + row.userId);
            // console.log(row.userId);
            this.form = row;
            let that = this;
            setTimeout(function() {
                that.viewVisible = true;
            }, 1200);
        },
        // 打开编辑
        async editUserInfo(index,row) {
            const { data: res } = this.$http.get('/user/info/' + row.userId);
            this.editForm = row;
            let that = this;
            setTimeout(function() {
                that.editDialogVisible = true;
            }, 1200);
        },
        // 编辑用户
        editUser() {
            this.editForm.roles=this.currRoleIds;
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
        },
        // 删除操作
        deleteUser(index, row) {
            // 二次确认删除
            this.$confirm('确定要删除吗？', '警告', {
                type: 'warning'
            })
                .then(async valid => {
                    console.log(valid);
                    if (!valid) {
                        return;
                    } else {
                        const { data: res } = await this.$http.get('/user/deleteUser/' + row.userId);
                        if (res.code !== '0000') {
                            return this.$message.error('删除用户失败！');
                        } else {
                            this.$message.success('删除用户成功');
                            this.userlist.splice(index, 1);
                            this.getUserList();
                        }
                    }
                })
                .catch(() => {});
        },
        // 监听pagesize改变的事件
        handleSizeChange(newSize) {
            this.query.pageSize = newSize;
            this.getUserList();
        },
        // 监听页码值改变事件
        handleCurrentChange(newPage) {
            this.query.pageNum = newPage;
            this.getUserList();
        }
    },
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
.el-table {
    width: 100%;
    margin-top: 20px;
    font-size: 14px;
}
.btn {
    margin-top: 16px;
}
.red {
    color: #ff0000;
}
.mr10 {
    margin-right: 10px;
}
.dialogDiv {
    height: 300px;
    overflow: auto;
}
.el-pagination {
    margin-top: 20px;
    margin-bottom: 10px;
    float: right;
}
</style>
