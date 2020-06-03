<template>
    <div>
        <el-card>
            <!-- 搜索参数 -->
            <el-form ref="queryRef" :model="query" :rules="queryRules" label-width="120px">
                <el-form-item label="编码类型" style="float: left;" prop="codeTypeId">
                    <el-input placeholder="编码类型" v-model="query.codeTypeId" class="handle-input"></el-input>
                </el-form-item>
                <el-form-item label="编码类型名称" style="float: left;" prop="codeTypeName">
                    <el-input placeholder="编码类型名称" v-model="query.codeTypeName" class="handle-input"></el-input>
                </el-form-item>
                <el-button class="btn" type="primary" icon="el-icon-search" @click="search()" size="mini">搜索</el-button>
                <el-button type="warning" icon="el-icon-refresh-left" size="mini" @click="resetForm('query')">清空</el-button>
                <div class="clear"></div>
            </el-form>
            <el-button
                type="primary"
                icon="el-icon-circle-plus-outline"
                size="mini"
                @click="addParamVisible = true"
            >添加</el-button>
            <!-- 参数列表 -->
            <el-table :data="parameterList" border stripe>
                <el-table-column prop="id" label="ID" width="50" align="center"></el-table-column>
                <el-table-column prop="codeTypeId" label="编码类型" align="center"></el-table-column>
                <el-table-column prop="codeTypeName" label="编码类型名称" align="center"></el-table-column>
                <el-table-column prop="codeId" label="编码" align="center"></el-table-column>
                <el-table-column prop="codeName" label="编码名称" align="center" show-overflow-tooltip></el-table-column>
                <el-table-column prop="codeDesc" label="描述" align="center" show-overflow-tooltip></el-table-column>
                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-view"
                            @click="handleView(scope.$index, scope.row)"
                        >查看</el-button>
                        <el-button
                            type="text"
                            icon="el-icon-edit"
                            @click="handleEdit(scope.$index, scope.row)"
                        >编辑</el-button>
                        <el-button
                            type="text"
                            icon="el-icon-delete"
                            class="red"
                            @click="handleDelete(scope.$index, scope.row)"
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
        <el-dialog title="添加参数" :visible.sync="addParamVisible" class="diaForm" @close="addDialogClosed()">
            <el-form
                ref="addParamFormRef"
                :model="addParamForm"
                :rules="addParamFormRules"
                label-width="120px"
            >
                <el-form-item label="编码类型ID" prop="codeTypeId">
                    <el-input v-model="addParamForm.codeTypeId"></el-input>
                </el-form-item>
                <el-form-item label="编码类型名称" prop="codeTypeName">
                    <el-input v-model="addParamForm.codeTypeName"></el-input>
                </el-form-item>
                <el-form-item label="编码" prop="codeId">
                    <el-input v-model="addParamForm.codeId"></el-input>
                </el-form-item>
                <el-form-item label="编码名称" prop="codeName">
                    <el-input v-model="addParamForm.codeName"></el-input>
                </el-form-item>
                <el-form-item label="编码描述" prop="codeDesc">
                    <el-input v-model="addParamForm.codeDesc"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addParamVisible= false">取 消</el-button>
                <el-button type="primary" @click="addParam">提 交</el-button>
            </span>
        </el-dialog>

        <!-- 查看弹出框 -->
        <el-dialog title="查看参数" :visible.sync="viewVisible" width="50%">
            <el-form ref="parameterForm" :model="parameterForm" label-width="120px">
                <el-form-item label="编码类型ID">
                    <el-input v-model="parameterForm.codeTypeId" disabled></el-input>
                </el-form-item>
                <el-form-item label="编码类型名称">
                    <el-input v-model="parameterForm.codeTypeName" disabled></el-input>
                </el-form-item>
                <el-form-item label="编码">
                    <el-input v-model="parameterForm.codeId" disabled></el-input>
                </el-form-item>
                <el-form-item label="编码名称">
                    <el-input v-model="parameterForm.codeName" disabled></el-input>
                </el-form-item>
                <el-form-item label="编码描述">
                    <el-input v-model="parameterForm.codeDesc" disabled></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="viewVisible = false">返 回</el-button>
            </span>
        </el-dialog>

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑参数" :visible.sync="editParemeterVisible" width="50%" @close="editDialogClosed()">
            <el-form
                :rules="editParamFormRules"
                ref="paramFormRef"
                :model="editParamForm"
                label-width="120px"
            >
                <el-form-item label="编码类型ID" prop="codeTypeId">
                    <el-input v-model="editParamForm.codeTypeId"></el-input>
                </el-form-item>
                <el-form-item label="编码类型名称" prop="codeTypeName">
                    <el-input v-model="editParamForm.codeTypeName"></el-input>
                </el-form-item>
                <el-form-item label="编码" prop="codeId">
                    <el-input v-model="editParamForm.codeId"></el-input>
                </el-form-item>
                <el-form-item label="编码名称" prop="codeName">
                    <el-input v-model="editParamForm.codeName"></el-input>
                </el-form-item>
                <el-form-item label="编码描述" prop="codeDesc">
                    <el-input v-model="editParamForm.codeDesc"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editParemeterVisible = false">取 消</el-button>
                <el-button type="primary" @click="editParameter">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            // 参数列表
            query: {
                codeTypeId: '',
                codeTypeName: '',
                pageNum: 1,
                pageSize: 5
            },
            addParamVisible: false,
            editParemeterVisible: false,
            // 编辑参数列表
            editParamForm: {
                codeTypeId: '',
                codeTypeName: '',
                codeId: '',
                codeName: '',
                codeDesc: ''
            },
            parameterList: [],
            total: 0,
            diaIsShow: false,
            formData: {},
            viewVisible: false,
            addVisible: false,
            // 查看操作
            parameterForm: {},
            // 添加表单
            addParamForm: {
                codeTypeId: '',
                codeTypeName: '',
                codeId: '',
                codeName: '',
                codeDesc: ''
            },
            idx: -1,
            id: -1,
            // 搜索表单校验
            queryRules: {
                codeTypeId: [{ required: false, message: '编码类型', trigger: 'blur' }],
                codeTypeName: [{ required: false, message: '请输入编码类型名称', trigger: 'blur' }],
            },
            // 添加表单验证
            addParamFormRules: {
                codeTypeId: [{ required: true, message: '请输入编码类型id', trigger: 'blur' }],
                codeTypeName: [{ required: true, message: '请输入编码类型名称', trigger: 'blur' }],
                codeId: [{ required: true, message: '请输入编码', trigger: 'blur' }],
                codeName: [{ required: true, message: '请输入编码名称', trigger: 'blur' }],
                codeDesc: [{ required: true, message: '请输入编码描述', trigger: 'blur' }]
            },
            // 编辑参数校验
            editParamFormRules: {
                codeTypeId: [{ required: true, message: '请输入编码类型id', trigger: 'blur' }],
                codeTypeName: [{ required: true, message: '请输入编码类型名称', trigger: 'blur' }],
                codeId: [{ required: true, message: '请输入编码', trigger: 'blur' }],
                codeName: [{ required: true, message: '请输入编码名称', trigger: 'blur' }],
                codeDesc: [{ required: true, message: '请输入编码描述', trigger: 'blur' }]
            }
        };
    },
    created() {
        this.getSmsParameterList();
    },
    methods: {
        // 获取参数列表
        async getSmsParameterList() {
            this.searchSmsParameter();
        },
        // 点击搜索
        async search() {
            this.query.pageNum = 1;
            this.searchSmsParameter()
        },
        // 搜索系统参数
        async searchSmsParameter() {
            const { data: res } = await this.$http.post('/tCode/search', this.query);
            // console.log(res.data);
            if (res.code !== '0000') {
                return this.$message.error('获取参数列表失败');
            } else {
                this.parameterList = res.data;
                // console.log(res.page.total);
                this.total = res.page.total;
            }
        },
        // 清空搜索区域数据
        resetForm(query) {
            this.$refs.queryRef.resetFields();
            // this.getSmsParameterList();
        },
        // 添加参数
        addParam() {
            this.$refs.addParamFormRef.validate(async valid => {
                console.log(valid);
                if (!valid) {
                    return;
                } else {
                    // 可以发起添加参数的网络请求
                    const { data: res } = await this.$http.post('/tCode/add', this.addParamForm);
                    // console.log(res.data)
                    if (res.code !== '0000') {
                        this.$message.error('添加短信参数失败');
                    } else {
                        this.$message.success('添加短信参数成功！');
                        // 隐藏添加参数的对话框
                        this.addParamVisible = false;
                        // 重新获取参数列表数据
                        this.getSmsParameterList();
                    }
                }
            });
        },
        // 监听添加用户对话框的关闭事件
        addDialogClosed() {
            this.$refs.addParamFormRef.resetFields();
        },
        editDialogClosed() {
            this.$refs.paramFormRef.resetFields();
        },
        // 删除操作
        handleDelete(index, row) {
            // 二次确认删除
            this.$confirm('确定要删除吗？', '警告', {
                type: 'warning'
            })
                .then(async valid => {
                    // console.log(valid);
                    if (!valid) {
                        return;
                    } else {
                        let delObj = {};
                        delObj.id = row.id;
                        const { data: res } = await this.$http.post('/tCode/delete', delObj);
                        if (res.code !== '0000') {
                            return this.$message.error('删除短信参数失败！');
                        } else {
                            this.$message.success('删除短信参数成功');
                            this.parameterList.splice(index, 1);
                            this.getSmsParameterList();
                        }
                    }
                })
                .catch(() => {});
        },
        // 查看操作
        async handleView(index, row) {
            let viewObj = {};
            viewObj.id = row.id;
            const { data: res } = this.$http.post('/tCode/search', viewObj);
            this.viewVisible = true;
            this.parameterForm = row;
        },
        // 编辑操作
        handleEdit(index, row) {
            this.idx = index;
            this.editParamForm = row;
            this.editParemeterVisible = true;
        },
        // 编辑参数
        editParameter() {
            this.$refs.paramFormRef.validate(async valid => {
                // console.log(valid);
                if (!valid) {
                    return;
                } else {
                    // 可以发起编辑参数的网络请求
                    const { data: res } = await this.$http.post('/tCode/change', this.editParamForm);
                    if (res.code !== '0000') {
                        this.$message.error('编辑参数失败');
                    } else {
                        this.$message.success(`编辑参数成功`);
                        // 隐藏编辑参数的对话框
                        this.editParemeterVisible = false;
                        // 重新获取用户列表数据
                        this.getSmsParameterList();
                    }
                }
            });
        },
        // 监听pagesize改变的事件
        handleSizeChange(newSize) {
            this.query.pageSize = newSize;
            this.getSmsParameterList();
        },
        // 监听页码值改变事件
        handleCurrentChange(newPage) {
            this.query.pageNum = newPage;
            this.getSmsParameterList();
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
    width: 216px;
    display: inline-block;
}
.handle-input {
    width: 216px;
    display: inline-block;
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
.btn {
    margin-left: 20px;
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
