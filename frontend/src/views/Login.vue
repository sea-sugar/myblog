<template>
  <div class="common-layout">
    <el-container>
      <el-header>欢迎来到海棠花未眠的博客</el-header>

      <el-main class="main-form"> 
        <el-form    
          :model="ruleForm"
          :rules="rules"
          label-width="120px"
          class="demo-ruleForm"
          :size="formSize"
          status-icon
          ref="ruleFormRef">

          <!-- 登录表单内容 -->
          <el-form-item label="Username" prop="username">
            <el-input v-model="ruleForm.username" placeholder="请输入用户名" />
          </el-form-item>
          <el-form-item label="Password" prop="password">
            <el-input  v-model="ruleForm.password" type="password" placeholder="请输入密码" show-password/>
          </el-form-item>
          
          <el-form-item>
            <el-button type="primary" @click="submitForm" v-loading.fullscreen.lock="fullscreenLoading">Submit</el-button>
            <el-button @click="resetForm">Reset</el-button>
            <el-button @click="test">测试</el-button>
            <el-button @click="router.push('/register')">注册</el-button>
            <el-button @click="router.push('/forgot')">忘记密码</el-button>
          </el-form-item>
        </el-form>

      </el-main>

      
      <el-footer>Footer</el-footer>
    </el-container>
  </div>
</template>

<script>
import { reactive, ref } from 'vue'
import { ElForm, ElFormItem, ElInput, ElButton, ElMessage,ElMessageBox ,ElLoading} from 'element-plus'
import 'element-plus/theme-chalk/index.css'
import { useStore } from 'vuex'
import router from '@/router'
import axios from 'axios';
import md5 from 'js-md5';
import { JSEncrypt } from 'jsencrypt' 
export default {
  components: {
    ElForm,
    ElFormItem,
    ElInput,
    ElButton
  },
  setup() {
    const ruleForm = reactive({
      username: '',
      password: '',
      
    })
    
    const store = useStore();
    const rules = {
      username: [
        { required: true, message: '请输入用户名', trigger: 'blur' }
      ],
      password: [
        { required: true, message: '请输入密码', trigger: 'blur' }
      ]
    }
    const ruleFormRef = ref(null)
    const fullscreenLoading = ref(false)
    const submitForm = () => {
      ruleFormRef.value.validate((valid) => {
        if (valid) {
            // 表单验证通过，处理登录逻辑
            processLogin()
        } else {
          ElMessage.error('表单错误')
          return false
        }
      })
    }

    const resetForm = () => {
      ruleFormRef.value.resetFields()
    }
    const processLogin = () => {
      //处理登录逻辑，判断用户名和密码是否正确
      const { username, password } = ruleForm;
      // 使用RSA公钥加密数据加密密码
      const encryptor = new JSEncrypt(); // 创建 JSEncrypt 对象
      const publicKey = 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAku+bi8ali9nRPrgp6GexYIJO+AkTyXgVhGGRFJXUf8GLp15Gk0s74T/kH4e3AzFDNZJlnuzw9xAhP85y4YbrwJ0/ELz/Bmn24P2F+Mm+Jg1k/abTHJMY+pCdVjRVBo/PKRX41nVBMHFZAVEAvZpuB7WQrhEGSaVcJ4ix/fWHBLnEbljr1gNebIL7C4Rsec83kEZL8S2uxqk+k4pRwlDXnty6zCyXTHxHNFnUfI2lyRvEJD7nF7Fx2m8O8S+ywVdMLjLlZc/cKvAXP4NZ3trXE4PArthBKrBArQns3fgUl4aNTVD24bh9kE+xaGau4IJyinMeb5uhM34atVwV+RPC9wIDAQAB'
      encryptor.setPublicKey(publicKey); // 设置公钥
      const rsapassword = encryptor.encrypt(password);

      axios// 发送登录请求到后端
        .post('http://10.117.32.70:3000/users/login', { username, rsapassword })
        .then(response => {
          const { data } = response;
          if (data.success) {
            store.commit('setLoggedIn', true); // 在Vuex中更新登录状态
            store.commit('setUsername', username); // 在Vuex中保存用户名
            store.commit('setToken', data.token);//保存token
            // console.log(store.state.token);
            const loading = ElLoading.service({  //loading界面
              lock: true,
              text: 'Loading',
              background: 'rgba(0, 0, 0, 0.7)',
            })
            setTimeout(() => {
              loading.close();
              ElMessage.success('登录成功');
            }, 500)
            
            router.replace('/BlogHome');
          } else {
            console.error(data.error);
            ElMessage.error('用户名或密码错误');
          }
        })
        .catch(error => {
          console.error(error);
          ElMessage.error('登录请求失败');
        });

      // //模拟登录成功
      // if (ruleForm.username === 'admin' && ruleForm.password === '1') {
      //   ElMessage.success('登录成功')
      //   // 跳转到其他页面
      //   router.push('/BlogHome')
      // } else {
      //   ElMessage.error('用户名或密码错误')
      // }
    }
    const test = () => {
      ElMessageBox.alert('功能暂未实现', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        // 点击确定按钮的回调函数
        // 在这里处理确定操作
      }).catch(() => {
        // 点击取消按钮的回调函数
        // 在这里处理取消操作
      });
    }
    const formSize = ref('default');
    return {
      ruleForm,
      rules,
      ruleFormRef,
      submitForm,
      resetForm,
      test,
      router,
      formSize,
      fullscreenLoading
    }
  }
}
</script>

<style scoped>
.main-form {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto; /* 居中对齐 */
}
</style>