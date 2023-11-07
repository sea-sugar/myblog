<template>
  <el-header>
    <el-menu
      :default-active="activeIndex"
      class="el-menu-demo"
      mode="horizontal"
      @select="handleMenuSelect"
    >
      <el-menu-item index="home">首页</el-menu-item>
      <el-sub-menu index="blog">
        <template #title>博客中心</template>
        <el-menu-item index="Vue3">Vue3</el-menu-item>
      </el-sub-menu>

      <el-sub-menu index="note">
        <template #title>笔记</template>
        <el-menu-item index="redis">Redis</el-menu-item>
        <el-menu-item index="proxy">Proxy</el-menu-item>
        <el-menu-item index="axios">axios</el-menu-item>
        <el-menu-item index="pinia">pinia</el-menu-item>
      </el-sub-menu>

      
      <el-menu-item index="ele">Elemrnt-Plus</el-menu-item>
      <el-menu-item index="knowledge">零碎的小知识</el-menu-item>
      <el-menu-item index="code">有用的代码片段</el-menu-item>
      <el-menu-item index="resume">个人简历</el-menu-item>

      <div class="avatar-name-container">
        <el-dropdown>
          <div class="name">
            <el-avatar :size="50" :src="`${store.state.avatarurl}`"  class="avatar-right" />
            <div class="username">{{ store.state.username }}</div>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>个人中心</el-dropdown-item>
              <el-dropdown-item @click="dialogFormUsername = true">更改用户名</el-dropdown-item>
              <el-dropdown-item @click="dialogFormPassword = true"  >更改密码</el-dropdown-item>
              <el-dropdown-item @click="dialogFormAvatar = true" >更改头像</el-dropdown-item>
              <el-dropdown-item divided @click="store.commit('removeuser')">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>

    </el-menu>
    
  </el-header>
  
  <el-dialog v-model="dialogFormUsername" title="更改用户名">
    <el-form :model="modifyForm" ref="modifyFormRef" >
      <el-form-item label="请输入新的用户名" prop="newusername" >
        <el-input v-model="modifyForm.newusername"  :rules="[ { required: true, message: '请输入新的用户名' , trigger: 'blur'}]"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFormUsername = false">取消</el-button>
        <el-button type="primary" @click="submitModifyForm">
          确认
        </el-button>
      </span>
    </template>
  </el-dialog>

  <el-dialog v-model="dialogFormPassword" title="更改密码">
    <el-form :model="modifypasswordForm"  ref="modifypasswordFormRef" >
      <el-form-item label="请输入原密码" prop="oldpassword" >
        <el-input v-model="modifypasswordForm.oldpassword"  type="password" show-password :rules="[{ required: true, message: '请输入原密码' , trigger: 'blur'}]"/>
      </el-form-item>
      <el-form-item label="请输入新密码" prop="newpassword">
        <el-input v-model="modifypasswordForm.newpassword" type="password" show-password :rules="[{ required: true, message: '请输入新密码' , trigger: 'blur'}]"/>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogFormUsername = false">取消</el-button>
        <el-button type="primary" @click="submitModifyPasswordForm">
          确认
        </el-button>
      </span>
    </template>
  </el-dialog>

    <el-dialog
      title="修改头像"
      v-model="dialogFormAvatar"
      :close-on-click-modal="false"
    >
      <el-upload
        class="avatar-uploader"
        action="http://10.117.32.70:3000/users/uploadavatar" 
        :data="{ username: store.state.username }"
        :show-file-list="false"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload"
      >
      <img v-if="imageUrl" :src="imageUrl" class="avatar" />
      <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
      </el-upload>
      <span>只能上传jpg文件且小于1M</span>
      <span class="dialog-footer" slot="footer">
        <br>
        <el-button @click="dialogFormAvatar = false">取 消</el-button>
        <el-button type="primary" @click="saveAvatar">确 定</el-button>
      </span>
    </el-dialog>
  

</template>

