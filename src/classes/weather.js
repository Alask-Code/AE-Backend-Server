"use strict";

let weather = undefined;

function initialize() {
    weather = fileIO.readParsed(db.user.cache.weather);
}

function generate() {
    let output = {};

    // set weather
    if (global._database.gameplayConfig.location.forceWeatherEnabled) {
        output = weather.data[global._database.gameplayConfig.location.forceWeatherId];
    } else {
        output = weather.data[utility.getRandomInt(0, weather.data.length - 1)];
    }

    // replace date and time
    if (global._database.gameplayConfig.location.realTimeEnabled) {
        // Apply acceleration to time computation.
        let timeInSeconds = new Date().getTime() / 1000; // date in seconds
        let deltaSeconds = utility.getServerUptimeInSeconds() * output.acceleration;
		
		let newDateInSeconds = timeInSeconds + deltaSeconds; 
		
		let newDateObj = new Date(newDateInSeconds * 1000);

        let time = utility.formatTime(newDateObj).replace("-", ":").replace("-", ":");
        let date = utility.formatDate(newDateObj);
        let datetime = `${date} ${time}`;

        output.weather.timestamp = Math.floor(newDateObj / 1000);
        output.weather.date = date;
        output.weather.time = datetime;
        output.date = date;
        output.time = time;
    }

    return output;
}

module.exports.initialize = initialize;
module.exports.generate = generate;