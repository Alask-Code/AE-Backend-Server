exports.cache = () => {
    if (!serverConfig.rebuildCache) {
        return;
    }

    logger.logInfo("Caching: items.json");

    let base = {"err": 0, "errmsg": null, "data": {}};
    let inputFiles = db.items;
    for (let file in inputFiles) {
        let filePath = inputFiles[file];
        let NodeFileData = fileIO.readParsed(filePath);
		for (let items of NodeFileData)
		{
			base.data[items._id] = items;
		}
    }

    fileIO.write("user/cache/items.json", base, true, false);
}