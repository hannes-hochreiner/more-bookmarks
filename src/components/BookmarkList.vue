<template>
  <v-list>
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
    let bc = new BroadcastChannel('net.hochreiner.more-bookmarks');
    bc.onmessage = function(event) {
      if (event.data.type == 'response' && event.data.action == 'bookmarksByUserId') {
        this.bookmarks = event.data.result;
      }
    }.bind(this);
    bc.postMessage({
      type: 'request',
      action: 'bookmarksByUserId',
      id: '1',
      userId: '1'
    });
  }
};
</script>