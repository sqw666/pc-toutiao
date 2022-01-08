<template>
  <div class="layout-container">
    <!-- <div>顶部导航栏</div>
    <div>侧边导航栏</div>
     -->
    <el-container class="layout-container">
      <el-aside width="auto" class="aside">
        <AppAside :is-collapse="isCollapse" class="aside-menu" />
      </el-aside>
      <el-container>
        <el-header class="header">
          <div>
            <!-- 样式绑定 -->
            <i
              :class="{
                'el-icon-s-fold': isCollapse,
                'el-icon-s-unfold': !isCollapse,
              }"
              @click="isCollapse = !isCollapse"
            ></i>
            <span>江苏传智播客科技教育有限公司</span>
          </div>

          <el-dropdown>
            <div class="avatar-wrap">
              <img class="avatar" :src="user.photo" alt="" />
              <span>{{ user.name }}</span>
              <i class="el-icon-arrow-down el-icon--right"></i>
            </div>
            <!-- <span>
              下拉菜单<i class="el-icon-arrow-down el-icon--right"></i>
            </span> -->
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>设置</el-dropdown-item>
              <el-dropdown-item @click.native="onLogout">退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-header>
        <!-- 该组件所在的位置就是路由的出口 -->
        <el-main class="main"><router-view /></el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import AppAside from "./components/aside";
import { getUserProfile } from "@/api/user";

export default {
  name: "layoutIndex",
  components: {
    AppAside,
  },
  props: {},
  data() {
    return {
      user: {},
      isCollapse: false,
    };
  },
  computed: {},
  watch: {},
  created() {
    this.loadUserProfile();
  },
  mounted() {},
  methods: {
    loadUserProfile() {
      getUserProfile().then((res) => {
        this.user = res.data.data;
      });
    },
    onLogout() {
      this.$confirm("确认退出么?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          window.localStorage.removeItem("user");
          this.$router.push("/login");
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消退出",
          });
        });
    },
  },
};
</script>

<style scoped lang="less">
.layout-container {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
}
.aside {
  width: 200px;
  background-color: #d3dce6;
  .aside-menu {
    height: 100%;
  }
}
.header {
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  // background-color: #b3c0d1;
  border-bottom: 1px solid #ccc;
}
.main {
  background-color: #e9eef3;
}
.avatar-wrap {
  display: flex;
  align-items: center;
  .avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 10px;
  }
}
</style>