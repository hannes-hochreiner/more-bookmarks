<template>
  <v-list>
    <v-subheader>Groups</v-subheader>
    <v-list-item
      v-for="group in groups"
      :key="group.id"
      @click="$emit('selected-group-changed', group)"
    >
      <v-list-item-content>
        <v-list-item-title v-text="group.name"></v-list-item-title>
      </v-list-item-content>
    </v-list-item>
  </v-list>
</template>
<script>
export default {
  name: 'GroupList',
  props: [
    'groups'
  ]
};
</script>