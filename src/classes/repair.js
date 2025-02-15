"use strict";

exports.main = (pmcData, body, sessionID) => {
    let output = item_f.handler.getOutput();
    let trader = trader_f.handler.getTrader(body.tid, sessionID);
    let repairRate = (trader.repair.price_rate === 0) ? 1 : (trader.repair.price_rate / 100 + 1);

    // find the item to repair
    for (let repairItem of body.repairItems) {
        let itemToRepair = undefined;

        for (let item of pmcData.Inventory.items) {
            if (item._id === repairItem._id) {
                itemToRepair = item;
                break;
            }
        }

        if (itemToRepair === undefined) {
            continue;
        }

        // get repair price and pay the money
        let repairCost = Math.round(global._database.items[itemToRepair._tpl]._props.RepairCost * repairItem.count * repairRate);

        if (!helper_f.payMoney(pmcData, {"scheme_items": [{"id": repairItem._id, "count": repairCost}], "tid": body.tid}, sessionID)) {
            logger.logError("no money found");
            return "";
        }

        // change item durability
        let calculateDurability = itemToRepair.upd.Repairable.Durability + repairItem.count;

        if (itemToRepair.upd.Repairable.MaxDurability <= calculateDurability) {
            calculateDurability = itemToRepair.upd.Repairable.MaxDurability;
        }

        itemToRepair.upd.Repairable.Durability = calculateDurability;
        itemToRepair.upd.Repairable.MaxDurability = calculateDurability;

        //repairing mask cracks
        if ("FaceShield" in itemToRepair.upd && itemToRepair.upd.FaceShield.Hits > 0) {
            itemToRepair.upd.FaceShield.Hits = 0;
        }

        output.items.change.push(itemToRepair);
    }

    return output;
}