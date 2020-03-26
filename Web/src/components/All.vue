<template>
    <div>
        <!-- 面包屑导航-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>我的文件</el-breadcrumb-item>
            <el-breadcrumb-item id="focus">全部</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-row>
                <el-button @click="showmkdir()">创建文件夹</el-button>
                <el-button @click="choosefile()">选择文件</el-button>
                <span v-if="choosedFileName">{{choosedFileName}}</span>
                <el-button @click="upload()" :disabled="choosedFileName?false:true">上传文件</el-button>
                <input id="flieinput" type="file" ref="file" @change="checkField($event)"></input>
            </el-row>
            <el-row>
                <!-- 文件路径面包屑 -->
                <el-breadcrumb separator="/">
                    <el-breadcrumb-item v-for="(item, index) in filePathList" 
                    :key="index"><span @click="returndir(index)">{{item}}</span></el-breadcrumb-item>
                </el-breadcrumb>
            </el-row>
            <!-- 文件列表 -->
            <el-table :data="filelist" style="width: 100%" @row-dblclick="filedblclick" @cell-mouse-enter="filehover" @cell-mouse-leave="fileleave">
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
                <el-table-column prop="size" label="文件大小" ></el-table-column>
                <el-table-column prop="type" label="文件类型" ></el-table-column>
                <el-table-column prop="birthtime" label="创建时间" width="200px">
                    <template slot-scope="scope">
                        {{scope.row.birthtime | dataFormat}}
                    </template>
                </el-table-column>
                <el-table-column width="200px" >
                    <template slot-scope="scope">
                        <el-tooltip class="item" effect="light" content="下载" placement="top-start" :enterable="false" :hide-after="800">
                            <i class="el-icon-download" v-show="scope.row.name===showFileDownloadButton&&scope.row.type!=='dir'" @click="download(scope.row.name)"></i>
                        </el-tooltip>
                        <el-tooltip class="item" effect="light" content="重命名" placement="top-start" :enterable="false" :hide-after="800">
                            <i class="el-icon-edit" v-show="scope.row.name===showFileDownloadButton" @click="openrename(scope.row.name,scope.row.type)"></i>    
                        </el-tooltip>
                        <el-tooltip class="item" effect="light" content="删除" placement="top-start" :enterable="false" :hide-after="800">
                            <i class="el-icon-delete" v-show="scope.row.name===showFileDownloadButton" @click="openremove(scope.row.name,scope.row.type)"></i>    
                        </el-tooltip>
                        <el-tooltip class="item" effect="light" content="分享" placement="top-start" :enterable="false" :hide-after="800">
                            <i class="el-icon-share" v-show="scope.row.name===showFileDownloadButton&&scope.row.type!=='dir'" @click="openshare(scope.row.name,scope.row.path,scope.row.type)"></i>    
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <!-- 创建文件夹对话框 -->
        <el-dialog title="创建文件夹" :visible.sync="mkdirvisible" width="40%">
            <el-form ref="loginformref" :model="mkdirform"  label-width="120px" >
                <el-form-item label="请输入文件夹名">
                    <el-input v-model="mkdirform.dirname"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button @click="resetmkdir()">取 消</el-button>
                <el-button @click="mkdir()">确 定</el-button>
            </span>
        </el-dialog>
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
        data() {
            return {
                filelist: [],
                // 在服务器上进行文件查找的路径
                serverpath:'files',
                mkdirvisible:false,
                choosedFileName:'',
                mkdirform:{
                    dirname:''
                },
                // 控制按钮的显示
                showFileDownloadButton:'',
                // 控制重命名对话框显示
                renamevisible:false,
                renameform:{
                     // 要被重命名的文件
                    oldname:'',
                    newname:'',
                    type:''
                },
                // 控制删除文件对话框
                removevisible:false,
                removeform:{
                    //  要被删除的文件名以及类型
                    removename:'',
                    type:''
                },
                // 控制分享文件
                sharevisible:false,
                // 文件分享相关数据
                sharefile:{
                    filename:'',
                    filepath:'',
                    createdate:'',
                    type:'',
                    sharedate:'0'
                },
                // 提取码
                sharecode:'',
            }
        },
        computed: {
            filePathList(){
                let arr = this.serverpath.split('/')
                arr[0]= '根目录'
                return arr
            }
        },
        created() {
            this.getFileList(this.serverpath)
        },
        methods: {
            // 获取文件列表
            async getFileList(serverpath) {
                const {data} = await this.$http.post(`getfile`,{serverpath})
                if (data.code !== 200) return this.$message('登录后方可使用此功能')
                this.filelist = data.arr
                console.log(this.filelist);
            },
            // 创建文件夹
            async mkdir() {
                let mkdirpath = this.serverpath+'/'+this.mkdirform.dirname
                const {data} = await this.$http.post('mkdir',{mkdirpath})
                if (data.code !== 200) return this.$message.error('创建文件夹失败')
                this.$message.success('创建文件夹成功')
                this.getFileList(this.serverpath)
                this.mkdirvisible = false
                this.mkdirform.dirname = ''
            },
            // 上传文件
            upload() {
                let formData = new FormData();
                formData.append('savePath', this.serverpath);
                formData.append('file', this.$refs.file.files[0])
                this.$http.post(`uploadfile`, formData, {
                    'Content-Type': 'multipart/form-data'
                }).then(res => {
                    this.getFileList(this.serverpath)
                    this.choosedFileName = ''
                })
            },
            // 选择上传的文件
            choosefile() {
                let nico = document.querySelector('#flieinput')
                nico.click()
            },
            // 展示上传文件的对话框
            showmkdir(){
                this.mkdirvisible = true
            },
            // 双击文件夹进入
            filedblclick(row){
                if(!row.child) return
                this.serverpath = row.path
                this.filelist = row.child
            },
            // 点击文件路径面包屑，进行跳转
            returndir(index){
                let path=''
                for(let i =0;i<index+1;i++){
                    if(i==0 && index ==0) path+='files'
                    else if(i==0) path+='files/'
                    else if(i==index) path+=this.filePathList[i]
                    else path+=this.filePathList[i]+'/'
                }
                this.serverpath = path
                this.getFileList(path)
            },
            // 监听文件上传input的改变
            checkField(dom){
                let arr = dom.target.value.split('\\')
                this.choosedFileName = arr[arr.length-1]
            },
            // 文件下载,传入文件名和文件路径
            async download(name){
                let filepath = this.serverpath
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
                let arr = row.path.split('/')
                this.showFileDownloadButton = arr[arr.length-1]
            },
            //监听鼠标离开表格
            fileleave(){
                this.showFileDownloadButton = ''
            },
            //打开重命名 
            openrename(row,type){
                this.renameform.newname = ''
                this.renameform.oldname = row
                this.renameform.type = type
                this.renamevisible = true
            },
            //重命名
            async rename(){
                let oldname = this.serverpath+'/'+this.renameform.oldname
                let newname
                if(this.renameform.type==='dir'){
                    newname = this.serverpath+'/'+this.renameform.newname
                }else{
                    newname = this.serverpath+'/'+this.renameform.newname+'.'+this.renameform.oldname.split('.')[1]
                }
                const {data} = await this.$http.post('rename',{oldname,newname})
                if (data.code !== 200) return this.$message.error('重命名失败')
                this.$message.success('重命名成功')
                this.getFileList(this.serverpath)
                this.renamevisible = false
            } ,
            // 取消重命名
            resetrename(){
                this.renamevisible = false
            },
            // 打开删除文件对话框
            openremove(row,type){
                this.removevisible = true
                this.removeform.removename = row
                this.removeform.type = type
            },
            //删除文件
            async remove(){
                let path = this.serverpath+'/'+this.removeform.removename
                let type = this.removeform.type
                const {data} = await this.$http.post('remove',{type,path})
                if (data.code !== 200) return this.$message.error('删除失败')
                this.$message.success('删除成功')
                this.getFileList(this.serverpath)
                this.removevisible = false
            } ,
            // 取消删除文件
            resetremove(){
                this.removevisible = false
            },
            // 打开分享文件对话框
            openshare(name,path,type){
                this.sharefile.filename = name
                this.sharefile.filepath = path
                this.sharefile.type = type
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