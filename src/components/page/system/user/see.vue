<template>
    <div>
        <el-button
            type="text"
            icon="el-icon-view"
            @click="userRole(scope.row),userRoles(),companyInfo(),editUserInfo(scope.$index, scope.row)"
        >查看</el-button>

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
    </div>
</template>

<script>
export default {
    data() {
        return {
            // 查看用户
            form: {},
            // 查看对话框的显示与隐藏
            viewVisible: false,
            // 默认选中的id值
            currRoleIds: [],
            // 角色数据总量
            roleData: [],
            // 分公司
            companyId: []
        };
    },
    methods: {
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
        }
    }
};
</script>