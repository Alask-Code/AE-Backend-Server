exports.execute = (url, info, sessionID) => {
	global._database.globals.time = Date.now() / 1000;
    return response_f.getBody(global._database.globals);
}