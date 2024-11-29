exports.execute = (url, info, sessionID) => response_f.getBody(
	{
		"notifier": {
			"server": `${server.getBackendUrl()}/`, 
			"channel_id": "testChannel", 
			"url": `${server.getBackendUrl()}/notifierServer/get/${sessionID}`
		}, 
		"notifierServer": `${server.getBackendUrl()}/notifierServer/get/${sessionID}`
	}
);