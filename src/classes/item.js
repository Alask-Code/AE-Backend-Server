"use strict";

class ItemServer {
    constructor() {
        this.output = "";
        this.routes = {};
		this.routeStructure = {};
        this.resetOutput();
    }

    /* adds route to check for */
    addRoute(route, callback) {
        this.routes[route] = callback;
    }

	updateRouteStruct(){
		this.routeStructure = {
			"Eat": health_f.handler.offraidEat,
			"Heal": health_f.handler.offraidHeal,
			"RestoreHealth": health_f.handler.healthTreatment,
			"CustomizationWear": customization_f.wearClothing,
			"CustomizationBuy": customization_f.buyClothing,
			"HideoutUpgrade": hideout_f.upgrade,
			"HideoutUpgradeComplete": hideout_f.upgradeComplete,
			"HideoutContinuousProductionStart": hideout_f.continuousProductionStart,
			"HideoutSingleProductionStart": hideout_f.singleProductionStart,
			"HideoutScavCaseProductionStart": hideout_f.scavCaseProductionStart,
			"HideoutTakeProduction": hideout_f.takeProduction,
			"HideoutPutItemsInAreaSlots": hideout_f.putItemsInAreaSlots,
			"HideoutTakeItemsFromAreaSlots": hideout_f.takeItemsFromAreaSlots,
			"HideoutToggleArea": hideout_f.toggleArea,
			"Insure": insurance_f.insure,
			"Move": move_f.moveItem,
			"Remove": move_f.discardItem,
			"Split": move_f.splitItem,
			"Merge": move_f.mergeItem,
			"Transfer": move_f.transferItem,
			"Swap": move_f.swapItem,
			"AddNote": note_f.addNote,
			"EditNote": note_f.editNode,
			"DeleteNote": note_f.deleteNote,
			"QuestAccept": quest_f.acceptQuest,
			"QuestComplete": quest_f.completeQuest,
			"QuestHandover": quest_f.handoverQuest,
			"RagFairAddOffer": ragfair_f.ragFairAddOffer,
			"Repair": repair_f.main,
			"Fold": status_f.foldItem,
			"Toggle": status_f.toggleItem,
			"Tag": status_f.tagItem,
			"Bind": status_f.bindItem,
			"Examine": status_f.examineItem,
			"ReadEncyclopedia": status_f.readEncyclopedia,
			"TradingConfirm": trade_f.confirmTrading,
			"RagFairBuyOffer": trade_f.confirmRagfairTrading,
			"SaveBuild": weaponbuilds_f.saveBuild,
			"RemoveBuild": weaponbuilds_f.removeBuild,
			"AddToWishList": wishlist_f.addToWishList,
			"RemoveFromWishList": wishlist_f.removeFromWishList,
			"ApplyInventoryChanges": move_f.applyInventoryChanges,
			"CreateMapMarker": status_f.handleMapMarker 
		}
	}

	handleRoutes(info, sessionID) {
		this.resetOutput();

		for (let body of info.data) {
			let pmcData = profile_f.handler.getPmcProfile(sessionID);
			if (body.Action in this.routes) {
				this.routes[body.Action](pmcData, body, sessionID);
			} else {
				logger.logError(`[UNHANDLED ACTION] ${body.Action} with body ${body}`);
			}
		}
		return this.output;
	}


    getOutput() {
        if (this.output === "") {
            this.resetOutput();
        }

        return this.output;
    }

    setOutput(data) {
        this.output = data;
    }

    resetOutput() {
        this.output = {"items": {"new": [], "change": [], "del": []}, "badRequest": [], "quests": [], "ragFairOffers": [], "builds": [], "currentSalesSums": {}};
    }
}

module.exports.handler = new ItemServer();
