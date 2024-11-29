exports.execute = (url, info, sessionID) => {
	return response_f.getBody(
		{
			"queued": false, 
			"banTime": 0, 
			"hash": "BAN0", 
			"lang": "en", 
			"aid": sessionID, 
			"token": "token_" + sessionID, 
			"taxonomy": "341", 
			"activeProfileId": 
			"user" + sessionID + "pmc", 
			"nickname": "user", 
			"backend": {
				"Trading": server.getBackendUrl(), 
				"Messaging": server.getBackendUrl(), 
				"Main": server.getBackendUrl(), 
				"RagFair": server.getBackendUrl()
			}, 
			"totalInGame": 0
		}
	);
}