exports.cache = () => {
    if (!serverConfig.rebuildCache) {
        return;
    }

    logger.logInfo("Caching: weather.json");

    let base = {"err": 0, "errmsg": null, "data": []};
    let inputFiles = db.weather;

    for (let file in inputFiles) {
        let filePath = inputFiles[file];
        let fileData = fileIO.readParsed(filePath);

        base.data.push(fileData);
    }

    fileIO.write(`./user/cache/weather.json`, base, true, false);
}