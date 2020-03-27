<template>
    <div>
        <!-- 面包屑导航-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>提取文件</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-row>
                <el-input v-model="code" placeholder="请输入提取码" class="codeinput"></el-input>
                <el-button @click="getfile">提取文件</el-button>
            </el-row>
            <el-row>
                <p>
                    <span>{{file.name}}</span>
                    <el-button class="dow" v-if="file.name" @click="download">下载</el-button>
                </p>
            </el-row>
        </el-card>
    </div>
</template>
<script>
export default {
    data() {
        return {
            code:'',
            file:{
                name:''
            },
            nowDateLast:0
        }
    },
    created() {
        let nowDate = this.getNowFormatDate()
        this.nowDateLast = this.days(nowDate)
    },
    methods: {
        async getfile(){
            let code = this.code
            let nowDateLast = this.nowDateLast
            const {data} = await this.$http.get(`getShareFile/${code}/${nowDateLast}`)
            if(data.code===222) return this.$message.error('提取码不存在')
            if(data.code===223) return this.$message.error('提取码已过期')
            if(data.code==200)  this.$message.success('提取成功')
            this.file = data.arr[0]
            console.log(data);
            this.code = ''
        },
        // 文件下载,传入文件名和文件路径
        async download(){
            let filename = this.file.name
            let filepath = this.file.path.replace('/'+filename,'').slice(2)
            this.$http.post("download", { filename,filepath},{responseType: 'blob'})
            .then(function(response) {
                var blob = new Blob([response.data])
                var downloadElement = document.createElement('a');
                var href = window.URL.createObjectURL(blob); //创建下载的链接
                downloadElement.href = href;
                downloadElement.download = filename; //下载后文件名
                document.body.appendChild(downloadElement);
                downloadElement.click(); //点击下载
                document.body.removeChild(downloadElement); //下载完成移除元素
                window.URL.revokeObjectURL(href); //释放掉blob对象 
                console.log(response);
            }).catch(function(error) {
                console.log(error);
                });
            },
    },
}
</script>
<style lang="less" scoped>
.codeinput{
    width: 200px;
    margin-right: 20px;
}
p{
    span{
        margin-left: 10px;
        margin-right: 20px;
        color:#303133
    }
    .dow{

    }
}
</style>