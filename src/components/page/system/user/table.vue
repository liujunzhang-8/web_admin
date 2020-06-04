<template>
    <div>
        <el-table :data="userlist" border stripe>
            <el-table-column prop="userId" label="ID" align="center" width="50"></el-table-column>
            <el-table-column prop="userName" label="用户名" align="center"></el-table-column>
            <el-table-column prop="userRealName" label="真实姓名" align="center"></el-table-column>
            <el-table-column prop="userPhone" label="手机号码" align="center"></el-table-column>
            <el-table-column
                prop="userEmail"
                label="电子邮箱"
                align="center"
                width="160"
                show-overflow-tooltip
            ></el-table-column>
            <el-table-column prop="userSummary" label="用户描述" align="center"></el-table-column>
            <el-table-column prop="createdDate" label="创建时间" align="center" width="160"></el-table-column>
            <el-table-column label="操作" width="220px" align="center" inline>
                <!-- 查看按钮 -->
                <See style="float: left; margin-left: 18px"></See>
                <!-- 修改按钮 -->
                <Edit style="float: left; margin-left: 18px"></Edit>
                <!-- 删除按钮 -->
                <el-button
                    type="text"
                    icon="el-icon-delete"
                    class="red"
                    @click="deleteUser(scope.$index, scope.row)"
                >删除</el-button>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import See from './see';
import Edit from './edit';
import Bus from '../../../common/bus';
export default {
    data() {
        return {
            query: {
                userName: '',
                userRealName: '',
                pageSize: 5
            },
            total: 25,
            // 用户列表
            userlist: []
        };
    },
    created() {
        this.getUserList();
        this.sendMsg();
        Bus.$on('activeName', item => {
            this.userlist = item;
        });
        // this.searchOperation();
    },
    methods: {
        // 获取用户列表
        async getUserList() {
            this.searchUser();
        },
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
        // 删除操作
        deleteUser(index, row) {
            // 二次确认删除
            this.$confirm('确定要删除吗？', '警告', {
                type: 'warning'
            })
                .then(async valid => {
                    console.log(valid);
                    if (!valid) {
                        return;
                    } else {
                        const { data: res } = await this.$http.get('/user/deleteUser/' + row.userId);
                        if (res.code !== '0000') {
                            return this.$message.error('删除用户失败！');
                        } else {
                            this.$message.success('删除用户成功');
                            this.userlist.splice(index, 1);
                            this.getUserList();
                        }
                    }
                })
                .catch(() => {});
        },
        sendMsg() {
            Bus.$emit('activeName', this.total);
        }
    },
    components: {
        See,
        Edit
    }
};
</script>

<style lang="sass" scoped>
.el-table 
    width: 100%
    margin-top: 20px
    font-size: 14px
.red 
    color: #ff0000
</style>