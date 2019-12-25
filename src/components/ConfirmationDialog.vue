<template>
  <v-dialog v-model="dialog" scrollable>
      <template v-slot:activator="{on}">
        <v-btn icon v-on="on" @click.prevent>
          <v-icon>{{icon}}</v-icon>
        </v-btn>
      </template>
      <v-card>
        <v-card-title>{{title}}</v-card-title>
        <!-- <v-divider></v-divider> -->
        <v-card-text>{{text}}</v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn icon @click="dialog = false">
            <v-icon>mdi-cancel</v-icon>
          </v-btn>
          <v-btn icon @click="$emit('confirmed')">
            <v-icon>mdi-check</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
  </v-dialog>
</template>
<script>
export default {
  name: 'BookmarkEditDialog',
  props: [
    'title',
    'text',
    'icon'
  ],
  data: function() {
    return {
      dialog: false,
    }
  },
};
</script>
