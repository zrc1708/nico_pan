<template>
  <div >
    <my-filelist title='文档' type='document'></my-filelist>
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

