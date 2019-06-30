<template>
    <div>
      <div>
        <img src="./images/404.png" alt="" class="image">
      </div>
      <router-link to="/">
        <button class="returnBackBtn">返回首页</button>
      </router-link>
    </div>
</template>

<script>
export default {
  name: 'notFound'
}
</script>

<style scoped>
.image{
  width: 100%;
  height: 600px;
}
.returnBackBtn{
  border: none;
  outline: none;
  outline:0;
  width: 8%;
  height: 40px;
  color: white;
  font-size: 16px;
  background-color: #3788EE;
  border-radius: 5px;
  cursor: pointer;
  display: inline-block;
  margin-left: 8%;

  position: absolute;
  top: 51%;
  left: 54%;
}
</style>
