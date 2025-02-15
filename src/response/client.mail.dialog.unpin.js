exports.execute = (url, info, sessionID) => {
	dialogue_f.handler.setDialoguePin(info.dialogId, false, sessionID);
    return response_f.emptyArrayResponse();
}