
exports.execute = (url, body, sessionID) => {
	global.server.softRestart();
	return {status: "OK"};
}