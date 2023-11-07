<template>
  <div class="common-layout">
    <el-container>
      <el-header>欢迎来到海棠花未眠的博客</el-header>

      <el-main class="main-form"> 
        <el-form
          :model="registerForm"
          :rules="registerRules"
          label-width="120px"
          class="demo-ruleForm"
          :size="formSize"
          status-icon
          ref="registerFormRef"
        >
          <!-- 注册表单内容 -->
          <el-form-item label="Username" prop="registerusername">
            <el-input v-model="registerForm.registerusername" placeholder="请输入用户名" />
          </el-form-item>
          <el-form-item label="Password" prop="registerpassword">
            <el-input v-model="registerForm.registerpassword" type="password" placeholder="请输入密码" show-password/>
          </el-form-item>
          <el-form-item label="Password" prop="registerpasswordagain">
            <el-input v-model="registerForm.registerpasswordagain" type="password" placeholder="请再一次输入密码" show-password/>
          </el-form-item>
          <el-form-item label="Email" prop="registeremail">
            <el-input v-model="registerForm.registeremail" type="email" placeholder="请输入邮箱" />
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="submitRegisterForm">注册</el-button>
            <el-button @click="resetRegisterForm">重置</el-button>
            <el-button @click="router.push('/login')">返回登录</el-button>
          </el-form-item>
        </el-form>
      </el-main>



      <el-footer>Footer</el-footer>
    </el-container>
  </div>
</template>

<script>
import { reactive, ref, registerRuntimeCompiler } from 'vue'
import { ElForm, ElFormItem, ElInput, ElButton, ElMessage,ElMessageBox } from 'element-plus'
import 'element-plus/theme-chalk/index.css'
import { useStore } from 'vuex'
import axios from 'axios';
import router from '@/router'
import md5 from 'js-md5';
import { JSEncrypt } from 'jsencrypt' 

export default {
  name:'Register',
  components: {
    ElForm,
    ElFormItem,
    ElInput,
    ElButton
  },
  setup() {
    const registerForm = reactive({
      registerusername: '',
      registerpassword: '',
      registerpasswordagain:'',
      registeremail:'',
    })
    const registerRules = {
      registerusername: [
          { required: true, message: '用户名不能为空', trigger: 'blur' },
          { pattern: /^[A-Za-z0-9_]{2,16}$/, message: '用户名只允许包含字母、数字和下划线', trigger: 'blur' }
        ],
        registerpassword: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { pattern: /^[A-Za-z0-9!@#$%^&*()_\-+=]{6,20}$/, message: '密码只允许包含字母、数字和特殊字符', trigger: 'blur' }
        ],
        registerpasswordagain:[
          { required: true, message: '请再次输入密码', trigger: 'blur' },
          { pattern: /^[A-Za-z0-9!@#$%^&*()_\-+=]{6,20}$/, message: '密码只允许包含字母、数字和特殊字符', trigger: 'blur' },
          { validator: validatePasswordAgain, trigger: 'blur' } // 自定义验证函数，用于验证两次密码输入是否一致
        ],
        registeremail: [
          { required: true, message: '邮箱不能为空', trigger: 'blur' },//没输入信息之前的提示
          { type: 'email', message: '请输入有效的邮箱', trigger: ['blur', 'change'] }//输入之后的提示
        ],
    };

    function validatePasswordAgain(rule, value, callback) {
      const password = registerForm.registerpassword; // 获取第一次输入的密码
      if (value !== password) {
        callback(new Error('两次输入的密码不一致'));
      } else {
        callback();
      }
    }
    // // 用户名只允许包含字母、数字和下划线，长度为 3 到 16 个字符
    // const usernameRegex = /^[A-Za-z0-9_]{3,16}$/;

    // // 密码只允许包含字母、数字和特殊字符，长度为 6 到 20 个字符
    // const passwordRegex = /^[A-Za-z0-9!@#$%^&*()_\-+=]{6,20}$/;

    // // 邮箱格式验证
    // const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

    const registerFormRef = ref(null)
    const submitRegisterForm =  () => {
      registerFormRef.value.validate(async (valid) => {
      if (valid) {
        try {
          // 使用RSA公钥加密数据加密密码
          const encryptor = new JSEncrypt(); // 创建 JSEncrypt 对象
          const publicKey = 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAku+bi8ali9nRPrgp6GexYIJO+AkTyXgVhGGRFJXUf8GLp15Gk0s74T/kH4e3AzFDNZJlnuzw9xAhP85y4YbrwJ0/ELz/Bmn24P2F+Mm+Jg1k/abTHJMY+pCdVjRVBo/PKRX41nVBMHFZAVEAvZpuB7WQrhEGSaVcJ4ix/fWHBLnEbljr1gNebIL7C4Rsec83kEZL8S2uxqk+k4pRwlDXnty6zCyXTHxHNFnUfI2lyRvEJD7nF7Fx2m8O8S+ywVdMLjLlZc/cKvAXP4NZ3trXE4PArthBKrBArQns3fgUl4aNTVD24bh9kE+xaGau4IJyinMeb5uhM34atVwV+RPC9wIDAQAB'
          encryptor.setPublicKey(publicKey); // 设置公钥
          const encryptedPassword = encryptor.encrypt(registerForm.registerpassword);
          console.log('加密的密码',encryptedPassword);      
          // 构造请求体数据
          const requestBody = {
            username: registerForm.registerusername,
            rsapassword: encryptedPassword,
            email: registerForm.registeremail,
          };
          
          // 发送注册请求
          const response = await axios.post('http://10.117.32.70:3000/users/register', requestBody);

          // 根据响应结果进行处理
          if (response.data.success) {
            // 注册成功
            ElMessage.success('注册成功');
            router.push('/Login');// 跳转到其他页面
          } else {
            // 注册失败
            ElMessage.error(response.data.error);
          }
        } catch (error) {
          console.error('请求失败', error);
          ElMessage.error('请求失败');
        }
      } else {
        ElMessage.error('表单验证失败');
        return false;
      }
    });
  };
 
    const resetRegisterForm = () =>{
      registerFormRef.value.resetFields()
    }
    const formSize = ref('default');
    return {
      registerForm,
      registerFormRef,
      registerRules,
      submitRegisterForm,
      resetRegisterForm,
      validatePasswordAgain,
      router,
      formSize
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