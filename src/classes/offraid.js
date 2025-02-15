"use strict";

class InraidServer {
    constructor() {
        // this needs to be saved on drive so if player closes server it can keep it going after restart
        this.players = {};
    }

    addPlayer(sessionID, info) {
        this.players[sessionID] = info;
    }

    removePlayer(sessionID) {
        delete this.players[sessionID];
    }

    removeMapAccessKey(offraidData, sessionID) {
        if (typeof offraid_f.handler.players[sessionID] == "undefined") {
            logger.logWarning("Disabling: Remove map key on entering, cause of offraid_f.handler.players[sessionID] is undefined");
            return;
        }
        let map = global._database.locations[offraid_f.handler.players[sessionID].Location.toLowerCase()].base;
        let mapKey = map.AccessKeys[0];

        if (!mapKey) {
            return;
        }

        for (let item of offraidData.profile.Inventory.items) {
            if (item._tpl === mapKey && item.slotId !== "Hideout") {
                let usages = -1

                if (!helper_f.getItem(mapKey)[1]._props.MaximumNumberOfUsage) {
                    usages = 1
                } else {
                    usages = ("upd" in item && "Key" in item.upd) ? item.upd.Key.NumberOfUsages : -1;
                }

                if (usages === -1) {
                    item.upd = { "Key": { "NumberOfUsages": 1 } };
                } else {
                    item.upd.Key.NumberOfUsages += 1;
                }

                if (item.upd.Key.NumberOfUsages >= helper_f.getItem(mapKey)[1]._props.MaximumNumberOfUsage) {
                    move_f.removeItemFromProfile(offraidData.profile, item._id);
                }

                break;
            }
        }
    }
}

/* adds SpawnedInSession property to items found in a raid */
function markFoundItems(pmcData, profile, isPlayerScav) {
    // mark items found in raid
    for (let offraidItem of profile.Inventory.items) {
        let found = false;

        // mark new items for PMC, mark all items for scavs
        if (!isPlayerScav) {
            // check if the item exists
            for (let item of pmcData.Inventory.items) {
                if (offraidItem._id === item._id) {
                    found = true;
                    break;
                }
            }

            if (found) {
                // if the item exists and is taken inside the raid, remove the taken in raid status
                if ("upd" in offraidItem && "SpawnedInSession" in offraidItem.upd) {
                    delete offraidItem.upd.SpawnedInSession;
                }

                continue;
            }
        }

        // mark item found in raid
        if ("upd" in offraidItem) {
            offraidItem.upd.SpawnedInSession = true;
        } else {
            offraidItem.upd = { "SpawnedInSession": true };
        }
    }

    return profile;
}

function RemoveFoundItems(profile) {
    for (let offraidItem of profile.Inventory.items) {
        // Remove the FIR status if the player died and the item marked FIR
        if ("upd" in offraidItem && "SpawnedInSession" in offraidItem.upd) {
            delete offraidItem.upd.SpawnedInSession;
        }

        continue;
    }

    return profile;
}

function setInventory(pmcData, profile) {
    move_f.removeItemFromProfile(pmcData, pmcData.Inventory.equipment);
    move_f.removeItemFromProfile(pmcData, pmcData.Inventory.questRaidItems);
    move_f.removeItemFromProfile(pmcData, pmcData.Inventory.questStashItems);

    // Bandaid fix to duplicate IDs being saved to profile after raid. May cause inconsistent item data. (~Kiobu)
    let duplicates = []

    x: for (let item of profile.Inventory.items) {
        for (let key in pmcData.Inventory.items) {
            let currid = pmcData.Inventory.items[key]._id
            if (currid == item._id) {
                duplicates.push(item._id)
                continue x;
            }
        }
        pmcData.Inventory.items.push(item);
    }
    pmcData.Inventory.fastPanel = profile.Inventory.fastPanel;

    if (duplicates.length > 0) {
        logger.logWarning(`Duplicate ID(s) encountered in profile after-raid. Found ${duplicates.length} duplicates. Ignoring...`)
    }

    return;
}

