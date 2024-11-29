"use strict";
const colorData = [
    {
        black: "\x1b[30m",
        red: "\x1b[31m",
        green: "\x1b[32m",
        yellow: "\x1b[33m",
        blue: "\x1b[34m",
        magenta: "\x1b[35m",
        cyan: "\x1b[36m",
        white: "\x1b[37m"
    },
    {
        black: "\x1b[40m",
        red: "\x1b[41m",
        green: "\x1b[42m",
        yellow: "\x1b[43m",
        blue: "\x1b[44m",
        magenta: "\x1b[45m",
        cyan: "\x1b[46m",
        white: "\x1b[47m"
    }
];

class Logger {
    constructor() {
        let file = utility.getDate() + "_" + utility.getTime() + ".log";
        let folder = "user/logs/";
        let filepath = folder + file;

        // create log folder
        if (!fileIO.exist(folder)) { +
            fileIO.mkDir(folder);
        }

        // create log file
        if (!fileIO.exist(filepath)) {
            fileIO.write(filepath, "");
        }

        this.fileStream = fileIO.createWriteStream(filepath);
    }

    log(type, data, colorFront = "", colorBack = "") {
        let setColors = "";
        let colors = ["", ""];

        if (colorFront !== "") {
            colors[0] = colorFront;
        }

        if (colorBack !== "") {
            colors[1] = colorBack;
        }

        // properly set colorString indicator
        for (let i = 0; i < colors.length; i++) {
            if (colors[i] !== "") {
                setColors += colorData[i][colors[i]];
            }
        }
		let deltaTime = (serverConfig.debugTimer)?"["+((new Date().getTime() - global.startTimestamp)/1000).toFixed(2)+"s] ":" ";
        // print data
        if (colors[0] !== "" || colors[1] !== "") {
			if(type != "" && type != "LogData")
				console.log(setColors+type+"\x1b[0m"+deltaTime+data);
			else 
				console.log(setColors+data+"\x1b[0m");
        } else {
			if(type != "" && type != "LogData")
				console.log(type+deltaTime+data);
			else
				console.log(data);
        }

        // write the logged data to the file
		if(type == "LogData"){
			this.fileStream.write(internal.util.format(data));
			this.fileStream.write(internal.util.format("\n"));//just new line
		} else {
			this.fileStream.write(internal.util.format(deltaTime+type+"-"+data+"\n"));
		}
    }

    logError(text) {
        this.log("[ERROR]", text, "white", "red");
    }

    logWarning(text) {
        this.log("[WARNING]", text, "white", "yellow");
    }

    logSuccess(text) {
        this.log("[SUCCESS]", text, "white", "green");
    }

    logDebug(text) {
        this.log("[DEBUG]", text, "black", "white");
    }

    logInfo(text) {
		if(!serverConfig.hideInfoLogs)
			this.log("[INFO]", text, "white", "blue");
    }

    logRequest(text, data = "") {
		if(data == "")
			this.log("", text, "cyan", "black");
		else
			this.log(data, text, "cyan", "black");
    }

    logData(data) {
        this.log("LogData", data);
    }
	
	throwErr(message, where, additional = ""){
		throw message + "\r\n" + where + ((additional!="")?`\r\n${additional}`:"");
	}
}

module.exports.logger = new Logger();