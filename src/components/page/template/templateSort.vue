<template>
    <div>
        <el-card>
            <!-- 查询条件 -->
            <el-form ref="queryRef" :model="queryInfo" :rules="queryRules" label-width="80px" inline>
                <el-form-item label="分类描述" prop="manageDetail">
                    <el-input
                        v-model="queryInfo.manageDetail"
                        class="handle-input"
                        closable
                        clearable
                    ></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button
                        type="primary"
                        icon="el-icon-search"
                        @click="search()"
                        size="mini"
                    >搜索</el-button>
                    <el-button
                        type="warning"
                        icon="el-icon-refresh-left"
                        @click="resetForm('queryInfo')"
                        size="mini"
                    >清空</el-button>
                </el-form-item>
            </el-form>
            <el-button
                type="primary"
                icon="el-icon-circle-plus-outline"
                class="addButton"
                size="mini"
                @click="addSort = true"
            >添加</el-button>
            <!-- 模板分类列表 -->
            <el-table :data="templateSort" border stripe>
                <el-table-column prop="manageCode" label="分类编码" align="center"></el-table-column>
                <el-table-column prop="manageDetail" label="分类描述" align="center"></el-table-column>
                <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
                <el-table-column prop="createBy" label="创建人" align="center"></el-table-column>
                <el-table-column label="操作" width="100" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pageNum"
                :page-sizes="[1, 2, 5, 10]"
                :page-size="queryInfo.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
            ></el-pagination>
        </el-card>

        <!-- 新增弹出框 -->
        <el-dialog title="新增模板分类" :visible.sync="addSort" @close="addDialogClosed()">
            <el-form
                ref="addSortFormRef"
                :model="addSortForm"
                :rules="addSortFormRules"
                label-width="90px"
            >
                <el-form-item label="分类编码" prop="manageCode">
                    <el-input v-model="addSortForm.manageCode" class="handle-input"></el-input>
                </el-form-item>
                <el-form-item label="分类描述" prop="manageDetail">
                    <el-input v-model="addSortForm.manageDetail" class="handle-input"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addSort = false">取 消</el-button>
                <el-button type="primary" @click="addTemplateSort()">提 交</el-button>
            </span>
        </el-dialog>

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑模板分类" :visible.sync="editVisible" @close="editDialogClosed()">
            <el-form
                ref="editSortFormRef"
                :model="editTemplate"
                :rules="editSortFormRules"
                label-width="90px"
            >
                <el-form-item label="分类编码" prop="manageCode">
                    <el-input v-model="editTemplate.manageCode" class="handle-input" disabled></el-input>
                </el-form-item>
                <el-form-item label="分类描述" prop="manageDetail">
                    <el-input v-model="editTemplate.manageDetail" class="handle-input"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit()">提 交</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: 'basetable',
    data() {
        return {
            queryInfo: {
                manageCode: '',
                manageDetail: '',
                pageNum: 1,
                pageSize: 5
            },
            total: 0,
            templateSort: [],
            // 控制模板分类新增框
            addSort: false,
            addSortForm: {
                manageCode: '',
                manageDetail: ''
            },
            queryRules: {
                manageDetail: [{ required: false, message: '请输入分类描述', trigger: 'blur' }]
            },
            addSortFormRules: {
                manageCode: [{ required: true, message: '请输入分类编码', trigger: 'blur' }],
                manageDetail: [{ required: true, message: '请输入分类描述', trigger: 'blur' }]
            },
            editSortFormRules: {
                manageDetail: [{ required: true, message: '请输入分类描述', trigger: 'blur' }]
            },
            editTemplate: {
                templateCode: '',
                templateName: ''
            },
            tableData: [],
            multipleSelection: [],
            delList: [],
            diaIsShow: false,
            formData: {},
            viewVisible: false,
            editVisible: false,
            addVisible: false,
            form: {},
            idx: -1,
            id: -1
        };
    },
    created() {
        this.getTemplateSort();
    },
    methods: {
        // 获取模板分类列表
        async getTemplateSort() {
            this.searchTemplateSort();
        },
        // 点击搜索
        async search() {
            this.queryInfo.pageNum = 1;
            this.searchTemplateSort()
        },
        // 搜索模板分类
        async searchTemplateSort() {
            const { data: res } = await this.$http.post('templateService/manageSearch', this.queryInfo);
            // console.log(res);
            if (res.code !== '0000') {
                return this.$message('获取模板列表失败');
            } else {
                this.templateSort = res.data;
                this.total = res.page.total;
            }
        },
        // 清空搜索区域数据
        resetForm(queryInfo) {
            this.$refs.queryRef.resetFields();
        },
        // 添加模板分类
        addTemplateSort() {
            this.$refs.addSortFormRef.validate(async valid => {
                // console.log(valid);
                if (!valid) {
                    return;
                } else {
                    // 可以发起添加分类的网络请求
                    const { data: res } = await this.$http.post('/templateService/manageAdd', this.addSortForm);
                    // console.log(res.data)
                    if (res.code !== '0000') {
                        this.$message.error('添加模板分类失败');
                    } else {
                        this.$message.success('添加模板分类成功！');
                        // 隐藏添加关键字的对话框
                        this.addSort = false;
                        // 重新获取关键字列表数据
                        this.getTemplateSort();
                    }
                }
            });
        },
        // 编辑操作
        handleEdit(row) {
            this.editTemplate = row;
            this.editVisible = true;
        },
        // 编辑模板
        saveEdit() {
            this.$refs.editSortFormRef.validate(async valid => {
                // console.log(valid);
                if (!valid) {
                    return;
                } else {
                    // 可以发起编辑模板分类的网络请求
                    const { data: res } = await this.$http.post('/templateService/manageChange', this.editTemplate);
                    if (res.code !== '0000') {
                        this.$message.error('编辑模板分类失败');
                    } else {
                        this.$message.success(`编辑模板分类成功`);
                        // 隐藏添加用户的对话框
                        this.editVisible = false;
                        // 重新获取用户列表数据
                        this.getTemplateSort();
                    }
                }
            });
        },
        // 监听添加用户对话框的关闭事件
        addDialogClosed() {
            this.$refs.addSortFormRef.resetFields();
        },
        editDialogClosed() {
            this.$refs.editSortFormRef.resetFields();
        },
        // 监听pagesize改变的事件
        handleSizeChange(newSize) {
            console.log(newSize);
            this.queryInfo.pageSize = newSize;
            this.getTemplateSort();
        },
        // 监听页码值改变事件
        handleCurrentChange(newPage) {
            // console.log(newPage);
            this.queryInfo.pageNum = newPage;
            this.getTemplateSort();
        }
    }
};
</script>

<style scoped>
.handle-box {
    margin-bottom: 20px;
}
span {
    color: #606266;
    font-size: 14px;
    padding-right: 10px;
}
.handle-input {
    width: 216px;
    display: inline-block;
}
.select {
    margin-right: 20px;
}
.addButton {
    margin-bottom: 20px;
}
.el-table {
    width: 100%;
    margin-top: 20px;
    font-size: 14px;
}
.table {
    width: 100%;
    font-size: 14px;
}
.red {
    color: #ff0000;
}
.mr10 {
    margin-right: 10px;
}
.table-td-thumb {
    display: block;
    margin: auto;
    width: 40px;
    height: 40px;
}
.el-pagination {
    margin-top: 20px;
    margin-bottom: 10px;
    float: right;
}
</style>
