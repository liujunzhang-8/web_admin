<template>
    <div>
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="query.pageNum"
            :page-sizes="[5, 10, 15, 20]"
            :page-size="query.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
        ></el-pagination>
    </div>
</template>

<script>
import Bus from '../../../common/bus'
export default {
    data() {
        return {
            query: {
            },
            // 用户总量
            total: 0
        };
    },
    created() {
        Bus.$on('activeName', item => {
            this.total = item
        })
    },
    methods: {
        // 监听pagesize改变的事件
        handleSizeChange(newSize) {
            this.query.pageSize = newSize;
            this.getUserList();
        },
        // 监听页码值改变事件
        handleCurrentChange(newPage) {
            this.query.pageNum = newPage;
            this.getUserList();
        },
    }
};
</script>

<style lang="sass" scoped>
.el-pagination 
    margin-top: 20px;
    margin-bottom: 10px;
    float: right;
</style>