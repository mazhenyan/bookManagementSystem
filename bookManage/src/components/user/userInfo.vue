<template>
  <div style="display: flex;flex-wrap:wrap;text-align: center;padding: 2%">
    <div class="left">
      <router-link to="/">
      <el-button type="primary" plain style="float: left;margin: 3%;">返回</el-button>
      </router-link>
      <br clear="both">
      <div class="imgInfo" @dblclick="changeImg">
        <img class="img" :src="form.avatar" alt="">
        <div>
          <input @change="fileChange($event)" type="file" id="upload_file" style="display: none;" accept="image/*"/>
        </div>
      </div>
      <div style="width: 90%;margin-top: 5%">
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="昵称：">
            <el-input v-model="form.nickName"></el-input>
          </el-form-item>
          <el-form-item label="签名：">
            <el-input v-model="form.signature"></el-input>
          </el-form-item>
          <el-button type="primary" @click="onSubmitLeft" style="margin: 2%">确定修改</el-button>
        </el-form>
      </div>
    </div>
    <div class="right">
      <div class="userInfo">
        <el-button type="danger" plain style="float: right;margin: 3%;" @click="exitLogin">退出</el-button>
        <p>个人信息</p>
        <div class="userInfoDetail">
          <el-form ref="form" :model="form" label-width="80px">
            <el-form-item label="姓名：">
              <el-input v-model="form.name" disabled></el-input>
            </el-form-item>
            <el-form-item label="学号：">
              <el-input v-model="form.id" disabled></el-input>
            </el-form-item>
            <el-form-item label="手机：">
              <el-input v-model="form.tel"></el-input>
            </el-form-item>
            <el-form-item label="密码：">
              <el-input type="password" v-model="form.password" autocomplete="off"></el-input>
            </el-form-item>
            <el-button type="primary" @click="onSubmit" style="margin: 2%">确定修改</el-button>
          </el-form>
        </div>
      </div>
    </div>
    <div class="borrowInfo">
        <p>所借书籍信息</p>
        <div class="borrowBookForm">
          <el-table
            :data="tableData"
            stripe
            @cell-click = "returnBook"
            style="width: 100%">
            <el-table-column
              prop="time"
              label="还书日期"
              width="180">
            </el-table-column>
            <el-table-column
              prop="bName"
              label="书籍名称"
              width="180">
            </el-table-column>
            <el-table-column
              label="归还书籍"
            >
              <el-button type="primary">还书</el-button>
            </el-table-column>
          </el-table>
        </div>

      </div>
    <div class="userIdea">
      <p>图书交流记录</p>
      <el-table
        :data="bookIdea"
        border
        @cell-click = "deleteIdea"
        style="width: 100%">
        <el-table-column
          prop="bName"
          label="书籍名称"
          width="180">
        </el-table-column>
        <el-table-column
          prop="bDes"
          label="描述">
        </el-table-column>
        <el-table-column
          label="操作"
        >
          <el-button type="primary">删除</el-button>
        </el-table-column>
      </el-table>
    </div>
    <div class="hidden" v-show="freshPage"></div>
  </div>
</template>

<script>
  import axios from 'axios'