function deleteInventory(pmcData) {
    let toDelete = [];

    for (let item of pmcData.Inventory.items) {
        // remove normal item
        if (item.parentId === pmcData.Inventory.equipment
            && item.slotId !== "SecuredContainer"
            && item.slotId !== "Scabbard"
            && item.slotId !== "Pockets"
            && item.slotId !== "Compass"
            && item.slotId !== "ArmBand"
            || item.parentId === pmcData.Inventory.questRaidItems) {
            toDelete.push(item._id);
        }

        // remove pocket insides
        if (item.slotId === "Pockets") {
            for (let pocket of pmcData.Inventory.items) {
                if (pocket.parentId === item._id) {
                    toDelete.push(pocket._id);
                }
            }
        }
    }

    // delete items
    for (let item of toDelete) {
        move_f.removeItemFromProfile(pmcData, item);
    }

    pmcData.Inventory.fastPanel = {}
    return;
}

function getPlayerGear(items) {
    // Player Slots we care about
    const inventorySlots = [
        'FirstPrimaryWeapon',
        'SecondPrimaryWeapon',
        'Holster',
        'Headwear',
        'Earpiece',
        'Eyewear',
        'FaceCover',
        'ArmorVest',
        'TacticalVest',
        'ArmBand',
        'Backpack',
        'pocket1',
        'pocket2',
        'pocket3',
        'pocket4',
        "SecuredContainer"
    ];

    let inventoryItems = [];

    // Get an array of root player items
    for (let item of items) {
        if (inventorySlots.includes(item.slotId)) {
            inventoryItems.push(item);
        }
    }

    // Loop through these items and get all of their children
    let newItems = inventoryItems;
    while (newItems.length > 0) {
        let foundItems = [];

        for (let item of newItems) {
            // Find children of this item
            for (let newItem of items) {
                if (newItem.parentId === item._id) {
                    foundItems.push(newItem);
                }
            }
        }

        // Add these new found items to our list of inventory items
        inventoryItems = [
            ...inventoryItems,
            ...foundItems,
        ];

        // Now find the children of these items
        newItems = foundItems;
    }

    return inventoryItems;
}

function getSecuredContainer(items) {
    // Player Slots we care about
    const inventorySlots = [
        'SecuredContainer',
    ];

    let inventoryItems = [];

    // Get an array of root player items
    for (let item of items) {
        if (inventorySlots.includes(item.slotId)) {
            inventoryItems.push(item);
        }
    }

    // Loop through these items and get all of their children
    let newItems = inventoryItems;

    while (newItems.length > 0) {
        let foundItems = [];

        for (let item of newItems) {
            for (let newItem of items) {
                if (newItem.parentId === item._id) {
                    foundItems.push(newItem);
                }
            }
        }

        // Add these new found items to our list of inventory items
        inventoryItems = [
            ...inventoryItems,
            ...foundItems,
        ];

        // Now find the children of these items
        newItems = foundItems;
    }

    return inventoryItems;
}

