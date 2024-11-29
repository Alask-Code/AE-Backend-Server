"use strict";

function upgrade(pmcData, body, sessionID) {
    for (let itemToPay of body.items) {
        for (let inventoryItem in pmcData.Inventory.items) {
            if (pmcData.Inventory.items[inventoryItem]._id !== itemToPay.id) {
                continue;
            }

            // if it's not money, its construction / barter items
            if (pmcData.Inventory.items[inventoryItem]._tpl === "5449016a4bdc2d6f028b456f") {
                pmcData.Inventory.items[inventoryItem].upd.StackObjectsCount -= itemToPay.count;
            } else {
                move_f.removeItem(pmcData, pmcData.Inventory.items[inventoryItem]._id, item_f.handler.getOutput(), sessionID);
            }
        }
    }

    // time construction management
    for (let hideoutArea in pmcData.Hideout.Areas) {
        if (pmcData.Hideout.Areas[hideoutArea].type !== body.areaType) {
            continue;
        }

        for (let hideout_stage in _database.hideout.areas) {
            if (_database.hideout.areas[hideout_stage].type === body.areaType) {
                let ctime = _database.hideout.areas[hideout_stage].stages[pmcData.Hideout.Areas[hideoutArea].level + 1].constructionTime;

                if (ctime > 0) {
                    let timestamp = Math.floor(Date.now() / 1000);

                    pmcData.Hideout.Areas[hideoutArea].completeTime = timestamp + ctime;
                    pmcData.Hideout.Areas[hideoutArea].constructing = true;
                }
            }
        }
    }

    return item_f.handler.getOutput();
}

// validating the upgrade
function upgradeComplete(pmcData, body, sessionID) {
    for (let hideoutArea in pmcData.Hideout.Areas) {
        if (pmcData.Hideout.Areas[hideoutArea].type !== body.areaType) {
            continue;
        }

        // upgrade area
        pmcData.Hideout.Areas[hideoutArea].level++;
        pmcData.Hideout.Areas[hideoutArea].completeTime = 0;
        pmcData.Hideout.Areas[hideoutArea].constructing = false;

        //go to apply bonuses
        for (let area_bonus of _database.hideout.areas) {
            if (area_bonus.type !== pmcData.Hideout.Areas[hideoutArea].type) {
                continue;
            }

            let bonuses = area_bonus.stages[pmcData.Hideout.Areas[hideoutArea].level].bonuses;

            if (bonuses.length > 0) {
                for (let bonus of bonuses) {
                    applyPlayerUpgradesBonuses(pmcData, bonus);
                }
            }
        }
    }

    return item_f.handler.getOutput();
}

// move items from hideout
function putItemsInAreaSlots(pmcData, body, sessionID) {
    let output = item_f.handler.getOutput();

    for (let itemToMove in body.items) {
        for (let inventoryItem of pmcData.Inventory.items) {
            if (body.items[itemToMove].id !== inventoryItem._id) {
                continue;
            }

            for (let area of pmcData.Hideout.Areas) {
                if (area.type !== body.areaType) {
                    continue;
                }

                let slot_position = parseInt(itemToMove);
                let slot_to_add = {
                    "item": [{
                        "_id": inventoryItem._id,
                        "_tpl": inventoryItem._tpl,
                        "upd": inventoryItem.upd
                    }]
                }

                if (!(slot_position in area.slots)) {
                    area.slots.push(slot_to_add);
                } else {
                    area.slots.splice(slot_position, 1, slot_to_add);
                }

                output = move_f.removeItem(pmcData, inventoryItem._id, output, sessionID);
            }
        }
    }

    return output;
}

function takeItemsFromAreaSlots(pmcData, body, sessionID) {
    let output = item_f.handler.getOutput();

    for (let area of pmcData.Hideout.Areas) {
        if (area.type !== body.areaType) {
            continue;
        }

        if (area.type === 4) {
            let itemToMove = area.slots[body.slots[0]].item[0];
            let newReq = {
                "item_id": itemToMove._tpl,
                "count": 1,
                "tid": "ragfair"
            };

            output = move_f.addItem(pmcData, newReq, output, sessionID);
            pmcData = profile_f.handler.getPmcProfile(sessionID);
            output.items.new[0].upd = itemToMove.upd;

            for (let item of pmcData.Inventory.items) {
                if (item._id == output.items.new[0]._id) {
                    item.upd = itemToMove.upd;
                }
            }

            area.slots[body.slots[0]] = {
                "item": null
            };
        } else {
            let newReq = {
                "item_id": area.slots[0].item[0]._tpl,
                "count": 1,
                "tid": "ragfair"
            };

            output = move_f.addItem(pmcData, newReq, output, sessionID);
            pmcData = profile_f.handler.getPmcProfile(sessionID);
            area.slots.splice(0, 1);
        }
    }

    return output;
}

