<template>
    <div ref="myChart" :style="{ width: width, height: height }" id="myChart"></div>
</template>

<script>
import echarts from 'echarts';
import _ from 'lodash';
require('echarts/theme/macarons');
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
        // lineChartData: {
        //     type: Object,
        //     required: true
        // }
    },
    name: 'dashboard',
    data() {
        return {
            num: 6,
            // 需要合并的数据
            options: {
                backgroundColor: '#fff',
                title: {
                    text: '月度消息发送量',
                    left: 'center',
                    textStyle: {
                        // color: '#55a8fd'
                    }
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        label: {
                            background: '#6a7985'
                        }
                    }
                },
                legend: {
                    orient: 'vertical',
                    top: '8%'
                    // data: ['短信', '微信', '邮件', 'app']
                },
                grid: {
                    left: '3%',
                    right: '7%',
                    bottom: '3%',
                    containLabel: true
                },
                // color: ['#FF507C'],
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    // data: ['7月', '8月', '9月', '10月', '11月', '12月'],
                    axisLabel: {
                        color: '#55a8fd' //x轴上的字体颜色
                    },
                    axisLine: {
                        lineStyle: {
                            width: 2,
                            color: '#55a8fd' //x轴的轴线的宽度和颜色
                        }
                    }
                },
                yAxis: {
                    splitLine: {
                        lineStyle: {
                            type: 'dotted'
                        }
                    },
                    axisLabel: {
                        color: '#55a8fd' //y轴上的字体颜色
                    },
                    axisLine: {
                        lineStyle: {
                            width: 2,
                            color: '#55a8fd' //y轴的轴线的宽度和颜色
                        }
                    },
                    type: 'value'
                },
                series: [
                    {
                        // name: '短信',
                        smooth: true,
                        type: 'line',
                        // data: [542, 761, 684, 495, 405, 395],
                        itemStyle: {
                            color: '#55a8fd'
                            // normal: {
                            //     borderWidth: '1'
                            // }
                        },
                        lineStyle: {
                            color: '#55a8fd'
                        }
                    }
                ]
            }
        };
    },
    // mounted() {
    //     document.querySelector('#myChart').style.width = document.querySelector('.content').clientWidth;
    //     this.setMyEchart(); //页面挂载完成后执行
    // },
    // 此时，页面上的元素已经被渲染完毕了
    async mounted() {
        // 3、基于准备好的dom，初始化echarts实例
        var myChart = echarts.init(document.getElementById('myChart'));
        const { data: res } = await this.$http.post('/smsInfo/getLineChartData', { num: this.num });
        if (res.code !== '0000') {
            return this.$message.error('获取折线图数据失败！');
        }
        // 4、准备数据和配置项
        const result = _.merge(res.data, this.options);
        // 5、展示数据
        myChart.setOption(result);
    },
    methods: {
        setMyEchart() {
            const myChart = this.$refs.myChart; //通过ref获取到DOM节点
            if (myChart) {
                const thisChart = this.$echarts.init(myChart); //利用原型调取Echarts的初始化方法
                //{}内写需要图表的各种配置，可以在官方案例中修改完毕后复制过来
                // const option = {
                //     // 
                // };
                // this.smsData.map(i => {
                //     // option.xAxis.data.push(i.timeDay);
                //     option.series[0].data.push(i.smsDataCount);
                // });
                // this.wechatData.map(i => {
                //     // option.xAxis.data.push(i.timeDay);
                //     option.series[1].data.push(i.wechatData);
                // });
                thisChart.setOption(option); //将编写好的配置项挂载到Echarts上
                window.addEventListener('resize', function() {
                    thisChart.resize(); //页面大小变化后Echarts也更改大小
                });
            }
        }
    }
};
</script>

<style lang="less" scoped></style>