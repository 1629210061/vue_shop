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
        <el-col :span="8">
          <el-input placeholder="请输入内容" class="input-with-select">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary">添加用户</el-button>
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
          <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
          <el-tooltip class="item" effect="dark" content="分配角色" placement="top">
            <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
          </el-tooltip>
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
    return {
      userDate: [],
      pageInfo: {
        currentPage: 1,
        pageSize: 2,
        totalSize: 0
      }
    }
  },
  methods: {
    async getAllUser() {
      var { data: res } = await this.axios.get('/user/findPage', {
        params: {
          currentPage: this.pageInfo.currentPage,
          pageSize: this.pageInfo.pageSize
        }
      })
      this.userDate = res.data.result
      this.pageInfo.totalSize = res.data.totalSize
      console.log(res)
    },
    handleSizeChange(val) {
      this.pageInfo.pageSize = val
      this.getAllUser()
    },
    handleCurrentChange(val) {
      this.pageInfo.currentPage = val
      this.getAllUser()
    },
    // 监听状态变化
    stateChange(data) {
      console.log(data)
      this.updateState(data.id, data.state)
    },
    async updateState(id, state) {
      var res = await this.axios.get('/user/updateStateById', {
        params: {
          id: id,
          state: state
        }
      })
      console.log(res)
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