function toggleArea(pmcData, body, sessionID) {
    for (let area in pmcData.Hideout.Areas) {
        if (pmcData.Hideout.Areas[area].type == body.areaType) {
            pmcData.Hideout.Areas[area].active = body.enabled;
        }
    }

    return item_f.handler.getOutput();
}

function singleProductionStart(pmcData, body, sessionID) {
    registerProduction(pmcData, body, sessionID);

    let output = item_f.handler.getOutput();

    for (let itemToDelete of body.items) {
        output = move_f.removeItem(pmcData, itemToDelete.id, output, sessionID);
    }

    return output;
}

function scavCaseProductionStart(pmcData, body, sessionID) {
    let output = item_f.handler.getOutput();
    console.log(body.items)

    for (let item of body.items) {
        for (let iitem in pmcData.Inventory.items) {
            if (item.id === pmcData.Inventory.items[iitem]._id) {
                let tpl = pmcData.Inventory.items[iitem]._tpl
                if (helper_f.isMoneyTpl(tpl)) {
                    if (pmcData.Inventory.items[iitem].upd.StackObjectsCount - item.count <= 0) {
                        output = move_f.removeItem(pmcData, item.id, output, sessionID);
                    } else {
                        pmcData.Inventory.items[iitem].upd.StackObjectsCount -= item.count
                    }
                } else {
                    output = move_f.removeItem(pmcData, item.id, output, sessionID);
                }
            }
        }
    }

    for (let recipe in _database.hideout.scavcase) {
        if (body.recipeId == _database.hideout.scavcase[recipe]._id) {
            let rarityItemCounter = {};
            let products = [];

            for (let rarity in _database.hideout.scavcase[recipe].EndProducts) {
                if (_database.hideout.scavcase[recipe].EndProducts[rarity].max > 0) {
                    rarityItemCounter[rarity] = _database.hideout.scavcase[recipe].EndProducts[rarity].max;
                }
            }

            for (let rarityType in rarityItemCounter) {
                while (rarityItemCounter[rarityType] !== 0) {
                    let random = utility.getRandomIntEx(Object.keys(global._database.items).length)
                    let randomKey = Object.keys(global._database.items)[random];
                    let tempItem = global._database.items[randomKey];

                    // products are not registered correctly
                    if (tempItem._props.Rarity === rarityType) {
                        products.push({
                            "_id": utility.generateNewItemId(),
                            "_tpl": tempItem._id
                        });

                        rarityItemCounter[rarityType] -= 1;
                    }
                }
            }
            pmcData.Hideout.Production["141"] = {
                "Products": products
            };
            pmcData.Hideout.Production[body.recipeId] = {
                "Progress": 0,
                "inProgress": true,
                "RecipeId": body.recipeId,
                "Products": [],
                "SkipTime": 0,
                "StartTime": Math.floor(Date.now() / 1000)
            };
        }
    }

    return output;
}

function continuousProductionStart(pmcData, body, sessionID) {
    registerProduction(pmcData, body, sessionID);
    return item_f.handler.getOutput();
}

function handleBitcoinReproduction(pmcData, sessionID) {
    let output = item_f.handler.getOutput();
    keepalive_f.main(sessionID) // Force keepalive call to prevent client/server desync.

    let bitcoin = { 
		"items": [
			{"item_id": "59faff1d86f7746c51718c9c", "count": 1}
		],
        "tid": "ragfair"
    };

    pmcData.Hideout.Production["5d5c205bd582a50d042a3c0e"].Products.forEach((_) => {
        output = move_f.addItem(pmcData, bitcoin, output, sessionID)
    })

    if (pmcData.Hideout.Production["5d5c205bd582a50d042a3c0e"].Products.length === 0) {
        logger.logWarning("No bitcoins to collect in profile.")
    }

    // Restart production.
	pmcData.Hideout.Production["5d5c205bd582a50d042a3c0e"].StartTime = Math.floor(Date.now() / 1000);
    pmcData.Hideout.Production["5d5c205bd582a50d042a3c0e"].Products = [];

    return output;
}

