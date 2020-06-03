<template>
    <div>
        <el-card>
            <!-- 获取一级菜单 -->
            <template>
                <el-tabs
                    :tab-position="tabPosition"
                    style="height: 100%"
                    @tab-click="handleOperationClick"
                >
                    <el-tab-pane v-for="menu in queryMenu" :label="menu.name" :key="menu.id">
                        <!-- {{menu.id}} -->
                        <el-tabs type="border-card" v-model="activeName" activate-name="first">
                            <el-tab-pane :label="`权限管理`" name="first" @click="getOperationList()">
                                <!-- 搜索与添加区域 -->
                                <el-form
                                    :inline="true"
                                    ref="queryRef"
                                    :model="queryInfo"
                                    :rules="queryInfoRules"
                                    class="demo-form-inline"
                                >
                                    <el-form-item label="名称" prop="operateName">
                                        <el-input
                                            v-model="queryInfo.operateName"
                                            placeholder="请输入权限名称"
                                            clearable
                                        ></el-input>
                                    </el-form-item>
                                    <el-form-item>
                                        <el-button
                                            type="primary"
                                            icon="el-icon-search"
                                            size="mini"
                                            @click="getOperationList()"
                                        >搜索</el-button>
                                        <!-- <el-button
                                            type="warning"
                                            icon="el-icon-refresh-left"
                                            size="mini"
                                            @click="resetForm(queryInfo)"
                                        >清空</el-button> -->
                                    </el-form-item>
                                </el-form>
                                <el-button
                                    class="btn"
                                    type="primary"
                                    icon="el-icon-circle-plus-outline"
                                    size="mini"
                                    @click="userAddTabVisible = true"
                                >添加</el-button>
                                <el-divider></el-divider>
                                <!-- 系统管理列表区域 -->
                                <el-table :data="operationList" border class="table" name="系统管理">
                                    <el-table-column prop="operateName" label="名称" align="center"></el-table-column>
                                    <el-table-column
                                        prop="operateTypeDesc"
                                        label="类型"
                                        align="center"
                                    ></el-table-column>
                                    <el-table-column prop="operateUrl" label="地址" align="center"></el-table-column>
                                    <el-table-column prop="createDate" label="创建时间" align="center"></el-table-column>
                                    <el-table-column label="操作" width="180" align="center">
                                        <template slot-scope="scope">
                                            <el-button
                                                type="text"
                                                icon="el-icon-view"
                                                @click="toViewInfo(scope.$index, scope.row)"
                                            >查看</el-button>
                                            <el-button
                                                type="text"
                                                icon="el-icon-edit"
                                                @click="toEditInfo(scope.$index, scope.row)"
                                            >编辑</el-button>
                                            <!-- <el-button
                                                type="text"
                                                icon="el-icon-delete"
                                                class="red"
                                                @click="doDeleteInfo(scope.$index, scope.row)"
                                            >删除</el-button>-->
                                        </template>
                                    </el-table-column>
                                </el-table>
                                <!-- 分页 -->
                                <el-pagination
                                    @size-change="handleSizeChange"
                                    @current-change="handleCurrentChange"
                                    :current-page="queryInfo.pagenum"
                                    :page-sizes="[1, 2, 5, 10]"
                                    :page-size="queryInfo.pageSize"
                                    layout="total, sizes, prev, pager, next, jumper"
                                    :total="total"
                                ></el-pagination>
                            </el-tab-pane>
                        </el-tabs>
                    </el-tab-pane>
                </el-tabs>

                <!-- 添加 -->
                <el-dialog
                    title="新增权限"
                    :visible.sync="userAddTabVisible"
                    class="diaForm"
                    @close="operationAddClosed"
                >
                    <el-form
                        ref="addFormRef"
                        :rules="addFormRules"
                        :model="addForm"
                        label-width="100px"
                    >
                        <el-form-item label="权限名称" prop="operateName">
                            <el-input v-model="addForm.operateName" class="handle-input"></el-input>
                        </el-form-item>
                        <el-form-item label="权限类型" prop="operateType">
                            <el-select v-model="addForm.operateType" placeholder="请选择类型">
                                <el-option key="01" label="操作栏" value="01"></el-option>
                                <el-option key="02" label="导航条" value="02"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="权限地址" prop="operateUrl">
                            <el-input v-model="addForm.operateUrl" class="handle-input"></el-input>
                        </el-form-item>
                    </el-form>

                    <span slot="footer" class="dialog-footer">
                        <el-button @click="userAddTabVisible = false">取 消</el-button>
                        <el-button type="primary" @click="doSaveAdd">提 交</el-button>
                    </span>
                </el-dialog>

                <!-- 查看 -->
                <el-dialog title="查看权限" :visible.sync="viewVisible" width="50%">
                    <el-form ref="editForm" :model="editForm" label-width="120px">
                        <el-form-item label="权限名称">
                            <el-input v-model="editForm.operateName" class="handle-input" disabled></el-input>
                        </el-form-item>
                        <el-form-item label="权限类型">
                            <el-select v-model="editForm.operateType" placeholder="请选择类型" disabled>
                                <el-option key="01" label="操作栏" value="01"></el-option>
                                <el-option key="02" label="导航条" value="02"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="权限地址">
                            <el-input v-model="editForm.operateUrl" class="handle-input" disabled></el-input>
                        </el-form-item>
                    </el-form>
                    <span slot="footer" class="dialog-footer">
                        <el-button type="primary" @click="viewVisible = false">关 闭</el-button>
                    </span>
                </el-dialog>

                <!-- 编辑 -->
                <el-dialog
                    title="编辑权限"
                    :visible.sync="editDialogVisible"
                    @close="operationEditClosed"
                    width="50%"
                >
                    <!-- 内容主体区域 -->
                    <el-form
                        ref="editFormRef"
                        :model="editForm"
                        :rules="editFormRules"
                        label-width="120px"
                    >
                        <el-form-item label="权限名称" prop="roleCode">
                            <el-input v-model="editForm.operateName" class="handle-input"></el-input>
                        </el-form-item>
                        <el-form-item label="权限类型" prop="operateType">
                            <el-select v-model="editForm.operateType" placeholder="请选择类型">
                                <el-option key="01" label="操作栏" value="01"></el-option>
                                <el-option key="02" label="导航条" value="02"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="权限地址" prop="operateUrl">
                            <el-input v-model="editForm.operateUrl" class="handle-input"></el-input>
                        </el-form-item>
                    </el-form>

                    <span slot="footer" class="dialog-footer">
                        <el-button type="primary" @click="doEditInfo">提 交</el-button>
                        <el-button @click="editDialogVisible = false">取 消</el-button>
                    </span>
                </el-dialog>
            </template>
        </el-card>
    </div>
