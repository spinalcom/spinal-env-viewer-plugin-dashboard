
<template>
  <div class="dashboard">

    <md-button @click="test()"
               class="md-icon-button">
      <md-icon>add</md-icon>
    </md-button>

    <endpoint-global-component @select_endpoint="on_item_selected"
                               :deviceNode="deviceNodes"></endpoint-global-component>

    <graph-component :endpointSelected="endpointSelected"></graph-component>

    <!-- <md-list>
        <device-component @itemSelected="on_item_selected"
                          :devices="devicesList"></device-component>
      </md-list>

      <p>{{item_selected}}</p> -->

  </div>
</template>

<script>
const globalType = typeof window === "undefined" ? global : window;
var spinalSystem;
var viewer;
var EventBus;
var graph;
var appName = "smartConnector3";
import endpointGlobalComponent from "./components/endpointGlobalComponent.vue";
import graphComponent from "./components/graphComponent.vue";
export default {
  name: "dashboard",
  data() {
    return {
      contextList: null,
      inc: 0,
      deviceNodes: null,
      endpointSelected: null
      // item_selected: null
    };
  },
  components: { endpointGlobalComponent, graphComponent },
  methods: {
    test: function() {
      console.log(this.deviceNodes);
    },
    on_item_selected: function(item) {
      this.endpointSelected = item;
    },
    getEvents: function() {},
    linkToDB: function() {
      let interval = setInterval(() => {
        if (
          typeof globalType.spinal.contextStudio != "undefined" &&
          typeof globalType.spinal.contextStudio.graph != "undefined"
        ) {
          graph = globalType.spinal.contextStudio.graph;

          graph.getApp(appName).then(el => {
            this.deviceNodes = el.startingNode.getChildrenByAppByRelation(
              appName,
              "hasDevice"
            )[2];
          });
          clearInterval(interval);
        }
      }, 500);
    }
  },
  mounted() {
    spinalSystem = globalType.spinal.spinalSystem;
    viewer = globalType.v;
    EventBus = globalType.spinal.eventBus;
    this.getEvents();
    this.linkToDB();
  }
};
</script>

<style scoped>
.dashboard {
  height: calc(100% - 35px);
}

dashboard .md-icon-button {
  width: 100%;
  height: 20px;
}

.md-toolbar.md-dense {
  min-height: 30px !important;
}

.dashboard .md-toolbar {
  height: 20px;
  min-height: 20px;
}

.dashboard .md-title {
  font-size: 15px;
}
</style>
