<template>
  <div class="paging-Con">
    <span @click="currentPageMin">&lt;</span>
    <span
      v-for="item of currentPageArr"
      @click="currentChange(item)"
      :class="{'currentActive':currentPage === item}"
    >
      {{item}}
    </span>
    <span @click="currentPageAdd">&gt;</span>
  </div>
</template>

<script>
  export default {
    name: 'paging',
    props: {
      allSize: Number,
      perSize: Number
    },
    data () {
      return {
        currentPageArr: [],
        currentPage: 1
      }
    },
    computed: {
      allPage: function(){
        return Math.ceil(this.allSize/this.perSize)
      }
    },
    methods: {
      currentChange(currentPage){
        this.currentPage = currentPage
      },
      currentPageAdd(){
        if(this.currentPage < this.allPage)
          this.currentPage++
      },
      currentPageMin(){
        if(this.currentPage > 1)
          this.currentPage--
      },
      arrPageChange(){
        this.currentPageArr = []
        if(this.currentPage <= 5){
          for (let i = 1; i <= this.allPage && i <= 9; i++) {
            this.currentPageArr.push(i)
          }
        }else {
          if((this.currentPage + 4) >= this.allPage){
            for (let i = this.allPage-8; i <= this.allPage; i++) {
              this.currentPageArr.push(i)
            }
          } else {
            for (let i = this.currentPage-4; i <= this.currentPage+4; i++) {
              this.currentPageArr.push(i)
            }
          }
        }
        this.$emit('pageChange', (this.currentPage - 1) * this.perSize, this.currentPage * this.perSize)
      }
    },
    watch: {
      currentPage: function () {
        this.arrPageChange()
      },
      allSize: function () {
        this.currentPage = 1
        this.arrPageChange()
      },
      perSize: function () {
        this.currentPage = 1
        this.arrPageChange()
      }
    }
  }
</script>

<style scoped>
  .paging-Con{
    user-select: none;
    margin-top: 10px;
    display: flex;
    flex-flow: row;
    justify-content: center;
  }
  .paging-Con span{
    cursor: pointer;
    display: inline-block;
    width: 30px;
    height: 30px;
    line-height: 30px;
    margin: 2px;
    text-align: center;
    border-radius: 3px;
    border: 1px solid #3788EE;
  }
  .currentActive{
    background: #3788EE;
    color: #fff;
  }
</style>
