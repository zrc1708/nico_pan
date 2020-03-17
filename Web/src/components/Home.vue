<template>
  <el-container class="home-container">
    <!-- 头部 -->
    <el-header>
      <div>
        <img src="../assets/nico.png" alt="">
        <img src="../assets/妮可云盘.png" alt="">
      </div>
      <el-button @click="loginVisible = true">登录</el-button>
      <el-button @click="logout">退出登录</el-button>
    </el-header>

    <el-container>
      <!-- 侧边导航 -->
      <el-aside width="200px">
        <el-menu default-active="1" :default-openeds="openeds" class="el-menu-vertical-demo" background-color="#f7f7f7">
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-folder-opened"></i>
              <span>我的文件</span>
            </template>
            <el-menu-item index="1-1">最近上传</el-menu-item>
            <el-menu-item index="1-2">报告</el-menu-item>
            <el-menu-item index="1-3">图片</el-menu-item>
            <el-menu-item index="1-4">视屏</el-menu-item>
            <el-menu-item index="1-5">电子书</el-menu-item>
            <el-menu-item index="1-6">其他</el-menu-item>
          </el-submenu>
          <el-menu-item index="2">
            <i class="el-icon-menu"></i>
            <span slot="title">我的分享</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <!-- 主体区域 -->
      <el-main>Main</el-main>

    </el-container>
    <!-- 登录对话框 -->
    <el-dialog title="欢迎使用妮可云盘" :visible.sync="loginVisible" width="40%">
      <el-form ref="loginformref" :model="loginform" :rules="loginformRules" label-width="80px" class="loginform">
        <el-form-item label="用户名">
          <el-input v-model="loginform.username"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="loginform.password" show-password></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="resetLoginForm">取 消</el-button>
        <el-button @click="login">确 定</el-button>
      </span>
    </el-dialog>
  </el-container>
</template>

<script>
  export default {
    data() {
      return {
        openeds: ['1'],
        // 控制登录对话框
        loginVisible:false,
        // 登录表单
        loginform:{
          username:'nico',
          password:'19990722'
        },
        loginformRules:{

        }
      }
    },
    methods: {
      // 登录
      async login(){
        const {data} = await this.$http.post('checkuser',this.loginform)
        console.log(data);
        window.sessionStorage.setItem('token',data.token)
        // if(data.rs.length===0) 
        //   this.$message.error('登录失败')
        // else
        //   this.$message.success('登录成功')
        this.loginVisible = false
      },
      // 退出登录
      async logout(){
        const data = await this.$http.get('getuser')
        console.log(data);
      },
      //  重置表单
      resetLoginForm(){
        this.loginform.username=''
        this.loginform.password=''
        this.loginVisible = false
      },
    },
  }
</script>

<style lang="less" scoped>
  .home-container {
    height: 100%;
  }

  .el-aside {
    border-right: 1px solid #e6e6e6;
    background-color: #f7f7f7;
  }

  .el-header {
    border-bottom: 1px solid #e6e6e6;
    display: flex;
    justify-content: space-between;
    align-items: center;
    div {
      display: flex;
      align-items: center;
      img:nth-child(1) {
        width: 65px;
        height: 65px;
      }
      img:nth-child(2) {
        margin-left: 15px;
        height: 45px;
      }
    }
  }

  .loginform{
    max-width: 400px!important;
    margin: 0 auto;
  }
</style>