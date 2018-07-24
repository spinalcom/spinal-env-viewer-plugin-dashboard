var GetInformation = class GetInformation extends Model {
  constructor() {
    super();
  }

  ReturnDeviceLst(lst) {
    var promiseLst = [];
    arrayToReturn = [];

    for (var i = 0; i < lst.length; i++) {
      promiseLst.push(lst[i].getElement());
    }

    console.log("promiseLst", promiseLst);


    return arrayToReturn;
  }
};

module.exports.GetInformation = GetInformation;