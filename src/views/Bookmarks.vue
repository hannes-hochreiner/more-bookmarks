<template>
  <div class="bookmarks">
    <v-app-bar
      app
      color="primary"
      dark
    >
      <v-spacer></v-spacer>
      <TreeSelect
        :trees="vm.trees"
        :selectedTree="vm.selectedTree"
        @selected-tree-changed="vm.selectedTreeChanged"
      />
    </v-app-bar>

    <v-content>
      <PathComponents
        :components="vm.pathComponents"
        @selected-component-changed="vm.selectedComponentChanged"
      />
      <GroupList
        :groups="vm.groups"
        @selected-group-changed="vm.selectedGroupChanged"
      />
      <BookmarkList
        :bookmarks="vm.bookmarks"
      />
    </v-content>
  </div>
</template>

<script>
import TreeSelect from '../components/TreeSelect.vue'
import GroupList from '../components/GroupList.vue'
import BookmarkList from '../components/BookmarkList.vue'
import PathComponents from '../components/PathComponents.vue'

export default {
  name: 'bookmarks',
  components: {
    GroupList,
    BookmarkList,
    TreeSelect,
    PathComponents
  },
  data: function() {
    return {
      vm: null
    };
  },
  created: function() {
    this.vm = this.$vmf.createViewModel('bookmarks');
  }
}
</script>
