var app = app || {};
app.Controller = function () {

    var save = function (key, value) {

        var serialized = JSON.stringify(value);
        window.localStorage.setItem(key, serialized);
        return serialized.length;
    };

    var load = function (key) {

        var value = window.localStorage.getItem(key);
        if (value) {
            return JSON.parse(value);
        } else {
            return null;
        }
    }

    var saveCompressed = function (key, value) {

        var compressed = LZString.compress(JSON.stringify(value));
        window.localStorage.setItem(key, compressed);
        return compressed.length;
    };

    var loadCompressed = function (key) {

        var value = window.localStorage.getItem(key);
        if (value) {
            return JSON.parse(LZString.decompress(value));
        } else {
            return null;
        }
    };

    return {
        load: load,
        save: save,        
        loadCompressed: loadCompressed,
        saveCompressed: saveCompressed
    };

};


$(document).ready(function () {

    var inspectionRequests = [],
        controller = new app.Controller(),
        loadedFromPlain,
        loadedFromCompressed;

    for (var i = 0; i < 100; i++) {

        var request = new app.model.BuildingInspectionRequest();

        inspectionRequests.push(request);
    }

    console.time("save duration");
    var sizeOfPlain = controller.save("plain", inspectionRequests);
    console.timeEnd("save duration");
    console.log("sizeOfPlain: " + sizeOfPlain);

    console.time("saveCompressed duration");
    var sizeOfCompressed = controller.saveCompressed("comppressed", inspectionRequests);
    console.timeEnd("saveCompressed duration");
    console.log("sizeOfCompressed: " + sizeOfCompressed);

    console.time("load duration");
    loadedFromPlain = controller.load("plain");
    console.timeEnd("load duration");
    //console.log("loadedFromPlain: " + loadedFromPlain);

    console.time("loadCompressed duration");
    loadedFromCompressed = controller.loadCompressed("comppressed");
    console.timeEnd("loadCompressed duration");
    console.log("loadedFromCompressed: " + loadedFromCompressed);
});