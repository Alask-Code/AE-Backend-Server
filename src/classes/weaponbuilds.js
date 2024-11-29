"use strict";

function getPath(sessionID) {
	let path = db.user.profiles.userbuilds;
	return path.replace("__REPLACEME__", sessionID);
}

function getUserBuilds(sessionID) {
	let userBuildsMap = fileIO.readParsed(getPath(sessionID));

	let userBuilds = [];

	for (let buildName in userBuildsMap) {
		userBuilds.push(userBuildsMap[buildName]);
	}

	return userBuilds;
}

function SaveBuild(pmcData, body, sessionID) {
	delete body.Action;
	body.id = utility.generateNewItemId();	

	let output = item_f.handler.getOutput();
	let savedBuilds = fileIO.readParsed(getPath(sessionID));

	// replace duplicate ID's. The first item is the base item.
	// The root ID and the base item ID need to match.
	body.items = helper_f.replaceIDs(pmcData, body.items, false);
	body.root = body.items[0]._id;

	savedBuilds[body.name] = body;
	fileIO.write(getPath(sessionID), savedBuilds);
	output.builds.push(body);
    return output;
}

function RemoveBuild(pmcData, body, sessionID) {
    let savedBuilds = fileIO.readParsed(getPath(sessionID));

    for (let name in savedBuilds) {
        if (savedBuilds[name].id === body.id) {
            delete savedBuilds[name];
            fileIO.write(getPath(sessionID), savedBuilds);
            break;
        }
    }

    return item_f.handler.getOutput();
}

module.exports.getPath = getPath;
module.exports.getUserBuilds = getUserBuilds;
module.exports.saveBuild = SaveBuild;
module.exports.removeBuild = RemoveBuild;