<script>
import router from '@/router';
import store from '@/store';
import axios from 'axios';
import { ElMessage,ElForm, ElFormItem, ElInput, ElButton,ElMessageBox,ElDialog} from 'element-plus';
import 'element-plus/theme-chalk/index.css'
import {ref ,reactive} from 'vue'
import { useStore } from 'vuex'
import md5 from 'js-md5';
import { JSEncrypt } from 'jsencrypt' 
  export default {
    name: "Header",
    componment:{
      ElForm,
      ElFormItem,
      ElInput,
      ElButton,
      ElDialog,

    },
    data() {
      return {
        activeIndex: '', // 当前选中的菜单项索引
        dialogFormUsername: false,//是否弹出对话框
        dialogFormPassword:false,
        dialogFormAvatar:false,
        imageUrl: null,
        formLabelWidth: '140px',
        uploadToken:'',
        };
      },
    setup(){
      const store = useStore()
      const modifyForm = reactive({
          newusername: '',
      })
      const modifypasswordForm = reactive({
        oldpassword:'',
        newpassword:'',
      })
      const modifyFormRef=ref(null)
      const modifypasswordFormRef =ref(null)

      const submitModifyPasswordForm =()=>{
        modifypasswordFormRef.value.validate( async (valid) =>{
          if(valid){
            try {
              //修改密码
              if(!/^[A-Za-z0-9!@#$%^&*()_\-+=]{6,20}$/.test(modifypasswordForm.newpassword)){
                ElMessage.error('密码格式错误')
                return false ;
              }
              const token = store.state.token; // 获取保存了 token
               // 使用RSA公钥加密数据加密密码
              const encryptor = new JSEncrypt(); // 创建 JSEncrypt 对象
              const publicKey = 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAku+bi8ali9nRPrgp6GexYIJO+AkTyXgVhGGRFJXUf8GLp15Gk0s74T/kH4e3AzFDNZJlnuzw9xAhP85y4YbrwJ0/ELz/Bmn24P2F+Mm+Jg1k/abTHJMY+pCdVjRVBo/PKRX41nVBMHFZAVEAvZpuB7WQrhEGSaVcJ4ix/fWHBLnEbljr1gNebIL7C4Rsec83kEZL8S2uxqk+k4pRwlDXnty6zCyXTHxHNFnUfI2lyRvEJD7nF7Fx2m8O8S+ywVdMLjLlZc/cKvAXP4NZ3trXE4PArthBKrBArQns3fgUl4aNTVD24bh9kE+xaGau4IJyinMeb5uhM34atVwV+RPC9wIDAQAB'
              encryptor.setPublicKey(publicKey); // 设置公钥
              const oldrsapassword = encryptor.encrypt(modifypasswordForm.oldpassword);
              const newrsapassword = encryptor.encrypt(modifypasswordForm.newpassword);

              const requestBody = {
                username:store.state.username,
                oldrsapassword:oldrsapassword,
                newrsapassword:newrsapassword,
               };
              const response = await axios.post('http://10.117.32.70:3000/users/modifypassword',requestBody,{
                headers: {
                  Authorization: `Bearer ${token}`, // 在请求头中添加 token
              }},requestBody);
              
              if(response.data.success){
                //可以进行修改密码
                ElMessage.success('修改密码成功');
                dialogFormPassword.value = false; 
                store.commit('removeuser');//退出登录，跳转login
                
              }else{
                console.log(response.data.message); 
              }
              


            } catch (error) {
              console.error('修改密码请求失败',error.response.data.message);
              ElMessage.error(error.response.data.message);
            }
          }
          else{
            ElMessage.error('修改密码失败')
            return false;
          }
        })
      }

      const submitModifyForm = ()=>{ 
        modifyFormRef.value.validate((valid) =>{
          if(valid){//我不知道我为什么有bug
            // 直接使用正则表达式验证
            if(!/^[A-Za-z0-9_]{2,16}$/.test(modifyForm.newusername)) {
              ElMessage.error('用户名格式错误')
              return false ;
            }else{
              ModifyUsername();
            }
          }else{
            ModifyUsername();
          }
        })
      }
      const dialogFormUsername = ref(false);
      const dialogFormPassword = ref(false);
      const ModifyUsername = ()=>{
      //更改用户名
          modifyFormRef.value.validate(async (valid) =>{
          if(valid){
            try{
              const requestBody = {
                newusername :modifyForm.newusername,
                username: store.state.username,
              };
              const response = await axios.post('http://10.117.32.70:3000/users/modifyusername',requestBody);
              if(response.data.success){
                ElMessage.success('修改用户名成功');
                store.commit('setUsername',modifyForm.newusername)
                dialogFormUsername.value = false; // 使用 dialogFormUsername.value 关闭对话框
                modifyForm.newusername = ''; // 清空表单字段
                modifyForm.password = ''; // 清空表单字段
              }else{
                ElMessageBox.alert('请检查是否重名', {
                  confirmButtonText: 'OK',
                  callback: () => { //防止点击box外部也报错?
                  },
                })
                ElMessage.error('修改用户名失败');
                
              } 
            }catch(error){
                console.error('修改用户名请求失败',error);
                ElMessage.error('修改用户名请求失败');
              }
            }else{
                ElMessage.error('修改用户名失败');
                return false;
              }
        });
      }

      const imageUrl = ref(null);
      const dialogFormAvatar = ref(false);
      const handleAvatarSuccess = (response, file) => {
        // 处理上传成功后的响应
        // response 包含后端返回的数据
        imageUrl.value = response.imageUrl; // 假设后端返回的数据中包含图片的URL
        const newImageUrl = `${imageUrl.value}?timestamp=${Date.now()}`;
        imageUrl.value = newImageUrl;
        console.log('后端返回的图片URL',imageUrl.value);
      }
      const beforeAvatarUpload = (file) =>{
        // 上传之前的验证逻辑，如文件大小、文件类型等
        const isJpg = file.type === 'image/jpeg';
        const isSizeValid = file.size / 1024 / 1024 <= 1;

        if (!isJpg) {
          console.error('只支持上传 JPG 格式的图片');
          ElMessage.error('只支持上传 JPG 格式的图片');
          return false;
        }
        if (!isSizeValid) {
          console.error('图片大小不能超过 1MB');
          ElMessage.error('图片大小不能超过 1MB');
          return false;
        }
        console.log('图片上传成功')
        ElMessage.success('图片上传成功');
        return true;
      }
      const saveAvatar = async () => {
        if(imageUrl.value){
          const newImageUrl = `${imageUrl.value}?timestamp=${Date.now()}`;
          store.commit("setavatarurl",newImageUrl);
          imageUrl.value = ''
          dialogFormAvatar.value = false;
        }else{
           // 没有修改头像，直接关闭对话框
          imageUrl.value = ''
          dialogFormAvatar.value = false;
        }
       
      };
  
      return {
        modifyFormRef,
        modifyForm,
        dialogFormUsername,
        dialogFormPassword,
        dialogFormAvatar,
        modifypasswordForm,
        modifypasswordFormRef,
        store,
        imageUrl,
        ModifyUsername,
        submitModifyForm,
        submitModifyPasswordForm,
        handleAvatarSuccess,
        beforeAvatarUpload,
        saveAvatar, 
      }
    },
    methods: {
      handleMenuSelect(selectedItem){
        const routeMap = {
          'home': '/Bloghome',
          //'blog': '/blog',
          'Vue3': '/blog/Vue3',
          //'note': '/note',
          'redis': '/note/redis',
          'proxy': '/note/proxy',
          'axios': '/note/axios',
          'ele': '/ele',
          'knowledge': '/knowledge',
          'code': '/code',
          'resume': '/resume',
          'pinia':'/note/pinia',
          // 其他菜单项的映射关系
        };

        const routePath = routeMap[selectedItem];

        if (selectedItem !== this.activeIndex) {
          this.activeIndex = selectedItem;
          this.$emit('menu-selected', selectedItem);
          // 触发自定义事件，传递选中的导航栏数据并进行路由跳转
          this.$router.push(routePath);
          console.log(routePath);
        }
      },
      
      
    },
    
    
  }
</script>

<style scoped>
.avatar-right {
  margin-right: 10px;
}
.avatar {
  width: 100px; /* 设置图片的宽度 */
  height: 100px; /* 设置图片的高度 */
  object-fit: cover;
}

.avatar-name-container {
  display: flex;
  align-items: center; 
  margin-left: auto;
}

.name {
  display: flex;
  align-items: center;
}

.username {
  margin-left: 10px;
  white-space: nowrap;/* white-space: nowrap 来防止换行 */
  overflow: hidden;/* overflow: hidden 隐藏溢出内容 */
  text-overflow: ellipsis;/* 以及 text-overflow: ellipsis 来显示省略号 */

}
.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
  border: 1px dashed #8c939d;
}
</style>