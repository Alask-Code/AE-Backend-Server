exports.execute = (url, info, sessionID) => {
	dialogue_f.handler.setDialoguePin(info.dialogId, true, sessionID);
    return response_f.emptyArrayResponse();
}