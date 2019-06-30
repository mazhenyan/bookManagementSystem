<template>
  <div class="login">
    <div class="loginTable">
      <span class="loginFont" style="font-size: 18px; background-color:#4EEE94;color: rgb(255, 255, 255)">忘记密码</span>
      <span style="text-align: center;display: block;margin-bottom: 20px;margin-top: 10px;font-size: 14px; color: #606266;">FORGET PASSWORD.</span>
      <div class="loginForm">
        <el-form label-width="80px">
          <el-form-item label="学号：">
            <el-input v-model="form.id"></el-input>
          </el-form-item>
          <el-form label-width="80px">
            <el-form-item label="手机：">
              <el-input v-model="form.tel"></el-input>
            </el-form-item>
          </el-form>
          <el-form-item label="新密码：" prop="pass">
            <el-input type="password" v-model="form.password" autocomplete="off"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="onSubmit">找回</el-button>
            <el-button @click="onCancel">清空</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'forgetPassword',
  data () {
    return {
      form: {
        id: '',
        password: '',
        tel: ''
      },
      checked: false
    }
  },
  methods:{
    onSubmit(){
      alert("1");
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
