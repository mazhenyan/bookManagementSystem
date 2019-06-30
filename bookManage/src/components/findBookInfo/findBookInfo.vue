<template>
  <div>
    <span class="alertInfo">请输入需要查找书籍的信息，可以只选择部分内容</span>
    <!--提交查找书籍表单-->
    <div class="findBookInfo">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="书籍名称">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="书籍分类">
          <el-select v-model="form.region" placeholder="请选择书籍的类别">
            <el-option label="全部书籍" value="0"></el-option>
            <el-option v-for="item of getBookCategory" :label="item.cName" :value="item.cId" :key="item.cId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="书籍状态">
          <el-radio-group v-model="form.resource">
            <el-radio label="全部书籍"></el-radio>
            <el-radio label="未借出书籍"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">立即查找</el-button>
          <el-button @click="onCanel">清空</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!--查找书籍后的书籍清单-->
    <div class="info">
      <el-table
        :data="bookInfoAll"
        @cell-click = "borrowBook"
        style="width: 100%">
        <el-table-column
          label="书籍 ID"
          prop="bid">
        </el-table-column>
        <el-table-column
          label="书籍名称"
          prop="bName">
        </el-table-column>
        <el-table-column
          label="描述"
          prop="bDes">
        </el-table-column>
        <el-table-column
          label="书籍状态"
          prop="bookStatus">
        </el-table-column>
        <el-table-column
          label="借阅"
        >
          <el-button type="primary">借书</el-button>
        </el-table-column>
      </el-table>
    </div>
    <!--借书跳出来的表单-->
    <div class="borrowBook" v-show="showBorrow">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="书籍名称" prop="name">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>
        <el-form-item label="归还时间" required>
          <el-col :span="11">
            <el-form-item prop="date1">
              <el-date-picker type="date" placeholder="选择日期" v-model="ruleForm.date1" style="width: 100%;" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">立即借阅</el-button>
          <el-button @click="resetForm('ruleForm')">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
    <br clear="both">
    <div class="gary" v-show="showGary"></div>
    <br clear="both">
    <paging :allSize="allSize" :perSize="perSize" @pageChange="pageChange"></paging>
  </div>
</template>

<script>
  import axios from 'axios'
  import paging from '../paging/paging'
export default {
  name: 'findBookInfo',
  components: {
    paging:paging
  },
  data () {
    return {
      allSize: 0,
      perSize: 5,
      pageAc: 0,
      pageEn: 0,
      getBookCategory:[],
      showGary: false,
      showBorrow: false,
      form: {
        name: '',
        region: '0',
        resource: '全部书籍',
      },
      bookInfoAll: [],
      bookInfoAllOrigin: [],
      ruleForm: {
        id: new Number(),
        name: '',
        region: '',
        date1: '',
      },
      rules: {
        date1: [
          { type: 'string', required: true, message: '请选择日期', trigger: 'change' }
        ]
      }

    }
  },
  methods: {
    getInfo() {
      axios({
        method: "post",
        url: "/api/getAllBookInfo"
      }).then(res=>{
        const data = res.data;
        if (data.code == 200){
          for (let i = 0;i < data.data.length;i++){
            let info = data.data[i];
            info.bookStatus = data.data[i].borrow == 0 ? "未借出":"已借出";
            this.bookInfoAllOrigin.push(info);
          }
          this.pageChange(0,this.perSize);
        }
      });
    },
    getCategory(){
      axios({
        method: "get",
        url: "/api/getCategory"
      }).then(res=>{
        const  data = res.data;
        if (data.code == 200){
          this.getBookCategory = data.data;
          this.getInfo();
        }
        console.log("目录",this.getBookCategory);
      });
    },
    //点击借阅书籍按钮
    borrowBook(info,b,htmlInfo){
      if(htmlInfo.getElementsByTagName("span").length == 0)return ;
      if(info.borrow == 1){
        alert("已借出");
      }else{
        this.showGary = true;
        this.showBorrow = true;
        this.ruleForm.id = info.bid;
        this.ruleForm.name = info.bName;
      }
    },
    onSubmit () {
      axios({
        method: "get",
        url: "/api/findBookInfo",
        params: {
          name: this.form.name,
        }
      }).then(res=>{
        const data = res.data;
        if (data.code == 200){
          this.bookInfoAllOrigin = [];
          //前端---后端
          let region = this.form.region;
          //是否借出
          let resource = this.form.resource == "全部书籍" ? -1 : 0;
          for (let i = 0;i < data.data.length; i++){
            let info = data.data[i];
            info.bookStatus = data.data[i].borrow == 0 ? "未借出":"已借出";
            if(region == 0 && resource == -1){
              //需要所有书籍
              this.bookInfoAllOrigin.push(info);
            }else if(region == 0 && resource == 0){
              if(data.data[i].borrow == 0){
                this.bookInfoAllOrigin.push(info);
              }
            }else if(region != 0 && resource == -1){
              if(data.data[i].bCategory == region){
                this.bookInfoAllOrigin.push(info);
              }
            }else if(region != 0 && resource == 0){
              if(data.data[i].bCategory == region && data.data[i].borrow == 0){
                this.bookInfoAllOrigin.push(info);
              }
            }
          }
          this.pageChange(0,this.perSize);
        }else{
          alert("查询失败！");
        }
      });
    },
    onCanel () {
      this.form.name = '';
      this.form.region = '0';
      this.form.resource = '全部书籍';
    },
    submitForm(formName) {
      this.showGary = false;
      this.showBorrow = false;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(this.ruleForm.date1);
          axios({
            method: "get",
            url: "/api/borrowBookConfig",
            params: {
              bid: this.ruleForm.id,
              data: this.ruleForm.date1,
              id: localStorage.getItem('id')
            }
          }).then(res=>{
            const data = res.data;
            console.log(data);
            if(data.code == 200){
              for (let i = 0;i < this.bookInfoAll.length;i ++){
                if(this.bookInfoAll[i].bid == this.ruleForm.id){
                  this.bookInfoAll[i].borrow = 1;
                }
              }
              alert("借阅成功，记得及时归还！");
            }
          });
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    resetForm(formName) {
      this.showGary = false;
      this.showBorrow = false;
      this.$refs[formName].resetFields();
    },
    pageChange(start,end){
      this.allSize = this.bookInfoAllOrigin.length;
      this.pageAc = start;
      this.pageEn = end;
      let info = [];
      for (let i = 0;i < this.bookInfoAllOrigin.length;i++){
        info.push(this.bookInfoAllOrigin[i]);
      }
      this.bookInfoAll = info.slice(start,end);
    }
  },
  created() {
    this.getCategory();
  }
}
</script>

<style scoped>
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
  .alertInfo{
    display: block;
    height: 40px;
    line-height: 40px;
    font-size: 18px;
    text-align: center;
    color: #606266;
  }
  .findBookInfo{
    width: 60%;
    margin: 0 auto;
  }
  .info{
    width: 80%;
    margin: 0 auto;
  }
  .borrowBook{
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
</style>
