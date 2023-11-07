<template>
  <Header></Header>
  <h5>this is pinia</h5>
  <el-main class="testmain">
    <div class="demo-collapse">
    <el-collapse v-model="activeName" accordion>
      <el-collapse-item title="Vuex - State " name="1">
        <div>提供唯一的公共数据源,所有共享的数据统一放到store的state进行储存,相似与data</div>
        <div>
          读取state数据,使用 $store.state.name 就可以,也可以使用双花括号包起来使用
          name:{{ $store.state.name }}
        </div>
      </el-collapse-item>
      <el-collapse-item title="Vuex - Mutation" name="2">
        <div>
          更改 Vuex 的 store 中的状态的唯一方法是提交 mutation。Vuex 中的 mutation 非常类似于事件：每个 mutation 都有一个字符串的事件类型 (type)和一个回调函数 (handler)。这个回调函数就是我们实际进行状态更改的地方，并且它会接受 state 作为第一个参数：
        </div>
        <div>
          我在store的mutations里面写了两个方法addcount和reducecount
          <button @click="testadd">点我+10</button>
          <button @click="testreduce">点我-1</button>
          count:{{ $store.state.count }}
        </div>
      </el-collapse-item>
      <el-collapse-item title="Vuex - Action" name="3">
        <div>
          不会
        </div>
      </el-collapse-item>
      <el-collapse-item title="Vuex - Getter" name="4">
        <div>
          类似于vue中的computed,进行缓存,对于Store中的数据进行加工处理形成新的数据
        </div>
      </el-collapse-item>
      <el-collapse-item title="Vuex - Modules" name="5">
        <div>
          当遇见大型项目时,数据量大,store就会显得很臃肿,为了解决以上问题,Vuex 允许我们将 store 分割成模块.
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
  </el-main>
</template>

<script>
import Header from '../../components/Header.vue'
export default {
  name:'pinia',
  components: {
    Header,
    activeName: '', // 将默认值设为空字符串
  },
  methods:{
    testadd(){
      this.$store.commit("addcount",10);
    },
    testreduce(){
      this.$store.commit("reducecount");
    }
  }
  
};
</script>