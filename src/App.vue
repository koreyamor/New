<template>
  <div id="app">
    <router-view />
    <image-dialog ref="imageDialog" :max="maxChooseImage"></image-dialog>
  

  </div>
</template>

<script>
import imageDialog from '@/components/image/image-dialog.vue';
export default {
  // 依赖注入
  provide() {
    return {
      app: this,
    }
  },
  data(){
    return{
      maxChooseImage:9
    }
  },
  methods:{
    chooseImage(callback,max = 9){
      this.maxChooseImage = max
      this.$refs.imageDialog.chooseImage(callback)
    }
  },
  components:{
    imageDialog
  }
}
</script>



<style lang="less">
//滚动条样式
::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 0;
}

::-webkit-scrollbar {
  -webkit-appearance: none;
  width: 10px;
  height: 10px;
}

::-webkit-scrollbar-thumb {
  cursor: pointer;
  border-radius: 5px;
  background: rgba(0, 0, 0, 0.25);
  transition: color 0.2s ease;
}
</style>
