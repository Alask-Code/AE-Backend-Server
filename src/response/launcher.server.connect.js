exports.execute = (url, info, sessionID) => {
	return fileIO.stringify({
        "backendUrl": server.getBackendUrl(),
        "name": server.getName(),
        "editions": Object.keys(db.profile)
    });
}