<template>
    <div class="login">
      <div class="loginTable">
        <span class="loginFont" style="font-size: 18px; background-color:#4EEE94;color: rgb(255, 255, 255)">登入</span>
        <span class="fontInfo">SIGN IN TO CONTINUE.</span>
        <div class="loginForm">
          <el-form ref="form" :model="form" label-width="80px">
            <el-form-item label="账号：">
              <el-input v-model="form.id"></el-input>
            </el-form-item>
            <el-form-item label="密码：" prop="pass">
              <el-input type="password" v-model="form.password" autocomplete="off"></el-input>
            </el-form-item>
            <el-checkbox label="记住密码" name="rememberMe" v-model="checked" style="margin-left: 25%;margin-bottom: 5%"></el-checkbox>
            <router-link to="/register">
            <span style="font-size: 14px; color: #606266;margin-left: 30px">注册</span>
            </router-link>
            <router-link to="/forgetPassword">
              <span style="font-size: 14px; color: #606266;margin-left: 30px">忘记密码</span>
            </router-link>
            <el-form-item>
              <el-button type="primary" @click="onSubmit">登入</el-button>
              <el-button @click="onCancel">清空</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'login',
  data () {
    return {
      form: {
        id: '',
        password: ''
      },
      checked: false
    }
  },
  methods: {
    getInfo(){
      let id = localStorage.getItem('id');
      let password = localStorage.getItem('password');
      if(id != null && password != null){
        this.form.id = id;
        this.form.password = password;
      }
    },
    onSubmit () {
      if (this.form.id == '' && this.form.password == '') {
        this.$alert('请输入账号和密码！', '注意', {
          confirmButtonText: '确定'
        });
        return
      }
      axios({
        method: 'get',
        url: '/api/login',
        params:{
          id : this.form.id,
          password: this.form.password
        }
      }).then(res => {
        const data = res.data;
        if(data.code == 200){
          if(this.checked == true){
            localStorage.setItem('password',this.form.password);
          }
          localStorage.setItem('id',this.form.id);
          localStorage.setItem('permission',data.permission);
          this.$router.push('/');
        }else{
          alert(data.message);
          this.onCancel();
        }
      })
    },
    onCancel () {
      this.form.id = '';
      this.form.password = '';
    }
  },
  created() {
    this.getInfo();
  }
}
</script>

<style scoped>
.login{
  position: relative;
  width: 100%;
  height: auto;
  min-height: 100%;
  overflow-x: hidden;
  background-color: rgb(245, 247, 250);
}
  .loginTable{
    margin-top: 10% !important;
    border-radius: 5px;
    width: 35%;
    height: 65%;
    background-color: #F0F8FF;
    margin-left: 32.5%;
  }
  .loginFont{
    display: block;
    text-align: center;
    font-size: 20px;
    height: 40px;
    line-height: 40px;
    background-color: #F0FFFF;
    font-family: "PingFang SC"
  }
  .loginForm{
    width: 80%;
  }
  .fontInfo{
    text-align: center;
    display: block;
    margin-bottom: 20px;
    margin-top: 10px;
    font-size: 14px;
    color: #606266;
  }
</style>
