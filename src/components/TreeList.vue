<template>
  <v-list>
    <v-list-item v-for="tree in trees" :key="tree.id">
      <v-list-item-content>
        <v-list-item-title v-text="tree.name"></v-list-item-title>
      </v-list-item-content>
    </v-list-item>
  </v-list>
</template>
<script>
export default {
  name: 'TreeList',
  data: () => ({
    trees: []
  }),
  mounted: function() {
    console.log('mounted');
    let bc = new BroadcastChannel('net.hochreiner.more-bookmarks');
    bc.onmessage = function(event) {
      if (event.data.type == 'response' && event.data.action == 'treesByUserId') {
        this.trees = event.data.result;
      }
    }.bind(this);
    bc.postMessage({
      type: 'request',
      action: 'treesByUserId',
      id: '1',
      userId: '1'
    });
  }
};
</script>