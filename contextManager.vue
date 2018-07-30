
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
            console.log(el);
            // if (typeof el.startingNode != "undefined")
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

/* .dashboard .md-toolbar {
  height: 20px;
  min-height: 20px;
}

.dashboard .md-title {
  font-size: 15px;
} */
</style>

<style>
/* .dashboard button.md-icon-button.md-button.md-theme-default {
  min-width: 20px;
  width: 20px;
  height: 20px;
}

.dashboard .md-toolbar {
  height: 20px;
  min-height: 20px;
}

.dashboard .md-title {
  font-size: 15px;
}

.dashboard .md-list,
.md-list *,
.md-button,
.md-button * {
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  padding-right: 0px;
  padding-top: 0px;
  padding-bottom: 0px;
  padding-left: 0px;
}

.dashboard i.md-icon.md-icon-font.md-theme-default {
  font-size: 18px !important;
}

.dashboard span {
  font-size: 14px;
}

.dashboard .md-ripple.md-list-item-content {
  min-height: 0px;
  font-size: 14px;
  box-sizing: border-box;
}

.small-menu * {
  min-height: 0px;
  font-size: 14px;
  box-sizing: border-box;
} */
</style>
