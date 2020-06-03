<template>
    <div>
        <el-card>
            <!-- 获取所有的角色 -->
            <template>
                <el-tabs
                    :tab-position="tabPosition"
                    style="height: 100%;"
                    @tab-click="handleRoleClick"
                >
                    <!-- 系统角色管理 -->
                    <el-tab-pane label="【系统角色管理】">
                        <el-card>
                            <!-- 搜索与添加区域 -->
                            <el-form
                                :inline="true"
                                ref="queryRef"
                                :model="query"
                                :rules="queryRules"
                                class="demo-form-inline"
                            >
                                <el-form-item label="角色名称" prop="roleName">
                                    <el-input v-model="query.roleName" placeholder="角色名称" clearable></el-input>
                                </el-form-item>
                                <el-form-item>
                                    <el-button
                                        type="primary"
                                        icon="el-icon-search"
                                        size="mini"
                                        @click="searchAllRole()"
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
                                @click="roleAddVisible = true, getRoleCode()"
                            >添加</el-button>
                            <!-- 角色列表区域 -->
                            <el-table :data="roleList" border stripe>
                                <el-table-column prop="roleCode" label="角色编码" align="center"></el-table-column>
                                <el-table-column prop="roleName" label="角色名称" align="center"></el-table-column>
                                <el-table-column prop="roleSummary" label="角色描述" align="center"></el-table-column>
                                <el-table-column label="操作" width="220px" align="center">
                                    <template slot-scope="scope">
                                        <el-button
                                            type="text"
                                            icon="el-icon-view"
                                            @click="handleView(scope.$index, scope.row)"
                                        >查看</el-button>
                                        <el-button
                                            type="text"
                                            icon="el-icon-edit"
                                            @click="editRolesInfo(scope.row)"
                                        >编辑</el-button>
                                        <el-button
                                            type="text"
                                            icon="el-icon-delete"
                                            class="red"
                                            @click="deleteRole(scope.$index, scope.row)"
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

                        <!-- 添加弹出框 -->
                        <el-dialog
                            title="添加角色"
                            :visible.sync="roleAddVisible"
                            @close="roleAddClosed"
                            width="50%"
                        >
                            <!-- 内容主体区域 -->
                            <el-form
                                ref="addFormRef"
                                :model="addForm"
                                :rules="addFormRules"
                                label-width="80px"
                            >
                                <el-form-item label="角色编码">
                                    <el-input v-model="addForm.roleCode" disabled></el-input>
                                </el-form-item>
                                <el-form-item label="角色名称" prop="roleName">
                                    <el-input v-model="addForm.roleName"></el-input>
                                </el-form-item>
                                <el-form-item label="角色描述" prop="roleSummary">
                                    <el-input v-model="addForm.roleSummary"></el-input>
                                </el-form-item>
                            </el-form>
                            <!-- 底部区域 -->
                            <span slot="footer" class="dialog-footer">
                                <el-button @click="roleAddVisible = false">取 消</el-button>
                                <el-button type="primary" @click="addRole">提 交</el-button>
                            </span>
                        </el-dialog>

                        <!-- 查看弹出框 -->
                        <el-dialog title="查看角色" :visible.sync="viewVisible" width="50%">
                            <el-form ref="form" :model="form" label-width="80px">
                                <el-form-item label="角色编码">
                                    <el-input v-model="form.roleCode" disabled></el-input>
                                </el-form-item>
                                <el-form-item label="角色名称">
                                    <el-input v-model="form.roleName" disabled></el-input>
                                </el-form-item>
                                <el-form-item label="用户描述">
                                    <el-input v-model="form.roleSummary" disabled></el-input>
                                </el-form-item>
                            </el-form>
                            <span slot="footer" class="dialog-footer">
                                <el-button type="primary" @click="viewVisible = false">关 闭</el-button>
                            </span>
                        </el-dialog>

                        <!-- 编辑弹出框 -->
                        <el-dialog
                            title="编辑角色"
                            :visible.sync="roleEditVisible"
                            @close="roleEditClosed"
                            width="50%"
                        >
                            <!-- 内容主体区域 -->
                            <el-form
                                ref="editFormRef"
                                :model="editForm"
                                :rules="editFormRules"
                                label-width="80px"
                            >
                                <el-form-item label="角色编码" prop="roleCode">
                                    <el-input v-model="editForm.roleCode" disabled></el-input>
                                </el-form-item>
                                <el-form-item label="角色名称" prop="roleName">
                                    <el-input v-model="editForm.roleName"></el-input>
                                </el-form-item>
                                <el-form-item label="角色描述" prop="roleSummary">
                                    <el-input v-model="editForm.roleSummary"></el-input>
                                </el-form-item>
                            </el-form>
                            <span slot="footer" class="dialog-footer">
                                <el-button type="primary" @click="editRole">提 交</el-button>
                                <el-button @click="roleEditVisible = false">取 消</el-button>
                            </span>
                        </el-dialog>
                    </el-tab-pane>
                    <!-- 每个角色 -->
                    <el-tab-pane v-for="role in roleList" :label="role.roleName" :key="role.roleId">
                        <!-- {{role.roleId}} -->
                        <el-tabs
                            type="border-card"
                            v-model="activeName"
                            @tab-click="handleRightClick"
                        >
                            <el-tab-pane :label="`角色人员设置`" name="first">
                                <el-button
                                    type="primary"
                                    icon="el-icon-circle-plus-outline"
                                    @click="editRolesPeopleInfo()"
                                >添加</el-button>
                                <el-divider></el-divider>
                                <el-table
                                    :data="rolePeopleData"
                                    border
                                    class="table"
                                    ref="multipleTable"
                                    header-cell-class-name="table-header"
                                >
                                    <el-table-column prop="userName" label="用户名称" align="center"></el-table-column>
                                    <el-table-column
                                        prop="userRealName"
                                        label="真实姓名"
                                        align="center"
                                    ></el-table-column>
                                    <el-table-column prop="userPhone" label="手机号码" align="center"></el-table-column>
                                    <el-table-column prop="userEmail" label="电子邮箱" align="center"></el-table-column>
                                </el-table>
                                <el-pagination
                                    @size-change="handleRolePeopleSizeChange"
                                    @current-change="handleRolePeopleCurrentChange"
                                    :current-page="queryRolePeople.pageNum"
                                    :page-sizes="[10, 20, 50, 100]"
                                    :page-size="queryRolePeople.pageSize"
                                    layout="total, sizes, prev, pager, next, jumper"
                                    :total="totalRolePeople"
                                ></el-pagination>
                            </el-tab-pane>

                            <el-tab-pane :label="`角色菜单设置`" name="second">
                                <el-button
                                    type="primary"
                                    icon="el-icon-circle-plus-outline"
                                    @click="editRolesMenuInfo()"
                                >添加</el-button>
                                <el-divider></el-divider>
                                <el-table
                                    :data="roleMenuData"
                                    border
                                    class="table"
                                    ref="multipleTable"
                                    header-cell-class-name="table-header"
                                >
                                    <el-table-column prop="menuName" label="菜单名称" align="center"></el-table-column>
                                    <el-table-column prop="menuUrl" label="菜单URL" align="center"></el-table-column>
                                    <el-table-column prop="menuSummary" label="菜单描述" align="center"></el-table-column>
                                </el-table>
                                <el-pagination
                                    @size-change="handleRoleMenuSizeChange"
                                    @current-change="handleRoleMenuCurrentChange"
                                    :current-page="queryRoleMenu.pageNum"
                                    :page-sizes="[10, 20, 50, 100]"
                                    :page-size="queryRoleMenu.pageSize"
                                    layout="total, sizes, prev, pager, next, jumper"
                                    :total="totalRoleMenu"
                                ></el-pagination>
                            </el-tab-pane>
                        </el-tabs>
                    </el-tab-pane>
                </el-tabs>

                <!-- 角色人员设置添加 -->
                <el-dialog
                    title="角色人员设置"
                    :visible.sync="rolePeopleEditVisible"
                    class="diaForm"
                    @close="rolePeopleEditClosed"
                >
                    <el-transfer
                        v-model="yesUserData"
                        filterable
                        filter-placeholder="请输入人员名称"
                        :props="{key: 'userId',label: 'userName'}"
                        :titles="['待选人员', '已选人员']"
                        :data="noUserData"
                    ></el-transfer>

                    <span slot="footer" class="dialog-footer">
                        <el-button type="primary" @click="commitRolePeople">提 交</el-button>
                        <el-button @click="rolePeopleEditVisible = false">取 消</el-button>
                    </span>
                </el-dialog>

                <!-- 角色菜单设置添加 -->
                <el-dialog
                    title="角色菜单权限设置"
                    :visible.sync="roleMenuEditVisible"
                    class="diaForm"
                    @close="roleMenuEditClosed"
                >
                    <el-tree
                        :data="groupTreeData"
                        show-checkbox
                        ref="RoleMenuGroupTree"
                        node-key="id"
                        @check="checkGroupNode"
                        :default-expand-all="true"
                    ></el-tree>

                    <span slot="footer" class="dialog-footer">
                        <el-button type="primary" @click="commitRoleMenu">提 交</el-button>
                        <el-button @click="roleMenuEditVisible = false">取 消</el-button>
                    </span>
                </el-dialog>
            </template>
        </el-card>
    </div>
