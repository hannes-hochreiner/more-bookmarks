<template>
  <v-list>
    <v-subheader>Bookmarks</v-subheader>
    <v-list-item v-for="bookmark in bookmarks" :key="bookmark.id" :href="bookmark.url">
      <v-list-item-content>
        <v-list-item-title v-text="bookmark.name"></v-list-item-title>
      </v-list-item-content>
    </v-list-item>
  </v-list>
</template>
<script>
export default {
  name: 'BookmarkList',
  props: [
    'bookmarks'
  ]
};
</script>