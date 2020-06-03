<template>
    <div ref="myPieChart" :style="{ width: width, height: height }" id="myPieChart"></div>
</template>

<script>
import echarts from 'echarts';
import _ from 'lodash';
export default {
    props: {
        width: {
            type: String,
            default: '100%'
        },
        height: {
            type: String,
            default: '350px'
        }
    },
    // name: 'dashboard',
    data() {
        return {
            // mycharts: '',
            name: [],
            value: []
        };
    },
    mounted() {
        document.querySelector('#myPieChart').style.width = document.querySelector('.content').clientWidth;
        // this.setMyEchart(); //页面挂载完成后执行
        this.getPieChart()
        this.drawCharts()
    },
    methods: {
        setMyEchart() {
            this.myPieChart = this.$echarts.init(document.getElementById("myPieChart")); //通过ref获取到DOM节点
            // if (myPieChart) {
                // const thisChart = this.$echarts.init(myPieChart); //利用原型调取Echarts的初始化方法
                //{}内写需要图表的各种配置，可以在官方案例中修改完毕后复制过来
                this.myPieChart.setOption ({
                    backgroundColor: '#fff',
                    title: {
                        text: '消息发送总量',
                        left: 'center'
                        // textStyle: {
                        //     color: '#55a8fd',
                        // }
                    },
                    tooltip: {
                        trigger: 'item'
                        // formatter: '{a} <br/>{b} : {c} ({d}%)'
                    },
                    legend: {
                        orient: 'vertical',
                        top: '6%',
                        left: '7%',
                        data: []
                    },
                    color: ['#55a8fd'],
                    series: [
                        {
                            name: '访问来源',
                            type: 'pie',
                            radius: '70%',
                            center: ['50%', '50%'],
                            data: [
                                // { value: 335, name: '直接访问' },
                                // { value: 310, name: '邮件' },
                                // { value: 234, name: '短信' },
                                // { value: 335, name: '微信' },
                                // { value: 548, name: 'App' }
                            ],
                            emphasis: {
                                itemStyle: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }
                    ]
                });
            // }
        },
        async getPieChart() {
            const { data: res } = await this.$http.post('/smsInfo/getPieChart');
            // console.log(res.data.options.series)
            var getData = [];
            var getLegend = [];
            for(let i=0; i<res.data.options.series.length; i++) {
                var obj = new Object();
                var arr = new Array();
                obj.name = res.data.options.series[i].data[i].name;
                obj.value = res.data.options.series[i].data[i].value;
                arr.name = res.data.options.series[i].data[i].name
                getData[i] = obj
                getLegend[i] = arr
                // console.log(getData[i])
                // console.log(getLegend[i])
            }
            this.myPieChart.setOption({
                legend: {
                    data: getLegend.value
                },
                series: [{
                    data: getData
                }]
            })
        },
        drawCharts() {
            this.setMyEchart();
        }
    }
};
</script>
<style></style>