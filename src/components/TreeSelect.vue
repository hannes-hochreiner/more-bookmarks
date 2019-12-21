<template>
  <v-select
    :items="trees"
    dense
    item-text="name"
    :value="selectedTree"
    @change="$emit('selected-tree-changed', $event)"
    return-object
  ></v-select>
</template>
<script>
export default {
  name: 'TreeSelect',
  props: ['trees', 'selectedTree'],
};
</script>