<template>
  <div id="login_container">
    <div class="login_box">
      <div class="login_log">
        <img src="../assets/logo.png" alt="" />
      </div>
      <el-form ref="loginForm" :model="loginForm" :rules="LoginFromRule" label-width="80px" class="login_form">
        <el-form-item label="用户名：" prop="name">
          <el-input v-model="loginForm.name" prefix-icon="iconfont iconaccount"></el-input>
        </el-form-item>
        <el-form-item label="密码：" prop="password">
          <el-input v-model="loginForm.password" show-password prefix-icon="iconfont iconpassword">
          </el-input>
        </el-form-item>
        <div class="login_button">
          <el-button type="success" @click="submitForm()" round>提交
          </el-button>
          <el-button type="info" @click="resetForm()" round>重置 </el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loginForm: {
        name: '',
        password: '',
        res: ''
      },
      LoginFromRule: {
        name: [
          // trigger触发时机，表示失去焦点的时候触发
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    resetForm() {
      this.$refs.loginForm.resetFields()
    },
    submitForm() {
      var that = this
      this.$refs.loginForm.validate(valid => {
        if (!valid) return
        this.axios
          .post('/getData', {
            name: this.loginForm.name,
            password: this.loginForm.password
          })
          .then(function(response) {
            if (response.status === 200) {
              that.$message({
                message: '登录成功啦',
                type: 'success'
              })
              // 将登陆成功之后的token，保存到客户端的sessionStorage中
              // 项目中除了登陆之外的其他API接口，必须在登陆之后才能放访问
              // token只应在当前网站打开期间生效，所以将token保存在sessionStorae中
              window.sessionStorage.setItem('token', response.data.token)
              that.$router.push('/home')
            } else {
              that.$message({
                message: '登录失败啦',
                type: 'error'
              })
            }
          })
          .catch(function(error) {
            that.$message({
              message: error,
              type: 'error'
            })
          })
      })
    }
  }
}
</script>

<style lang="less" scoped>
#login_container {
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-color: rgb(210, 219, 199);
  width: 100%;
  height: 100%;
}

.login_box {
  height: 300px;
  width: 550px;
  background-color: white;
  border-radius: 5%;
  padding-bottom: 10px;
}

.login_form {
  width: 80%;
  height: 200px;
  margin: 0 auto;
}

.login_button {
  margin-top: 40px;
  text-align: right;
}

.login_log img {
  width: 100px;
  height: 100px;
  border-radius: 50%;
}

.login_log {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin: 0 auto;
  padding: 3px;
  transform: translateY(-50%);
  border: 1px solid rgb(212, 205, 205);
  background-color: rgba(246, 243, 248, 0.945);
  box-shadow: 0 0 10px #ddd;
}
</style>
