exports.execute = (url, info, sessionID) => {
	let myID = url.replace("/server/profile/pmc", "").replace("/server/profile/scav","");
	return response_f.getBody(profile_f.handler.getProfileById(myID));
}