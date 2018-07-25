<template>
  <h1>
    {{endpointS}}
  </h1>
</template>


<script>
export default {
  name: "graphComponent",
  components: {},
  props: ["endpointSelected"],
  data() {
    return {};
  },
  methods: {},
  computed: {
    endpointS: function() {
      if (this.endpointSelected) {
        return this.endpointSelected.name;
      }
      return "";
    }
  }
};
</script>


<style>
</style>
