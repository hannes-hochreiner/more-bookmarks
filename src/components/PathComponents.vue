<template>
  <v-chip-group>
    <v-chip
      v-for="(component, idx) in components"
      :key="component.id"
      :disabled="idx + 1 === components.length"
      :value="component"
      @click="$emit('selected-component-changed', component)"
    >
      {{component.name}}
    </v-chip>
  </v-chip-group>
</template>
<script>
export default {
  name: 'PathComponents',
  props: ['components']
};
</script>