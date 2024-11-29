exports.execute = (url, info, sessionID) => {
	let output = profile_f.handler.changeNickname(info, sessionID);
    
    if (output == "taken") {
        return response_f.getBody(null, 255, serverConfig.translations.alreadyInUse)
    }

    if (output == "tooshort") {
        return response_f.getBody(null, 256, serverConfig.translations.tooShort)
    }
    
    return response_f.getBody({"status": 0, "nicknamechangedate": Math.floor(new Date() / 1000)});
}
