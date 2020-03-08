<template>
  <div class="authentication">
    <v-app-bar
      app
      color="primary"
      dark
    >
      <v-toolbar-title>more bookmarks</v-toolbar-title>
    </v-app-bar>
    <v-content>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="4">
            <v-card>
              <v-card-title>Authentication</v-card-title>
              <v-card-text>
                <v-text-field label="User Name" v-model="vm.userName"></v-text-field>
                <v-text-field type="password" label="Password" v-model="vm.password"></v-text-field>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text @click="vm.login">login</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
    <v-dialog cols="12" sm="8" md="4" v-model="vm.getNewPassword">
      <v-card>
        <v-card-title>New Password</v-card-title>
        <v-card-text>
          <v-text-field type="password" label="New Password" v-model="vm.newPassword"></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="vm.setNewPassword">set new password</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
export default {
  name: 'authentication',
  components: {
  },
  data: function() {
    return {
      vm: null
    };
  },
  created: function() {
    this.vm = this.$vmf.createViewModel('authentication', this.$route.params);
  },
  beforeDestroy: function() {
    this.vm.destruct();
    delete this.vm;
  }
};
</script>
