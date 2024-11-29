"use strict";

class Router {
    constructor() {
		this.createStaticResponses();
		this.createDynamicResponses();
    }
	
	createStaticResponses(){
        this.staticRoutes = {};
		let getStaticRoute = fileIO.readDir("./src/response");
		for(let file of getStaticRoute){
			if(file.indexOf('_') == 0) continue;
			if(!file.includes(".js")) continue;

			let route = "/" + file.replace(".js", "").replace(/\./g, "/");
			let callback = require("../../src/response/" + file);
			this.staticRoutes[route] = callback.execute;
		}
		logger.logSuccess("Create: Static Response Callbacks");
	}
	createDynamicResponses(){
		this.dynamicRoutes = {};
		let getDynamicRoute = fileIO.readDir("./src/response/dynamic");
		for(let file of getDynamicRoute){
			//if(file.includes('_')) continue; // fucks up the last_id dynamic response
			if(!file.includes(".js")) continue;
			
			let route = file.replace(".js", "");
			if(route == "jpg" || route == "png" || route == "bundle")
				route = "." + route;
			else if(route == "last_id")
				route = "?" + route;
			else
				route = "/" + route.replace(/\./g, "/");
			
			if(route.includes("getTrader")){
				route = route + "/";
			}
			let callback = require("../../src/response/dynamic/" + file);
			this.dynamicRoutes[route] = callback.execute;
		}
		
		//reverse the order...
		let new_obj = {}
		let rev_obj = Object.keys(this.dynamicRoutes).reverse();
		for (let obj of rev_obj)
			new_obj[obj] = this.dynamicRoutes[obj];
		this.dynamicRoutes = new_obj;
		
		logger.logSuccess("Create: Dynamic Response Callbacks");
	}

    getResponse(req, body, sessionID) {
        let output = "";
        let url = req.url;
        let info = {};
		if(typeof body != "object"){
			/* parse body */
			if (body !== "") {
				info = fileIO.parse(body);
			}
		} else {
			if(url.includes("/server/config") && !url.includes(".css")){
				info = body;
			}
		}
        /* remove retry from URL */
        if (url.includes("?retry=")) {
            url = url.split("?retry=")[0];
        }
        
        /* route request */
        if (url in this.staticRoutes) {
            output = this.staticRoutes[url](url, info, sessionID);
        } else {
			let found = "";
			let scrappedURL = url.slice("/", "");
            for (let key in this.dynamicRoutes) {
				if (url.includes(key)) {
					output = this.dynamicRoutes[key](url, info, sessionID);
				}
            }
        }
    
        return output;
    }
}

module.exports.router = new Router();