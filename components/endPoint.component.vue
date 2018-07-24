<template>

  <md-list-item class="endPointComponent">
    <p>{{endpoint.name.get()}}</p>
  </md-list-item>

</template>


<script>
export default {
  name: "endpoint",
  components: {},
  props: ["endpoint"]
};
</script>
