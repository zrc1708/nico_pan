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
            <el-table :data="filelist" style="width: 100%" @row-dblclick="filedblclick" >
                <el-table-column type="index"></el-table-column>
                <el-table-column prop="name" label="文件名"></el-table-column>
                <el-table-column prop="size" label="文件大小"></el-table-column>
                <el-table-column prop="type" label="文件类型"></el-table-column>
                <el-table-column prop="birthtime" label="创建时间">
                    <template slot-scope="scope">
                        {{scope.row.birthtime | dataFormat}}
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
                }
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
                if (data.code !== 200) return this.$message.error('获取文件列表失败')
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
    }
</style>