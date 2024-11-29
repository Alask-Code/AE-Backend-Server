"use strict";
// WipeDependencies
exports.wipeDepend = (data) => {
	return JSON.parse(JSON.stringify(data));
}

// getCookies
exports.getCookies = (req) => {
    let found = {};
    let cookies = req.headers.cookie;
    if (cookies) {
        for (let cookie of cookies.split(';')) {
            let parts = cookie.split('=');

            found[parts.shift().trim()] = decodeURI(parts.join('='));
        }
    }
    return found;
}
// clearString
exports.clearString = (s) => {
	return s.replace(/[\b]/g, '')
            .replace(/[\f]/g, '')
            .replace(/[\n]/g, '')
            .replace(/[\r]/g, '')
            .replace(/[\t]/g, '')
            .replace(/[\\]/g, '');
}
// getRandomInt
exports.getRandomInt = (min = 0, max = 100) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return (max > min) ? Math.floor(Math.random() * (max - min + 1) + min) : min;
}
// getRandomIntEx
exports.getRandomIntEx = (max) => {
    return (max > 1) ? Math.floor(Math.random() * (max - 2) + 1) : 1;
}
// getDirList TODO: OBSOLETE
exports.getDirList = (path) => {
    return fileIO.readDir(path).filter(function(file) {
        return fileIO.statSync(path + '/' + file).isDirectory();
    });
}
// removeDir TODO: OBSOLETE
exports.removeDir = (dir) => {
    for (file of fileIO.readDir(dir)) {
        let curPath = internal.path.join(dir, file);

        if (fileIO.lstatSync(curPath).isDirectory()) {
            this.removeDir(curPath);
        } else {
            fileIO.unlink(curPath);
        }
    }

    fileIO.rmDir(dir);
}
// getServerUptimeInSeconds
exports.getServerUptimeInSeconds = () => {
    return Math.floor(internal.process.uptime());
}
// getTimestamp
exports.getTimestamp = () => {
    let time = new Date();
    return Math.floor(time.getTime() / 1000);
}
// getTime
exports.getTime = () => {
    return this.formatTime(new Date());
}
// formatTime
exports.formatTime = (date) => {
    let hours = ("0" + date.getHours()).substr(-2);
    let minutes = ("0" + date.getMinutes()).substr(-2);
    let seconds = ("0" + date.getSeconds()).substr(-2);
    return hours + "-" + minutes + "-" + seconds;
}
// getDate
exports.getDate = () => {
    return this.formatDate(new Date());
}
// formatDate
exports.formatDate = (date) => {
    let day = ("0" + date.getDate()).substr(-2);
    let month = ("0" + (date.getMonth() + 1)).substr(-2);
    return date.getFullYear() + "-" + month + "-" + day;
}
// makeSign
exports.makeSign = (Length) => {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    
    for (let i = 0; i < Length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    
    return result;
}
// generateNewAccountId
exports.generateNewAccountId = () => {
    return this.generateNewId("AID", true);
}
// generateNewItemId
exports.generateNewItemId = () => {
    return this.generateNewId("I");
}
// generateNewDialogueId
exports.generateNewDialogueId = () => {
    return this.generateNewId("D");
}

const { v4: uuidv4 } = require('uuid')

// generateNewId
exports.generateNewId = (prefix = "", useOld = false) => {
    let getTime = new Date();
	let retVal = ""
	if(useOld){
		retVal = prefix
		retVal += getTime.getMonth().toString();
		retVal += getTime.getDate().toString();
		retVal += getTime.getHours().toString();
		retVal += (parseInt(getTime.getMinutes()) + parseInt(getTime.getSeconds())).toString();
		retVal += this.getRandomInt(1000000, 9999999).toString();
		retVal += this.makeSign(24 - retVal.length).toString();
	} else {
		retVal = `${prefix}-${uuidv4()}`
	}
    return retVal;
}
// secondsToTime
exports.secondsToTime = (timestamp) =>{
    timestamp = Math.round(timestamp);
    let hours = Math.floor(timestamp / 60 / 60);
    let minutes = Math.floor(timestamp / 60) - (hours * 60);
    let seconds = timestamp % 60;

    if( minutes < 10 ){ minutes = "0" + minutes}
    if( seconds < 10 ){ seconds = "0" + seconds}
    return hours + 'h' + minutes + ':' + seconds;
}
// isUndefined
exports.isUndefined = (dataToCheck) => {
	return typeof dataToCheck == "undefined";
}
exports.getArrayValue = (arr) => {
	return arr[utility.getRandomInt(0, arr.length - 1)];
}

/*
 *	PROFILE UTILITIES
 *
*/

exports.generateInventoryID = (profile) => {
	let itemsByParentHash = {};
	let inventoryItemHash = {};
	let inventoryId = "";

	// Generate inventoryItem list
	for (let item of profile.Inventory.items)
	{
		inventoryItemHash[item._id] = item;

		if (item._tpl === "55d7217a4bdc2d86028b456d")
		{
			inventoryId = item._id;
			continue;
		}

		if (!("parentId" in item))
		{
			continue;
		}

		if (!(item.parentId in itemsByParentHash))
		{
			itemsByParentHash[item.parentId] = [];
		}

		itemsByParentHash[item.parentId].push(item);
	}

	// update inventoryId
	const newInventoryId = utility.generateNewItemId();
	inventoryItemHash[inventoryId]._id = newInventoryId;
	profile.Inventory.equipment = newInventoryId;

	// update inventoryItem id
	if (inventoryId in itemsByParentHash)
	{
		for (let item of itemsByParentHash[inventoryId])
		{
			item.parentId = newInventoryId;
		}
	}

	return profile;
}

exports.splitStack = (item) => 
{
	if (!("upd" in item) || !("StackObjectsCount" in item.upd))
	{
		return [item];
	}

	let maxStack = global._database.items[item._tpl]._props.StackMaxSize;
	let count = item.upd.StackObjectsCount;
	let stacks = [];

	// If the current count is already equal or less than the max
	// then just return the item as is.
	if (count <= maxStack)
	{
		stacks.push(utility.wipeDepend(item));
		return stacks;
	}

	while (count)
	{
		let amount = Math.min(count, maxStack);
		let newStack = utility.wipeDepend(item);

		newStack._id = utility.generateNewItemId();
		newStack.upd.StackObjectsCount = amount;
		count -= amount;
		stacks.push(newStack);
	}

	return stacks;
}