export default {
  name: 'userInfo',
  data () {
    return {
      form: {
        name: '',
        id: '',
        tel: '',
        password: '',
        nickName: '',
        signature: '',
        avatar: '',
      },
      freshPage: true,
      tableData: [],
      bookIdea:[]
    }
  },
  methods: {
    getInfo(){
      axios({
        method:"get",
        url:"/api/getUserInfo",
        params:{
          id : localStorage.getItem('id')
        }
      }).then(res=>{
        const data = res.data;
        console.log(data);
        if (data.code == 200){
          this.form.name = data.data.uname;
          this.form.id = data.data.id;
          this.form.tel = data.data.tel;
          this.form.password = data.data.password;
          this.form.nickName = data.data.nickName;
          this.form.signature = data.data.signature;
          this.form.avatar = data.data.avatar;
          
          for (let i = 0;i < data.borrowInfo.length;i++){
            this.tableData.push(data.borrowInfo[i]);
          }
        }
      });
    },
    getUserIdea(){
      axios({
        method: "get",
        url: "/api/getUserIdea",
        params:{
          id: localStorage.getItem("id")
        }
      }).then(res=>{
        const data = res.data;
        console.log("用户看法：",data);
        this.bookIdea = data.data;
      });
    },
    //修改账号信息
    onSubmit () {
    //  更改用户绑定的信息
      axios({
        url: "/api/changUserInfo",
        method: "get",
        params: {
          id: this.form.id,
          tel: this.form.tel,
          password: this.form.password
        }
      }).then(res=>{
        const data = res.data;
        if(data.code == 200){

        }else{
          alert("更改失败！");
        }
      });
    },
    //修改个人信息
    onSubmitLeft(){
      axios({
        method: "get",
        url: "/api/changeNickSig",
        params: {
          nickName: this.form.nickName,
          signature: this.form.signature,
          id: this.form.id,
        }
      }).then(res=>{
        const data = res.data;
        if(data.code != 200){
          alert("修改失败");
        }
      });
    },
    //更改头像操作
    changeImg () {
      document.getElementById('upload_file').click();
    },
    fileChange (el) {
      const that = this;
      if (!el.target.files[0].size) return;
      this.file = event.target.files[0];  //获取上传元素信息
      event.preventDefault();
      // 只能通过formData方式来传输文件
      let formData = new FormData();
      formData.append('file', this.file);
      axios({
        method: "post",
        url: "/api/uplodeAvatar/"+this.form.id,
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(res=>{
        const data = res.data;
        if(data.code == 200){
          let reader = new FileReader();
          reader.readAsDataURL(this.file);
          reader.onload = function () {
            that.form.avatar = this.result;
          };
        }
      });
    },
    //用户归还书籍信息
    returnBook(info,b,htmlInfo){
      if(htmlInfo.getElementsByTagName("span").length == 0)return ;
      if(confirm("是否归还书籍？")){
        axios({
          method: "get",
          url: "/api/returnBook",
          params: {
            bid: info.bId,
            id: info.schoolNum,
          }
        }).then(res=>{
          const data = res.data;
          if(data.code == 200){
            alert("归还成功");
          }
        });
      }
    },
  //  用户删除书籍评价
    deleteIdea(info,b,htmlInfo){
      if(htmlInfo.getElementsByTagName("span").length == 0)return ;
      if(confirm("确定删除？")){
        axios({
          method: "get",
          url: "/api/deleteIdea",
          params: {
            id: localStorage.getItem("id"),
            bName: info.bName,
            bDes: info.bDes
          }
        }).then(res=>{
          const data = res.data;
          if(data.code == 200){
            let index = this.bookIdea.indexOf(info);
            this.bookIdea.splice(index,1);
            alert("删除成功");
          }
        });
      }
    },
  //  退出登入
    exitLogin(){
      localStorage.clear();
      this.$router.push("/login");
    }
  },
  created() {
    this.getInfo();
    this.getUserIdea();
  },
}
</script>

<style scoped>
.left{
  box-shadow: 0 1px 1px rgba(0,0,0,.05);
  width: 40%;
  text-align: center;
  border: 1px solid #cfdbe2;
}
.right{
  width: 53%;
  border: 1px solid #cfdbe2;
  box-shadow: 0 1px 1px rgba(0,0,0,.05);
  text-align: center;
  margin-left: 2%;
}
.borrowInfo{
  width: 40%;
  box-shadow: 0 1px 1px rgba(0,0,0,.05);
  border: 1px solid #cfdbe2;
  margin-top: 2%;
}
.borrowBookForm{
  padding: 0 5%;
}
  .imgInfo{
    width: 100%;
  }
  .img{
    height: 100px;
    width:100px;
    border-radius: 50%;
    border: 1px solid #dee2e6;
    margin-top: 20px;
  }
  .userInfoDetail{
    width: 80%;
  }
  .userIdea{
    margin-top: 2%;
    width: 53%;
    border: 1px solid #cfdbe2;
    box-shadow: 0 1px 1px rgba(0,0,0,.05);
    text-align: center;
    margin-left: 2%;
  }
</style>
