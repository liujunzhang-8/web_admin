<template>
    <div>
        <el-card>
            <!-- 查询条件 -->
            <el-form
                ref="queryFormRef"
                :model="queryForm"
                :rules="queryFormRules"
                label-width="80px"
                inline
            >
                <el-form-item label="保单号" prop="policyNum">
                    <el-input
                        v-model="queryForm.policyNum"
                        class="handle-input"
                        placeholder="请输入保单号"
                        clearable
                    ></el-input>
                </el-form-item>
                <el-form-item label="模板名称" prop="templateName">
                    <el-select v-model="queryForm.templateName" placeholder="请选择">
                        <el-option value="">--请选择--</el-option>
                        <el-option
                            v-for="template in templateList"
                            :key="template.templateCode"
                            :value="template.templateName"
                            :label="template.templateName"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="分公司" prop="companyId">
                    <el-select
                        v-model="queryForm.companyId"
                        placeholder="请选择"
                        value-key="companynum"
                    >
                        <el-option value="">--请选择--</el-option>
                        <el-option
                            v-for="item in companyId"
                            :key="item.companynum"
                            :value="item.companynum"
                            :label="item.companyname"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="来源" prop="origin">
                    <el-select v-model="queryForm.origin" placeholder="请选择">
                        <el-option value="">--请选择--</el-option>
                        <el-option
                            v-for="origin in originList"
                            :key="origin.allOfOrigin"
                            :value="origin.paramValue"
                            :label="origin.paramRemark"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="开始日期" prop="startDate">
                    <el-date-picker v-model="queryForm.startDate" type="date" placeholder="开始日期"></el-date-picker>
                </el-form-item>
                <el-form-item label="结束日期" prop="endDate">
                    <el-date-picker v-model="queryForm.endDate" type="date" placeholder="结束日期"></el-date-picker>
                </el-form-item>
                <el-form-item label="状态" prop="status">
                    <el-select v-model="queryForm.status">
                        <el-option value="">--请选择--</el-option>
                        <el-option
                            v-for="statu in statusList"
                            :key="statu.paramKey"
                            :value="statu.paramValue"
                            :label="statu.paramRemark"
                        ></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="search()">搜索</el-button>
            <el-button
                type="warning"
                icon="el-icon-refresh-left"
                size="mini"
                @click="resetForm('queryForm')"
            >清空</el-button>
            <!-- 查询列表区域 -->
            <el-table :data="wechatQueryList" border stripe>
                <el-table-column label="保单号" prop="policyNum" align="center" show-overflow-tooltip></el-table-column>
                <el-table-column label="来源" prop="originDesc" align="center" show-overflow-tooltip></el-table-column>
                <el-table-column label="微信编号" prop="wechatCode" align="center" show-overflow-tooltip></el-table-column>
                <el-table-column label="微信模板ID" prop="templateId" align="center" show-overflow-tooltip></el-table-column>
                <el-table-column
                    label="模板名称"
                    prop="templateCode"
                    align="center"
                    show-overflow-tooltip
                ></el-table-column>
                <el-table-column label="微信号" prop="wechatNo" align="center" show-overflow-tooltip></el-table-column>
                <el-table-column label="发送时间" prop="sendTime" align="center" show-overflow-tooltip></el-table-column>
                <el-table-column label="状态" prop="statusDesc" align="center" show-overflow-tooltip></el-table-column>
                <el-table-column
                    label="微信内容"
                    prop="wechatDetail"
                    width="160px"
                    align="center"
                    show-overflow-tooltip
                ></el-table-column>
                <el-table-column label="操作" width="100" align="center">
                    <template slot-scope="scope">
                        <el-button
                            type="text"
                            icon="el-icon-view"
                            @click="handleView(scope.$index, scope.row)"
                        >查看</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页 -->
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryForm.pageNum"
                :page-sizes="[10, 20, 50, 100]"
                :page-size="queryForm.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
            ></el-pagination>
        </el-card>

        <!-- 查看弹出框 -->
        <el-dialog title="查看微信" :visible.sync="viewVisible" class="diaForm" width="50%">
            <div class="dialogDiv">
                <el-form ref="form" :model="form" label-width="90px">
                    <el-form-item label="保单号">
                        <el-input v-model="form.policyNum" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="来源">
                        <el-input v-model="form.origin" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="微信编号">
                        <el-input v-model="form.wechatCode" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="微信模板ID">
                        <el-input v-model="form.templateId" class="handle-input" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="模板名称">
                        <el-input v-model="form.templateCode" class="handle-input" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="微信号">
                        <el-input v-model="form.wechatNo" class="handle-input" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="发送时间">
                        <el-input v-model="form.sendTime" class="handle-input" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="状态">
                        <el-input v-model="form.status" class="handle-input" disabled></el-input>
                    </el-form-item>
                    <el-form-item label="微信内容">
                        <el-input type="textarea" rows="5" v-model="form.wechatDetail" disabled></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="viewVisible = false">返 回</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            queryForm: {
                companyId: [],
                templateName: '',
                status: '',
                origin: '',
                policyNum: '',
                startDate: '',
                endDate: '',
                pageNum: 1,
                pageSize: 10
            },
            // 分公司
            companyId: {},
            wechatQueryList: [],
            queryList: {},
            // 模板名称查询参数
            query: {
                templateCode: '',
                templateName: '',
                templateType: ''
            },
            templateList: [],
            // 获取所有微信来源
            originList: {},
            paramType: '',
            // 获取所有微信状态
            statusList: {},
            total: 0,
            // 搜索框表单验证
            queryFormRules: {
                policyNum: [{ required: false, message: '请输入保单号', trigger: 'blur' }],
                companyId: [{ required: false, message: '请选择分公司', trigger: 'blur' }],
                status: [{ required: false, message: '请选择状态', trigger: 'blur' }],
                origin: [{ required: false, message: '请选择来源', trigger: 'blur' }],
                startDate: [{ required: false, message: '请输入开始日期', trigger: 'blur' }],
                templateName: [{ required: false, message: '请选择模板名称', trigger: 'blur' }]
            },
            // 查看微信
            form: {
                companyId: [],
                templateType: '',
                templateName: '',
                status: '',
                origin: '',
                policyNum: ''
            },
            // 查看对话框的显示与隐藏
            viewVisible: false
        };
    },
    created() {
        this.getWeChatQueryList();
        this.companyInfo();
        this.getTemplateList();
        this.getSmsOrigin();
        this.getSmsStatus();
    },
    methods: {
        // 获取微信查询
        async getWeChatQueryList() {
            this.searchWeChatQuery();
        },
        // 点击搜索
        async search() {
            this.query.pageNum = 1;
            this.searchWeChatQuery();
        },
        // 搜索微信
        async searchWeChatQuery() {
            const { data: res } = await this.$http.post('/weChat/pgSearch', this.queryForm);
            // console.log(res);
            if (res.code !== '0000') {
                return this.$message('获取微信列表失败');
            } else {
                this.wechatQueryList = res.data;
                this.total = res.page.total;
            }
        },
        // 获取分公司
        async companyInfo() {
            const { data: res } = await this.$http.post('/companyInfo/getAllCompanys');
            if (res.code !== '0000') {
                return this.$message('获取分公司失败');
            } else {
                this.companyId = res.data;
                // console.log(res.data[5].companynum);
            }
        },
        // 获取所有的模板名称
        async getTemplateList() {
            const { data: res } = await this.$http.post('/templateService/searchWXTemplates', this.query);
            if (res.code !== '0000') {
                return this.$message('获取模板列表失败');
            } else {
                this.templateList = res.data;
            }
        },
        // 获取所有短信来源
        async getSmsOrigin() {
            const { data: res } = await this.$http.post('/paramService/list', {
                paramType: 'messageOrigin'
            });
            if (res.code !== '0000') {
                return this.$message('获取短信来源失败');
            } else {
                this.originList = res.data;
            }
        },
        // 获取所有短信状态
        async getSmsStatus() {
            const { data: res } = await this.$http.post('/paramService/list', {
                paramType: 'messageStatus'
            });
            if (res.code !== '0000') {
                return this.$message('获取短信状态失败');
            } else {
                this.statusList = res.data;
            }
        },
        // 清空搜索区域数据
        resetForm(queryForm) {
            this.$refs.queryFormRef.resetFields();
            this.getWeChatQueryList();
        },
        // 查看操作
        async handleView(scope, row) {
            const { data: res } = this.$http.post('/weChat/getById', {id: row.id});
            this.viewVisible = true;
            this.form = row;
        },
        // 监听pagesize改变的事件
        handleSizeChange(newSize) {
            this.queryForm.pageSize = newSize;
            this.getWeChatQueryList();
        },
        // 监听页码值改变事件
        handleCurrentChange(newPage) {
            this.queryForm.pageNum = newPage;
            this.getWeChatQueryList();
        }
    }
};
</script>

<style lang="less" scoped>
.el-input {
    width: 216px;
    display: inline-block;
}
.el-date-picker {
    width: 200px;
}
.el-table {
    width: 100%;
    margin-top: 20px;
    font-size: 14px;
}
.dialogDiv {
    height: 300px;
    overflow: auto;
}
.el-pagination {
    margin-top: 20px;
    margin-bottom: 10px;
    float: right;
}
</style>