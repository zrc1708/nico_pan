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
                <el-button @click="choosefile()">选择文件</el-button>
                <el-button @click="upload()">上传文件</el-button>
                <el-button @click="showmkdir()">创建文件夹</el-button>
                <input id="flieinput" type="file" ref="file"></input>
            </el-row>
            <el-table :data="filelist" style="width: 100%"  >
                <el-table-column type="index"></el-table-column>
                <el-table-column prop="name" label="文件名"></el-table-column>
                <el-table-column prop="size" label="文件大小"></el-table-column>
                <el-table-column prop="type" label="文件类型"></el-table-column>
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
                path:'/files',
                mkdirvisible:false,
                mkdirform:{
                    dirname:''
                }
            }
        },
        created() {
            this.getFileList()
        },
        methods: {
            // 获取文件列表
            async getFileList() {
                const {data} = await this.$http.get('getfile')
                if (data.code !== 200) return this.$message.error('获取文件列表失败')
                this.filelist = data.arr
                console.log(this.filelist);
            },
            // 创建文件夹
            async mkdir() {
                const {data} = await this.$http.post('mkdir',this.mkdirform)
                if (data.code !== 200) return this.$message.error('创建文件夹失败')
                this.$message.success('创建文件夹成功')
                this.getFileList()
                this.mkdirvisible = false
            },
            // 上传文件
            upload() {
                let formData = new FormData();
                formData.append('file', this.$refs.file.files[0])
                this.$http.post(`uploadfile${this.path}`, formData, {
                    'Content-Type': 'multipart/form-data'
                }).then(res => {
                    console.log(res);
                    this.getFileList()
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
            }
        }
    }
</script>
<style lang="less" scoped>
    .el-row {
        overflow: hidden;

        input {
            opacity: 0;
            transform: translateY(200px);
        }
    }
</style>