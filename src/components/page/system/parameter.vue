<template>
    <div>
        <el-card>
            <!-- 搜索参数 -->
            <el-form :inline="true" ref="queryRef" :model="query" :rules="queryRules" label-width="80px" class="demo-form-inline">
                <el-form-item label="key:" prop="paramKey">
                    <el-input placeholder="key" v-model="query.paramKey" class="handle-input" clearable></el-input>
                </el-form-item>
                <el-form-item label="value:" prop="paramValue">
                    <el-input placeholder="value" v-model="query.paramValue" class="handle-input" clearable></el-input>
                </el-form-item>
                <el-form-item label="参数类型" prop="paramType">
                    <el-input placeholder="参数类型" v-model="query.paramType" class="handle-input" clearable></el-input>
                </el-form-item>
                <el-button class="btn" type="primary" icon="el-icon-search" @click="search()" size="mini">搜索</el-button>
                <el-button type="warning" icon="el-icon-refresh-left" size="mini" @click="resetForm('query')">清空</el-button>
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
                <el-table-column prop="paramKey" label="参数key" align="center" width="200"></el-table-column>
                <el-table-column prop="paramValue" label="参数value" align="center"></el-table-column>
                <el-table-column label="类型" align="center">
                    <template slot-scope="scope">{{scope.row.paramType}}</template>
                </el-table-column>
                <el-table-column label="说明" align="center" show-overflow-tooltip>
                    <template slot-scope="scope">{{scope.row.paramRemark}}</template>
                </el-table-column>
                <el-table-column prop="createDate" label="创建时间" align="center"></el-table-column>
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
        <el-dialog title="添加参数" :visible.sync="addParamVisible" class="diaForm"  @close="addDialogClosed()">
            <el-form
                ref="addParamFormRef"
                :model="addParamForm"
                :rules="addParamFormRules"
                label-width="100px"
            >
                <el-form-item label="参数key" prop="paramKey">
                    <el-input v-model="addParamForm.paramKey"></el-input>
                </el-form-item>
                <el-form-item label="参数value" prop="paramValue">
                    <el-input v-model="addParamForm.paramValue"></el-input>
                </el-form-item>
                <el-form-item label="类型" prop="paramType">
                    <el-input v-model="addParamForm.paramType"></el-input>
                </el-form-item>
                <el-form-item label="说明" prop="paramRemark">
                    <el-input v-model="addParamForm.paramRemark"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addParamVisible= false">取 消</el-button>
                <el-button type="primary" @click="addParam">提 交</el-button>
            </span>
        </el-dialog>

        <!-- 查看弹出框 -->
        <el-dialog title="查看参数" :visible.sync="viewVisible" width="50%">
            <el-form ref="parameterForm" :model="parameterForm" label-width="80px">
                <el-form-item label="参数key">
                    <el-input v-model="parameterForm.paramKey" disabled></el-input>
                </el-form-item>
                <el-form-item label="参数value">
                    <el-input v-model="parameterForm.paramValue" disabled></el-input>
                </el-form-item>
                <el-form-item label="类型">
                    <el-input v-model="parameterForm.paramType" disabled></el-input>
                </el-form-item>
                <el-form-item label="说明">
                    <el-input v-model="parameterForm.paramRemark" disabled></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="viewVisible = false">返 回</el-button>
            </span>
        </el-dialog>

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑参数" :visible.sync="editParemeterVisible" width="40%" @close="editDialogClosed()">
            <el-form
                :rules="paramFormRules"
                ref="paramFormRef"
                :model="paramForm"
                label-width="90px"
            >
                <el-form-item label="参数key" prop="paramKey">
                    <el-input v-model="paramForm.paramKey"></el-input>
                </el-form-item>
                <el-form-item label="参数value" prop="paramValue">
                    <el-input v-model="paramForm.paramValue"></el-input>
                </el-form-item>
                <el-form-item label="类型" prop="paramType">
                    <el-input v-model="paramForm.paramType"></el-input>
                </el-form-item>
                <el-form-item label="说明" prop="paramRemark">
                    <el-input v-model="paramForm.paramRemark"></el-input>
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
                paramKey: '',
                paramValue: '',
                paramType: '',
                pageNum: 1,
                pageSize: 5
            },
            addParamVisible: false,
            editParemeterVisible: false,
            // 编辑参数列表
            paramForm: {
                oldParamKey: '',
                paramKey: '',
                paramValue: '',
                paramType: '',
                paramRemark: '',
                createDate: ''
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
                paramKey: '',
                paramValue: '',
                paramType: '',
                paramRemark: '',
            },
            idx: -1,
            id: -1,
            // 搜索表单校验
            queryRules: {
                paramKey: [{ required: false, message: '请输入key值', trigger: 'blur' }],
                paramValue: [{ required: false, message: '请输入value值', trigger: 'blur' }],
                paramType: [{ required: false, message: '请输入类型', trigger: 'blur' }]
            },
            // 添加表单验证
            addParamFormRules: {
                paramKey: [{ required: true, message: '请输入key值', trigger: 'blur' }],
                paramValue: [{ required: true, message: '请输入value值', trigger: 'blur' }],
                paramType: [{ required: true, message: '请输入类型', trigger: 'blur' }]
            },
            // 编辑参数校验
            paramFormRules: {
                paramKey: [{ required: true, message: '请输入key值', trigger: 'blur' }],
                paramValue: [{ required: true, message: '请输入value值', trigger: 'blur' }],
                paramType: [{ required: true, message: '请输入类型', trigger: 'blur' }],
                paramRemark: [{required: false, message: '请输入说明', trigger: 'blur'}]
            }
        };
    },
    created() {
        this.getParameterList();
    },
    methods: {
        // 获取参数列表
        async getParameterList() {
            this.searchParameter();
        },
        // 搜索
        async search() {
            this.query.pageNum = 1;
            this.searchParameter()
        },
        // 搜索系统参数
        async searchParameter() {
            const { data: res } = await this.$http.post('/paramService/list', this.query);
            // console.log(res.data);
            if (res.code !== '0000') {
                return this.$message.error('获取参数列表失败');
            } else {
                this.parameterList = res.data;
                // console.log(res.page.total);
                this.total = res.page.total;
            }
        },
        // 添加参数
        addParam() {
            this.$refs.addParamFormRef.validate(async valid => {
                // console.log(valid);
                if (!valid) {
                    return;
                } else {
                    // 可以发起添加参数的网络请求
                    const { data: res } = await this.$http.post('/paramService/add', this.addParamForm);
                    // console.log(res.data)
                    if (res.code !== '0000') {
                        this.$message.error('添加参数失败！');
                    } else {
                        this.$message.success('添加参数成功！');
                        // 隐藏添加参数的对话框
                        this.addParamVisible = false;
                        // 重新获取参数列表数据
                        this.getParameterList();
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
                    console.log(valid);
                    if (!valid) {
                        return;
                    } else {
                        const { data: res } = await this.$http.get('/paramService/delParam/' + row.id);
                        if (res.code !== '0000') {
                            return this.$message.error('删除参数失败！');
                        } else {
                            this.$message.success('删除参数成功！');
                            this.parameterList.splice(index, 1);
                            this.getParameterList();
                        }
                    }
                })
                .catch(() => {});
        },
        // 查看操作
        async handleView(index, row) {
            const { data: res } = this.$http.get('/paramService/info/' + row.id);
            this.viewVisible = true;
            this.parameterForm = row;
        },
        // 编辑操作
        handleEdit(index, row) {
            this.idx = index;
            this.paramForm = row;
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
                    const { data: res } = await this.$http.post('/paramService/change', this.paramForm);
                    if (res.code !== '0000') {
                        this.$message.error('编辑参数失败!');
                    } else {
                        this.$message.success(`编辑参数成功!`);
                        // 隐藏编辑参数的对话框
                        this.editParemeterVisible = false;
                        // 重新获取用户列表数据
                        this.getParameterList();
                    }
                }
            });
        },
        // 清空搜索区域数据
        resetForm(query) {
            this.$refs.queryRef.resetFields();
            // this.getParameterList();
        },
        // 监听pagesize改变的事件
        handleSizeChange(newSize) {
            // console.log(newSize);
            this.query.pageSize = newSize;
            this.getParameterList();
        },
        // 监听页码值改变事件
        handleCurrentChange(newPage) {
            // console.log(newPage);
            this.query.pageNum = newPage;
            this.getParameterList();
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
    width: 180px;
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
