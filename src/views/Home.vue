<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <TreeList/>
    <!-- <BookmarkList/> -->
  </div>
</template>

<script>
// @ is an alias to /src
// import BookmarkList from '@/components/BookmarkList.vue'
import TreeList from '@/components/TreeList.vue'

export default {
  name: 'home',
  components: {
    TreeList,
    // BookmarkList,
  }
}
</script>
