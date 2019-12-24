<template>
  <v-list>
    <v-list-item
      two-line
      v-for="bookmark in bookmarks"
      :key="bookmark.id"
      :href="bookmark.url"
    >
      <v-list-item-icon>
        <v-icon>mdi-bookmark</v-icon>
      </v-list-item-icon>
      <v-list-item-content>
        <v-list-item-title v-text="bookmark.name"></v-list-item-title>
        <v-list-item-subtitle>{{bookmark.url}}</v-list-item-subtitle>
      </v-list-item-content>
      <v-list-item-action>
        <v-toolbar flat dense>
          <BookmarkEditDialog :bookmark="bookmark" @update-bookmark="$emit('update-bookmark', $event)"/>
          <v-btn icon>
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </v-toolbar>
      </v-list-item-action>
    </v-list-item>
  </v-list>
</template>
<script>
import BookmarkEditDialog from './BookmarkEditDialog';

export default {
  name: 'BookmarkList',
  components: {
    BookmarkEditDialog
  },
  props: [
    'bookmarks'
  ],
};
</script>