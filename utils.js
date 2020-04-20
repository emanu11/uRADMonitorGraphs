function getMassFactor(name) {
    // 24.45 for 25 ºC and 1 atmosphere: mg/m^3 = ppm x molecular_weight  / 24.45
    switch (name) {
        // industrial units
        case "O3": return (48 / 24.45) * 1000; //1.96319018404908 //ppm to ug
        case "NO2": return (46.0055 / 24.45) * 1000; //1.88161554192229
        case "SO2": return (64.066 / 24.45) * 1000; //2.620286298568507
        case "CO`": return (28.01 / 24.45); //1.14560327198364 CAREFUL, this is in mg/m^3
        case "NH3": return (17.031 / 24.45) * 1000; // 0.696564417177914
        case "H2S": return (34.1 / 24.45) * 1000; // 1.394683026584867
        case "CL2": return (70.906 / 24.45) * 1000; // 2.900040899795501
        // a3 units
        case "Carbon Dioxide": return (44.01 / 24.45); // 1.8 CAREFUL, this is in mg/m^3
        case "Ozone": return (48 / 24.45);  // 1.96319018404908 ppb to ug
        case "Formaldehyde": return (30.031 / 24.45);  // 1.228261758691207 ppb to ug
        default: return 1;
    }
}

function getUnit(sensor) {
    switch (sensor) {
        case "temperature": return "°C";
        case "cpm": return "CPM";
        case "voltage": return "Volts";
        case "duty": return "‰";
        case "pressure": return "Pa";
        case "humidity": return "% RH";
        case "gas1": return "ppm";
        case "gas2": return "ppm";
        case "gas3": return "ppm";
        case "gas4": return "ppm";
        case "dust": return "mg/m³";
        case "co2": return "ppm";
        case "ch2o": return "ppm";
        case "pm25": return "µg/m³";
        case "pm1": return "µg/m³";
        case "pm10": return "µg/m³";
        case "noise": return "dBA";
        case "voc": return "voc";
    }
}

function getUnitByName(name) {
    switch (name) {
        case "Temperature": return "°C";
        case "Radiation": return "µSv/h";
        case "Voltage": return "V";
        case "Duty cycle": return "‰";
        case "Pressure": return "hPa";
        case "Humidity": return "% RH";
        case "VOC": return "Ohm";
        case "O3":
        case "NO2":
        case "SO2":
        case "CL2":
        case "NH3":
        case "H2S":
        case "O2": "µg/m³";
        case "PM1.0":
        case "PM2.5":
        case "PM10": return "µg/m³";
        case "CO": return "mg/m³";
        case "Carbon Dioxide": "mg/m³";
        case "Formaldehyde": return "µg/m³";
        case "Ozone": return "µg/m³";
        case "Noise": return "dB";
        case "Battery": return "V";
        case "Speed": return "km/h";
        case "Timelocal": return "sec";
        case "Altitude": return "m";
        case "Radon": return "Bq/m³";
        default: "unk";
    }
}

//CONVERSION UTILS
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
function standardDeviation(values) {
    var avg = average(values);
    var squareDiffs = values.map(function (value) {
        var diff = value - avg;
        return diff * diff;
    });
    var avgSquareDiff = average(squareDiffs);
    return Math.sqrt(avgSquareDiff);
}
function convert(sensor, value, factor) {
    switch (sensor) {
        case "dose": return value * factor;
        default: return value;
    }
}
function idFactor(id) {
    if (!id) return 0;
    switch (id.substr(0, 2)) {
        case "11": return 0.006315; // sbm20
        case "12": return 0.010000; // si29bg
        case "13": return 0.006315; // sbm20
        case "41": return 0.006315; // sbm20
        case "51": return 0.006315; // sbm20
        case "64": return 0.005940;	// lnd712
        case "82": return 0.010000; // si29bg
        default: return 0;
    }
}
function getVolLimits(name) {
    switch (name) {
        case "Radiation": return ['0.20', '1.0', '10.00'];
        case "pm1": return ['20', '40', '56'];
        case "pm25": return ['25', '50', '70'];
        case "pm10": return ['40', '67', '100'];
        case "VOC AQI": return ['200', '300', '400']
        case "Noise": return ['40', '60', '100'];

        case "Carbon Dioxide": return ['700', '1000', '4000']; //ppm
        case "Formaldehyde": return ['100', '200', '300'];// ppb
        case "Ozone": return ['54', '85', '200']; // ppb

        case "O3": return ['0.054', '0.085', '0.2']; // ppm
        case "NO2": return ['0.053', '0.36', '1.249']; // ppm
        case "SO2": return ['0.035', '0.185', '0.604']; // ppm
        case "CO": return ['4.4', '12.4', '30.4'];	//ppm
        default: null;

        // ZE25-O3, 0..10ppm
        // ZE03-O3, 0..20ppm
        // ZE03-SO2, 0..20ppm
        // ZE03-NO2, 0..20ppm
        // ZE03-CO, 0..1000ppm
    }
}
function getLimits(name) {
    var limits = getVolLimits(name);
    if (!limits)
        return limits;
    else {
        var factor = getMassFactor(name);
        return [limits[0] * factor, limits[1] * factor, limits[2] * factor];
    }
}