<template>
    <div>
        <el-card>
            <!-- 查询条件 -->
            <el-form
                ref="queryRef"
                :model="queryInfo"
                :rules="queryRules"
                label-width="80px"
                inline
            >
                <el-form-item label="关键字" prop="keyword">
                    <el-input v-model="queryInfo.keyword" class="handle-input" closable clearable></el-input>
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
                @click="addKeys = true"
            >添加</el-button>
            <el-table
                :data="keyWordsList"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
            >
                <el-table-column prop="keyword" label="关键字" align="center"></el-table-column>
                <el-table-column prop="keywordNote" label="说明" align="center"></el-table-column>
                <el-table-column prop="createTime" label="创建时间" align="center"></el-table-column>
                <el-table-column prop="createBy" label="创建人" align="center"></el-table-column>
            </el-table>
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.newPage"
                :page-sizes="[10, 20, 30, 40]"
                :page-size="queryInfo.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
            ></el-pagination>
        </el-card>

        <!-- 新增弹出框 -->
        <el-dialog
            title="新增模板关键字"
            :visible.sync="addKeys"
            class="diaForm"
            @close="addDialogClosed()"
        >
            <el-form
                ref="addKeyWordsRef"
                :model="addKeyWords"
                :rules="addKeyWordsRefRules"
                label-width="100px"
            >
                <el-form-item label="关键字名称" prop="keyword">
                    <el-input v-model="addKeyWords.keyword" class="handle-input"></el-input>
                </el-form-item>
                <el-form-item label="关键字说明" prop="keywordNote">
                    <el-input v-model="addKeyWords.keywordNote" class="handle-input"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="addKeys = false">取 消</el-button>
                <el-button type="primary" @click="addKeyWord()">提 交</el-button>
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
                keyword: '',
                keywordNote: '',
                pageNum: 1,
                pageSize: 10
            },
            queryRules: {
                keyword: [{ required: false, message: '请输入关键字', trigger: 'blur' }]
            },
            // 添加关键字打开隐藏
            addKeys: false,
            addKeyWords: {
                keyword: '',
                keywordNote: ''
            },
            addKeyWordsRefRules: {
                keyword: [{ required: true, message: '请输入关键字', trigger: 'blur' }],
                keywordNote: [{ required: true, message: '请输入关键字说明', trigger: 'blur' }]
            },
            keyWordsList: [],
            tableData: [],
            multipleSelection: [],
            delList: [],
            diaIsShow: false,
            formData: {},
            viewVisible: false,
            editVisible: false,
            addVisible: false,
            total: 0,
            form: {},
            idx: -1,
            id: -1
        };
    },
    created() {
        this.getKeyWords();
    },
    methods: {
        // 获取模板关键字列表
        async getKeyWords() {
            this.searchKeyWords();
        },
        // 搜索
        async search() {
            this.queryInfo.pageNum = 1;
            this.searchKeyWords()
        },
        // 搜索模板关键字
        async searchKeyWords() {
            const { data: res } = await this.$http.post('/templateService/getKeywords', this.queryInfo);
            // console.log(res);
            if (res.code !== '0000') {
                return this.$message('获取模板关键字列表失败');
            } else {
                this.keyWordsList = res.data;
                this.total = res.page.total;
            }
        },
        // 清空搜索区域数据
        resetForm(queryInfo) {
            this.$refs.queryRef.resetFields();
        },
        // 添加模板关键字
        addKeyWord() {
            this.$refs.addKeyWordsRef.validate(async valid => {
                // console.log(valid);
                if (!valid) {
                    return;
                } else {
                    // 可以发起添加用户的网络请求
                    const { data: res } = await this.$http.post('/templateService/addKeyword', this.addKeyWords);
                    // console.log(res.data)
                    if (res.code !== '0000') {
                        this.$message.error('添加关键字失败');
                    } else {
                        this.$message.success('添加关键字成功！');
                        // 隐藏添加关键字的对话框
                        this.addKeys = false;
                        // 重新获取关键字列表数据
                        this.getKeyWords();
                    }
                }
            });
        },
        // 查看操作
        handleView(index, row) {
            this.idx = index;
            this.form = row;
            this.viewVisible = true;
        },
        // 编辑操作
        handleEdit(index, row) {
            this.idx = index;
            this.form = row;
            this.editVisible = true;
        },
        // 保存添加
        saveAdd() {
            this.addVisible = false;
            this.$message.success(`提交成功`);
        },
        // 监听添加用户对话框的关闭事件
        addDialogClosed() {
            this.$refs.addKeyWordsRef.resetFields();
        },
        // 监听pagesize改变的事件
        handleSizeChange(newSize) {
            // console.log(newSize);
            this.queryInfo.pageSize = newSize;
            this.getKeyWords();
        },
        // 监听页码值改变事件
        handleCurrentChange(newPage) {
            // console.log(newPage);
            this.queryInfo.pageNum = newPage;
            this.getKeyWords();
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
