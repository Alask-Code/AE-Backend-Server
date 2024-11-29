exports.cache = () => {
    if (serverConfig.rebuildCache) {
        logger.logInfo("Caching: mods.json");    
        fileIO.write("user/cache/mods.json", modsConfig);
    }
}