<template>
  <v-dialog v-model="dialog" scrollable>
      <template v-slot:activator="{ on }">
        <v-btn icon v-on="on">
          <v-icon>mdi-bookmark-plus-outline</v-icon>
        </v-btn>
      </template>
      <v-card>
        <v-card-title>Create Bookmark</v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-text-field label="Name" v-model="name"></v-text-field>
          <v-text-field label="URL" v-model="url"></v-text-field>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn icon @click="dialog = false">
            <v-icon>mdi-cancel</v-icon>
          </v-btn>
          <v-btn icon @click="createBookmark">
            <v-icon>mdi-check</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
  </v-dialog>
</template>
<script>
export default {
  name: 'BookmarkCreateDialog',
  data: function() {
    return {
      dialog: false,
      name: '',
      url: ''
    }
  },
  beforeMount: function() {
    this.updateValues();
  },
  afterUpdate: function() {
    this.updateValues();
  },
  methods: {
    updateValues: function() {
      this.name = '';
      this.url = '';
    },
    createBookmark: function() {
      this.$emit('create-bookmark', {
        name: this.name,
        url: this.url
      });
      this.dialog = false;
    }
  }
};
</script>
