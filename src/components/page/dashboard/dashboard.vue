<template>
    <div>
        <sum-mary></sum-mary>
        <el-row :gutter="20">
            <el-col :span="12">
                    <line-charts class="lCharts"></line-charts>
            </el-col>
            <el-col :span="12">
                    <pie-charts class="pieCharts"></pie-charts>
            </el-col>
        </el-row>
    </div>
</template>

<script>
require('echarts/theme/macarons');
import SumMary from '../dashboard/summary'
import LineCharts from '../dashboard/charts/LineCharts'
import PieCharts from '../dashboard/charts/PieChart'
export default {
    name: 'dashboard',
    data() {
        return {
        };
    },
    components: {
        LineCharts,
        PieCharts,
        SumMary
    },
    computed: {
        role() {
            return this.name === 'admin' ? '超级管理员' : '普通用户';
        }
    },
    methods: {
    }
};
</script>


<style scoped lang="scss">
$mgTop: 10px;
@mixin shadow {
    box-shadow: 0 0 10px #e2e2e2;
}
.lCharts {
    background: #fff;
    // margin-top: $mgTop;
    padding: 10px 0;
    @include shadow();
}
.pieCharts {
  background: #fff;
  padding: 10px 0;
  @include shadow();
}
</style>