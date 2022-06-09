<template>
  <el-dialog title="图片管理" :visible.sync="imageModel" width="80%" top="5vh">
    <el-container style="position: relative; height: 70vh; margin: -30px -20px">
      <!-- 头部 -->
      <el-header class="d-flex align-items-center border-bottom">
        <div class="d-flex mr-auto">
          <el-select
            class="mr-2"
            v-model="searchForm.order"
            placeholder="请选择图片排序方式"
            size="mini"
            style="width: 180px"
          >
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
          <el-input
            class="mr-2"
            size="mini"
            style="width: 250px"
            v-model="searchForm.keyword"
            placeholder="输入相册名称"
          ></el-input>
          <el-button type="success" size="mini">搜索</el-button>
        </div>
        <el-button
          type="warning"
          size="mini"
          @click="unChoose"
          v-if="chooseList.length"
          >取消选中</el-button
        >
      </el-header>
      <el-container>
        <!-- 侧边 相册列表-->
        <el-aside
          width="200px"
          style="position: absolute; top: 60px; bottom: 60px; left: 0"
          class="bg-white border-right"
        >
          <ul class="list-group list-group-flush">
            <ablumItem
              v-for="(item, index) in albums"
              :key="index"
              :item="item"
              :index="index"
              :active="albumIndex === index"
              @change="albumChange"
              :showOption="false"
            ></ablumItem>
          </ul>
        </el-aside>
        <el-container>
          <!-- 内容主体 -->
          <el-main
            style="
              position: absolute;
              top: 60px;
              bottom: 60px;
              left: 200px;
              right: 0;
            "
          >
            <el-row :gutter="10">
              <el-col
                :span="24"
                :lg="4"
                :md="6"
                :sm="8"
                v-for="(item, index) in imageList"
                :key="index"
              >
                <el-card
                  class="box-card mb-3 position-relative"
                  :body-style="{ padding: 0 }"
                  shadow="hover"
                  style="cursor: pointer"
                >
                  <!-- 图片选中边框 -->
                  <div
                    class="border"
                    :class="{ 'border-danger': item.ischeck }"
                  >
                    <span
                      class="badge badge-danger"
                      style="position: absolute; right: 0; top: 0"
                      v-if="item.ischeck"
                    >
                      {{ item.checkOrder }}
                    </span>
                    <img
                      :src="item.url"
                      class="w-100"
                      style="height: 100px"
                      @click="chooser(item)"
                    />
                    <div
                      class="w-100 text-white px-1"
                      style="
                        background: rgba(0, 0, 0, 0.5);
                        margin-top: -25px;
                        position: absolute;
                      "
                    >
                      <span class="small"> {{ item.name }}</span>
                    </div>

                    <div class="p-2 text-center">
                      <el-button-group>
                        <el-button
                          icon="el-icon-edit"
                          size="mini"
                          class="p-2"
                          @click="imageEdit(item, index)"
                        ></el-button>
                        <el-button
                          icon="el-icon-delete"
                          size="mini"
                          class="p-2"
                          @click="imageDel({ index })"
                        ></el-button>
                      </el-button-group>
                    </div>
                  </div>
                </el-card>
              </el-col>
            </el-row>
          </el-main>
        </el-container>
      </el-container>
      <!-- 底部 -->
      <el-footer class="d-flex border-top align-items-center px-0">
        <!-- 左边上下页 -->
        <div
          class="
            h-100
            d-flex
            align-items-center
            justify-content-center
            border-right
          "
          style="width: 200px; flex-shrink: 0"
        >
          <el-button size="mini">上一页</el-button>
          <el-button size="mini">下一页</el-button>
        </div>
        <!-- 右边分页 -->
        <div style="flex: 1" class="px-2">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[100, 200, 300, 400]"
            :page-size="100"
            layout="total, sizes, prev, pager, next, jumper"
            :total="400"
          >
          </el-pagination>
        </div>
      </el-footer>
    </el-container>
    <div slot="footer" class="dialog-footer">
      <el-button @click="hide">取 消</el-button>
      <el-button type="primary" @click="confirm">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import ablumItem from '@/components/image/album-item.vue'