function takeProduction(pmcData, body, sessionID) {
    let output = item_f.handler.getOutput();

    if (body.recipeId === "5d5c205bd582a50d042a3c0e") {
        return handleBitcoinReproduction(pmcData, sessionID)
    }

    for (let recipe in _database.hideout.production) {
        if (body.recipeId !== _database.hideout.production[recipe]._id) {
            continue;
        }

        // delete the production in profile Hideout.Production
        for (let prod in pmcData.Hideout.Production) {
            if (pmcData.Hideout.Production[prod].RecipeId === body.recipeId) {
                if (body.recipeId === "5d5c205bd582a50d042a3c0e") { 
                    continue
                } else { delete pmcData.Hideout.Production[prod]; }
            }
        }

        // create item and throw it into profile
        let id = _database.hideout.production[recipe].endProduct;

        // replace the base item with its main preset
        if (preset_f.handler.hasPreset(id)) {
            id = preset_f.handler.getStandardPreset(id)._id;
        }

        let newReq = {
            "item_id": id,
            "count": _database.hideout.production[recipe].count,
            "tid": "ragfair"
        };

        return move_f.addItem(pmcData, newReq, output, sessionID, true);
    }

    for (let recipe in scavcase.data) {
        if (body.recipeId !== scavcase.data[recipe]._id) {
            continue;
        }

        for (let prod in pmcData.Hideout.Production) {
            if (pmcData.Hideout.Production[prod].RecipeId !== body.recipeId) {
                continue;
            }
			pmcData.Hideout.Production[prod].Products = pmcData.Hideout.Production["141"].Products;
            // give items BEFORE deleting the production
            for (let itemProd of pmcData.Hideout.Production[prod].Products) {
                pmcData = profile_f.handler.getPmcProfile(sessionID);

                let newReq = {
                    "item_id": itemProd._tpl,
                    "count": 1,
                    "tid": "ragfair"
                };

                output = move_f.addItem(pmcData, newReq, output, sessionID, true);
            }

            delete pmcData.Hideout.Production[prod];
			delete pmcData.Hideout.Production["141"];
            return output;
        }
    }

    return "";
}

function registerProduction(pmcData, body, sessionID) {
    for (let recipe in _database.hideout.production) {
        if (body.recipeId === _database.hideout.production[recipe]._id) {
            try {
                pmcData.Hideout.Production[_database.hideout.production[recipe]._id] = {
                    "Progress": 0,
                    "inProgress": true,
                    "RecipeId": body.recipeId,
                    "Products": [],
                    "SkipTime": 0,
                    "StartTime": Math.floor(Date.now() / 1000)
                };
            } catch (e) {
                logger.logError(`Attempted to register production of ${body.recipeId}, but no production was found in the profile.`)
            }
        }
    }
}

// BALIST0N, I got bad news for you
// we do need to implement these after all
// ...
// with that I mean manual implementation
// RIP, GL whoever is going to do this
function applyPlayerUpgradesBonuses(pmcData, bonus) {
    switch (bonus.type) {
        case "StashSize":

            for (let item in pmcData.Inventory.items) {
                if (pmcData.Inventory.items[item]._id == pmcData.Inventory.stash) {
                    pmcData.Inventory.items[item]._tpl = bonus.templateId;
                }
            }
            break;

        case "MaximumEnergyReserve":
            pmcData.Health.Energy.Maximum = 110;
            break;

        case "EnergyRegeneration":
        case "HydrationRegeneration":
        case "HealthRegeneration":
        case "DebuffEndDelay":
        case "ScavCooldownTimer":// Implemented.
        case "QuestMoneyReward":
        case "InsuranceReturnTime":
        case "ExperienceRate":
        case "SkillGroupLevelingBoost":
        case "RagfairCommission":
        case "AdditionalSlots":
        case "UnlockWeaponModification":
        case "TextBonus":
        case "FuelConsumption":
            break;
    }

    pmcData.Bonuses.push(bonus);
}

module.exports.upgrade = upgrade;
module.exports.upgradeComplete = upgradeComplete;
module.exports.putItemsInAreaSlots = putItemsInAreaSlots;
module.exports.takeItemsFromAreaSlots = takeItemsFromAreaSlots;
module.exports.toggleArea = toggleArea;
module.exports.singleProductionStart = singleProductionStart;
module.exports.continuousProductionStart = continuousProductionStart;
module.exports.scavCaseProductionStart = scavCaseProductionStart;
module.exports.takeProduction = takeProduction;