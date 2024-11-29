exports.cache = () => {
    if (!serverConfig.rebuildCache) {
        return;
    }
    
    logger.logInfo("Caching: templates.json");

    let base = {"err": 0, "errmsg": null, "data": {"Categories": [], "Items": []}};
    let inputDir = [
        "categories",
        "items"
    ];

    for (let path in inputDir) {
        let _data = fileIO.readParsed(db.templates[inputDir[path]]);
		if (path == 0) {
			base.data.Categories = _data;
		} else {
			base.data.Items = _data;
		}
    }

    fileIO.write(`./user/cache/templates.json`, base, true, false);
}