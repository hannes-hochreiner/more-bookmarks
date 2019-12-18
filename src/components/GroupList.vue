<template>
  <v-list>
    <v-subheader>Groups</v-subheader>
    <v-list-item v-for="group in groups" :key="group.id" v-on:click="click(group)">
      <v-list-item-content>
        <v-list-item-title v-text="group.name"></v-list-item-title>
      </v-list-item-content>
    </v-list-item>
  </v-list>
</template>
<script>
export default {
  name: 'GroupList',
  data: () => ({
    groups: []
  }),
  mounted: function() {
    this.$ps.subscribe({type: 'broadcast', action: 'selectedTreeChanged'}, this.updateGroups.bind(this));
    this.$ps.subscribe({type: 'broadcast', action: 'selectedGroupChanged'}, this.updateGroups.bind(this));
    this.$ps.subscribe({type: 'response', action: 'groupsByIds'}, function(data) {
      this.groups = data.result;
    }.bind(this));
  },
  methods: {
    updateGroups: function(data) {
      let groupIds, treeId;

      if (data.action == 'selectedTreeChanged') {
        groupIds = data.selectedTree.groupIds;
        treeId = data.selectedTree.id;
      } else {
        groupIds = data.selectedGroup.groupIds;
        treeId = data.selectedGroup.treeId;
      }

      this.$ps.publish({
        type: 'request',
        action: 'groupsByIds',
        groupIds: groupIds,
        treeId: treeId
      });
    },
    click: function(group) {
      let msg = {
        type: 'broadcast',
        action: 'selectedGroupChanged',
        selectedGroup: group
      };

      this.updateGroups(msg);
      this.$ps.publish(msg);
    }
  }
};
</script>