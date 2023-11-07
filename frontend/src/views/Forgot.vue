<template>
  <div class="common-layout">
    <el-container>
      <el-header>欢迎来到海棠花未眠的博客</el-header>

      <el-main class="main-form"> 

        <el-form
          :model="forgotForm"
          :rules="forgotRules"
          label-width="120px"
          class="demo-ruleForm"
          :size="formSize"
          status-icon
          ref="forgotFormRef"
        >
          <!-- 忘记密码表单内容 -->
          <el-form-item label="Username" prop="forgotusername">
            <el-input v-model="forgotForm.forgotusername" placeholder="请输入用户名" />
          </el-form-item>
          <el-form-item label="Email" prop="forgotemail">
            <el-input v-model="forgotForm.forgotemail"  type="email" placeholder="请输入邮箱" />
          </el-form-item>


          <el-form-item>
            <el-button type="primary" @click="submitForgotForm">提交</el-button>
            <el-button @click="resetForgotForm">重置</el-button>
            <el-button @click="router.push('/login')">返回登录</el-button>
          </el-form-item>
        </el-form>

      </el-main>



      <el-footer>Footer</el-footer>
    </el-container>
  </div>
</template>

<script>
import { reactive, ref, } from 'vue'
import { ElForm, ElFormItem, ElInput, ElButton, ElMessage,ElMessageBox } from 'element-plus'
import 'element-plus/theme-chalk/index.css'
import { useStore } from 'vuex'
import router from '@/router'
import axios from 'axios'
import { JSEncrypt } from 'jsencrypt' 
export default {
  components: {
    ElForm,
    ElFormItem,
    ElInput,
    ElButton
  },
  setup() {
    const forgotForm = reactive({
      forgotusername: '',
      forgotemail:'',
    })
    const forgotRules = {
      forgotusername: [
        { required: true, message: '请输入用户名', trigger: 'blur' }
      ],
      forgotemail: [
        { required: true, message: '请输入邮箱', trigger: 'blur' },
        { type: 'email', message: '请输入有效的邮箱', trigger: ['blur', 'change'] }
      ],
    }
    const forgotFormRef = ref(null)
    const submitForgotForm = async () =>{
      forgotFormRef.value.validate(async(valid) => {  //根据 await 这里为什么要加async？
        if (valid) {
            
           //提交忘记密码表单    
           try {
            //构造请求结构体
            const requestBody = {
              username:forgotForm.forgotusername,
              email:forgotForm.forgotemail,
            };
            //发送忘记密码请求结果
            const response = await axios.post ('http://10.117.32.70:3000/users/forgot',requestBody);  //请求本地服务器

            //根据响应结果进行处理
            if(response.data.success){
              //找回密码成功
              ElMessage.success('找回密码成功');
              ElMessageBox('已经更改随机密码为:' + response.data.Password);
              router.push('/Login');
            }else{
              // 信息错误找回密码失败
              ElMessage.error(response.data.error);
            }
           }catch(error){
            console.error('忘记密码请求失败',error.message);
            ElMessage.error('忘记密码请求失败');
           }
        } else {
          ElMessage.error('表单错误')
          return false
        }
      })
    }
    const resetForgotForm = () =>{
      forgotFormRef.value.resetFields()
    }
    const formSize = ref('default');

    return {
      forgotForm,
      forgotFormRef,
      forgotRules,
      submitForgotForm,
      resetForgotForm,
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