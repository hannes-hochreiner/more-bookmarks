<template>
  <v-app>
    <router-view></router-view>
    <Messages/>
  </v-app>
</template>

<script>
import Messages from './views/Messages';

export default {
  name: 'App',
  components: {
    Messages
  },
  data: () => ({
  })
};
</script>
