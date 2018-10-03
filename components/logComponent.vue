<template>

  <md-content class="logContent"
              :class="{selected: isEndpointSelected()}"
              :style="divStyle"
              @click="selectEndpoint">

    <!-- one_item : itemCount == 1,two_item : itemCount == 2,three_item : itemCount == 3, four_item : itemCount == 4 , five_item : itemCount == 5, six_item :itemCount == 6 -->
    <div v-if="endpoint"
         class="logClass">
      <div class="name"
           :title="endpoint.name">
        {{endpoint.name}}
      </div>

      <div class="message"
           :title="endpoint.message">
        {{ endpoint.message }}
      </div>

      <div class="date">
        <div class="date_item">
          <span title="maximum value"
                class="title">Max Value :</span>
          <span class="value"
                :title="endpoint.value">{{endpoint.value}}</span>
        </div>
        <div class="date_item">
          <span title="Begin"
                class="title">Begin :</span>
          <span class="value"
                :title="formatDate(endpoint.end)">{{formatDate(endpoint.begin)}}</span>
        </div>
        <div class="date_item">
          <span title="End"
                class="title">End :</span>
          <span class="value"
                :title="formatDate(endpoint.end)">{{formatDate(endpoint.end)}}</span>
        </div>
      </div>
      <!--   <div class="btnGroup">
        <md-button v-for="icon in iconsItems"
                   :key="icon.iconName"
                   class="md-icon-button md-dense"
                   :title="icon.title"
                   @click="icon.clickMethod">
          <md-icon>
            {{icon.iconName}}
          </md-icon>
        </md-button>

        <md-button v-if="displayAlarmIcon()"
                   @click="activeAlarmMode"
                   class="alarmMode md-icon-button md-dense"
                   title="Alarm">
          <md-icon>error_outline</md-icon>
        </md-button>

      </div> -->
    </div>

  </md-content>

</template>


<script>
const globalType = typeof window === "undefined" ? global : window;
import chartComponent from "./chartComponent.vue";
import seuilComponent from "./configureSeuilDialog.vue";

var getInfo = require("../classes/getInfo.js");
var getInfoInstance = new getInfo.GetInformation();
var viewer;

export default {
  name: "logComponent",
  components: { chartComponent },
  props: ["endpointNode", "logNodes", "endpointSelected"],
  data() {
    return {
      endpoint: null,
      log: null,
      mouseOver: false,
      itemCount: 2
    };
  },
  computed: {
    divStyle() {
      return {
        width: "calc((100% /" + this.itemCount + ") - 24px)"
      };
    }
  },
  methods: {
    selectEndpoint: function() {
      this.$emit("selectEndpoint", this.endpointNode);
    },
    getLogElement: function() {
      var _self = this;

      this.endpointNode.getElement().then(el => {
        el.bind(() => {
          if (el.constructor.name == "SpinalLog")
            _self.endpoint = getInfoInstance.getLogDetail(el);
        });
      });
    },
    isEndpointSelected: function() {
      if (this.endpointNode && this.endpointSelected) {
        if (this.endpointNode.id.get() == this.endpointSelected.id.get()) {
          return true;
        }
      }
      return false;
    },
    formatDate: function(date) {
      var t = new Date(date);
      return (
        t.getDate() +
        "/" +
        (t.getMonth() + 1) +
        "/" +
        t.getFullYear() +
        " at " +
        t.getHours() +
        ":" +
        t.getMinutes() +
        ":" +
        t.getSeconds()
      );
    }
  },
  mounted() {
    var _self = this;
    if (this.endpointNode) {
      this.getLogElement();
    }

    viewer = globalType.v;

    globalType.spinal.eventBus.$on("itemCountPerLineChange", el => {
      _self.itemCount = el;
    });
  },
  watch: {
    endpointNode: function() {
      this.getLogElement();
    }
  }
};
</script>

<style scoped>
.md-content .logContent {
  /* width: 85px !important; */
  height: 230px;
  display: inline-block;
  justify-content: center;
  padding: 7px;
  margin: 5px;
  background: #242424;
}

.md-content .selected {
  background: #356bab;
}

.md-content .logContent:hover {
  background: #58595b;
  cursor: pointer;
}

.md-content .selected:hover {
  background: #356bab;
}

/* .md-content .logContent .endpoint_name {
  width: 100%;
  height: 20%;
  text-align: center;
  padding-top: 5px;
  font-size: 1em;
  text-transform: capitalize;
} */

.md-content .logContent .logClass {
  width: 100%;
  height: 100%;
  display: block;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.md-content .logContent .logClass .name {
  width: 100%;
  height: 20%;
  text-align: center;
  font-size: 12px;
  text-transform: uppercase;
  font-weight: bold;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.md-content .logContent .logClass .message {
  width: 100%;
  height: 50%;
  min-height: 20px;
  color: #f68204;
  align-items: center;
  padding-top: 8px;
  text-align: center;
  text-transform: uppercase;
  white-space: normal;
  text-overflow: ellipsis;
  overflow: hidden;
  font-size: 13px;
}

.md-content .logContent .logClass .date {
  width: 100%;
  height: 20%;
}

.md-content .logContent .logClass .date .date_item {
  width: 100%;
}

.md-content .logContent .logClass .date .date_item span.title {
  width: 50%;
  float: left;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

.md-content .logContent .logClass .date .date_item span.value {
  width: 50%;
  float: right;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  color: #f68204;
}
</style>
