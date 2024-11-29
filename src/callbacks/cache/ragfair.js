// TODO: this will require some rewrite

exports.cache = () => {
    if (!serverConfig.rebuildCache) {
        return;
    }

    logger.logInfo("Caching: ragfair_offers.json");

    let response = {"categories": {}, "offers": [], "offersCount": 100, "selectedCategory": "5b5f78dc86f77409407a7f8e"};
    let offers = [];
    let counter = 0;

    for (let trader in db.traders) {
        if (trader === "ragfair" || trader === "579dc571d53a0658a154fbec") {
            continue;
        }
        let allAssort = fileIO.readParsed("./user/cache/assort_" + trader + ".json");
        allAssort = allAssort.data;
    
        for (let itemAssort of allAssort.items) {
            if (itemAssort.slotId === "hideout") {
                let barter_scheme = null;
                let loyal_level = 0;

                let itemsToSell = [];
                itemsToSell.push(itemAssort);
                itemsToSell = [...itemsToSell, ...findChildren(itemAssort._id, allAssort.items)];

                for (let barterFromAssort in allAssort.barter_scheme) {
                    if (itemAssort._id == barterFromAssort) {
                        barter_scheme = allAssort.barter_scheme[barterFromAssort][0];
                        break;
                    }
                }

                for (let loyal_levelFromAssort in allAssort.loyal_level_items) {
                    if (itemAssort._id == loyal_levelFromAssort) {
                        loyal_level = allAssort.loyal_level_items[loyal_levelFromAssort];
                        break;
                    }
                }

                offers = offers.concat(loadCache(itemsToSell, barter_scheme, loyal_level, trader, counter)); 
                counter += 1;
            }
        } 
    }

    response.offers = offers;
    fileIO.write("user/cache/ragfair_offers.json", response, true, false);
}

function loadCache(itemsToSell, barter_scheme, loyal_level, trader, counter = 911) {
    let offers = [];
    let offerBase = fileIO.readParsed(db.base.fleaOffer);
    let traderObj = fileIO.readParsed(db.traders[trader].base);

    offerBase._id = itemsToSell[0]._id;
    offerBase.intId = counter;
    offerBase.user = {
        "id": traderObj._id,
        "memberType": 4,
        "nickname": traderObj.surname,
        "rating": 1,
        "isRatingGrowing": true,
        "avatar": traderObj.avatar
    };
    offerBase.root = itemsToSell[0]._id;
    offerBase.items = itemsToSell;
    offerBase.requirements = barter_scheme;
    offerBase.loyaltyLevel = loyal_level;

    offers.push(offerBase);
    return offers;
}

//find childs of the item in a given assort (weapons pars for example, need recursive loop function)
function findChildren(itemIdToFind, assort) {
    let Array = [];
    
    for (let itemFromAssort of assort) {
        if (itemFromAssort.parentId == itemIdToFind) {   
            Array.push(itemFromAssort)
            Array = Array.concat(findChildren(itemFromAssort._id, assort));
        }
    }

    return Array;
}