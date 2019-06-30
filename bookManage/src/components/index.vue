<template>
  <div class="main">
    <div class="top">
      <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
        <el-menu-item index="1">主页</el-menu-item>
        <el-menu-item index="2">查找/借阅书籍</el-menu-item>
        <el-menu-item index="4">书籍交流</el-menu-item>
        <el-menu-item index="5" v-show="permission == 1">借阅管理</el-menu-item>
      </el-menu>
    </div>

    <div class="userInfo" style="display: inline-block;float: right;margin-right: 10%;height: 100%;margin-top: 10px">
      <div class="loginInfo" v-show="!loginRegister">
        <router-link to="/login">
        <span style="display: inline-block;line-height: 57px;margin-right: 10px">登入</span>
        </router-link>
        <router-link to="/register">
        <span style="display: inline-block;line-height: 57px;">注册</span>
        </router-link>
      </div>
      <router-link to="/userInfo">
      <p style="font-size: 14px;color: #606266;" v-show="loginRegister">个人信息中心</p>
      </router-link>
    </div>
    <!--分页面内容-->
    <div class="content">
      <mainInfo v-show="key == 1"></mainInfo>
      <findBookInfo v-show="key == 2"></findBookInfo>
      <bookCategory v-show="key == 4"></bookCategory>
      <manage v-show="key == 5"></manage>
    </div>
    <div class="hidden" v-show="freshPage"></div>
  </div>
</template>

<script>
import mainInfo from './main/main'
import findBookInfo from './findBookInfo/findBookInfo'
import bookCategory from './bookCategory/bookCategory'
import manage from './manageInfo/manage'
export default {
  name: 'index',
  data () {
    return {
      activeIndex: '1',
      loginRegister: localStorage.getItem('permission') != null ? 1 : 0,
      key: 1,
      freshPage: false,
      permission: localStorage.getItem("permission")
    }
  },
  components: {
    mainInfo,
    findBookInfo,
    bookCategory,
    manage
  },
  methods: {
    handleSelect(key, keyPath) {
      this.key = key;
    },
  },
}
</script>

<style scoped>
  .top{
    margin-left: 10px;
    display: inline-block;
  }
  .loginInfo{
    display: inline-block;
    float: right;
  }
  .content{
    height: calc(100% - 67px);
    margin-top: 2px;
    overflow-y: scroll;
  }
</style>
