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

    <v-content v-if="vm.mode == 'init'" align="center">
      <v-progress-circular
        indeterminate
      />
    </v-content>
    <v-content v-else>
      <PathComponents
        :components="vm.pathComponents"
        @selected-component-changed="vm.selectedComponentChanged"
      />
      <v-toolbar>
        <v-toolbar-title>{{vm.title}}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-progress-circular
          v-if="vm.mode == 'working'"
          indeterminate
        />
        <v-btn
          v-if="vm.mode == 'view'"
          icon
          @click="vm.switchToReorderMode"
        >
          <v-icon>mdi-swap-vertical</v-icon>
        </v-btn>
        <v-btn
          v-if="vm.mode == 'reorder'"
          icon
          @click="vm.cancel"
        >
          <v-icon>mdi-cancel</v-icon>
        </v-btn>
        <v-btn
          v-if="vm.mode == 'reorder'"
          icon
          @click="vm.ok"
        >
          <v-icon>mdi-check</v-icon>
        </v-btn>
      </v-toolbar>
      <GroupList
        :mode="vm.mode"
        :groups="vm.groups"
        @selected-group-changed="vm.selectedGroupChanged"
        @move-group-up="vm.moveGroupUp"
        @move-group-down="vm.moveGroupDown"
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
    this.vm = this.$vmf.createViewModel('bookmarks', this.$route.params);
  },
  beforeRouteUpdate: function(to, from, next) {
    console.log(to);
    console.log(from);
    next();
  }
}
</script>
