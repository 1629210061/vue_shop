<template>
  <el-container id="home_container">
    <!-- 头部区域 -->
    <el-header>
      <div class="title">
        <img src="../assets/images/logo.jpg" alt="" />
        <span>电商后台管理系统</span>
      </div>

      <el-button type="info" plain @click="logout">退出</el-button>
    </el-header>
    <!-- 页面主体区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse?'64px':'200px'">
        <div class="toggle-button" @click="toggleMenu">|||</div>
        <!-- 侧边菜单栏 -->
        <!-- collapse实现隐藏显示效果  unique-opened子标签只能打开唯一一个 router打开路由，那么：index值就为跳转的路径-->
        <el-menu class="el-menu-vertical-demo" background-color="#c0d7e2" text-color="#000" active-text-color="#ffd04b"
          :unique-opened="true" :collapse="isCollapse" :collapse-transition="false" router :default-active="activePath">
          <!-- 一级菜单 -->
          <el-submenu :index="item.id+''" v-for="item in menus" :key="item.id">
            <template slot="title">
              <i :class="icons[item.id]"></i>
              <span>{{item.authwame}}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item :index="child.path" v-for="child in item.children" :key="child.id"
              @click="active(child.path)">
              <template slot="title">
                <i class="iconfont iconall-fill"></i>
                <span>{{child.authlame}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧内容部分 -->
      <el-container>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      menus: '',
      icons: {
        1: 'iconfont iconproduct1',
        2: 'iconfont iconpic-fill1',
        3: 'iconfont iconstore-fill'
      },
      isCollapse: false,
      activePath: '/user'
    }
  },
  methods: {
    // 实现退出功能，原理很简单，就是吧token清空即可
    logout: function() {
      window.sessionStorage.removeItem('token')
      this.$router.push('/login')
    },
    async getMenus() {
      const res = await this.axios.get('/getNav')
      if (!res.status === 200) return this.$message.error('获取菜单数据失败')
      this.menus = res.data.data
      console.log(this.menus)
    },
    toggleMenu() {
      this.isCollapse = !this.isCollapse
    },
    active(path) {
      this.activePath = path
      console.log(this.activePath)
    }
  },
  created() {
    this.getMenus()
  }
}
</script>

<style type="text/less" lang="less" scoped>
/* 头部样式 */
.el-header {
  color: white;
  font-size: 18px;
  background-color: #88aec0;
  line-height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .title {
    display: flex;
    align-items: center;
    img {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      margin-right: 20px;
    }
  }
}

// 侧边导航栏
.el-aside {
  background-color: #c0d7e2;
  color: #333;
  .toggle-button {
    text-align: center;
    background-color: #a0cacf;
    line-height: 30px;
    letter-spacing: 2px;
  }
  .el-menu {
    border: 0;
    .iconfont {
      margin-right: 5px;
    }
  }
}

.el-main {
  background-color: #e9eef3;
  color: #333;
  text-align: center;
}

#home_container {
  height: 100%;
}
</style>
