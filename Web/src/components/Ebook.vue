<template>
  <div >
    <my-filelist title='电子书' type='ebook'></my-filelist>
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

