exports.execute = (url, body, sessionID) => {
	home_f.processSaveAccountsData(body, db.user.configs.accounts);
	return home_f.RenderAccountsConfigPage("/server/config/accounts");
}