exports.execute = (url, info, sessionID) => {
	dialogue_f.handler.removeDialogue(info.dialogId, sessionID);
    return response_f.emptyArrayResponse();
}