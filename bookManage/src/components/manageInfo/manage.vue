<template>
  <div>
    <el-button type="info" round style="float: right;margin-right: 10%" @click="showBookDes">上传新的书籍</el-button>
    <el-button type="info" round style="float: right;margin-right: 10%" @click="addBookKinds">增加书籍种类</el-button>
    <div>
      <!--展示所有书籍-->
      <div class="info">
        <el-table
          :data="bookInfoAll"
          @cell-click = "modifyBook"
          style="width: 100%">
          <el-table-column
            width="80%"
            label="ID"
            prop="bid">
          </el-table-column>
          <el-table-column
            label="书籍名称"
            align="center"
            prop="bName">
          </el-table-column>
          <el-table-column
            label="描述"
            align="center"
            prop="bDes">
          </el-table-column>
          <el-table-column
            label="书籍分类"
            align="center"
            width="80%"
            prop="categoryInfo">
          </el-table-column>
          <el-table-column
            label="书籍状态"
            width="80%"
            align="center"
            prop="borrowInfo">
          </el-table-column>
          <el-table-column
            label="借阅人员"
            prop="uname"
            align="center"
          >
          </el-table-column>
          <el-table-column
            label="修改书籍信息"
          >
            <el-button type="primary">修改</el-button>
          </el-table-column>
        </el-table>
      </div>
      <div class="bookDes" v-show="submitBookIdea">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="书籍名称" prop="bName">
            <el-input v-model="ruleForm.bName"></el-input>
          </el-form-item>
          <el-form-item label="书籍分类">
            <el-select v-model="ruleForm.bCategory" placeholder="请选择书籍的类别">
              <el-option v-for="item of getBookCategory" :label="item.cName" :value="item.cId" :key="item.cId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="书籍介绍" prop="bDesc">
            <el-input type="textarea" v-model="ruleForm.bDesc"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">发布</el-button>
            <el-button @click="resetForm('ruleForm')">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="gary" v-show="showGary"></div>
      <br clear="both">
      <div class="showModify" v-show="showModify">
        <el-form ref="form" :model="form" label-width="80px">
          <el-form-item label="书籍名称">
            <el-input v-model="form.bName"></el-input>
          </el-form-item>
          <el-form-item label="书籍分类">
            <el-select v-model="form.bCategory" placeholder="请选择书籍分类">
              <el-option v-for="item of getBookCategory" :label="item.cName" :value="item.cId" :key="item.cId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="书籍描述">
            <el-input type="textarea" v-model="form.bDes"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="danger" @click="deleteBook">删除书籍</el-button>
            <el-button type="primary" @click="onSubmit">立即修改</el-button>
            <el-button @click="cancelBtn">取消</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!--增加书籍分类-->
      <div class="addBookKinds showModify" v-show="showAddBookKinds">
        <el-input v-model="newKind" placeholder="请输入增加名称" style="margin-bottom:10px"></el-input>
        <el-button type="primary" @click="addKindConfig">立即创建</el-button>
        <el-button @click="addKindCancel">取消</el-button>
      </div>
    </div>
    <paging :allSize="allSize" :perSize="perSize" @pageChange="pageChange"></paging>
  </div>
</template>

<script>
  import axios from 'axios'
  import paging from '../paging/paging'
  export default {
    name: "manage",
    components: {
      paging:paging
    },
    data () {
      return {
        allSize: 0,
        perSize: 6,
        pageAc: 0,
        pageEn: 0,
        newKind: '',
        bookInfoAll: [],
        bookInfoAllOrigin: [],
        ruleForm: {
          bName: '',
          bCategory: '',
        },
        rules: {
          bDesc: [
            { required: true, max: 50, message: '描述小于50字', trigger: 'blur' }
          ]
        },
        submitBookIdea: false,
        showGary: false,
        getBookCategory:[],
        showModify: false,
        showAddBookKinds: false,
        form: {
          bName: '',
          region: '',
          type: [],
          resource: '',
          bDes: '',
          bCategory: ''
        }
      }
    },
    methods:{
      getInfo(){
        axios({
          method: "get",
          url: "/api/manageGetBookInfo"
        }).then(res=>{
          const data = res.data;
          if (data.code == 200){
            for (let i = 0;i < data.data.length;i ++){
              let info = data.data[i];
              info.borrowInfo = info.borrow == 0 ? "未借出" : "已借出";
              info.categoryInfo = this.getBookCategory[info.bCategory-1].cName;
              this.bookInfoAllOrigin.push(info);
            }
            this.pageChange(0,this.perSize);
            console.log( this.bookInfoAllOrigin);
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
        });
      },
      modifyBook(info,b,htmlInfo){
        if(htmlInfo.getElementsByTagName("span").length == 0)return ;
        this.showModify = true;
        this.showGary = true;
        this.form = info;
        console.log(info);
      },
      showBookDes(){
        this.submitBookIdea = true;
        this.showGary = true;
      },
      addBookKinds(){
        this.showAddBookKinds = true;
        this.showGary = true;
      },
      submitForm(){
        if(this.ruleForm.bName.trim() == "" || this.ruleForm.bCategory == ""){
          alert("请将书籍信息填写完整");
          return ;
        }
        axios({
          method: "get",
          url: "/api/addBookInfo",
          params: {
            bName: this.ruleForm.bName,
            bDes: this.ruleForm.bDesc,
            bCategory: this.ruleForm.bCategory,
          }
        }).then(res=>{
          const data = res.data;
          if(data.code == 200){
            this.resetForm();
          }
        });
      },
      resetForm(){
        this.ruleForm.bName = "";
        this.ruleForm.bDesc = "";
        this.ruleForm.bCategory = "";
        this.submitBookIdea = false;
        this.showGary = false;
      },
      //删除书籍信息
      deleteBook(){
        axios({
          method: "get",
          url: "/api/deleteBook",
          params: {
            bid: this.form.bid
          }
        }).then(res=>{
          const data = res.data;
          if(data.code != 200){
            alert("删除失败！");
          }
          this.cancelBtn();
        });
      },
      onSubmit() {
        console.log(this.form);
        axios({
          method: "get",
          url: "/api/manageChangeInfo",
          params: {
            bid: this.form.bid,
            bDes: this.form.bDes,
            bName: this.form.bName,
            bCategory: this.form.bCategory
          }
        }).then(res=>{
          const data = res.data;
          if(data.code != 200){
            alert("修改失败！");
          }
          this.cancelBtn();
        });
      },
      cancelBtn(){
        this.showGary = false;
        this.showModify = false;
      },
      addKindConfig(){
        axios({
          method: "get",
          url: "/api/addNewKind",
          params: {
            addName: this.newKind
          }
        }).then(res=>{
          const data = res.data;
          if (data.code != 200){
            alert("增加失败");
          }
          this.addKindCancel();
        });
      },
      addKindCancel(){
        this.showGary = false;
        this.showAddBookKinds = false;
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
  .info{
    width: 80%;
    margin: 0 auto;
  }
  .bookDes{
    width: 50%;
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
  .showModify{
    width: 50%;
    background-color: #EEE5DE;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 5%;
    z-index: 100;
    border-radius: 5px;
  }
  .addBookKinds{
    width: 25%;
  }
</style>
