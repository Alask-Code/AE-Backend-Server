exports.execute = (url, info, sessionID) => {
	dialogue_f.handler.setRead(info.dialogs, sessionID);
    return response_f.emptyArrayResponse();
}