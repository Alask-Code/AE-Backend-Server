exports.execute = (url, info, sessionID) => {
	let TraderID = url.split("/");
	TraderID = TraderID[TraderID.length-1];
	return response_f.getBody(trader_f.handler.getAssort(sessionID, TraderID));
}