<template>
  <v-snackbar :color="vm.type" v-model="vm.show" :timeout="vm.timeout">
    {{ vm.text }}
    <v-btn icon @click="vm.show = false">
      <v-icon>mdi-close</v-icon>
    </v-btn>
  </v-snackbar>
</template>
<script>
export default {
  name: 'Messages',
  data: function() {
    return {
      vm: null
    };
  },
  created: function() {
    this.vm = this.$vmf.createViewModel('messages');
  },
};
</script>