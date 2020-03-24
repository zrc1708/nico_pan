<template>
    <div>
        <!-- 为 ECharts 准备一个具备大小（宽高）的 DOM -->
        <div id="main1" style="width: 500px;height:300px;"></div>
        <div id="main2" style="width: 500px;height:300px;"></div>
    </div>
</template>
<script>
import echarts from 'echarts'

export default {
    data() {
        return {
            allFileNum:[]
        }
    },
    created() {
        this.getAllFileNum()
    },
    mounted() {
        // 基于准备好的dom，初始化echarts实例
        var myChart1 = echarts.init(document.getElementById('main1'));
        var myChart2 = echarts.init(document.getElementById('main2'));
        // 指定图表的配置项和数据
        var option1 = {
            title: {
                text: '文件类型'
            },
            backgroundColor: '#f7f7f7',
            visualMap: {
                show: false,
                min: 80,
                max: 600,
                inRange: {
                    colorLightness: [0, 1]
                }
            },
            series : [
                {
                    type: 'pie',
                    radius: '65%',
                    roseType: 'angle',
                    label: {
                        normal: {
                            textStyle: {
                                color: '#606266'
                            }
                        }
                    },
                    labelLine: {
                        normal: {
                            lineStyle: {
                                color: '#606266'
                            }
                        }
                    },
                    data:[
                        {value:235, name:'视频广告'},
                        {value:274, name:'联盟广告'},
                        {value:310, name:'邮件营销'},
                        {value:335, name:'直接访问'},
                        {value:400, name:'搜索引擎'}
                    ],
                    itemStyle: {
                        normal: {
                            color: '#c23531',
                            shadowBlur: 200,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };
        var option2 = {
            title: {
                text: '文件大小'
            },
            backgroundColor: '#f7f7f7',
            visualMap: {
                show: false,
                min: 80,
                max: 600,
                inRange: {
                    colorLightness: [0, 1]
                }
            },
            series : [
                {
                    type: 'pie',
                    radius: '65%',
                    // roseType: 'angle',
                    label: {
                        normal: {
                            textStyle: {
                                color: '#606266'
                            }
                        }
                    },
                    labelLine: {
                        normal: {
                            lineStyle: {
                                color: '#606266'
                            }
                        }
                    },
                    data:[
                        {value:235, name:'视频广告'},
                        {value:274, name:'联盟广告'},
                        {value:310, name:'邮件营销'},
                        {value:335, name:'直接访问'},
                        {value:400, name:'搜索引擎'}
                    ],
                    itemStyle: {
                        normal: {
                            color: '#409EFF',
                            shadowBlur: 200,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };
        // 使用刚指定的配置项和数据显示图表。
        myChart1.setOption(option1);
        myChart2.setOption(option2);
    },
    methods: {
        async getAllFileNum(){
            const {data} = await this.$http.get(`getAllFileNum`)
            if (data.code !== 200) return this.$message('登录后方可使用此功能')
            console.log(data);
            this.allFileNum = data.arr
        }
    },
}
</script>
<style lang="less" scoped>
    #main1,#main2{
        border-radius: 5px;
    }
</style>