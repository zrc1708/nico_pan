<template>
    <div>
        <!-- 面包屑导航-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>我的分享</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <!-- 文件列表 -->
            <el-table :data="filelist" style="width: 100%"  @cell-mouse-enter="filehover" @cell-mouse-leave="fileleave">
                <el-table-column type="index"></el-table-column>
                <el-table-column prop="name" label="文件名" width="350px">
                    <template slot-scope="scope">
                        <img src="../assets/file_icon/文件夹.png" alt="" v-if="scope.row.type==='dir'">
                        <img src="../assets/file_icon/pdf.png" alt="" v-else-if="scope.row.type==='pdf'">
                        <img src="../assets/file_icon/txt.png" alt="" v-else-if="scope.row.type==='txt'">
                        <img src="../assets/file_icon/视频.png" alt="" v-else-if="scope.row.type==='mp4'||scope.row.type==='flv'||scope.row.type==='wmv'||scope.row.type==='m4v'||scope.row.type==='rmvb'||scope.row.type==='mov'||scope.row.type==='mkv'">
                        <img src="../assets/file_icon/word.png" alt="" v-else-if="scope.row.type==='doc'||scope.row.type==='docx'">
                        <img src="../assets/file_icon/ppt.png" alt="" v-else-if="scope.row.type==='ppt'||scope.row.type==='pptx'">
                        <img src="../assets/file_icon/图片.png" alt="" v-else-if="scope.row.type==='png'||scope.row.type==='jpg'||scope.row.type==='jpeg'">
                        <img src="../assets/file_icon/压缩包.png" alt="" v-else-if="scope.row.type==='rar'||scope.row.type==='zip'">
                        <img src="../assets/file_icon/其他.png" alt="" v-else>
                        {{scope.row.name}}
                    </template>
                </el-table-column>
                <el-table-column prop="createdate" label="创建时间" width="100px"></el-table-column>
                <el-table-column prop="lastdate" label="分享时间" width="100px">
                    <template slot-scope="scope">
                        <span v-if="scope.row.lastdate===0">永久有效</span>
                        <span v-else>{{scope.row.lastdate}}天</span>
                    </template>
                </el-table-column>
                <el-table-column prop="code" label="提取码" width="100px"></el-table-column>
                <!-- <el-table-column width="200px" >
                    <template slot-scope="scope">
                        <el-tooltip class="item" effect="light" content="下载" placement="top-start" :enterable="false" :hide-after="800">
                            <i class="el-icon-download" v-show="scope.row.path===showFileDownloadButton&&scope.row.type!=='dir'" @click="download(scope.row.name,scope.row.path)"></i>
                        </el-tooltip>
                        <el-tooltip class="item" effect="light" content="重命名" placement="top-start" :enterable="false" :hide-after="800">
                            <i class="el-icon-edit" v-show="scope.row.path===showFileDownloadButton" @click="openrename(scope.row.name,scope.row.type,scope.row.path)"></i>    
                        </el-tooltip>
                        <el-tooltip class="item" effect="light" content="删除" placement="top-start" :enterable="false" :hide-after="800">
                            <i class="el-icon-delete" v-show="scope.row.path===showFileDownloadButton" @click="openremove(scope.row.path)"></i>    
                        </el-tooltip>
                        <el-tooltip class="item" effect="light" content="分享" placement="top-start" :enterable="false" :hide-after="800">
                            <i class="el-icon-share" v-show="scope.row.path===showFileDownloadButton&&scope.row.type!=='dir'" @click="openshare(scope.row.name,scope.row.path)"></i>    
                        </el-tooltip>
                    </template>
                </el-table-column> -->
            </el-table>
        </el-card>
        
    </div>
</template>
<script>
    export default {
        data() {
            return {
                filelist: [],
                // 控制按钮的显示
                showFileDownloadButton:'',
            }
        },
        created() {
            this.getFileList()
        },
        methods: {
            // 获取文件列表
            async getFileList() {
                const {data} = await this.$http.get(`getMyShare`)
                if (data.code !== 200) return this.$message('登录后方可使用此功能')
                this.filelist = data.arr
                console.log(this.filelist);
            },
            
            //监听鼠标在表格悬停 
            filehover(row, column, cell, event){
                this.showFileDownloadButton = row.path
            },
            //监听鼠标离开表格
            fileleave(){
                this.showFileDownloadButton = ''
            },
            
            
        }
    }
</script>
<style lang="less" scoped>
    .el-row:nth-child(1){
        overflow: hidden;
        span{
            padding-left: 20px;
            padding-right: 20px;
        }
        input {
            opacity: 0;
            transform: translateY(-200px);
        }
    }
    .el-row:nth-child(2){
        padding-top: 20px;
        span{
            cursor: pointer;
        }
    }
    .el-table{
        margin-top: 0; 
        font-size: 13px;
        img{
            width: 25px;
            height: 25px;
            vertical-align: middle;
            margin-right: 10px;
        }
        i:nth-child(1){
            position: absolute;
            top: 10px;
            font-size: 28px;
            color: #10a9fb;
            cursor: pointer;
        }
        i:nth-child(2){
            position: absolute;
            top: 10px;
            left: 50px;
            font-size: 25px;
            color: #10a9fb;
            cursor: pointer;
        }
         i:nth-child(3){
            position: absolute;
            top: 10px;
            left: 90px;
            font-size: 25px;
            color: #10a9fb;
            cursor: pointer;
        }
        i:nth-child(4){
            position: absolute;
            top: 10px;
            left: 130px;
            font-size: 25px;
            color: #10a9fb;
            cursor: pointer;
        }
    }
    .renameinputbox{
        text-align: center;
        .renameinput{
            width: 70%;
        }
        span:nth-child(3){
            padding-left: 10px;
        }
    }
    .share{
        text-align: center;
        p{
            margin-top: -10px;
            color: #606266;
        }
        span{
            color: black;
        }
    }
</style>