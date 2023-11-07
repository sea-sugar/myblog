<template>
    <Header></Header>
    <el-main class="testmain">
        <h5>欢迎来到海棠花未眠的博客首页</h5>
        <el-divider />  <!-- 下划线 -->

    </el-main>
</template>
  
<script>
  import Header from "../components/Header.vue";
  import Main from "../components/Main.vue";
  import Aside from "../components/Aside.vue";

  export default {
    name:'BlogHome',
    components: {
      Header,
      Main,
      Aside,
    },
    data(){

    },
    methods:{
  
    }
  };
</script>
<style>

</style>