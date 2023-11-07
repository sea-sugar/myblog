import { createStore } from 'vuex'
import router from '@/router'

export default createStore({
  state: {//数据，相当于data
    loggedIn: false,
    username: '',
    count:0,
    token: null, // 初始值为 null
    avatarurl: '/gundam_Q.png',
  },
  getters: {
    //get
  },
  mutations: {//里面定义方法，操作state
    //set
    addcount(state,num){
      state.count=state.count+num
    },
    reducecount(state){
      state.count--
    },
    setavatarurl(state, avatarurl){
      state.avatarurl = avatarurl;
      localStorage.setItem("atarurl",avatarurl)
    },
    setLoggedIn(state, isLoggedIn) {
      state.loggedIn = isLoggedIn;
      localStorage.setItem("loggedIn",isLoggedIn)
    },
    setUsername(state, username) {
      state.username = username;
      localStorage.setItem("username",username)
    },
    setToken(state, token) {
      state.token = token;
    },
    removeuser:(state)=>{
      state.loggedIn=false;
      state.username = '';
      state.token=null;
      state.avatarurl=null;
      localStorage.setItem("loggedIn",false)
      localStorage.setItem("username",'')
      router.replace('/')
    }
  },
  actions: {// 操作异步操作mutation
  },
  modules: {
  }
})
