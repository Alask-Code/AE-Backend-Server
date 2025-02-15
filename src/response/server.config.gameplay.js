exports.execute = (url, body, sessionID) => {
	//execute data save here with info cause info should be $_GET transfered to json type with info[variableName]
	home_f.processSaveData(body, db.user.configs.gameplay);
	return home_f.RenderGameplayConfigPage("/server/config/gameplay");
}