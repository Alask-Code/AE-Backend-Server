"use strict";

function getCustomization() {
	return global._database.customization;
}

function getPath(sessionID) {
	let path = db.user.profiles.storage;
	return path.replace("__REPLACEME__", sessionID);
}

function wearClothing(pmcData, body, sessionID) {
	for (let i = 0; i < body.suites.length; i++) {
		let suite = global._database.customization[body.suites[i]];

		// this parent reffers to Lower Node
		if (suite._parent == "5cd944d01388ce000a659df9") {
			pmcData.Customization.Feet = suite._props.Feet;
		}

		// this parent reffers to Upper Node
		if (suite._parent == "5cd944ca1388ce03a44dc2a4") {
			pmcData.Customization.Body = suite._props.Body;
			pmcData.Customization.Hands = suite._props.Hands;
		}
	}

	return item_f.handler.getOutput();
}

function buyClothing(pmcData, body, sessionID) {
	let output = item_f.handler.getOutput();
	let storage = fileIO.readParsed(getPath(sessionID));
	let offers = trader_f.handler.getAllCustomization(sessionID);

	// check if outfit already exists
	for (let suiteId of storage.data.suites) {
		if (suiteId === body.offer) {
			return output;
		}
	}

	// pay items
	for (let sellItem in body.items) {
		for (let item in pmcData.Inventory.items) {
			if (pmcData.Inventory.items[item]._id === sellItem.id) {
				if (pmcData.Inventory.items[item].upd.StackObjectsCount > sellItem.count) {
					pmcData.Inventory.items[item].upd.StackObjectsCount -= sellItem.count;

					output.items.change.push({
                        "_id": pmcData.Inventory.items[item]._id,
                        "_tpl": pmcData.Inventory.items[item]._tpl,
                        "parentId": pmcData.Inventory.items[item].parentId,
                        "slotId": pmcData.Inventory.items[item].slotId,
                        "location": pmcData.Inventory.items[item].location,
                        "upd": {"StackObjectsCount": pmcData.Inventory.items[item].upd.StackObjectsCount}
					});
					break;
				} else if (pmcData.Inventory.items[item].upd.StackObjectsCount === sellItem.count && sellItem.del === true) {
					output.items.del.push({"_id": sellItem.id});
                    pmcData.Inventory.items.splice(item, 1);					
				}
			}
		}
	}

	// add outfit to storage
	for (let offer of offers) {
		if (body.offer === offer._id) {
			storage.data.suites.push(offer.suiteId);
			break;
		}
	}

	fileIO.write(getPath(sessionID), storage);
	return output;
}

module.exports.getCustomization = getCustomization;
module.exports.getPath = getPath;
module.exports.wearClothing = wearClothing;
module.exports.buyClothing = buyClothing;
