<template>
    <div>
        <el-card>
            <div class="clear"></div>
            <el-row :gutter="10">
                <el-col :span="8">
                    <!-- 接收号码 -->
                    <span>手机号码</span>
                    <el-input v-model="Sending.num" placeholder="手机号码" clearable class="mr10"></el-input>
                </el-col>
            </el-row>
            <el-divider></el-divider>
            <el-row :gutter="10">
                <el-col :span="16">
                    <el-form ref="form" :model="multipleSelection" label-width="80px">
                        <el-form-item label="发送内容">
                            <el-input
                                type="textarea"
                                rows="8"
                                v-model="multipleSelection.templateDetail"
                            ></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="handleSending()">发 送</el-button>
                            <el-button type="danger" @click="clearText">清 空</el-button>
                            <el-button type="info" @click="templateDialogVisible = true">我的模板</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
        </el-card>
        <!-- 我的模板弹出框 -->
        <el-dialog
            title="我的模板"
            :visible.sync="templateDialogVisible"
            width="60%"
            @close="myTemplateDialogClosed()"
        >
            <!-- 查询条件 -->
            <el-form ref="queryRef" :model="query" :rules="queryRules" label-width="80px">
                <el-form-item label="模板编码" style="float: left;" prop="templateCode">
                    <el-input v-model="query.templateCode" class="handle-input"></el-input>
                </el-form-item>
                <el-form-item label="模板名称" style="float: left;" prop="templateName">
                    <el-input v-model="query.templateName" class="handle-input"></el-input>
                </el-form-item>
            </el-form>
            <el-button type="primary" icon="el-icon-search" @click="search()">搜索</el-button>
            <el-button type="warning" icon="el-icon-refresh-left" @click="resetForm('query')">清空</el-button>
            <el-table :data="templateList" style="width: 100%" border>
                <el-table-column width="50">
                    <template slot-scope="scope">
                        <el-radio :label="scope.row" v-model="multipleSelection">&nbsp;</el-radio>
                    </template>
                </el-table-column>
                <el-table-column prop="templateCode" label="模板编码" width="140"></el-table-column>
                <el-table-column prop="templateName" label="模板名称" width="200"></el-table-column>
                <el-table-column prop="templateDetail" label="模板内容" show-overflow-tooltip></el-table-column>
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
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="templateDialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            Sending: {
                num: ''
            },
            sendObj: {
                templateCode: '',
                smsDetail: '',
                phoneNum: ''
            },
            templateList: [],
            templateDialogVisible: false,
            query: {
                templateCode: '',
                templateName: '',
                pageSize: 5
            },
            total: 0,
            multipleSelection: {},
            queryRules: {
                templateCode: [{ required: false, message: '请输入模板编码', trigger: 'blur' }],
                templateName: [{ required: false, message: '请输入模板名称', trigger: 'blur' }]
            }
        };
    },
    created() {
        this.getTemplateList();
    },
    methods: {
        // 获取模板列表
        async getTemplateList() {
            this.searchTemplate();
        },
        // 点击搜索
        async search() {
            this.query.pageNum = 1;
            this.searchTemplate();
        },
        // 搜索模板
        async searchTemplate() {
            const { data: res } = await this.$http.post('/templateService/pgMsgTemplatesSearch', this.query);
            if (res.code !== '0000') {
                return this.$message('获取模板列表失败');
            } else {
                this.templateList = res.data;
                this.total = res.page.total;
            }
        },
        // 发送操作
        handleSending() {
            // 二次确认发送
            this.$confirm('确定要发送吗？', '提示', {
                type: 'info'
            })
                .then(async valid => {
                    console.log(valid);
                    if (!valid) {
                        return;
                    } else {
                        const { data: res } = await this.$http.post('/smsInfo/sendSms', {
                            phoneNum: this.Sending.num,
                            smsDetail: this.multipleSelection.templateDetail,
                            templateCode: this.multipleSelection.templateCode

                            });
                        if (res.code !== '0000') {
                            return this.$message.error('短信发送失败！');
                        } else {
                            this.$message.success('短信发送成功');
                        }
                    }
                })
                .catch(() => {});
        },
        // 清空搜索区域数据
        resetForm(query) {
            this.$refs.queryRef.resetFields();
            // this.getTemplateList();
        },
        clearText() {
            this.multipleSelection.templateDetail = '';
        },
        // 监听我的模板对话框的关闭事件
        myTemplateDialogClosed() {
            this.$refs.queryRef.resetFields();
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

<style lang="less" scoped>
span {
    color: #606266;
    font-size: 14px;
    padding-right: 10px;
    margin-left: 14px;
}
.el-input {
    width: 216px;
    display: inline-block;
    margin-right: 10px;
}
.form {
    float: left;
}
.button {
    float: right;
}
.clear {
    clear: both;
}
.el-pagination {
    margin-top: 20px;
    margin-bottom: 10px;
    // float: right;
}
</style>