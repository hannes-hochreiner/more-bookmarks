<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <BookmarkList/>
  </div>
</template>

<script>
// @ is an alias to /src
import BookmarkList from '@/components/BookmarkList.vue'

export default {
  name: 'home',
  components: {
    BookmarkList
  }
}
</script>
