<template>
  <v-dialog v-model="dialog" scrollable>
      <template v-slot:activator="{ on }">
        <v-btn icon v-on="on">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
      </template>
      <v-card>
        <v-card-title>Edit Group</v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-text-field label="Name" v-model="name"></v-text-field>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn icon @click="dialog = false">
            <v-icon>mdi-cancel</v-icon>
          </v-btn>
          <v-btn icon @click="updateGroup">
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
    'group',
  ],
  data: function() {
    return {
      dialog: false,
      name: ''
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
      this.name = this.$props.group.name;
    },
    updateGroup: function() {
      this.$emit('update-group', {
        name: this.name,
      });
      this.dialog = false;
    }
  }
};
</script>
