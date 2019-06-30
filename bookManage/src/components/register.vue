<template>
  <div class="login">
    <div class="loginTable">
      <span class="loginFont" style="font-size: 18px; background-color:#4EEE94;color: rgb(255, 255, 255)">注册</span>
      <span style="text-align: center;display: block;margin-bottom: 20px;margin-top: 10px;font-size: 14px; color: #606266;">SIGN UP TO CONTINUE.</span>
      <div class="loginForm">
        <el-form label-width="80px">
          <el-form-item label="昵称：">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
        </el-form>
        <el-form label-width="80px">
          <el-form-item label="学号：">
          <el-input v-model="form.id"></el-input>
        </el-form-item>
          <el-form label-width="80px">
            <el-form-item label="手机：">
              <el-input v-model="form.tel"></el-input>
            </el-form-item>
          </el-form>
          <el-form-item label="密码：" prop="pass">
            <el-input type="password" v-model="form.password" autocomplete="off"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="onSubmit">注册</el-button>
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
  name: 'register',
  data () {
    return {
      form: {
        name: '',
        id: '',
        password: '',
        tel: ''
      },
      checked: false
    }
  },
  methods:{
    //验证注册是否符合要求
    configRegister(){
      if((this.form.id).trim().length != 12)return "学号错误！";
      if((this.form.tel).trim().length != 11)return "手机号码错误！";
      if(!(/^1[3456789]\d{9}$/.test((this.form.tel).trim()))){
        return "手机号码错误!";
      }
      if((this.form.password).trim().length < 6)return "密码小于6位！";
      return true;
    },
    onSubmit () {
      let info = this.configRegister();
      if(info != true){
        alert(info);
        return ;
      }
      axios({
        method: 'get',
        url: '/api/register',
        params: {
          name: this.form.name,
          id: this.form.id,
          password: this.form.password,
          tel: this.form.tel
        }
      }).then(res => {
        const data = res.data;
        if (data.code == 200){
          //注册成功之后跳转到主页面，将信息存到localStorage里面
          // localStorage.setItem("id",this.form.id);
          // localStorage.setItem("password",this.form.password);
          this.$router.push('/login');
        }else{
          alert("注册失败！");
        }
      });
    },
    onCancel(){
      this.form.name = '';
      this.form.id = '';
      this.form.password = '';
      this.form.tel = '';
    }
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
</style>
