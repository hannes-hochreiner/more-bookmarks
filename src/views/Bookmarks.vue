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
        @selected-tree-changed="selectedTreeChanged"
      />
    </v-app-bar>

    <v-content v-if="vm.mode == 'init'" align="center">
      <v-progress-circular
        indeterminate
      />
    </v-content>
    <v-content v-else>
      <v-toolbar>
        <v-btn icon v-if="vm.parent" :to="vm.parent.type == 'tree' ? `/tree/${vm.parent.id}` : `/tree/${vm.parent.treeId}/group/${vm.parent.id}`">
          <v-icon>mdi-arrow-up</v-icon>
        </v-btn>
        <v-toolbar-title>{{vm.title}}</v-toolbar-title>
        <v-spacer></v-spacer>
        <GroupCreateDialog v-if="vm.mode == 'view'" @create-group="vm.createGroup"/>
        <BookmarkCreateDialog v-if="vm.mode == 'view'" @create-bookmark="vm.createBookmark"/>
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
        @move-group-up="vm.moveGroupUp"
        @move-group-down="vm.moveGroupDown"
        @delete-group="vm.deleteGroup"
        @update-group="vm.updateGroup"
      />
      <BookmarkList
        :bookmarks="vm.bookmarks"
        @update-bookmark="vm.updateBookmark"
        @delete-bookmark="vm.deleteBookmark"
      />
    </v-content>
  </div>
</template>

<script>
import TreeSelect from '../components/TreeSelect.vue'
import GroupList from '../components/GroupList.vue'
import BookmarkList from '../components/BookmarkList.vue'
import GroupCreateDialog from '../components/GroupCreateDialog.vue'
import BookmarkCreateDialog from '../components/BookmarkCreateDialog.vue'

export default {
  name: 'bookmarks',
  components: {
    GroupList,
    BookmarkList,
    TreeSelect,
    GroupCreateDialog,
    BookmarkCreateDialog
  },
  data: function() {
    return {
      vm: null
    };
  },
  created: function() {
    this.vm = this.$vmf.createViewModel('bookmarks', this.$route.params);
  },
  watch: {
    '$route': 'parametersChanged'
  },
  methods: {
    parametersChanged: function(to) {
      this.vm.parametersChanged(to.params);
    },
    selectedTreeChanged: function(tree) {
      this.$router.push(`/tree/${tree.id}`);
    }
  }
}
</script>