export default {
  props: {
    //选中数量限制
    max: {
      type: Number,
      default: 9,
    },
  },
  data() {
    return {
      imageModel: false,
      callback: false,
      searchForm: {
        order: '',
        keyword: '',
      },
      //当前选中的相册
      albumIndex: 0,
      //   相册
      albums: [],
      imageList: [],
      //选中的数组
      chooseList: [],
      //分页默认选中
      currentPage: 1,
    }
  },
  created() {
    this.__init()
  },
  methods: {
    //打开弹出层
    chooseImage(callback) {
      //  取消选中
      this.unChoose()
      this.callback = callback
      this.imageModel = true
    },
    // 确定
    confirm() {
      //选中的图片url
      if (typeof this.callback === 'function') {
        this.callback(this.chooseList)
      }
      //隐藏
      this.hide()
    },
    //关闭弹出层
    hide() {
      this.imageModel = false
      this.callback = false
    },
    __init() {
      for (let i = 0; i < 20; i++) {
        this.albums.push({
          name: '相册' + i,
          num: Math.floor(Math.random() * 100),
          order: 0,
        })
      }
      for (var i = 0; i < 30; i++) {
        this.imageList.push({
          id: i,
          url: 'https://tangzhe123-com.oss-cn-shenzhen.aliyuncs.com/Appstatic/qsbk/demo/datapic/40.jpg',
          name: '图片' + i,
          ischeck: false,
          checkOrder: 0,
        })
      }
    },
    //切换相册
    albumChange(index) {
      this.albumIndex = index
    },
    //修改图片名称
    imageEdit(item, index) {
      this.$prompt('请输入新名称', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        //输入框的初始文本
        inputValue: item.name,
        inputValidator(val) {
          if (val === '') {
            return '图片名称不能为空'
          }
        },
      }).then(({ value }) => {
        item.name = value
        this.$message({
          message: '修改成功',
          type: 'success',
        })
      })
    },
    //删除图片
    imageDel(obj) {
      this.$confirm(obj.all ? '是否删除选中图片?' : '是否删除该图片?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        if (obj.all) {
          let list = this.imageList.filter((img) => {
            return !this.chooseList.some((c) => {
              return c.id === img.id
            })
          })
          // console.log(list)
          this.imageList = list
          this.chooseList = []
        }
        this.imageList.splice(obj.index, 1)
        this.$message({
          type: 'success',
          message: '删除成功!',
        })
      })
    },
    //选中图片
    chooser(item) {
      if (!item.ischeck) {
        //限制选中数量
        if (this.chooseList.length >= this.max) {
          return this.$message({
            message: '最多选择' + this.max + '张图片',
            type: 'warning',
          })
        }
        //   item.ischeck = !item.ischeck
        //   加入选中
        this.chooseList.push({
          id: item.id,
          url: item.url,
        })
        //计算序号
        item.checkOrder = this.chooseList.length
        //修改状态
        item.ischeck = true
        return
      }
      //取消选中 找到chooseList中的索引，删除
      let i = this.chooseList.findIndex((v) => v.id === item.id)
      if (i === -1) return
      //重新计算序号
      let length = this.chooseList.length
      //取消选中中间部分
      if (i + 1 < length) {
        //重新计算ImageList选中序号
        for (var j = i; j < length; j++) {
          let no = this.imageList.findIndex(
            (v) => v.id === this.chooseList[j].id
          )
          if (no > -1) {
            this.imageList[no].checkOrder--
          }
        }
      }
      //删除
      this.chooseList.splice(i, 1)
      //修改状态
      item.ischeck = false
      //重置序号
      item.checkOrder = 0
    },
    //取消选中
    unChoose() {
      this.imageList.forEach((img) => {
        //找到所有选中的图片
        let i = this.chooseList.findIndex((item) => {
          return item.id === img.id
        })
        if (i > -1) {
          //取消选中样式，选中排序归0
          img.ischeck = false
          img.checkOrder = 0
          //从chooseList中移除
          this.chooseList.splice(i, 1)
        }
      })
    },
    //批量删除
    // imageDelAll() {
    //   this.$confirm('是否删除选中图片', '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning',
    //   }).then(() => {
    //     let list = this.imageList.filter((img) => {
    //       return !this.chooseList.some((c) => {
    //         return c.id === img.id
    //       })
    //     })
    //     // console.log(list)
    //     this.imageList = list
    //     this.chooseList = []
    //     this.$message({
    //       type: 'success',
    //       message: '删除成功!',
    //     })
    //   })
    // },
    //右边分页
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
    },
  },

  components: {
    ablumItem,
  },
}
</script>

<style>
</style>