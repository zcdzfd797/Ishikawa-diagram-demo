<template>
  <el-container class="app-shell">
    <el-aside class="side-panel" width="208px">
      <el-scrollbar class="menu-scroll">
        <el-menu
          :default-active="activeMenu"
          class="example-menu"
          router
        >
          <el-menu-item
            v-for="route in menuRoutes"
            :key="route.path"
            :index="route.path"
          >
            <span>{{ route.meta.title }}</span>
          </el-menu-item>
        </el-menu>
      </el-scrollbar>
    </el-aside>

    <el-main class="main-panel">
      <div class="content-panel">
        <router-view />
      </div>
    </el-main>
  </el-container>
</template>

<script>
import { menuRoutes } from "@/router";

export default {
  name: "App",
  data() {
    return {
      menuRoutes,
    };
  },
  computed: {
    activeMenu() {
      return this.$route.path;
    },
  },
};
</script>

<style>
html,
body,
#app {
  height: 100%;
}

body {
  margin: 0;
  overflow: hidden;
  background: #f5f7fa;
  color: #303133;
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
}

* {
  box-sizing: border-box;
}

.app-shell {
  height: 100%;
  overflow: hidden;
  background: #fff;
}

.side-panel {
  height: 100%;
  overflow: hidden;
  border-right: 1px solid #ebeef5;
  background: #fff;
}

.main-panel {
  min-width: 0;
  height: 100%;
  padding: 8px !important;
  background: #f5f7fa;
}

.menu-scroll {
  height: 100%;
}

.menu-scroll .el-scrollbar__wrap {
  overflow-x: hidden;
}

.example-menu {
  min-height: 100%;
  border-right: 0 !important;
}

.content-panel {
  height: 100%;
  min-height: 0;
  min-width: 0;
  overflow: hidden;
  background: #fff;
}

@media (max-width: 1180px) {
  body {
    overflow: auto;
  }

  .app-shell {
    display: block;
    height: auto;
    overflow: visible;
  }

  .side-panel {
    width: 100% !important;
    height: 240px;
    border-right: 0;
    border-bottom: 1px solid #ebeef5;
  }

  .main-panel {
    height: calc(100vh - 240px);
    padding: 10px !important;
  }

  .content-panel {
    min-height: 520px;
  }
}

@media (max-width: 720px) {
  .side-panel {
    height: 220px;
  }

  .main-panel {
    height: calc(100vh - 220px);
    padding: 8px !important;
  }
}
</style>
