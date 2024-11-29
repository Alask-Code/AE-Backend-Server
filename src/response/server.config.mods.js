exports.execute = (url, body, sessionID) => {
	home_f.processSaveModData(body, global.internal.resolve("user/configs/mods.json"));
	return home_f.RenderModsConfigPage("/server/config/mods");
}