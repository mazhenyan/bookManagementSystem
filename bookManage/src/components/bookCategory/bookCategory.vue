<template>
  <div class="main">
    <el-button type="info" round style="float: right;margin-right: 10%" @click="showBookDes">上传书籍看法</el-button>
    <!--书籍表格展现-->
    <div class="bookForm">
      <el-table
        :data="tableData"
        stripe
        style="width: 100%">
        <el-table-column
          prop="nickName"
          label="昵称"
          width="180">
        </el-table-column>
        <el-table-column
          prop="bName"
          label="书籍"
          width="180">
        </el-table-column>
        <el-table-column
          prop="bDes"
          label="描述">
        </el-table-column>
      </el-table>
    </div>
    <!--用于抒发个人对于书籍的想法-->
    <div class="bookDes" v-show="submitBookIdea">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="书籍名称" prop="name">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="书籍介绍" prop="desc">
          <el-input type="textarea" v-model="ruleForm.desc"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">发布</el-button>
          <el-button @click="resetForm('ruleForm')">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="gary" v-show="showGary"></div>
    <br clear="both">
    <paging :allSize="allSize" :perSize="perSize" @pageChange="pageChange"></paging>
  </div>
</template>

<script>
  import axios from 'axios'
  import paging from '../paging/paging'
export default {
  name: 'bookCategory',
  components: {
    paging:paging
  },
  data() {
    return {
      allSize: 0,
      perSize: 10,
      pageAc: 0,
      pageEn: 0,
      tableData: [],
      tableDataOrigin: [],
      ruleForm: {
        name: '',
        desc: ''
      },
      rules: {
        desc: [
          { required: true, max: 50, message: '描述小于50字', trigger: 'blur' }
        ]
      },
      submitBookIdea: false,
      showGary: false,
    };
  },
  methods: {
    getInfo(){
      axios({
        method: "get",
        url: "/api/getAllIdea",
      }).then(res=>{
        const data = res.data;
        this.tableDataOrigin = data.data;
        this.pageChange(0,this.perSize);
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          axios({
            method: "get",
            url: "/api/uploadBookIdea",
            params:{
              name: this.ruleForm.name,
              des: this.ruleForm.desc,
              id: localStorage.getItem("id")
            }
          }).then(res=>{
            const data = res.data;
            if(data.code == 200){
              let info = new Object();
              info.schoolNum = localStorage.getItem("id");
              info.bName = this.ruleForm.name;
              info.bDes = this.ruleForm.desc;
              this.tableDataOrigin.unshift(info);
              this.pageChange(this.pageAc,this.pageEn);
            }
          });
          this.submitBookIdea = false;
          this.showGary = false;

        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.submitBookIdea = false;
      this.showGary = false;
    },
    showBookDes(){
      this.submitBookIdea = true;
      this.showGary = true;
    },
    pageChange(start,end){
      this.allSize = this.tableDataOrigin.length;
      this.pageAc = start;
      this.pageEn = end;
      let info = [];
      for (let i = 0;i < this.tableDataOrigin.length;i++){
        info.push(this.tableDataOrigin[i]);
      }
      this.tableData = info.slice(start,end);
    }
  },
  created() {
    this.getInfo();
  }
}
</script>

<style scoped>
  .bookForm{
    width: 80%;
    padding: 10px;
    margin: 0 auto;
  }
  .bookDes{
    width: 50%;
    height: 28%;
    background-color: #EEE5DE;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 5%;
    z-index: 100;
    border-radius: 5px;
  }
  .gary{
    position: absolute;
    background-color: rgba(245,245,245,0.6);
    height: 100%;
    width: 100%;
    top: 61px;
    left: 0;
    bottom: 0;
    right: 0;
  }
</style>
