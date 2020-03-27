<template>
    <div id="nico">
        <!-- 为 ECharts 准备一个具备大小（宽高）的 DOM -->
        <div class="top">
            <div>
                <span v-if="titleshow">文件数量</span>
                <div id="main1" style="width: 520px;height:350px;"></div>
            </div>
            <div>
                <span v-if="titleshow">文件大小</span>
                <div id="main2" style="width: 520px;height:350px;"></div>
            </div>
        </div>
        
        <div class="mydata">
            <div  style="width: 520px;height:350px;"  v-if="titleshow">
                <p>妮可网盘已为您存储文件<span>{{userdata.day}}</span>天</p>
                <p>您一共存储了<span>{{filenumber}}</span>个文件</p>
                <p>其中，电子书<span>{{allFileNum.data[0].value}}</span>个，共<span>{{userdata.showsize[0]}}</span></p>
                <p>图片文件<span>{{allFileNum.data[1].value}}</span>个，共<span>{{userdata.showsize[1]}}</span></p>
                <p>视屏文件<span>{{allFileNum.data[2].value}}</span>个，共<span>{{userdata.showsize[2]}}</span></p>
                <p>文档<span>{{allFileNum.data[3].value}}</span>个，共<span>{{userdata.showsize[3]}}</span></p>
                <p>其他文件<span>{{allFileNum.data[4].value}}</span>个，共<span>{{userdata.showsize[4]}}</span></p>
            </div>
            <div  style="width: 520px;height:350px;"  v-if="titleshow">
                <p>广告位招租</p>
                <p>如有意向，请联系站长</p>
            </div>
        </div>
        
    </div>
</template>
<script>
import echarts from 'echarts'

function getNowFormatDate() {
        var date = new Date();
        var seperator1 = "-";
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        // var currentdate = year + seperator1 + month + seperator1 + strDate;
        var currentdate ={
            year,month,strDate
        }
        return currentdate;
    }

function days(year,month,day){
    var dateArr = new Array(31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
    var result = 0;
    for ( var i = 0; i < month; i++) {
        result += dateArr[i];
    }
    result += day;
    //判断是否闰年
    if (month > 1 && (year % 4 == 0 && year % 100 != 0) || year % 400 == 0) {
        result += 1;
    }
    return result
}

export default {
    data() {
        return {
            allFileNum:{
                data:[],
                max:0,
                min:0
            },
            allFileSize:{
                data:[],
                max:0,
                min:0
            },
            titleshow:false,
            userdata:{
                showsize:[],
                createtime:'',
                day:0
            }
        }
    },
    created() {
        this.getcreatetime()
    },
    computed: {
        filenumber(){
            let num = 0
            this.allFileNum.data.forEach(item => {
                num+=item.value
            });
            return num
        }
    },
     async mounted() {
        await this.getAllFileNum()
        await this.getAllFileSize()
        // 基于准备好的dom，初始化echarts实例
        var myChart1 = echarts.init(document.getElementById('main1'));
        var myChart2 = echarts.init(document.getElementById('main2'));
        // 指定图表的配置项和数据
        var option1 = {
            title: {

            },
            backgroundColor: '#f7f7f7',
            series : [
                {
                    type: 'pie',
                    radius: '70%',
                    roseType: 'angle',
                    // 字的颜色
                    label: {
                        normal: {
                            textStyle: {
                                color: '#606266'
                            }
                        }
                    },
                    // 线的颜色
                    labelLine: {
                        normal: {
                            lineStyle: {
                                color: '#606266'
                            }
                        }
                    },
                    data:this.allFileNum.data
                }
            ]
        };
        var option2 = {
            title: {

            },
            backgroundColor: '#f7f7f7',
            series : [
                {
                    type: 'pie',
                    radius: '70%',
                    // roseType: 'angle',
                    // 字的颜色
                    label: {
                        normal: {
                            textStyle: {
                                color: '#606266'
                            }
                        }
                    },
                    // 线的颜色
                    labelLine: {
                        normal: {
                            lineStyle: {
                                color: '#606266'
                            }
                        }
                    },
                    data:this.allFileSize.data
                }
            ]
        };
        // 使用刚指定的配置项和数据显示图表。
        myChart1.setOption(option1);
        myChart2.setOption(option2);
        // 判断是否登录
        if(this.allFileNum.data.length===0) return this.titleshow  = false
        this.titleshow  = true
    },
    methods: {
        // 获取文件数量总览数据
        async getAllFileNum(){
            const {data} = await this.$http.get(`getAllFileNum`)
            if (data.code !== 200) return this.$message('登录后方可使用此功能')
            this.allFileNum.data = data.arr
            this.allFileNum.max = data.max
            this.allFileNum.min = data.min
        },
        // 获取文件大小总览数据
        async getAllFileSize(){
            const {data} = await this.$http.get(`getAllFileSize`)
            if (data.code !== 200) return 
            this.allFileSize.data = data.arr
            this.allFileSize.max = data.max
            this.allFileSize.min = data.min
            this.userdata.showsize = data.showsize
        },
        // 获取用户注册的时间
        async getcreatetime(){
            const {data} = await this.$http.get(`usercreatetime`)
            if (data.code !== 200) return 
            this.userdata.createtime= data.arr[0].createtime

            let nowdate = getNowFormatDate()
            let day1 =  days(nowdate.year,nowdate.month,nowdate.strDate)
            let day2 = this.userdata.createtime.split('T')[0].split('-')
            let day = day1 - days(Number(day2[0]),Number(day2[1]),Number(day2[2]))
            this.userdata.day = day
        },
    },
}
</script>
<style lang="less" scoped>
    #nico{
        height: 100%;
    }
    .top{
        width: 100%;
        display: flex;
        justify-content: space-around;
        span{
            display: block;
            text-align: center;
            background-color: #f7f7f7;
            border-radius: 10px 10px 0  0;
            padding-top: 10px;
        }
        #main1,#main2{
            border-radius: 0 0 10px 10px;
            overflow: hidden;
        }
    }
    .mydata{
        margin-top: 40px;
        width: 100%;
        display: flex;
        justify-content: space-around;
        div{
            background-color: #f7f7f7;
        }
        div:nth-child(1){
            color: #606266;
            p{
                padding-left: 100px;
            }
            span{
                padding: 0 10px;
                font-size: 25px;
                color: #a4b0be;
            }
        }
        div:nth-child(2){
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-content: center;
            p{
                text-align: center;
            }
        }
    }
</style>