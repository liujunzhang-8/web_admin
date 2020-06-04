<template>
    <div>
        <!-- 搜索与添加区域 -->
        <el-form
            :inline="true"
            ref="queryRef"
            :model="query"
            :rules="queryRules"
            class="demo-form-inline"
        >
            <el-form-item label="用户名称" prop="userName">
                <el-input v-model="query.userName" placeholder="用户名称" clearable></el-input>
            </el-form-item>
            <el-form-item label="真实姓名" prop="userRealName">
                <el-input v-model="query.userRealName" placeholder="真实姓名" clearable></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="searchUser()">搜索</el-button>
                <el-button
                    type="warning"
                    icon="el-icon-refresh-left"
                    size="mini"
                    @click="resetForm()"
                >清空</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import Bus from '../../../common/bus'
export default {
    data() {
        return {
            query: {
                userName: '',
                userRealName: '',
                pageSize: 5
            },
            queryRules: {
                userName: [{ required: false, message: '请输入用户名称', trigger: 'blur' }],
                userRealName: [{ required: false, message: '请输入真实姓名', trigger: 'blur' }]
            }
        };
    },
    created() {
        this.sendMsg(),
        Bus.$on('activeName', item => {
            this.userlist = item
        })
    },
    methods: {
        // 搜索用户
        async searchUser() {
            const { data: res } = await this.$http.post('/user/list', this.query);
            // console.log(res);
            if (res.code !== '0000') {
                return this.$message('获取用户列表失败');
            } else {
                this.userlist = res.data;
                this.total = res.page.total;
            }
        },
        // 清空搜索区域数据
        resetForm() {
            this.$refs.queryRef.resetFields();
        },
        sendMsg () {
            Bus.$emit ('activeName', this.userlist)
        }
    }
};
</script>

<style lang="sass" scoped>

</style>