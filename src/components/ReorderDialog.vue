<template>
  <v-dialog v-model="dialog" scrollable>
      <template v-slot:activator="{ on }">
        <v-btn icon v-on="on" @click.prevent>
          <v-icon>mdi-swap-vertical</v-icon>
        </v-btn>
      </template>
      <v-card>
        <v-card-title>Reorder Groups and Bookmarks</v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-list>
            <v-list-item v-for="(group, idx) in newGroups" :key="group.id">
              <v-list-item-icon><v-icon>mdi-folder</v-icon></v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title v-text="group.name"></v-list-item-title>
              </v-list-item-content>
              <v-list-item-action>
                <v-toolbar flat dense>
                  <v-btn icon @click="moveElementAtIndexUp(newGroups, idx)" v-if="idx > 0">
                    <v-icon>mdi-chevron-up</v-icon>
                  </v-btn>
                  <v-btn icon @click="moveElementAtIndexDown(newGroups, idx)" v-if="idx < newGroups.length - 1">
                    <v-icon>mdi-chevron-down</v-icon>
                  </v-btn>
                </v-toolbar>
              </v-list-item-action>
            </v-list-item>
          </v-list>
          <v-list>
            <v-list-item v-for="(bookmark, idx) in newBookmarks" :key="bookmark.id">
              <v-list-item-icon><v-icon>mdi-bookmark</v-icon></v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title v-text="bookmark.name"></v-list-item-title>
              </v-list-item-content>
              <v-list-item-action>
                <v-toolbar flat dense>
                  <v-btn icon @click="moveElementAtIndexUp(newBookmarks, idx)" v-if="idx > 0">
                    <v-icon>mdi-chevron-up</v-icon>
                  </v-btn>
                  <v-btn icon @click="moveElementAtIndexDown(newBookmarks, idx)" v-if="idx < newBookmarks.length - 1">
                    <v-icon>mdi-chevron-down</v-icon>
                  </v-btn>
                </v-toolbar>
              </v-list-item-action>
            </v-list-item>
          </v-list>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn icon @click="dialog = false">
            <v-icon>mdi-cancel</v-icon>
          </v-btn>
          <v-btn icon @click="reorderGroupsBookmarks">
            <v-icon>mdi-check</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
  </v-dialog>
</template>
<script>
export default {
  name: 'GroupEditDialog',
  props: [
    'groups',
    'bookmarks'
  ],
  data: function() {
    return {
      dialog: false,
      newGroups: [],
      newBookmarks: []
    }
  },
  watch: {
    groups: 'updateValues',
    bookmarks: 'updateValues'
  },
  methods: {
    updateValues: function() {
      this.newGroups = Array.from(this.groups);
      this.newBookmarks = Array.from(this.bookmarks);
    },
    reorderGroupsBookmarks: function() {
      this.$emit('reorder-groups-bookmarks', {
        groups: this.newGroups,
        bookmarks: this.newBookmarks
      });
    },
    moveElementAtIndexUp: function(collection, idx) {
      collection.splice(idx - 1, 0, collection.splice(idx, 1)[0]);
    },
    moveElementAtIndexDown: function(collection, idx) {
      collection.splice(idx + 1, 0, collection.splice(idx, 1)[0]);
    },
  }
};
</script>
