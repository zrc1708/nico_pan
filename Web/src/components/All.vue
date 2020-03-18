<template>
    <div>
        <!-- 面包屑导航-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>我的文件</el-breadcrumb-item>
            <el-breadcrumb-item>全部</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-button @click="test()">上传文件</el-button>
            <el-button @click="mkdir()">创建文件夹</el-button>
            
            <form action="http://127.0.0.1:8888/uploadfile" method="post" enctype="multipart/form-data">
                <input type="file" name="file" id="file" value="" multiple="multiple" />
                <input type="submit" value="提交" />
            </form>

        </el-card>
    </div>
</template>
<script>
    export default {
        data() {
            return {    
                filename:''
            }
        },
        methods: {
            async test(){
                const {data} = await this.$http.get('getfile')
                console.log(data);
            },
            async mkdir(){
                const {data} = await this.$http.get('mkdir')
                console.log(data);
            }
        }
    }
</script>
<style lang="less" scoped>

</style>