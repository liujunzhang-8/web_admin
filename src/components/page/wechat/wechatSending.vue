<template>
    <div>
        <el-card>
            <el-form
                ref="policyNoRef"
                :model="policyNo"
                label-width="100px"
                inline
            >
                <el-form-item label="微信标题" prop="number">
                    <el-input v-model="policyNo.number"></el-input>
                </el-form-item>
                <el-form-item label="期望通知时间" prop="number">
                    <el-input v-model="policyNo.number"></el-input>
                </el-form-item>
                <el-form-item label="是否重发" prop="number">
                    <el-input v-model="policyNo.number"></el-input>
                </el-form-item>
                <el-form-item label="跳转链接" prop="number">
                    <el-input v-model="policyNo.number"></el-input>
                </el-form-item>
                <el-form-item label="类型" prop="number">
                    <el-input v-model="policyNo.number"></el-input>
                </el-form-item>
                <el-form-item label="客户信息" prop="number">
                    <el-input v-model="policyNo.number"></el-input>
                </el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="searchPolicyNo()">查询</el-button>
            </el-form>
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
                            <el-button type="primary">发 送</el-button>
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
            <el-form ref="queryRef" :model="query" :rules="queryRules" label-width="80px" inline>
                <el-form-item label="模板编码" prop="templateCode">
                    <el-input v-model="query.templateCode"></el-input>
                </el-form-item>
                <el-form-item label="模板名称" prop="templateName">
                    <el-input v-model="query.templateName"></el-input>
                </el-form-item>
                <el-button type="primary" icon="el-icon-search" @click="searchTemplate()">搜索</el-button>
                <el-button type="warning" icon="el-icon-refresh-left" @click="resetForm('query')">清空</el-button>
            </el-form>
            <el-table :data="templateList" style="width: 100%" border>
                <el-table-column width="50">
                    <template slot-scope="scope">
                        <el-radio :label="scope.row" v-model="multipleSelection">&nbsp;</el-radio>
                    </template>
                </el-table-column>
                <el-table-column prop="templateCode" label="模板编码" width="160"></el-table-column>
                <el-table-column prop="templateName" label="模板名称" width="180"></el-table-column>
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
            policyNo: {
                number: ''
            },
            Sending: {
                num: ''
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
        // 查询保单号
        // searchPolicyNo() {},
        // 点击搜索，查询保单
        // searchPolicyNo() {
        //     this.$refs.policyNoRef.validate(async valid => {
        //         console.log(valid);
        //     });
        // },
        // 获取模板列表
        async getTemplateList() {
            this.searchTemplate();
        },
        // 搜索模板
        async searchTemplate() {
            const { data: res } = await this.$http.post('/templateService/pgWXTemplatesSearch', this.query);
            // console.log(res.data[0].templateDetail);
            if (res.code !== '0000') {
                return this.$message('获取模板列表失败');
            } else {
                this.templateList = res.data;
                this.total = res.page.total;
            }
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
    width: 200px;
    display: inline-block;
    margin-right: 10px;
}
.el-pagination {
    margin-top: 14px;
    // margin-bottom: 10px;
    // float: right;
}
</style>
