<template>
    <div>
        <el-card>
            <!-- 查询条件 -->
            <el-form ref="queryRef" :model="query" :rules="queryRules" label-width="80px" inline>
                <el-form-item label="模板编码" prop="templateCode">
                    <el-input v-model="query.templateCode" class="handle-input" clearable></el-input>
                </el-form-item>
                <el-form-item label="模板名称" prop="templateName">
                    <el-input v-model="query.templateName" class="handle-input" clearable></el-input>
                </el-form-item>
                <el-form-item label="模板类型" prop="templateType">
                    <el-select v-model="query.templateType" placeholder="请选择">
                        <el-option value="">--请选择--</el-option>
                        <el-option
                            v-for="item in templateType"
                            :key="item.id"
                            :value="item.paramValue"
                            :label="item.paramRemark"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="模板分类" prop="manageId">
                    <el-select v-model="query.manageId" placeholder="请选择">
                        <el-option value="">--请选择--</el-option>
                        <el-option
                            v-for="item in templateSort"
                            :key="item.manageId"
                            :value="item.id"
                            :label="item.manageDetail"
                        ></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <el-button type="primary" icon="el-icon-search" @click="search()" size="mini">搜索</el-button>
            <el-button
                type="warning"
                icon="el-icon-refresh-left"
                @click="resetForm('query')"
                size="mini"
            >清空</el-button>
            <el-button
                type="primary"
                icon="el-icon-circle-plus-outline"
                size="mini"
                @click="diaIsShow = true"
            >添加</el-button>
            <!-- 模板列表展示 -->
            <el-table :data="templateList" border stripe>
                <el-table-column
                    prop="templateCode"
                    label="模板编码"
                    align="center"
                    show-overflow-tooltip
                ></el-table-column>
                <el-table-column
                    prop="templateName"
                    label="模板名称"
                    align="center"
                    show-overflow-tooltip
                ></el-table-column>
                <el-table-column prop="paramRemark" label="模板类型" align="center"></el-table-column>
                <el-table-column
                    prop="manageIdDesc"
                    label="模板分类"
                    align="center"
                    show-overflow-tooltip
                ></el-table-column>
                <el-table-column
                    prop="templateDetail"
                    label="模板内容"
                    align="center"
                    show-overflow-tooltip
                    disabled
                ></el-table-column>
                <el-table-column
                    prop="createTime"
                    label="创建时间"
                    align="center"
                    width="160"
                    show-overflow-tooltip
                ></el-table-column>
                <el-table-column
                    prop="updateTime"
                    label="修改时间"
                    align="center"
                    width="160"
                    show-overflow-tooltip
                ></el-table-column>
                <el-table-column prop="updateBy" label="修改者" align="center"></el-table-column>
                <el-table-column label="操作" width="120" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-view" @click="handleView(scope.row)">查看</el-button>
                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.row)">编辑</el-button>
                    </template>
                </el-table-column>
            </el-table>
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
            title="添加模板"
            :visible.sync="diaIsShow"
            class="diaForm"
            @close="addDialogClosed()"
        >
            <el-form ref="addFormRef" :model="addForm" :rules="addFormRules" label-width="90px">
                <el-form-item label="模板编码" prop="templateCode">
                    <el-input v-model="addForm.templateCode" class="handle-input"></el-input>
                </el-form-item>
                <el-form-item label="模板名称" prop="templateName">
                    <el-input v-model="addForm.templateName" class="handle-input"></el-input>
                </el-form-item>
                <el-form-item label="模板类型" prop="templateType">
                    <el-select v-model="addForm.templateType" placeholder="请选择">
                        <el-option value="">--请选择--</el-option>
                        <el-option
                            v-for="item in templateType"
                            :key="item.id"
                            :value="item.paramValue"
                            :label="item.paramRemark"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="模板分类" prop="manageId">
                    <el-select v-model="addForm.manageId" placeholder="请选择">
                        <el-option value="">--请选择--</el-option>
                        <el-option
                            v-for="item in templateSort"
                            :key="item.manageId"
                            :value="item.id"
                            :label="item.manageDetail"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="模板内容" prop="templateDetail">
                    <el-input type="textarea" rows="5" v-model="addForm.templateDetail"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="diaIsShow = false">取 消</el-button>
                <el-button type="primary" @click="saveAdd">提 交</el-button>
            </span>
        </el-dialog>

        <!-- 查看弹出框 -->
        <el-dialog title="查看模板" :visible.sync="viewVisible" width="50%">
            <el-form ref="form" :model="viewTemplate" label-width="80px">
                <el-form-item label="模板编码">
                    <el-input v-model="viewTemplate.templateCode" disabled></el-input>
                </el-form-item>
                <el-form-item label="模板名称">
                    <el-input v-model="viewTemplate.templateName" disabled></el-input>
                </el-form-item>
                <el-form-item label="模板类型">
                    <el-select v-model="viewTemplate.templateType" placeholder="请选择" disabled>
                        <el-option
                            v-for="item in templateType"
                            :key="item.id"
                            :value="item.paramValue"
                            :label="item.paramRemark"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="模板分类">
                    <el-select v-model="viewTemplate.manageIdDesc" placeholder="请选择" disabled>
                        <el-option
                            v-for="item in templateSort"
                            :key="item.id"
                            :value="item.manageDetail"
                            :label="item.manageDetail"
                        >{{item.manageDetail}}</el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="模板内容">
                    <el-input
                        type="textarea"
                        rows="4"
                        v-model="viewTemplate.templateDetail"
                        disabled
                    ></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="viewVisible = false">关闭</el-button>
            </span>
        </el-dialog>

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑模板" :visible.sync="editVisible" width="50%">
            <el-form
                ref="editTemplateRef"
                :model="editTemplate"
                :rules="editTemplateRules"
                label-width="80px"
            >
                <el-form-item label="模板编码">
                    <el-input v-model="editTemplate.templateCode" class="handle-input"></el-input>
                </el-form-item>
                <el-form-item label="模板名称">
                    <el-input v-model="editTemplate.templateName" class="handle-input"></el-input>
                </el-form-item>
                <el-form-item label="模板类型">
                    <el-select v-model="editTemplate.templateType" placeholder="请选择">
                        <el-option value="">--请选择--</el-option>
                        <el-option
                            v-for="item in templateType"
                            :key="item.id"
                            :value="item.paramValue"
                            :label="item.paramRemark"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="模板分类">
                    <el-select v-model="editTemplate.manageIdDesc" placeholder="请选择">
                        <el-option value="">--请选择--</el-option>
                        <el-option
                            v-for="item in templateSort"
                            :key="item.manageId"
                            :value="item.id"
                            :label="item.manageDetail"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="模板内容">
                    <el-input type="textarea" rows="4" v-model="editTemplate.templateDetail"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="saveEdit()">确 定</el-button>
                <el-button @click="editVisible = false">取 消</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: 'basetable',
    data() {
        return {
            query: {
                templateCode: '',
                templateName: '',
                templateType: '',
                manageId: '',
                pageNum: 1,
                pageSize: 5
            },
            templateSort: [],
            templateType: [],
            viewTemplate: {},
            templateList: [],
            tableData: [],
            diaIsShow: false,
            formData: {},
            viewVisible: false,
            editVisible: false,
            addVisible: false,
            total: 0,
            addForm: {
                templateCode: '',
                templateName: '',
                templateType: '',
                manageId: '',
                templateDetail: ''
            },
            editTemplate: {
                templateCode: '',
                templateName: '',
                templateType: '',
                manageId: '',
                templateDetail: ''
            },
            idx: -1,
            id: -1,
            queryRules: {
                templateCode: [{ required: false, message: '请输入模板编码', trigger: 'blur' }],
                templateName: [{ required: false, message: '请输入模板名称', trigger: 'blur' }],
                templateType: [{ required: false, message: '请选择模板类型', trigger: 'blur' }],
                manageId: [{ required: false, message: '请选择模板分类', trigger: 'blur' }]
            },
            addFormRules: {
                templateCode: [{ required: true, message: '请输入模板编码', trigger: 'blur' }],
                templateName: [{ required: true, message: '请输入模板名称', trigger: 'blur' }],
                templateType: [{ required: true, message: '请选择模板类型', trigger: 'blur' }],
                manageId: [{ required: true, message: '请选择模板分类', trigger: 'blur' }],
                templateDetail: [{ required: true, message: '请输入模板内容', trigger: 'blur' }]
            },
            editTemplateRules: {
                templateCode: [{ required: true, message: '请输入模板编码', trigger: 'blur' }],
                templateName: [{ required: true, message: '请输入模板名称', trigger: 'blur' }],
                templateType: [{ required: true, message: '请选择模板类型', trigger: 'blur' }],
                manageId: [{ required: true, message: '请选择模板分类', trigger: 'blur' }],
                templateDetail: [{ required: true, message: '请输入模板内容', trigger: 'blur' }]
            }
        };
    },
    created() {
        this.getTemplateList();
        this.getTemplateSort();
        this.getTemplateType();
    },
    methods: {
        // 获取模板列表
        async getTemplateList() {
            this.searchTemplate();
        },
        // 点击搜索
        async search() {
            this.query.pageNum = 1;
            this.searchTemplate()
        },
        // 搜索模板
        async searchTemplate() {
            const { data: res } = await this.$http.post('/templateService/pgSearch', this.query);
            if (res.code !== '0000') {
                return this.$message('获取模板列表失败');
            } else {
                this.templateList = res.data;
                this.total = res.page.total;
            }
        },
        // 获取所有模板分类
        async getTemplateSort() {
            const { data: res } = await this.$http.post('/templateService/manageSearch', { templateCode: this.query.templateCode });
            if (res.code !== '0000') {
                return this.$message.error('获取模板分类失败');
            } else {
                this.templateSort = res.data;
            }
        },
        // 获取所有的模板类型
        async getTemplateType() {
            const { data: res } = await this.$http.post('/templateService/searchBussinessType');
            if (res.code !== '0000') {
                return this.$message.error('获取模板类型失败');
            } else {
                this.templateType = res.data;
            }
        },
        // 清空搜索区域数据
        resetForm(query) {
            this.$refs.queryRef.resetFields();
            // this.getTemplateList();
        },
        // 添加
        saveAdd() {
            this.$refs.addFormRef.validate(async valid => {
                // console.log(valid);
                if (!valid) {
                    return;
                } else {
                    // 可以发起添加模板的网络请求
                    const { data: res } = await this.$http.post('/templateService/add', this.addForm);
                    // console.log(res.data)
                    if (res.code !== '0000') {
                        this.$message.error('添加模板失败!');
                    } else {
                        this.$message.success(`添加模板成功!`);
                        // 隐藏添加模板的对话框
                        this.diaIsShow = false;
                        // 重新获取模板列表数据
                        this.getTemplateList();
                    }
                }
            });
        },
        // 监听添加模板对话框的关闭事件
        addDialogClosed() {
            this.$refs.addFormRef.resetFields();
        },
        // 查看操作
        async handleView(row) {
            const { data: res } = this.$http.post('/templateService/getTemplate', { templateId: row.templateId });
            this.viewTemplate = row;
            this.viewVisible = true;
        },
        // 编辑操作
        handleEdit(row) {
            this.editTemplate = row;
            this.editVisible = true;
        },
        // 编辑模板
        saveEdit() {
            this.$refs.editTemplateRef.validate(async valid => {
                // console.log(valid);
                if (!valid) {
                    return;
                } else {
                    // 可以发起编辑模板的网络请求
                    const { data: res } = await this.$http.post('/templateService/change', this.editTemplate);
                    if (res.code !== '0000') {
                        this.$message.error('编辑模板失败');
                    } else {
                        this.$message.success(`编辑模板成功`);
                        // 隐藏添加用户的对话框
                        this.editVisible = false;
                        // 重新获取用户列表数据
                        this.getTemplateList();
                    }
                }
            });
        },
        // 监听pagesize改变的事件
        handleSizeChange(newSize) {
            console.log(newSize);
            this.query.pageSize = newSize;
            this.getTemplateList();
        },
        // 监听页码值改变事件
        handleCurrentChange(newPage) {
            // console.log(newPage);
            this.query.pageNum = newPage;
            this.getTemplateList();
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
.el-input {
    width: 180px;
    display: inline-block;
}
.el-select {
    width: 180px;
    margin-right: 20px;
}
.addButton {
    margin-bottom: 20px;
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
.clear {
    clear: both;
}
.smsSearch {
    float: right;
    margin-right: 20px;
}
.el-table {
    width: 100%;
    margin-top: 20px;
    font-size: 14px;
}
.el-pagination {
    margin-top: 20px;
    margin-bottom: 10px;
    float: right;
}
</style>