</template>

<script>
export default {
    data() {
        return {
            tabPosition: 'left',
            activeName: 'first',
            // 获取操作功能点列表参数
            queryInfo: {
                pageNum: 1,
                pageSize: 5,
                operateName: '',
                cId: ''
            },
            // 获取小菜单集合
            queryMenu: {
                menuId: ''
            },
            // 操作功能点列表集合
            operationList: [],
            total: 0,
            diaIsShow: false,
            form: {},
            // 添加框
            userAddTabVisible: false,
            viewVisible: false,
            editDialogVisible: false,
            // 添加
            addForm: {
                menuId: -1,
                operateName: '',
                operateType: '',
                operateUrl: ''
            },
            editForm: {
                menuId: -1,
                operateName: '',
                operateType: '',
                operateUrl: ''
            },
            queryInfoRules: {
                operateName: [{ required: false, message: '请输入权限名称', trigger: 'blur' }]
            },
            // 添加表单的验证规则对象
            addFormRules: {
                operateName: [{ required: true, message: '请输入权限名称', trigger: 'blur' }],
                operateType: [{ required: true, message: '请选择权限类型', trigger: 'blur' }],
                operateUrl: [{ required: true, message: '请输入权限地址', trigger: 'blur' }]
            },
            // 编辑表单规则的验证规则
            editFormRules: {
                operateName: [{ required: true, message: '请输入权限名称', trigger: 'blur' }],
                operateType: [{ required: true, message: '请选择权限类型', trigger: 'blur' }],
                operateUrl: [{ required: true, message: '请输入权限地址', trigger: 'blur' }]
            }
        };
    },
    created() {
        this.smallMenu();
    },
    methods: {
        // 添加对话框关闭事件
        operationAddClosed() {
            this.$refs.addFormRef.resetFields();
        },
        // 编辑对话框关闭事件
        operationEditClosed() {
            this.$refs.editFormRef.resetFields();
        },
        // 获取操作功能点列表
        async getOperationList() {
            this.queryInfo.cId = this.currCheckMenuId;
            const { data: res } = await this.$http.post('/operate/getOperatesByCmenuId', this.queryInfo);
            // console.log(res.data);
            if (res.code !== '0000') {
                // return this.$message('获取操作功能点列表失败');
                this.operationList = [];
                this.total = 0;
            } else {
                this.operationList = res.data;
                this.total = res.page.total;
            }
        },
        // 操作功能点小菜单查询
        async smallMenu() {
            const { data: res } = await this.$http.post('/operate/querySysOperate');
            // console.log(res.data);
            if (res.code !== '0000') {
                return this.$message('获取操作功能点列表失败');
            } else {
                // this.queryMenu = res.data;
                //获取第一级菜单
                var menuLevel_1 = [];
                res.data.forEach(value => {
                    if (value.pId == 'p1') {
                        menuLevel_1.push(value);
                    }
                });
                // console.log("menuLevel_1---->"+menuLevel_1);
                //获取第二级菜单
                var menuLevel_2 = [];
                menuLevel_1.forEach(value1 => {
                    var id_level1 = value1.id;
                    res.data.forEach(value2 => {
                        if (value2.pId == id_level1) {
                            var obj2 = { id: '', name: '' };
                            obj2.id = value2.id;
                            obj2.name = value1.name + '---' + value2.name;
                            menuLevel_2.push(obj2);
                        }
                    });
                });
                this.queryMenu = menuLevel_2;
                // console.log("menuLevel_2---->"+menuLevel_2);
                //默认选择第一个 拉取数据
                var menuId = this.queryMenu[0].id;
                // console.log('menuId-->' + menuId);
                this.currCheckMenuId = menuId;
                this.getOperationList();
            }
        },
        // 保存添加
        async doSaveAdd() {
            let that = this;
            that.addForm.menuId = that.currCheckMenuId;
            this.$refs.addFormRef.validate(async valid => {
                // console.log(valid);
                if (!valid) {
                    return;
                } else {
                    // debugger;
                    const { data: res } = await this.$http.post('/operate/add', that.addForm);
                    if (res.code !== '0000') {
                        this.$message.error('失败:' + res.message);
                    } else {
                        this.$message.success('添加权限成功！');
                        this.userAddTabVisible = false;
                        this.getOperationList();
                    }
                }
            });
        },
        // 打开查看
        toViewInfo(index, row) {
            this.idx = index;
            this.editForm = row;
            this.viewVisible = true;
        },
        // 打开编辑
        toEditInfo(index, row) {
            this.idx = index;
            this.editForm = row;
            this.editDialogVisible = true;
        },
        // 编辑
        async doEditInfo() {
            this.$refs.editFormRef.validate(async valid => {
                // console.log(valid);
                if (!valid) {
                    return;
                } else {
                    this.editForm.menuId = this.currCheckMenuId;
                    const { data: res } = await this.$http.post('/operate/change', this.editForm);
                    if (res.code !== '0000') {
                        this.$message.error('失败:' + res.message);
                    } else {
                        this.$message.success('编辑权限成功！');
                        this.editDialogVisible = false;
                        this.getOperationList();
                    }
                }
            });
        },
        // 删除操作
        // doDeleteInfo(index, row) {
        //     // 二次确认删除
        //     this.$confirm('确定要删除吗？', '警告', {
        //         type: 'warning'
        //     })
        //         .then(async valid => {
        //             console.log(valid);
        //             if (!valid) {
        //                 return;
        //             } else {
        //                 let delObj = {};
        //                 delObj.operateId = row.operateId;
        //                 const { data: res } = await this.$http.post('/operate/operateDelById', delObj);
        //                 if (res.code !== '0000') {
        //                     return this.$message.error('删除失败！');
        //                 } else {
        //                     this.$message.success('删除成功');
        //                     this.operationList.splice(index, 1);
        //                     this.getOperationList();
        //                 }
        //             }
        //         })
        //         .catch(() => {});
        // },
        handleOperationClick: function(tab, event) {
            var id = event.target.getAttribute('id') + '';
            // console.log('id-->' + id);
            var index = id.replace('tab-', '');
            if (index >= 0) {
                // console.log('index-->' + index);
                var menuId = this.queryMenu[index].id;
                // console.log('menuId-->' + menuId);
                this.currCheckMenuId = menuId;
                this.getOperationList();
            }
        },
        // 清空搜索区域数据
        // resetForm(queryInfo) {
        //     this.$refs.queryRef.resetFields(queryInfo);
        // },
        // 监听pagesize改变的事件
        handleSizeChange(newSize) {
            this.queryInfo.pageSize = newSize;
            this.getOperationList();
        },
        // 监听页码值改变事件
        handleCurrentChange(newPage) {
            this.queryInfo.pageNum = newPage;
            this.getOperationList();
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
.handle-input {
    width: 216px;
    display: inline-block;
}
.el-table {
    width: 100%;
    margin-top: 20px;
    font-size: 14px;
}
.red {
    color: #ff0000;
}
.mr10 {
    margin-right: 10px;
}
.btn {
    margin-top: 16px;
}
.message-title {
    cursor: pointer;
}
.handle-row {
    margin-top: 30px;
}
.el-pagination {
    margin-top: 20px;
    margin-bottom: 10px;
    float: right;
}
</style>