</template>

<script>
export default {
    name: 'basetable',
    data() {
        // debugger;
        return {
            groupTreeDataSelect: [],
            groupTreeData: [],
            noUserData: [],
            yesUserData: [],
            tabPosition: 'left',
            activeName: 'first',
            // 搜索角色
            query: {
                roleCode: '',
                roleName: '',
                roleSummary: '',
                pageNum: 1,
                pageSize: 10
            },
            // 搜索角色人员
            queryRolePeople: {
                roleCode: '',
                pageNum: 1,
                pageSize: 10
            },
            // 搜索角色人员2
            queryAddRolePeople: {
                roleId: ''
            },
            // 搜索角色菜单
            queryRoleMenu: {
                roleId: '',
                pageNum: 1,
                pageSize: 10
            },
            message: 'first',
            // 角色列表
            roleList: [],
            // 角色菜单列表
            roleMenuList: [],
            total: 0,
            totalRolePeople: 0,
            totalRoleMenu: 0,
            // 控制添加角色对话框的显示与隐藏
            roleAddVisible: false,
            // 添加角色人员设置的显示与隐藏
            rolePerson: false,
            // 添加角色菜单设置的显示与隐藏
            roleMenu: false,
            // 添加角色的表单数据
            addForm: {
                roleCode: '',
                roleName: '',
                roleSummary: ''
            },
            //提交角色人员信息
            commitRolePeopleForm: {
                userIds: '',
                roleId: ''
            },
            //提交角色菜单权限信息
            commitRoleMenuForm: {
                menuIds: '',
                roleId: '',
                operateIds: ''
            },
            // 控制查看角色对话框的显示与隐藏
            roleViewVisible: false,
            // 控制编辑角色对话框的显示与隐藏
            roleEditVisible: false,
            rolePeopleEditVisible: false,
            roleMenuEditVisible: false,
            // 编辑角色的表单数据
            editForm: {
                roleCode: '',
                roleName: '',
                roleSummary: ''
            },
            queryRules: {
                roleName: [{ required: false, message: '请输入角色名称', trigger: 'blur' }]
            },
            // 添加表单的验证规则对象
            addFormRules: {
                roleCode: [{ required: true, message: '请输入角色编码', trigger: 'blur' }],
                roleName: [{ required: true, message: '请输入角色名称', trigger: 'blur' }]
            },
            // 编辑表单规则的验证规则
            editFormRules: {
                roleCode: [{ required: true, message: '请输入角色编码', trigger: 'blur' }],
                roleName: [{ required: true, message: '请输入角色名称', trigger: 'blur' }]
            },
            viewVisible: false,
            editVisible: false,
            form: {},
            rolePeopleData: [],
            roleMenuData: [],
            value: [],
            rolePerson: {},
            currCheckRoleId: 0,
            currCheckRoleCode: ''
        };
    },
    created() {
        this.getRoleList();
        // this.getRoleMenu()
        // this.getRolePeopleList();
    },
    methods: {
        checkGroupNode: function(a, b) {
            // if (b.checkedKeys.length > 0) {
            //     this.$refs.RoleMenuGroupTree.setCheckedKeys([a.id]);
            // }
            // console.log("------>"+b.checkedKeys);
            // console.log('bb------>' + this.$refs.RoleMenuGroupTree.getCheckedKeys());
        },
        // 获取角色列表
        async getRoleList() {
            this.searchAllRole();
        },
        async getRolePeopleList() {
            this.queryRolePeople.roleCode = this.currCheckRoleCode;
            const { data: res } = await this.$http.post('/role/findRolePeopleList', this.queryRolePeople);
            // console.log(res.data);
            if (res.code !== '0000') {
                return this.$message('获取用户列表失败');
            } else {
                this.rolePeopleData = res.data;
                this.totalRolePeople = res.page.total;
            }
        },
        async getRoleMenuList() {
            this.queryRoleMenu.roleId = this.currCheckRoleId;
            const { data: res } = await this.$http.post('/role/findRoleMenuList', this.queryRoleMenu);
            // console.log(res.data);
            if (res.code !== '0000') {
                return this.$message('获取用户列表失败');
            } else {
                this.roleMenuData = res.data;
                this.totalRoleMenu = res.page.total;
            }
        },
        // 清空搜索区域数据
        resetForm() {
            this.$refs.queryRef.resetFields();
        },
        // 搜索角色
        async searchAllRole() {
            const { data: res } = await this.$http.post('/role/getAllRoles', this.query);
            // console.log(res.data);
            if (res.code !== '0000') {
                return this.$message('获取角色列表失败');
            } else {
                this.roleList = res.data;
                this.total = res.page.total;
            }
        },
        // 获取角色编码
        async getRoleCode() {
            const { data: res } = await this.$http.post('/role/getCode');
            // console.log(res.data);
            if (res.code !== '0000') {
                return this.$message('获取角色编码失败');
            } else {
                this.addForm.roleCode = res.data;
            }
        },
        // 监听添加角色对话框的关闭事件
        roleAddClosed() {
            this.$refs.addFormRef.resetFields();
        },
        // 监听编辑角色对话框的关闭事件
        roleEditClosed() {
            this.$refs.editFormRef.resetFields();
        },
        rolePeopleEditClosed() {
            this.rolePeopleEditVisible = false;
        },
        roleMenuEditClosed() {
            this.roleMenuEditVisible = false;
        },
        // 点击按钮，添加新角色
        addRole() {
            this.$refs.addFormRef.validate(async valid => {
                // console.log(valid);
                if (!valid) {
                    return;
                } else {
                    // 可以发起添加用户的网络请求
                    const { data: res } = await this.$http.post('/role/add', this.addForm);
                    // console.log(res.data);
                    if (res.code !== '0000') {
                        this.$message.error('添加角色失败！');
                    } else {
                        this.$message.success('添加角色成功！');
                        // 隐藏添加用户角色的对话框
                        this.roleAddVisible = false;
                        // 重新获取角色列表数据
                        this.getRoleList();
                    }
                }
            });
        },
        // 删除操作
        async deleteRole(index, row) {
            // 二次确认删除
            const confirmResult = await this.$confirm('确定要删除吗？', '警告', {
                type: 'warning'
            }).catch(err => err);
            // console.log(confirmResult);
            if (confirmResult !== 'confirm') {
                return this.$message.info('已取消删除！');
            }
            const { data: res } = await this.$http.get('/role/deleteRole/' + row.roleId);
            if (res.code !== '0000') {
                return this.$message.error('删除角色失败！');
            }
            this.$message.success('删除角色成功！');
            this.getRoleList();
            this.roleList.splice(index, 1);
        },
        // 查看操作
        async handleView(index, row) {
            const { data: res } = this.$http.get('/role/showRoles/' + row.roleCode);
            this.form = row;
            this.viewVisible = true;
        },
        // 编辑操作
        editRolesInfo(row) {
            this.editForm = row;
            this.roleEditVisible = true;
        },
        editRolesPeopleInfo() {
            this.getBeforeaAddRolePeopleInfo();
        },
        editRolesMenuInfo() {
            this.findRoleMenuOperateList();
        },
        editRole() {
            this.$refs.editFormRef.validate(async valid => {
                // console.log(valid);
                if (!valid) {
                    return;
                } else {
                    // 可以发起编辑角色的网络请求
                    const { data: res } = await this.$http.post('/role/change', this.editForm);
                    this.$message.success('编辑成功！');
                    // 隐藏编辑角色的对话框
                    this.roleEditVisible = false;
                    // 重新获取角色列表数据
                    this.getRoleList();
                }
            });
        },
        // 保存添加角色人员
        async commitRolePeople() {
            this.commitRolePeopleForm.roleId = this.currCheckRoleId;
            this.commitRolePeopleForm.userIds = this.yesUserData.toString();
            const { data: res } = await this.$http.post('/role/commitRolePeopleList', this.commitRolePeopleForm);
            // console.log(res.data);
            this.$message.success('添加角色人员成功！');
            this.rolePeopleEditVisible = false;
            this.getRolePeopleList();
        },
        // 保存添加角色菜单信息
        async commitRoleMenu() {
            this.commitRoleMenuForm.roleId = this.currCheckRoleId;
            var checkedkeys = this.$refs.RoleMenuGroupTree.getCheckedKeys();
            var menuIds = [];
            var operateIds = [];
            for (var index in checkedkeys) {
                var key1 = checkedkeys[index].toString();
                var key_flag = key1.slice(0, key1.indexOf(','));
                if (key_flag == 'O') {
                    var operateId = key1.slice(key1.indexOf(',') + 1, key1.indexOf('_'));
                    var menuId = key1.slice(key1.indexOf('_') + 1);
                    menuIds.push(menuId);
                    operateIds.push(operateId);
                }
            }
            menuIds.sort();
            for (var i = 0; i < menuIds.length - 1; i++) {
                if (menuIds[i] == menuIds[i + 1]) {
                    menuIds.splice(i + 1, 1);
                    i--;
                }
            }
            this.commitRoleMenuForm.menuIds = menuIds.toString(); //operateIds
            this.commitRoleMenuForm.operateIds = operateIds.toString();
            // console.log("menuIds------>"+menuIds.toString());
            // console.log("operateIds------>"+operateIds.toString());
            const { data: res } = await this.$http.post('/role/commitRoleMenuOperateList', this.commitRoleMenuForm);
            // console.log(res.data);
            this.$message.success('添加角色菜单成功！');
            this.roleMenuEditVisible = false;
            this.getRoleMenuList();
            // this.getMenuList();
        },
        async getBeforeaAddRolePeopleInfo() {
            this.noUserData = [];
            this.yesUserData = [];
            this.queryAddRolePeople.roleId = this.currCheckRoleId;
            const { data: res } = await this.$http.post('/role/beforeaAddRolePeople', this.queryAddRolePeople);
            // console.log(res.data);
            this.rolePeopleEditVisible = true;
            this.noUserData = res.data.leftUsers;
            var rightUsers = res.data.rightUsers;
            var leftlength = res.data.leftUsers.length;
            var rightlength = res.data.rightUsers.length;
            for (var index in rightUsers) {
                this.noUserData.push(rightUsers[index]);
                this.yesUserData.push(rightUsers[index].userId);
            }
        },
        async findRoleMenuOperateList() {
            let that = this;
            that.groupTreeData = [];
            that.groupTreeDataSelect = [];
            this.queryAddRolePeople.roleId = this.currCheckRoleId;
            const { data: res } = await this.$http.post('/role/findRoleMenuOperateList', this.queryAddRolePeople);
            // console.log(res.data);
            if (res.code !== '0000') {
                return this.$message('获取角色菜单操作列表失败');
            } else {
                res.data.forEach(value => {
                    var object_1 = { id: -1, label: '', disabled: false, children: [] };
                    object_1.id = 'F,' + value.id;
                    object_1.label = value.name;

                    value.list.forEach(value2 => {
                        var object_2 = { id: -1, label: '', disabled: false, children: [] };
                        object_2.id = 'M,' + value2.cMenu.id;
                        object_2.label = value2.cMenu.name;

                        value2.cMenu.list.forEach(value3 => {
                            var object_3 = { id: -1, label: '', disabled: false, children: [] };
                            object_3.id = 'O,' + value3.operate.id + '_' + value2.cMenu.id;
                            object_3.label = value3.operate.name;
                            if (value3.operate.isCheck == 'true') {
                                that.groupTreeDataSelect.push(object_3.id);
                            }
                            object_2.children.push(object_3);
                        });

                        object_1.children.push(object_2);
                    });

                    that.groupTreeData.push(object_1);
                });
                // console.log('that.groupTreeDataSelect-->' + that.groupTreeDataSelect);
                setTimeout(function() {
                    that.groupTreeDataSelect.forEach(value => {
                        that.$refs.RoleMenuGroupTree.setChecked(value, true, false);
                    });
                }, 10);
            }
            this.roleMenuEditVisible = true;
        },
        // 监听pagesize改变的事件
        handleSizeChange(newSize) {
            this.query.pageSize = newSize;
            this.getRoleList();
        },
        // 监听页码值改变事件
        handleCurrentChange(newPage) {
            this.query.pageNum = newPage;
            this.getRoleList();
        },
        // 监听pagesize改变的事件角色人员信息
        handleRolePeopleSizeChange(newSize) {
            this.queryRolePeople.pageSize = newSize;
            this.getRolePeopleList();
        },
        // 监听页码值改变事件角色人员信息
        handleRolePeopleCurrentChange(newPage) {
            this.queryRolePeople.pageNum = newPage;
            this.getRolePeopleList();
        },
        // 监听pagesize改变的事件角色人员信息
        handleRoleMenuSizeChange(newSize) {
            this.queryRoleMenu.pageSize = newSize;
            this.getRoleMenuList();
        },
        // 监听页码值改变事件角色人员信息
        handleRoleMenuCurrentChange(newPage) {
            this.queryRoleMenu.pageNum = newPage;
            this.getRoleMenuList();
        },
        handleRoleClick: function(tab, event) {
            var id = event.target.getAttribute('id') + '';
            // console.log('id-->' + id);
            var index = id.replace('tab-', '');
            if (index >= 1) {
                // console.log('index-->' + index);
                var roleId = this.roleList[index - 1].roleId;
                var roleCode = this.roleList[index - 1].roleCode;
                // console.log('role-->' + roleId + ',roleCode-->' + roleCode);
                this.currCheckRoleId = roleId;
                this.currCheckRoleCode = roleCode;
                // console.log('activeName-->' + this.activeName);
                if (this.activeName == 'first') {
                    this.getRolePeopleList();
                } else {
                    this.getRoleMenuList();
                }
            }
        },
        handleRightClick: function(tab, event) {
            // console.log('activeName-->' + this.activeName);
            if (this.activeName == 'first') {
                this.getRolePeopleList();
            } else {
                this.getRoleMenuList();
            }
        }
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
    margin-right: 10px;
}
.el-table {
    width: 100%;
    margin-top: 20px;
    font-size: 14px;
}
.red {
    color: #ff0000;
}
.btn {
    margin-top: 16px;
}
.el-pagination {
    margin-top: 20px;
    margin-bottom: 10px;
    float: right;
}
</style>
