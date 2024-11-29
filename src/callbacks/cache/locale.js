exports.cache = () => {
    if (!serverConfig.rebuildCache) {
        return;
    }
    for (let locale in db.locales) {
		
        let base = { "interface": {}, "enum": [], "error": {}, "mail": {}, "quest": {}, "preset": {}, "handbook": {}, "season": {}, "templates": {}, "locations": {}, "banners": {}, "trading": {}}
		let inputNode = db.locales[locale];
		if(fileIO.exist(`./db/locales/${locale}/locale.json`)){
			logger.logInfo(`Caching: locale_${locale}.json(1) + locale_menu_${locale}.json`);
			// Loading from 1 file
			base = fileIO.readParsed(`./db/locales/${locale}/locale.json`);
		} else {
			logger.logInfo(`Caching: locale_${locale}.json + locale_menu_${locale}.json`);
			let inputDir = [
				"banners", "customization", "handbook", "locations",
				"mail", "preset", "quest", "season", "templates", "trading"
			];
			base.interface = fileIO.readParsed(inputNode.interface);
			base.error = fileIO.readParsed(inputNode.error);

			for (let name of inputDir) {
				// loop through all inputDir's
				base[name] = fileIO.readParsed(`./db/locales/${locale}/${name}.json`);
			}
		}
		
		let menu = fileIO.readParsed(inputNode.menu);
        fileIO.write(`user/cache/locale_${locale}.json`, base, true, false);
        fileIO.write(`user/cache/locale_menu_${locale}.json`, menu, true, false);
    }
}