var GetInformation = class GetInformation extends Model {
  constructor() {
    super();
  }



  verifyEndpointFormat(device) {
    if (typeof device.seuilMin == "undefined") {
      device.add_attr({
        seuilMin: {
          value: 0,
          active: false
        }
      })
    }

    if (typeof device.seuilMax == "undefined") {
      device.add_attr({
        seuilMax: {
          value: 0,
          active: false
        }
      })
    }

    if (typeof device.alarmType == "undefined") {
      device.add_attr({
        alarmType: new Choice(1, ["min", "normal", "max"]),
        oldAlarmType: "normal",
      })
    }

    if (typeof device.currentLog == "undefined") {
      device.add_attr({
        currentLog: new Model()
      })
    }


  }


  getDeviceDetail(device) {

    this.verifyEndpointFormat(device)

    var deviceCopy = {};

    deviceCopy['id'] = device.id.get();
    // deviceCopy['ipAddress'] = device.ipAddress.get();
    deviceCopy['model_id'] = device.model_id;
    deviceCopy['name'] = device.name.get();
    deviceCopy['path'] = device.path.get();
    // deviceCopy['type'] = device.type.get();
    deviceCopy['_server_id'] = device._server_id;




    deviceCopy['min'] = device.seuilMin.get();
    deviceCopy['max'] = device.seuilMax.get();



    deviceCopy['dataNature'] = device.dataNature.get();
    deviceCopy['unit'] = (device.unit.get() && device.unit.get().trim()
      .length >
      0 && device.unit.get() != "none") ? device.unit.get() : "-";

    // deviceCopy['type'] = typeof device.currentValue.get();
    deviceCopy['type'] = device.dataType.get() ? device.dataType.get() :
      "string";

    if (deviceCopy['type'] != "string" && isNaN(device.currentValue.get())) {
      deviceCopy["currentValue"] = "Not defined"
    } else {
      deviceCopy["currentValue"] = device
        .currentValue
        .get()
    }

    // deviceCopy['currentValue'] = ! &&
    //   deviceCopy['type'] != "string" ?  : "Not defined";

    return deviceCopy;

  }


  getLogDetail(log) {
    var logCopy = {};

    logCopy['id'] = log.id.get();
    logCopy['name'] = log.name.get();
    logCopy['type'] = log.type.get();
    logCopy['begin'] = log.date_begin.get();
    logCopy['end'] = log.date_end.get();
    logCopy['user'] = log.user.get();
    logCopy['message'] = log.message.get();
    logCopy['value'] = log.value.get();

    return logCopy;

  }
};

module.exports.GetInformation = GetInformation;