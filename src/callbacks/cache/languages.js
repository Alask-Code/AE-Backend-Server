exports.cache = () => {
    if (!serverConfig.rebuildCache) {
        return;
    }
    
    let base = {"err": 0, "errmsg": null, "data": []};

    for (let file in db.locales) {
		if(typeof db.locales[file][file] == "undefined")
			throw "db.locales[" + file + "][" + file + "] not found";
		if(typeof db.locales[file][file] == "object")
			throw "db.locales[" + file + "][" + file + "] is not a path";
        let fileData = fileIO.readParsed(db.locales[file][file]);
        base.data.push(fileData);
    }

    fileIO.write("user/cache/languages.json", base, true, false);
}