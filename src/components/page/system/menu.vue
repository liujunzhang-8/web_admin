<template>
    <div>
        <el-card>
            <!-- 搜索区域 -->
            <el-form
                :inline="true"
                ref="queryRef"
                :model="query"
                :rules="queryRules"
                class="demo-form-inline"
            >
                <el-form-item label="菜单名称" prop="menuName">
                    <el-input v-model="query.menuName" placeholder="请输入菜单名称" clearable></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button
                        type="primary"
                        icon="el-icon-search"
                        size="mini"
                        @click="searchMenu()"
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
                @click="addMenuTab = true"
            >添加</el-button>
            <el-table :data="menuList" border stripe>
                <el-table-column prop="menuName" label="菜单名称" align="center"></el-table-column>
                <el-table-column prop="menuUrl" label="菜单地址" align="center"></el-table-column>
                <el-table-column prop="menuOrder" label="显示顺序" align="center"></el-table-column>
                <el-table-column prop="menuParentCodeDesc" label="父级菜单" align="center"></el-table-column>
                <el-table-column prop="menuSummary" label="描述" align="center"></el-table-column>
                <el-table-column label="操作" width="220px" align="center">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-view"
                            @click="viewMenu(scope.$index, scope.row)"
                        >查看</el-button>
                        <el-button
                            type="text"
                            icon="el-icon-edit"
                            @click="editMenu(scope.$index, scope.row)"
                        >编辑</el-button>
                        <el-button
                            type="text"
                            icon="el-icon-delete"
                            class="red"
                            @click="deleteMenu(scope.$index, scope.row)"
                        >删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="query.pageNum"
                :page-sizes="[1, 2, 5, 10]"
                :page-size="query.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
            ></el-pagination>
        </el-card>

        <!-- 添加菜单弹出框 -->
        <el-dialog
            title="添加菜单"
            :visible.sync="addMenuTab"
            class="diaForm"
            @close="addDialogClosed()"
        >
            <el-form ref="addMenuRef" :model="addMenu" :rules="addMenuRules" label-width="100px">
                <el-form-item label="菜单名称" prop="menuName">
                    <el-input v-model="addMenu.menuName" placeholder="请输入菜单名称"></el-input>
                </el-form-item>
                <el-form-item label="菜单地址" prop="menuUrl">
                    <el-input v-model="addMenu.menuUrl" placeholder="请输入菜单地址"></el-input>
                </el-form-item>
                <el-form-item label="显示顺序" prop="menuOrder">
                    <el-input v-model="addMenu.menuOrder" placeholder="请输入显示顺序"></el-input>
                </el-form-item>
                <el-form-item label="父级菜单">
                    <el-select
                        v-model="addMenu.menuParentCode"
                        placeholder="请选择"
                        value-key="menuParentCode"
                    >
                        <el-option
                            v-for="item in parentMenu"
                            :key="item.menuParentCode"
                            :value="item.menuId"
                            :label="item.menuName"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="菜单描述" prop="menuSummary">
                    <el-input v-model="addMenu.menuSummary" placeholder="请输入菜单描述" show-word-limit></el-input>
                </el-form-item>
            </el-form>
            <!-- 底部区域 -->
            <span slot="footer">
                <el-button @click="addMenuTab = false">取 消</el-button>
                <el-button type="primary" @click="addMenuList">确 认</el-button>
            </span>
        </el-dialog>

        <!-- 查看菜单弹出框 -->
        <el-dialog title="查看菜单" :visible.sync="viewMenuTab" class="diaForm">
            <el-form ref="viewMenuRef" :model="viewMenuModel" label-width="90px">
                <el-form-item label="菜单名称" prop="menuName">
                    <el-input v-model="viewMenuModel.menuName" disabled></el-input>
                </el-form-item>
                <el-form-item label="菜单地址" prop="menuUrl">
                    <el-input v-model="viewMenuModel.menuUrl" disabled></el-input>
                </el-form-item>
                <el-form-item label="显示顺序" prop="menuOrder">
                    <el-input v-model="viewMenuModel.menuOrder" disabled></el-input>
                </el-form-item>
                <el-form-item label="父级菜单" prop="menuParentCode">
                    <el-select
                        v-model="viewMenuModel.menuParentCode"
                        placeholder="请选择"
                        value-key="menuName"
                        disabled
                    >
                        <el-option
                            v-for="item in parentMenu"
                            :key="item.menuId"
                            :value="item.menuId"
                            :label="item.menuName"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="菜单描述" prop="menuSummary">
                    <el-input v-model="viewMenuModel.menuSummary" disabled></el-input>
                </el-form-item>
            </el-form>
            <!-- 底部区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="viewMenuTab = false">返 回</el-button>
            </span>
        </el-dialog>

        <!-- 编辑菜单弹出框 -->
        <el-dialog title="编辑菜单" :visible.sync="editMenuTab" class="diaForm">
            <el-form
                ref="editMenuRef"
                :model="editMenuModel"
                :rules="editMenuRules"
                label-width="90px"
                @close="editDialogClosed()"
            >
                <el-form-item label="菜单名称" prop="menuName">
                    <el-input v-model="editMenuModel.menuName"></el-input>
                </el-form-item>
                <el-form-item label="菜单地址" prop="menuUrl">
                    <el-input v-model="editMenuModel.menuUrl"></el-input>
                </el-form-item>
                <el-form-item label="显示顺序" prop="menuOrder">
                    <el-input v-model="editMenuModel.menuOrder"></el-input>
                </el-form-item>
                <el-form-item label="父级菜单" prop="menuParentCode">
                    <el-select v-model="editMenuModel.menuParentCode">
                        <el-option
                            v-for="item in parentMenu"
                            :key="item.menuId"
                            :value="item.menuId"
                            :label="item.menuName"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="菜单描述" prop="menuSummary">
                    <el-input v-model="editMenuModel.menuSummary"></el-input>
                </el-form-item>
            </el-form>
            <!-- 底部区域 -->
            <span slot="footer">
                <el-button type="primary" @click="editMenuInfo">确 定</el-button>
                <el-button @click="editMenuTab = false">取 消</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            // 搜索菜单
            query: {
                menuName: '',
                pageNum: 1,
                pageSize: 5
            },
            // 添加菜单的表单数据
            addMenu: {
                menuName: '',
                menuUrl: '',
                menuOrder: '',
                menuParentCode: '',
                menuSummary: ''
            },
            // 编辑菜单的表单数据
            editMenuModel: {},
            // 查看菜单
            viewMenuModel: {},
            tableData: [],
            total: 0,
            // 菜单列表
            menuList: [],
            // 父级菜单列表
            parentMenu: [],
            // 控制添加弹出框
            addMenuTab: false,
            // 控制查看弹出框
            viewMenuTab: false,
            // 控制编辑弹出框
            editMenuTab: false,
            // 搜索表单验证
            queryRules: {
                menuName: [{ required: false, message: '请输入菜单名称', trigger: 'blur' }]
            },
            // 添加表单的验证规则
            addMenuRules: {
                menuName: [{ required: true, message: '请输入菜单名称', trigger: 'blur' }],
                menuUrl: [{ required: true, message: '请输入菜单地址', trigger: 'blur' }],
                menuOrder: [{ required: true, message: '请输入显示顺序', trigger: 'blur' }],
                menuParentCode: [{ required: true, message: '请选择父级菜单', trigger: 'change' }],
                menuSummary: [{ required: true, message: '请输入显示顺序', trigger: 'blur' }]
            },
            editMenuRules: {
                menuName: [{ required: true, message: '请输入菜单名称', trigger: 'blur' }],
                menuUrl: [{ required: true, message: '请输入菜单地址', trigger: 'blur' }]
            }
        };
    },
    created() {
        this.parentMenus();
        this.getMenuList();
    },
    methods: {
        // 获取菜单
        async getMenuList() {
            this.searchMenu();
        },
        // 搜索菜单
        async searchMenu() {
            const { data: res } = await this.$http.post('/menu/list', this.query);
            // console.log(res.data);
            if (res.code !== '0000') {
                return this.$message.error('获取菜单列表失败');
            } else {
                this.menuList = res.data;
                this.dealMenuListData();
                this.total = res.page.total;
            }
        },
        // 清空搜索区域数据
        resetForm() {
            this.$refs.queryRef.resetFields();
        },
        // 添加菜单列表
        addMenuList() {
            this.$refs.addMenuRef.validate(async valid => {
                // console.log(valid);
                if (!valid) {
                    return;
                } else {
                    // 可以发起添加用户的网络请求
                    const { data: res } = await this.$http.post('/menu/add', this.addMenu);
                    // console.log(res.data)
                    if (res.code !== '0000') {
                        this.$message.error('添加菜单失败');
                    } else {
                        this.$message.success('添加菜单成功！');
                        // 隐藏添加用户的对话框
                        this.addMenuTab = false;
                        this.parentMenus();
                        this.getMenuList();
                    }
                }
            });
        },
        // 监听添加用户对话框的关闭事件
        addDialogClosed() {
            this.$refs.addMenuRef.resetFields();
        },
        // 监听编辑用户对话框的关闭事件
        editDialogClosed() {
            this.$refs.addMenuRef.resetFields();
        },
        // 获取父级菜单集合
        async parentMenus() {
            const { data: res } = await this.$http.get('/menu/parentMenus');
            // this.parentMenu = res.data;
            this.parentMenu = [];
            var obj = { menuId: '0', menuName: '--无上级--' };
            this.parentMenu.push(obj);
            // console.log(res.data[5].companynum);
            res.data.forEach(value => {
                value.menuId = value.menuId + ''; //字符串 数字问题
                this.parentMenu.push(value);
            });
            this.dealMenuListData();
        },
        async dealMenuListData() {
            let that = this;
            // console.log(that.menuList.length);
            if (that.menuList.length == 0 || that.parentMenu.length == 0) {
                setTimeout(function() {
                    that.dealMenuListData();
                }, 200);
            } else {
                var obj_1 = [];
                that.menuList.forEach(value => {
                    that.parentMenu.forEach(value2 => {
                        if (value2.menuId + '' == value.menuParentCode + '') {
                            value.menuParentCodeDesc = value2.menuName;
                            obj_1.push(value);
                        }
                    });
                });
                that.menuList = obj_1;
            }
        },
        // 监听pagesize改变的事件
        handleSizeChange(newSize) {
            // console.log(newSize);
            this.query.pageSize = newSize;
            this.getMenuList();
        },
        // 监听页码值改变事件
        handleCurrentChange(newPage) {
            // console.log(newPage);
            this.query.pageNum = newPage;
            this.getMenuList();
        },
        // 查看操作
        async viewMenu(index, row) {
            // const { data: res } = this.$http.get('/menu/menuInfo/' + row.menuId);
            this.idx = index;
            this.viewMenuModel = row;
            this.viewMenuTab = true;
        },
        // 修改菜单信息并提交
        editMenu(index, row) {
            this.idx = index;
            this.editMenuModel = row;
            this.editMenuTab = true;
        },
        // 编辑菜单
        editMenuInfo() {
            this.$refs.editMenuRef.validate(async valid => {
                // console.log(valid);
                if (!valid) {
                    return;
                } else {
                    // 可以发起添加用户的网络请求
                    const { data: res } = await this.$http.post('/menu/change', this.editMenuModel);
                    if (res.code !== '0000') {
                        this.$message.error('编辑用户失败');
                    } else {
                        this.$message.success(`编辑菜单成功`);
                        // 隐藏添加用户的对话框
                        this.editMenuTab = false;
                        this.parentMenus();
                        this.getMenuList();
                    }
                }
            });
        },
        // 删除操作
        deleteMenu(index, row) {
            // 二次确认删除
            this.$confirm('确定要删除吗？', '警告', {
                type: 'warning'
            })
                .then(async valid => {
                    // console.log(valid);
                    if (!valid) {
                        return;
                    } else {
                        const { data: res } = await this.$http.get('/menu/deleMenuInfo/' + row.menuId);
                        if (res.code !== '0000') {
                            return this.$message.error('删除菜单失败！');
                        } else {
                            this.$message.success('删除菜单成功！');
                            this.menuList.splice(index, 1);
                            this.parentMenus();
                            this.getMenuList();
                        }
                    }
                })
                .catch(() => {});
        }
    }
};
</script>

<style lang="scss" scoped>
span {
    color: #606266;
    font-size: 14px;
    padding-right: 10px;
}
.searchDiv {
    margin-bottom: 16px;
}
.width1 {
    width: 180px;
    margin-right: 10px;
}
.diaForm {
    .el-input {
        width: 216px;
    }
}
.el-table {
    font-size: 14px;
}
.red {
    color: #ff0000;
}
</style>
<style lang="scss">
.anoCard {
    .el-card__body:after {
        content: '';
        clear: both;
        width: 0;
        height: 0;
        visibility: hidden;
        display: block;
    }
}
.diaForm .el-form-item__label {
    padding-right: 20px;
}
.searchDiv [class^='el-icon'] {
    color: #fff;
}
.btn {
    margin-bottom: 16px;
}
.el-pagination {
    margin-top: 20px;
    margin-bottom: 10px;
    float: right;
}
</style>
