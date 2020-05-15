function arrayMax(data) {
    return data.reduce(function (a, b) {
        return Math.max(a, b);
    });
}
function arrayMin(data) {
    return data.reduce(function (a, b) {
        return Math.min(a, b);
    });
}
function arrayAvg(data) {
    var sum = data.reduce(function (sum, value) { return sum + parseFloat(value); }, 0);
    return sum / data.length;
}

function getTresholds(name) {
    //http://airqualitynow.eu/about_indices_definition.php
    var pm1Limits = [];
    pm1Limits.push(new Limit("verrylow", "", "#37ac56", 0, 5));
    pm1Limits.push(new Limit("low", "", "#9bd444", 5, 10));
    pm1Limits.push(new Limit("medium", "", "#f1d309", 10, 20));
    pm1Limits.push(new Limit("high", "", "#fb0", 20, 30));
    pm1Limits.push(new Limit("verryhigh", "", "#ff8c00", 30, 35));

    var pm25Limits = [];
    pm25Limits.push(new Limit("verrylow", "", "#37ac56", 0, 10));
    pm25Limits.push(new Limit("low", "", "#9bd444", 10, 20));
    pm25Limits.push(new Limit("medium", "", "#f1d309", 20, 30));
    pm25Limits.push(new Limit("high", "", "#fb0", 30, 60));
    pm25Limits.push(new Limit("verryhigh", "", "#ff8c00", 60, 70));

    var pm10Limits = [];
    pm10Limits.push(new Limit("verrylow", "", "#37ac56", 0, 15));
    pm10Limits.push(new Limit("low", "", "#9bd444", 15, 30));
    pm10Limits.push(new Limit("medium", "", "#f1d309", 30, 50));
    pm10Limits.push(new Limit("high", "", "#fb0", 50, 100));
    pm10Limits.push(new Limit("verryhigh", "", "#ff8c00", 100, 110));

    var tresholds = [];
    tresholds.push(new SensorTresholds("pm1", pm1Limits));
    tresholds.push(new SensorTresholds("pm25", pm25Limits));
    tresholds.push(new SensorTresholds("pm10", pm10Limits));

    switch (name) {
        case "pm1": return pm1Limits;
        case "pm25": return pm25Limits;
        case "pm10": return pm10Limits;
        default: null;
    }
}

function mapValueToAQI(sensor, value) {
    //value = 26;
    //sensor = "pm25";
    var AQILimits = [];
    AQILimits.push(new Limit("verrylow", "Nivel foarte scazut de poluare", "#37ac56", 0, 25));
    AQILimits.push(new Limit("low", "Nivel scazut de poluare", "#9bd444", 25, 50));
    AQILimits.push(new Limit("medium", "Nivel mediu de poluare", "#f1d309", 50, 75));
    AQILimits.push(new Limit("high", "Nivel ridicat de poluare", "#fb0", 75, 100));
    AQILimits.push(new Limit("verryhigh", "Nivel foarte ridicat de poluare", "#fb0", 100, 150));

    var sensorTreshold = getTresholds(sensor).filter(function (treshold) {
        return treshold.low < value && treshold.high > value
    });
    sensorTreshold = sensorTreshold[0];
    var ret;
    AQILimits.forEach(function (aqiLimit) {
        if (aqiLimit.id == sensorTreshold.id) {
            AQI = Math.round(((aqiLimit.high - aqiLimit.low) / (sensorTreshold.high - sensorTreshold.low)) * (value - sensorTreshold.low) + aqiLimit.low);
            ret = { "value": AQI, "text": aqiLimit.text, "color": aqiLimit.color };
        }
    });
    return ret;
}

function getCompatibleGaugeData() {
}

class DeviceCapability {
    constructor(id, name, measurementUnit) {
        this.id = id;
        this.name = name;
        this.measurementUnit = measurementUnit;
    }
}

class SensorData extends DeviceCapability {
    constructor(id, name, measurementUnit, value) {
        super(id, name, measurementUnit);
        this.value = value;
    }
}
class Limit {
    constructor(id, text, color, low, high) {
        this.id = id;
        this.text = text;
        this.color = color;
        this.low = low;
        this.high = high;
    }
}
class SensorTresholds {
    constructor(name, limits) {
        this.name = name;
        this.limits = limits;
    }
}

