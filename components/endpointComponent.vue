<template>

  <md-content class="endpointContent"
              @click="selectEndpoint(endpoint)">{{endpoint.name}}</md-content>

</template>


<script>
const globalType = typeof window === "undefined" ? global : window;

export default {
  name: "endpointComponent",
  components: {},
  props: ["endpoint"],
  data() {
    return {};
  },
  methods: {
    selectEndpoint: function(endpoint) {
      this.$emit("selectEndpoint", endpoint);
    }
  }
};
</script>

<style lang="scss" scoped>
.md-content .endpointContent {
  width: 100px;
  height: 100px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
}

.md-content .endpointContent:hover {
  background: gray;
  cursor: pointer;
}
</style>
