
<template>
    <el-main class="testmain">
        <h5>Main</h5>
        <div v-if="selectedMenu === '1-1'" >1-1小菜单</div>
        <div v-else-if="selectedMenu === '1' " >测试主菜单</div>
        <div v-else-if="selectedMenu === '1-2'" >1-2小菜单</div>
        <div v-else-if="selectedMenu === '1-3'" >1-3小菜单</div>
        <div v-else-if="selectedMenu === '1-4-1'" >1-4-1小菜单</div>
        <Main1 v-else-if="selectedMenu === '2'"/>
        <div v-else-if="selectedMenu === '3'">这是个人发展的内容</div>
        <div v-else-if="selectedMenu === '4'">这是个人博客的内容</div>
      </el-main>
  </template>
  
  <script>
  export default {
    
  };
  </script>