function saveProgress(offraidData, sessionID) {
    if (!global._database.gameplayConfig.inraid.saveLootEnabled) {
        return;
    }
    // TODO: FOr now it should work untill we figureout whats is fucked at dll - it will also prevent future data loss and will eventually disable feature then crash everything in the other hand. ~Maoci
    let offlineWorksProperly = false;
    if (typeof offraid_f.handler.players[sessionID] != "undefined") {
        if (fileIO.exist(db.locations.base[offraid_f.handler.players[sessionID].Location.toLowerCase()])) {
            offlineWorksProperly = true;
        }
    }
    let insuranceEnabled = false;
    if (!offlineWorksProperly) {
        logger.logWarning("insurance Disabled!! cause of varaible undefined or file not found. Check line 270 - 272 at src/classes/offraid.js");
    } else {
        let map = fileIO.readParsed(db.locations.base[offraid_f.handler.players[sessionID].Location.toLowerCase()]);
        insuranceEnabled = map.Insurance;
    }
    if (typeof offraidData == "undefined") {
        logger.logError("offraidData" + offraidData);
        return;
    }
    if (typeof offraidData.exit == "undefined" || typeof offraidData.isPlayerScav == "undefined" || typeof offraidData.profile == "undefined") {
        logger.logError("offraidData variables are empty... (exit, isPlayerScav, profile)");
        logger.logError(offraidData.exit);
        logger.logError(offraidData.isPlayerScav);
        logger.logError(offraidData.profile);
        return;
    }
    let pmcData = profile_f.handler.getPmcProfile(sessionID);
    let scavData = profile_f.handler.getScavProfile(sessionID);
    const isPlayerScav = offraidData.isPlayerScav;
    const isDead = (offraidData.exit !== "survived" && offraidData.exit !== "runner");
    const preRaidGear = (isPlayerScav) ? [] : getPlayerGear(pmcData.Inventory.items);

    // set pmc data
    if (!isPlayerScav) {
        pmcData.Info.Level = offraidData.profile.Info.Level;
        pmcData.Skills = offraidData.profile.Skills;
        pmcData.Stats = offraidData.profile.Stats;
        pmcData.Encyclopedia = offraidData.profile.Encyclopedia;
        pmcData.ConditionCounters = offraidData.profile.ConditionCounters;
        pmcData.Quests = offraidData.profile.Quests;

        // For some reason, offraidData seems to drop the latest insured items.
        // It makes more sense to use pmcData's insured items as the source of truth.
        offraidData.profile.InsuredItems = pmcData.InsuredItems;

        // add experience points
        pmcData.Info.Experience += pmcData.Stats.TotalSessionExperience;
        pmcData.Stats.TotalSessionExperience = 0;

        // level 69 cap to prevent visual bug occuring at level 70
        if (pmcData.Info.Experience > 23129881) {
            pmcData.Info.Experience = 23129881;
        }

        // Remove the Lab card
        offraid_f.handler.removeMapAccessKey(offraidData, sessionID);
        offraid_f.handler.removePlayer(sessionID);
    }

    //Check for exit status
    if (offraidData.exit === "survived") {
        // mark found items and replace item ID's if the player survived
        offraidData.profile = markFoundItems(pmcData, offraidData.profile, isPlayerScav);
    } else {
        //Or remove the FIR status if the player havn't survived
        offraidData.profile = RemoveFoundItems(offraidData.profile)
    }
    // check for playerId in the item ID and replace
    let raidItems = offraidData.profile.Inventory.items
    for (let item of raidItems) {
        if (item._id.includes(`AID`)) {
            item._id = utility.generateNewItemId();
        }
    }
    // set profile equipment to the raid equipment
    if (isPlayerScav) {
        setInventory(scavData, offraidData.profile, sessionID, true);
        health_f.handler.initializeHealth(sessionID);
        profile_f.handler.setScavProfile(sessionID, scavData);
        return;
    } else {
        setInventory(pmcData, offraidData.profile);
        health_f.handler.saveHealth(pmcData, offraidData.health, sessionID);
    }

    // remove inventory if player died and send insurance items
    //TODO: dump of prapor/therapist dialogues that are sent when you die in lab with insurance.
    if (insuranceEnabled) {
        insurance_f.handler.storeLostGear(pmcData, offraidData, preRaidGear, sessionID);
    }

    if (isDead) {
        if (insuranceEnabled) {
            insurance_f.handler.storeDeadGear(pmcData, offraidData, preRaidGear, sessionID);
        }
        deleteInventory(pmcData);

        //remove quest conditions related to QuestItem to avoid causing the item not spawning
        removeQuestConditions(pmcData);

        //Delete carried quests items
        offraidData.profile.Stats.CarriedQuestItems = []
    }
    if (insuranceEnabled) {
        insurance_f.handler.sendInsuredItems(pmcData, sessionID);
    }
}

