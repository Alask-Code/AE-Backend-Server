exports.execute = (url, info, sessionID) => {
	offraid_f.handler.addPlayer(sessionID, info);
}