<template>
  <div >
    <my-filelist title='图片' type='picture'></my-filelist>
  </div>
</template>

<script>
import FileList from '../components/assembly/FileList.vue'
export default {
  components:{
    'my-filelist':FileList
  }
}
</script>

