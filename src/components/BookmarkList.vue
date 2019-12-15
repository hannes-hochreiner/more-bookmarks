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
  data: () => ({
    bookmarks: []
  }),
  mounted: function() {
    this.$ps.subscribe({type: 'broadcast', action: 'selectedTreeChanged'}, this.updateBookmarks.bind(this));
    this.$ps.subscribe({type: 'response', action: 'bookmarksByIds'}, function(data) {
      this.bookmarks = data.result;
    }.bind(this));
  },
  methods: {
    updateBookmarks: function(data) {
      console.log(data);
      this.$ps.publish({
        type: 'request',
        action: 'bookmarksByIds',
        bookmarkIds: data.selectedTree.bookmarkIds,
        treeId: data.selectedTree.id
      });
    }
  }
};
</script>