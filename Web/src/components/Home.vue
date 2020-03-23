<template>
  <el-container class="home-container">
    <!-- 头部 -->
    <el-header>
      <div>
        <img src="../assets/nico.png" alt="">
        <img src="../assets/妮可云盘.png" alt="">
      </div>
      <div>
        <el-button @click="loginVisible = true" v-if="!$store.state.username">登录</el-button>
        <div v-else>
          <span>欢迎，{{$store.state.username}}</span>
          <el-button @click="logout">退出登录</el-button>
        </div>
      </div>
    </el-header>

    <el-container>
      <!-- 侧边导航 -->
      <el-aside width="200px">
        <el-menu :default-active="$route.path.slice(1)" :router='true' :default-openeds="openeds" class="el-menu-vertical-demo" background-color="#f7f7f7">
          <el-menu-item index="overview">
            <i class="el-icon-s-order"></i>
            <span slot="title">总览</span>
          </el-menu-item>
          <el-submenu index="myfile">
            <template slot="title">
              <i class="el-icon-folder-opened"></i>
              <span>我的文件</span>
            </template>
            <el-menu-item index="all">全部文件</el-menu-item>
            <el-menu-item index="lately">最近上传</el-menu-item>
            <el-menu-item index="ebook">电子书</el-menu-item>
            <el-menu-item index="picture">图片</el-menu-item>
            <el-menu-item index="2-4">视屏</el-menu-item>
            <el-menu-item index="2-5">文档</el-menu-item>
            <el-menu-item index="2-6">其他</el-menu-item>
          </el-submenu>
          <el-menu-item index="3">
            <i class="el-icon-menu"></i>
            <span slot="title">我的分享</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <!-- 主体区域 -->
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>

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
        openeds: ['2'],
        // 控制登录对话框
        loginVisible:false,
        // 登录表单
        loginform:{
          username:'nico',
          password:'19990722'
        },
        // 登录表单的验证规则
        loginformRules:{

        }
      }
    },
    created() {
      let username =   window.sessionStorage.getItem('name')
      if(!username) return
      this.$store.commit('setUsernameValue',username)
    },
    methods: {
      // 登录
      async login(){
        const {data} = await this.$http.post('checkuser',this.loginform)
        console.log(data);
        window.sessionStorage.setItem('token',data.token)
        window.sessionStorage.setItem('name',data.rs[0].username)
        if(data.code===201) 
          return this.$message.error('登录失败')
        else
          this.$message.success('登录成功')
        this.$store.commit('setUsernameValue',data.rs[0].username)
        this.$store.commit('setIdValue',data.rs[0].id)
        this.loginVisible = false
      },
      // 退出登录
      async logout(){
        window.sessionStorage.clear()
        this.$store.commit('setUsernameValue','')
        this.$store.commit('setIdValue','')
        this.$message('您已成功退出登录')
        this.$router.push('/welcome')
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
    div:nth-child(1) {
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
    div:nth-child(2){
      span{
        margin-right: 20px;
      }
    }
  }

  .loginform{
    max-width: 400px!important;
    margin: 0 auto;
  }
</style>