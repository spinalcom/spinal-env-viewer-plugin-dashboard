<template>
  <md-content class="globalDialog">
    <md-dialog :md-active.sync="showDialog">
      <md-dialog-title>Seuil Configuration :
        <span style="color: #356BAB"
              v-if="endpointSelected">{{endpointSelected.name.get()}}</span>
      </md-dialog-title>

      <div class="viewport"
           v-if="endpointSelected">
        <md-list class="minSeuil">
          <md-subheader>Seuil Min</md-subheader>

          <md-list-item>
            <md-checkbox v-model="seuilMin.active">Active</md-checkbox>
          </md-list-item>

          <md-field md-inline
                    class="seuilValue">
            <label>Value</label>
            <md-input v-model="seuilMin.value"
                      :disabled="!seuilMin.active"
                      type="number"></md-input>
          </md-field>

        </md-list>

        <md-list class="maxSeuil">
          <md-subheader>Seuil Max</md-subheader>

          <md-list-item>
            <md-checkbox v-model="seuilMax.active">Active</md-checkbox>
          </md-list-item>

          <md-field md-inline
                    class="seuilValue">
            <label>Value</label>
            <md-input v-model="seuilMax.value"
                      type="number"
                      :disabled="!seuilMax.active"></md-input>
          </md-field>

        </md-list>

      </div>

      <md-dialog-actions>
        <md-button class="md-primary"
                   @click="hideDialog(false)">Close</md-button>
        <md-button class="md-primary"
                   @click="hideDialog(true)">Save</md-button>
      </md-dialog-actions>
    </md-dialog>
  </md-content>
</template>


<script>
export default {
  name: "seuilComponent",
  props: ["showDialog", "endpointSelected"],
  data() {
    return {
      seuilMin: null,
      seuilMax: null
    };
  },
  methods: {
    hideDialog: function(save) {
      this.$emit("hideDialog");
      if (save) {
        this.endpointSelected.seuilMin.active.set(this.seuilMin.active);
        this.endpointSelected.seuilMin.value.set(this.seuilMin.value);
        this.endpointSelected.seuilMax.active.set(this.seuilMax.active);
        this.endpointSelected.seuilMax.value.set(this.seuilMax.value);
      }
    }
  },
  watch: {
    endpointSelected: function() {
      this.seuilMin = this.endpointSelected.seuilMin.get();
      this.seuilMax = this.endpointSelected.seuilMax.get();
    }
  }
};
</script>

<style>
.globalDialog {
  width: 50%;
}

.viewport {
  width: 100%;
  padding: 10px;
}

.viewport .minSeuil {
  width: 50%;
  float: left;
}

.viewport .maxSeuil {
  width: 50%;
  float: right;
}

.viewport .seuilValue {
  width: 70%;
}
</style>
