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
    this.$ps.subscribe({type: 'response', action: 'treesByUserId'}, function(data) {
      this.trees = data.result;
    }.bind(this));
    this.$ps.publish({
      type: 'request',
      action: 'treesByUserId',
      id: '1',
      userId: '1'
    });
  }
};
</script>