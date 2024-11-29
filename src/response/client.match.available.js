exports.execute = (url, info, sessionID) => {
	let output = match_f.handler.getEnabled();
  
    if (output === false) {
        return response_f.getBody(null, 999, "Offline mode enabled, if you are a server owner please change that in gameplay settings");
    }
  
    return response_f.getBody(output);
}