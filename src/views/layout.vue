<template>
  <div class="layout">
    <!-- 头部 -->
    <el-container
      style="
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        right: 0;
        overflow: hidden;
      "
    >
      <el-header class="d-flex align-items-center" style="background: #545c64">
        <a class="h5 text-light mb-0 mr-auto">
          {{ $conf.logo }}
        </a>
        <el-menu
          :default-active="navBar.active"
          mode="horizontal"
          @select="handleSelect"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
        >
          <el-menu-item
            :index="index | numToString"
            v-for="(item, index) in navBar.list"
            :key="index"
            >{{ item.name }}</el-menu-item
          >

          <el-submenu index="100">
            <template slot="title">
              <el-avatar
                size="small"
                src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"
              ></el-avatar>
              summer
            </template>
            <el-menu-item index="100-1">修改</el-menu-item>
            <el-menu-item index="100-2">退出</el-menu-item>
          </el-submenu>
        </el-menu>
      </el-header>
      <!-- 侧边布局 -->
      <el-container style="height: 100%">
        <el-aside width="200px">
          <!-- 侧边导航栏 -->
          <el-menu
            :default-active="slideMenuActive"
            @select="slideSelect"
            style="height: 100%"
          >
            <el-menu-item
              :index="index | numToString"
              :key="index"
              v-for="(item, index) in slideMenus"
            >
              <i :class="item.icon"></i>
              <span slot="title">{{ item.name }}</span>
            </el-menu-item>
          </el-menu>
        </el-aside>
        <!-- 内容主布局 -->
        <el-main
          class="bg-light"
          style="padding-bottom: 60px; position: relative"
        >
          <!-- 面包屑导航 -->
          <div
            class="border-bottom mb-3 bg-white"
            v-if="bran.length > 0"
            style="padding: 20px; margin: -20px"
          >
            <el-breadcrumb separator-class="el-icon-arrow-right">
              <el-breadcrumb-item
                v-for="(item, index) in bran"
                :key="index"
                :to="{ path: item.path }"
              >
                {{ item.title }}</el-breadcrumb-item
              >
            </el-breadcrumb>
          </div>

          <!-- 主内容 -->
          <router-view />
          <div style="height: 50px"></div>
          <!-- 返回顶部 -->
          <el-backtop target=".el-main" :bottom="100">
            <div
              style="
                height: 100%;
                width: 100%;
                background-color: #f2f5f6;
                box-shadow: 0 0 6px rgba(0, 0, 0, 0.12);
                text-align: center;
                line-height: 40px;
                color: #1989fa;
              "
            >
              up
            </div>
          </el-backtop>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import common from '@/common/mixins/common'
export default {
  name: 'layout',
  mixins: [common],
  data() {
    return {
      navBar: [],
      bran: [],
    }
  },
  created() {
    // 初始化菜单
    this.navBar = this.$conf.navBar
    //获取面包屑导航
    this.getRouterBran()
    //初始化选中菜单
    this.__initNavBar()
  },
  watch: {
    $route(to, from) {
      //本地存储
      localStorage.setItem(
        'navActive',
        JSON.stringify({
          top: this.navBar.active,
          left: this.slideMenuActive,
        })
      )
      this.getRouterBran()
    },
  },
  methods: {
    handleSelect(key, keyPath) {
      // return console.log(key);
      if( key === '100-1'){
        return console.log('修改资料');
      }
      if(key === '100-2'){
        return console.log('退出登录');
      }
      this.navBar.active = key
      //默认选中跳转到当前激活的那个
      this.slideMenuActive = '0'
      if (this.slideMenus.length > 0) {
        this.$router.push({
          name: this.slideMenus[this.slideMenuActive].pathname,
        })
      }
    },
    slideSelect(key, keyPath) {
      this.slideMenuActive = key
      //跳转到指定页面
      // console.log(this.slideMenus[key].pathname);
      this.$router.push({ name: this.slideMenus[key].pathname })
    },
    //获取面包屑导航
    getRouterBran() {
      // console.log(this.$route.matched)
      let b = this.$route.matched.filter((v) => v.name)
      let arr = []
      // console.log(b);
      b.forEach((v, k) => {
        //过滤layout和index
        if (v.name === 'index' || v.name === 'layout') return
        arr.push({
          name: v.name,
          path: v.path,
          title: v.meta.title,
        })
      })
      // console.log(arr);
      if (arr.length > 0) {
        arr.unshift({ name: 'index', path: '/index', title: '后台首页' })
      }
      this.bran = arr
      // console.log(arr)
    },
    __initNavBar() {
      //获取本地存储
      let r = localStorage.getItem('navActive')
      if (r) {
        r = JSON.parse(r)
        this.navBar.active = r.top
        this.slideMenuActive = r.left
      }
    },
  },
  computed: {
    slideMenus() {
      return this.navBar.list[this.navBar.active].submenu || []
    },

    /*slideMenuActive(){
      return this.navBar.list[this.navBar.active].subActive || '0'
    }*/

    slideMenuActive: {
      get() {
        return this.navBar.list[this.navBar.active].subActive || '0'
      },
      set(val) {
        this.navBar.list[this.navBar.active].subActive = val
      },
    },
  },
}
</script>
<style lang="less" scoped>
</style>
