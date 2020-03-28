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
                <el-table-column label="状态" width="100px">
                    <template slot-scope="scope">
                        <span v-if="Number(nowDateLast)-Number(scope.row.shareLasrDate)<=scope.row.lastdate">分享中</span>
                        <span v-else style="color:red">已过期</span>
                    </template>
                </el-table-column>
                <el-table-column width="200px" >
                    <template slot-scope="scope">
                        <el-tooltip class="item" effect="light" content="删除" placement="top-start" :enterable="false" :hide-after="800">
                            <i class="el-icon-delete" v-show="scope.row.path===showFileDownloadButton" @click="deleteshare(scope.row.path)"></i>    
                        </el-tooltip>
                    </template>
                </el-table-column> 
            </el-table>
        </el-card>
        <!-- 删除分享对话框 -->
        <el-dialog title="删除文件" :visible.sync="removevisible" width="35%">
            <span>该文件的分享将被删除，其他用户将永久无法提取该文件，是否确认？</span>
            <span slot="footer">
                <el-button @click="resetremove()">取 消</el-button>
                <el-button @click="remove()">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                filelist: [],
                // 控制按钮的显示
                showFileDownloadButton:'',
                nowDateLast:0,
                removevisible:false,
                removepath:''
            }
        },
        created() {
            let nowDate = this.getNowFormatDate()
            this.nowDateLast = this.days(nowDate)
            this.getFileList()
        },
        methods: {
            // 获取文件列表
            async getFileList() {
                const {data} = await this.$http.get(`getMyShare`)
                if (data.code !== 200) return this.$message('登录后方可使用此功能')
                this.filelist = data.arr
                this.filelist.forEach(item=>{
                    item.shareLasrDate = this.days(item.createdate)
                })
                // console.log(this.filelist);
            },
            
            //监听鼠标在表格悬停 
            filehover(row, column, cell, event){
                this.showFileDownloadButton = row.path
            },
            //监听鼠标离开表格
            fileleave(){
                this.showFileDownloadButton = ''
            },
            deleteshare(path){
                this.removepath = path
                this.removevisible = true
            },
            async remove(){
                let path = this.removepath
                const {data} = await this.$http.post(`removeshare`,{path})
                this.$message.success('删除分享成功')
                this.removevisible = false
                this.getFileList()
            },
            resetremove(){
                this.removevisible = false
            }
            
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