"use strict";

function foldItem(pmcData, body, sessionID) {
    for (let item of pmcData.Inventory.items) {
        if (item._id && item._id === body.item) {
            item.upd.Foldable = {"Folded": body.value};
            return item_f.handler.getOutput();
        }
    }

    return "";
}

function toggleItem(pmcData, body, sessionID) {
    for (let item of pmcData.Inventory.items) {
        if (item._id && item._id === body.item) {
            item.upd.Togglable = {"On": body.value};
            return item_f.handler.getOutput();
        }
    }

    return "";
}

function tagItem(pmcData, body, sessionID) {
    for (let item of pmcData.Inventory.items) {
        if (item._id === body.item) {
            if (item.upd !== null &&
                item.upd !== undefined &&
                item.upd !== "undefined") {
                item.upd.Tag = {"Color": body.TagColor, "Name": body.TagName};
            } else { //if object doesn't have upd create and add it
                let myobject = {
                    "_id": item._id,
                    "_tpl": item._tpl,
                    "parentId": item.parentId,
                    "slotId": item.slotId,
                    "location": item.location,
                    "upd": {"Tag": {"Color": body.TagColor, "Name": body.TagName}}
                };
                Object.assign(item, myobject); // merge myobject into item -- overwrite same properties and add missings
            }

            return item_f.handler.getOutput();
        }
    }

    return "";
}

function bindItem(pmcData, body, sessionID) {
    for (let index in pmcData.Inventory.fastPanel) {
        if (pmcData.Inventory.fastPanel[index] === body.item) {
            pmcData.Inventory.fastPanel[index] = "";
        }
    }

    pmcData.Inventory.fastPanel[body.index] = body.item;
    return item_f.handler.getOutput();
}

function examineItem(pmcData, body, sessionID) {
    let itemID = "";
    let pmcItems = pmcData.Inventory.items;

    // outside player profile
    if ("fromOwner" in body) {
        // scan ragfair as a trader
        if (body.fromOwner.type === "RagFair") {
            body.item = body.fromOwner.id;
            body.fromOwner.type = "Trader";
            body.fromOwner.id = "ragfair";
        }

        // get trader assort
        if (body.fromOwner.type === "Trader") {
            pmcItems = trader_f.handler.getAssort(sessionID, body.fromOwner.id).items;
        }

        // get hideout item
        if (body.fromOwner.type === "HideoutProduction") {
            itemID = body.item;
        }
    }

    if (preset_f.handler.isPreset(itemID)) {
        itemID = preset_f.handler.getBaseItemTpl(itemID);
    }

    if (itemID === "") {
        // player/trader inventory
        for (let item of pmcItems) {
            if (item._id === body.item) {
                itemID = item._tpl;
                break;
            }
        }
    }

    if (itemID === "") {
        // player/trader inventory
        let result = helper_f.getItem(body.item);
        if (result[0]) {
            itemID = result[1]._id;
        }
    }

    // item not found
    if (itemID === "") {
        logger.logError(`Cannot find item to examine for ${body.item}`);
        return "";
    }

    // item found
	if(typeof global._database.items[itemID] == "undefined"){
		logger.logError(`file not found with id: ${itemID}`);
	}
    let item = global._database.items[itemID];
    pmcData.Info.Experience += item._props.ExamineExperience;
    pmcData.Encyclopedia[itemID] = true;

    //logger.logSuccess(`EXAMINED: ${itemID}`);
    return item_f.handler.getOutput();
}

function readEncyclopedia(pmcData, body, sessionID) {
    for (let id of body.ids) {
        pmcData.Encyclopedia[id] = true;
    }
    return item_f.handler.getOutput();
}

function handleMapMarker(pmcData, body, sessionID) {

    for (let k in pmcData.Inventory.items) {
        let curritem = pmcData.Inventory.items[k]
        if (curritem._id === body.item) {
            if (!curritem.upd.Map) {
                curritem.upd.Map = {
                    "Markers": []
                }
            }
            curritem.upd.Map.Markers.push(body.mapMarker)
            console.log(body.mapMarker)
        }
    }

    return item_f.handler.getOutput();
}

module.exports.foldItem = foldItem;
module.exports.toggleItem = toggleItem;
module.exports.tagItem = tagItem;
module.exports.bindItem = bindItem;
module.exports.examineItem = examineItem;
module.exports.readEncyclopedia = readEncyclopedia;
module.exports.handleMapMarker = handleMapMarker;