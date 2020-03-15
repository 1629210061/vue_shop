<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card class="box-card">
      <el-row :gutter="20">
        <!-- 搜索框 -->
        <el-col :span="8">
          <el-input placeholder="请输入内容" class="input-with-select" v-model="pageInfo.keyWord" clearable
            @clear="getAllUser">
            <el-button slot="append" icon="el-icon-search" @click="getAllUser"></el-button>
          </el-input>
        </el-col>
        <!-- 添加用户 -->
        <el-col :span="4">
          <el-button type="primary" @click="addUserDialogVisible = true">添加用户</el-button>
          <el-dialog title="添加用户" :visible.sync="addUserDialogVisible" width="50%" @close="resetAddForm">
            <!-- 用户表单 -->
            <el-form status-icon :model="userInfo" :rules="userRules" ref="userInfo" label-width="100px"
              class="demo-ruleForm">
              <el-form-item label="用户名称" prop="userName">
                <el-input v-model="userInfo.userName"></el-input>
              </el-form-item>
              <el-form-item label="密码" prop="password">
                <el-input type="password" v-model="userInfo.password"></el-input>
              </el-form-item>
              <el-form-item label="邮箱" prop="email">
                <el-input v-model="userInfo.email"></el-input>
              </el-form-item>
              <el-form-item label="手机号" prop="mobile">
                <el-input v-model="userInfo.mobile"></el-input>
              </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
              <el-button @click="addUserDialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="submitAddForm">确 定</el-button>
            </span>
          </el-dialog>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <el-table :data="userDate" border style="width: 100%">
        <!-- 索引列 -->
        <el-table-column type="index">
        </el-table-column>
        <el-table-column prop="userName" label="姓名">
        </el-table-column>
        <el-table-column prop="email" label="邮箱">
        </el-table-column>
        <el-table-column prop="mobile" label="电话">
        </el-table-column>
        <el-table-column prop="roleName" label="角色">
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.state" active-color="#13ce66" inactive-color="#ff4949"
              @change="stateChange(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <!-- 修改用户信息操作 -->
            <el-dialog title="修改用户信息" :visible.sync="editUserDialogVisible" width="50%" @close="resetEditForm">
              <!-- 用户表单 -->
              <el-form status-icon :model="editForm" :rules="userRules" ref="editForm" label-width="100px"
                class="demo-ruleForm">
                <el-form-item label="用户名称" prop="userName">
                  <el-input v-model="editForm.userName" disabled></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                  <el-input v-model="editForm.email"></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="mobile">
                  <el-input v-model="editForm.mobile"></el-input>
                </el-form-item>
              </el-form>
              <span slot="footer" class="dialog-footer">
                <el-button @click="editUserDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editUserSubmitForm()">确 定</el-button>
              </span>
            </el-dialog>
            <!-- 修改用户信息按钮 -->
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="editUserClick(scope.row.id)">
            </el-button>
            <!-- 删除按钮 -->
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteUser(scope.row.id)"></el-button>
            <el-tooltip class="item" effect="dark" content="分配角色" placement="top">
              <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="pageInfo.currentPage" :page-sizes="[1, 2, 5, 10]" :page-size="pageInfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper" :total="pageInfo.totalSize">
      </el-pagination>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    // 自定义密码校验规则
    var checkPassword = (rule, value, callback) => {
      var regPassword = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/
      if (regPassword.test(value)) {
        callback()
      }
      callback(new Error('密码至少包含 数字和英文，长度6-20'))
    }
    // 自定义邮箱正则验证
    var checkEmail = (rule, value, callback) => {
      var regEmail = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
      if (regEmail.test(value)) {
        callback()
      }
      callback(new Error('邮箱格式错误'))
    }
    // 自定义手机号正则验证
    var checkMobile = (rule, value, callback) => {
      var regMobile = /^1[3-9][0-9]{9}$/
      if (regMobile.test(value)) {
        callback()
      }
      callback(new Error('手机号有误'))
    }
    return {
      // 添加用户弹出框标志
      addUserDialogVisible: false,
      // 修改用户弹出框标志
      editUserDialogVisible: false,
      userDate: [],
      // 添加用户信息
      userInfo: {
        userName: '',
        password: '',
        email: '',
        mobile: ''
      },
      editForm: {},
      // 信息校验规则
      userRules: {
        userName: [
          { required: true, message: '请输入用户名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { validator: checkPassword, trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      pageInfo: {
        // 搜索关键字
        keyWord: '',
        // 当前页数
        currentPage: 1,
        // 每页条数
        pageSize: 5,
        // 总条数
        totalSize: 0
      }
    }
  },
  methods: {
    // 分页获取用户列表
    async getAllUser() {
      var { data: res } = await this.axios.get('/user/findPage', {
        params: {
          currentPage: this.pageInfo.currentPage,
          pageSize: this.pageInfo.pageSize,
          keyWord: this.pageInfo.keyWord
        }
      })
      console.log(this.pageInfo.keyWord)
      if (res.code !== 200) {
        return this.$message({ message: '获取用户列表失败', type: 'error' })
      }

      this.userDate = res.data.result
      this.pageInfo.totalSize = res.data.totalSize
      console.log(res)
    },
    // 监听每页数据条数改变
    handleSizeChange(val) {
      this.pageInfo.pageSize = val
      this.getAllUser()
    },
    // 监听页码改变
    handleCurrentChange(val) {
      this.pageInfo.currentPage = val
      this.getAllUser()
    },
    // 监听状态变化
    stateChange(data) {
      console.log(data)
      this.updateState(data.id, data.state)
    },
    // 更新状态
    async updateState(id, state) {
      var res = await this.axios.get('/user/updateStateById', {
        params: {
          id: id,
          state: state
        }
      })
      console.log(res)
    },
    // 重置添加用户表单
    resetAddForm() {
      this.$refs.userInfo.resetFields()
    },
    // 添加用户，表单提交前的预验证
    submitAddForm() {
      this.$refs.userInfo.validate(async valid => {
        if (!valid) return
        var res = await this.axios.post('/user/insertUser', {
          userName: this.userInfo.userName,
          password: this.userInfo.password,
          email: this.userInfo.email,
          mobile: this.userInfo.mobile
        })
        if (res.data.code !== 200) {
          return this.$message.error(res.data.msg)
        }
        this.getAllUser()
        this.addUserDialogVisible = false
        this.$message.success('添加用户成功啦')
      })
    },
    // 修改用户信息表单提交
    editUserSubmitForm() {
      this.$refs.editForm.validate(async valid => {
        if (!valid) return
        var res = await this.axios.post('/user/updateUserById', {
          id: this.editForm.id,
          email: this.editForm.email,
          mobile: this.editForm.mobile
        })
        if (res.data.code !== 200) {
          return this.$message.error(res.data.msg)
        }
        this.editUserDialogVisible = false
        this.getAllUser()
      })
    },
    // 点击修改按钮触发事件
    async editUserClick(id) {
      console.log(id)

      var res = await this.findById(id)
      if (res.data.code !== 200) {
        return this.$message.error(res.data.msg)
      }
      this.editForm = res.data.data
      this.editUserDialogVisible = true
    },
    // 根据id查找用户
    findById(id) {
      var res = this.axios.get('/user/findById', {
        params: {
          id: id
        }
      })
      return res
    },
    // 重置修改表单
    resetEditForm() {
      this.$refs.editForm.resetFields()
    },
    // 删除用户信息
    deleteUser(id) {
      this.$confirm('此操作将永久删除该用户信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.axios.get('/user/deleteById', {
            params: {
              id: id
            }
          })
          this.getAllUser()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    }
  },
  created() {
    this.getAllUser()
  }
}
</script>

<style lang="less" scoped>
.el-card {
  margin-top: 20px;
}
</style>
