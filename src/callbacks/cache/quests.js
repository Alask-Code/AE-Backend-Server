exports.cache = () => {
    if (!serverConfig.rebuildCache) {
        return;
    }
    logger.logInfo("Caching: quests.json");
    let base = {"err": 0, "errmsg": null, "data": []};
	for(let quest in db.quests){
		let data = fileIO.readParsed(db.quests[quest]);
		if(typeof data.length != "undefined"){
			for(let q in data)
			{
				base.data.push(data[q]);
			}
		} else {
			base.data.push(data);
		}
	}
    fileIO.write("user/cache/quests.json", base, true, false);
}