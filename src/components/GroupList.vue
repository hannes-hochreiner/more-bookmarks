<template>
  <v-list>
    <v-list-item
      two-line
      v-for="(group, idx) in groups"
      :key="group.id"
      :to="`/tree/${group.treeId}/group/${group.id}`"
    >
      <v-list-item-icon>
        <v-icon>mdi-folder</v-icon>
      </v-list-item-icon>
      <v-list-item-content>
        <v-list-item-title v-text="group.name">
        </v-list-item-title>
        <v-list-item-subtitle>
          <v-chip small class="ma-2"><v-avatar left><v-icon>mdi-folder-outline</v-icon></v-avatar>{{group.groupIds.length}}</v-chip>
          <v-chip small class="ma-2"><v-avatar left><v-icon>mdi-bookmark-outline</v-icon></v-avatar>{{group.bookmarkIds.length}}</v-chip>
        </v-list-item-subtitle>
      </v-list-item-content>
      <v-list-item-action v-if="mode == 'reorder'">
        <v-btn icon @click="$emit('move-group-up', group)" v-if="idx > 0">
          <v-icon>mdi-chevron-up</v-icon>
        </v-btn>
        <v-btn icon @click="$emit('move-group-down', group)" v-if="idx < groups.length - 1">
          <v-icon>mdi-chevron-down</v-icon>
        </v-btn>
      </v-list-item-action>
    </v-list-item>
  </v-list>
</template>
<script>
export default {
  name: 'GroupList',
  props: [
    'groups',
    'mode'
  ],
};
</script>