// Takes a pmcData object and removes completed conditions in profile's quests section for quest items lost when dying
// example: Extortionist's Folder
function removeQuestConditions(pmcData) {

    const completedConditionsArray = Object.keys(pmcData.BackendCounters); // Create array of quest conditions that have been completed

    if (questFindItemArray.length == 0) {
        cacheFindItemConditions(); // If this array hasn't been created then create it
    }

    let questStashItemArray = [];
    for (const thisItemObj of pmcData.Inventory.items) { // Create an array of stashed quest items
        if (typeof thisItemObj.parentId != 'undefined' && thisItemObj.parentId == pmcData.Inventory.questStashItems) {
            questStashItemArray.push(thisItemObj._tpl);
        }
    }

    for (let thisQuestObj of pmcData.Quests) {
        // If this is a quest in progress with completedConditions
        if (typeof thisQuestObj.status != 'undefined' && thisQuestObj.status.toLowerCase() == 'started' && typeof thisQuestObj.completedConditions != 'undefined' && thisQuestObj.completedConditions.length > 0) {
            // Only keep "find item" conditions that have been turned into the quest giver, "find item" conditions where the quest item has been stashed, and conditions that are not "find item" type
            thisQuestObj.completedConditions = thisQuestObj.completedConditions.filter(thisCondition => !questFindItemArray.includes(thisCondition) || completedConditionsArray.includes(thisCondition)
                || (typeof questConditionTargets[thisCondition] != 'undefined' && arrayIncludesAny(questStashItemArray, questConditionTargets[thisCondition])));
        }
    }

    return;
}

let questFindItemArray = []; // Needs to be in class scope
let questConditionTargets = {};
function cacheFindItemConditions() {
    const questDB = global._database.quests;
    const itemDB = global._database.items;

    for (const thisQuestObj of questDB) {
        if (typeof thisQuestObj.conditions != 'undefined' && thisQuestObj.conditions.AvailableForFinish != 'undefined') {
            for (const thisConditionObj of thisQuestObj.conditions.AvailableForFinish) {
                if (thisConditionObj._parent == 'FindItem') { // Quest items are always in FindItem class quests
                    if (thisConditionObj._props.target.length > 0) {
                        const thisConditionID = thisConditionObj._props.id;

                        questConditionTargets[thisConditionID] = thisConditionObj._props.target; // Save targets of this condition for reference when checking stashed quest items

                        for (const thisFindItem of thisConditionObj._props.target) {
                            // If the target of this condition is marked as a quest item
                            if (typeof itemDB[thisFindItem] != 'undefined' && typeof itemDB[thisFindItem]._props != 'undefined' && typeof itemDB[thisFindItem]._props.QuestItem != 'undefined'
                                && itemDB[thisFindItem]._props.QuestItem && !questFindItemArray.includes(thisConditionID)) {
                                questFindItemArray.push(thisConditionID);
                            }
                        }
                    }
                }
            }
        }
    }
}

function arrayIncludesAny(array1, array2) {
    let result = false;

    for (const thisElement of array2) {
        if (array1.includes(thisElement)) {
            result = true;
            break;
        }
    }

    return result;
}

module.exports.handler = new InraidServer();
module.exports.saveProgress = saveProgress;
module.exports.getSecuredContainer = getSecuredContainer;
module.exports.getPlayerGear = getPlayerGear;
module.exports.markFoundItems = markFoundItems;
module.exports.RemoveFoundItems = RemoveFoundItems;
module.exports.setInventory = setInventory;
module.exports.deleteInventory = deleteInventory;
module.exports.removeQuestConditions = removeQuestConditions;
