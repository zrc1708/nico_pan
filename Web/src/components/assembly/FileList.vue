<template>
    <div>
        <!-- 面包屑导航-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>我的文件</el-breadcrumb-item>
            <el-breadcrumb-item>{{title}}</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <!-- 文件列表 -->
            <el-table :data="filelist" style="width: 100%"  @cell-mouse-enter="filehover" @cell-mouse-leave="fileleave">
                <el-table-column type="index"></el-table-column>
                <el-table-column prop="name" label="文件名" width="350px">
                    <template slot-scope="scope">
                        <img src="../../assets/file_icon/文件夹.png" alt="" v-if="scope.row.type==='dir'">
                        <img src="../../assets/file_icon/pdf.png" alt="" v-else-if="scope.row.type==='pdf'">
                        <img src="../../assets/file_icon/txt.png" alt="" v-else-if="scope.row.type==='txt'">
                        <img src="../../assets/file_icon/视频.png" alt="" v-else-if="scope.row.type==='mp4'||scope.row.type==='flv'||scope.row.type==='wmv'||scope.row.type==='m4v'||scope.row.type==='rmvb'||scope.row.type==='mov'||scope.row.type==='mkv'">
                        <img src="../../assets/file_icon/word.png" alt="" v-else-if="scope.row.type==='doc'||scope.row.type==='docx'">
                        <img src="../../assets/file_icon/ppt.png" alt="" v-else-if="scope.row.type==='ppt'||scope.row.type==='pptx'">
                        <img src="../../assets/file_icon/图片.png" alt="" v-else-if="scope.row.type==='png'||scope.row.type==='jpg'||scope.row.type==='jpeg'">
                        <img src="../../assets/file_icon/压缩包.png" alt="" v-else-if="scope.row.type==='rar'||scope.row.type==='zip'">
                        <img src="../../assets/file_icon/其他.png" alt="" v-else>
                        {{scope.row.name}}
                    </template>
                </el-table-column>
                <el-table-column prop="size" label="文件大小" width="100px"></el-table-column>
                <el-table-column prop="path" label="文件路径" >
                    <template slot-scope="scope">
                        {{'根目录'+scope.row.path.slice(7)}}
                    </template>
                </el-table-column>
                <el-table-column prop="type" label="文件类型" width="100px"></el-table-column>
                <el-table-column prop="birthtime" label="创建时间" width="200px">
                    <template slot-scope="scope">
                        {{scope.row.birthtime | dataFormat }}
                    </template>
                </el-table-column>
                <el-table-column width="200px" >
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
                            <i class="el-icon-share" v-show="scope.row.path===showFileDownloadButton&&scope.row.type!=='dir'" @click="openshare(scope.row.name,scope.row.path,scope.row.type)"></i>    
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <!-- 重命名文件对话框 -->
        <el-dialog title="重命名文件" :visible.sync="renamevisible" width="35%">
            <div class="renameinputbox">
                <span>新文件名：</span>
                <el-input class="renameinput" v-model="renameform.newname"></el-input>
                <span v-show="renameform.type!=='dir'">{{'.'+renameform.oldname.split('.')[1]}}</span>
            </div>
            <span slot="footer">
                <el-button @click="resetrename()">取 消</el-button>
                <el-button @click="rename()">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 删除文件对话框 -->
        <el-dialog title="删除文件" :visible.sync="removevisible" width="35%">
            <span>您的文件将会永久删除，是否确认？</span>
            <span slot="footer">
                <el-button @click="resetremove()">取 消</el-button>
                <el-button @click="remove()">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 分享文件对话框 -->
        <el-dialog title="分享文件" :visible.sync="sharevisible" width="35%">
            <div class="showshare" v-if="sharecode">
                <p>您的文件已分享成功</p>
                <p>链接：http://pan.jibei66.com/getfile，提取码：{{sharecode}}</p>
            </div>
            <div class="share" v-else>
                <p>请为  <span>{{sharefile.filename}}</span>  选择分享时限</p>
                <template>
                    <el-radio v-model="sharefile.sharedate" label="1">1天</el-radio>
                    <el-radio v-model="sharefile.sharedate" label="3">3天</el-radio>
                    <el-radio v-model="sharefile.sharedate" label="7">7天</el-radio>
                    <el-radio v-model="sharefile.sharedate" label="0">永久</el-radio>
                </template>
            </div>
            <span slot="footer">
                <el-button @click="resetshare()">取 消</el-button>
                <el-button @click="share2()" v-if="sharecode">确 定</el-button>
                <el-button @click="share()" v-else>确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
    export default {
        props: ['title', 'type'],
        data() {
            return {
                filelist: [],
                // 在服务器上进行文件查找的路径
                serverpath:'',
                choosedFileName:'',
                // 控制按钮的显示
                showFileDownloadButton:'',
                // 控制重命名对话框显示
                renamevisible:false,
                renameform:{
                     // 要被重命名的文件
                    oldname:'',
                    newname:'',
                    path:'',
                    type:''
                },
                // 控制删除文件对话框
                removevisible:false,
                removepath:'',
                // 控制分享文件
                sharevisible:false,
                // 文件分享相关数据
                sharefile:{
                    filename:'',
                    type:'',
                    filepath:'',
                    createdate:'',
                    sharedate:'0'
                },
                // 提取码
                sharecode:'',
            }
        },
        created() {
            this.getFileList()
        },
        methods: {
            // 获取文件列表
            async getFileList() {
                let type = this.type
                const {data} = await this.$http.get(`getTypeFiles/${type}`)
                if (data.code !== 200) return this.$message('登录后方可使用此功能')
                this.filelist = data.arr
                console.log(this.filelist);
            },
            // 文件下载,传入文件名和文件路径
            async download(name,path){
                // 去除路径中包含文件名的部分
                let arr = path.slice(2).split('/')
                let filepath = 'files'
                for(let i =1;i<arr.length-1;i++){
                    filepath+= '/'+arr[i]
                }
                console.log(filepath);
               this.$http.post("download", { filename: name,filepath},{responseType: 'blob'})
                .then(function(response) {
                    var blob = new Blob([response.data])
                    var downloadElement = document.createElement('a');
                　　 var href = window.URL.createObjectURL(blob); //创建下载的链接
                　　 downloadElement.href = href;
                　　 downloadElement.download = name; //下载后文件名
                　　 document.body.appendChild(downloadElement);
                　　 downloadElement.click(); //点击下载
                　　 document.body.removeChild(downloadElement); //下载完成移除元素
                　　 window.URL.revokeObjectURL(href); //释放掉blob对象 
                    console.log(response);
                }).catch(function(error) {
                    console.log(error);
                    });
            },
            //监听鼠标在表格悬停 
            filehover(row, column, cell, event){
                this.showFileDownloadButton = row.path
            },
            //监听鼠标离开表格
            fileleave(){
                this.showFileDownloadButton = ''
            },
            //打开重命名 
            openrename(row,type,path){
                this.renameform.newname = ''
                this.renameform.oldname = row
                this.renameform.type = type
                this.renameform.path = path
                this.renamevisible = true
            },
            //重命名
            async rename(){
                let oldname = this.renameform.path.slice(2)
                // 造个serverpath出来，嘿嘿
                let arr = this.renameform.path.slice(2).split('/')
                let serverpath = 'files'
                for(let i =1;i<arr.length-1;i++){
                    serverpath+= '/'+arr[i]
                }
                // 此情景只可能是文件重命名
                let newname = serverpath+'/'+this.renameform.newname+'.'+this.renameform.oldname.split('.')[1]
                const {data} = await this.$http.post('rename',{oldname,newname})
                if (data.code !== 200) return this.$message.error('重命名失败')
                this.$message.success('重命名成功')
                this.getFileList()
                this.renamevisible = false
            } ,
            // 取消重命名
            resetrename(){
                this.renamevisible = false
            },
            // 打开删除文件对话框
            openremove(path){
                this.removevisible = true
                this.removepath = path
            },
            //删除文件
            async remove(){
                let path = this.removepath.slice(2)
                // 此情景下删除均为非文件夹
                let type = 'notdir'
                const {data} = await this.$http.post('remove',{type,path})
                if (data.code !== 200) return this.$message.error('删除失败')
                this.$message.success('删除成功')
                this.getFileList()
                this.removevisible = false
            } ,
            // 取消删除文件
            resetremove(){
                this.removevisible = false
            },
            // 打开分享文件对话框
            openshare(name,path,type){
                this.sharefile.filename = name
                this.sharefile.type = type
                this.sharefile.filepath = path
                this.sharecode = ''
                this.sharefile.createdate = this.getNowFormatDate()
                this.sharevisible = true
            },
            //  取消分享文件 
            resetshare(){
                this.sharevisible = false
            },
            // 分享文件
            async share(){
                let obj = this.sharefile
                const {data} = await this.$http.post('sharefile',{obj})
                if (data.code !== 200) return this.$message.error('分享失败')
                // this.$message.success('删除成功')
                this.sharecode = data.num
            },
            // 确认提取码，关闭对话框
            share2(){
                this.sharevisible = false
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