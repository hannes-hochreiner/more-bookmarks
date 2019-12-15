<template>
  <v-select
    :items="trees"
    dense
    item-text="name"
    v-model="selectedTree"
    v-on:change="selectedTreeChanged"
    return-object
  ></v-select>
</template>
<script>
export default {
  name: 'TreeSelect',
  data: () => ({
    trees: [],
    selectedTree: null
  }),
  mounted: function() {
    this.$ps.subscribe({type: 'response', action: 'treesByUserId'}, function(data) {
      this.trees = data.result;
      this.selectedTree = this.trees.find(function(elem) { return elem.default; });
      this.selectedTreeChanged();
    }.bind(this));
    this.$ps.publish({
      type: 'request',
      action: 'treesByUserId',
      id: '1',
      userId: '1'
    });
  },
  methods: {
    selectedTreeChanged: function() {
      this.$ps.publish({
        type: 'broadcast',
        action: 'selectedTreeChanged',
        selectedTree: this.selectedTree
      });
    }
  }
};
</script>