exports.execute = (url, info, sessionID) => response_f.getBody(
	[
		{
			"profileid": "scav" + sessionID, 
			"status": "Free", 
			"sid": "", 
			"ip": "", 
			"port": 0
		}, 
		{
			"profileid": "pmc" + sessionID, 
			"status": "Free", 
			"sid": "", 
			"ip": "", 
			"port": 0
		}
	]
);