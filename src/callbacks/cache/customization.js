exports.cache = () => {
    if (!serverConfig.rebuildCache) {
        return;
    }

    logger.logInfo("Caching: customization.json");
    let base = {"err": 0, "errmsg": null, "data": {}};
    for (let file in db.customization) {
        let data = fileIO.readParsed(db.customization[file]);
		if(Object.keys(data)[0].length == 24){
			for(let q in data)
			{
				base.data[q] = data[q];
			}
		} else {
			base.data[file] = data;
		}
    }

    fileIO.write("user/cache/customization.json", base, true, false);
}