exports.execute = (url, info, sessionID) => {
	let ids = Object.keys(account_f.handler.accounts).filter(x => x != sessionID);
	let users = [];
	for(let i in ids){
		let id = ids[i];
		if(!fileIO.exist(`user/profiles/${id}/character.json`)) continue;
		let character = fileIO.readParsed(`user/profiles/${id}/character.json`);
		if(!character.Info.Nickname || !character.Info.Nickname.toLowerCase().includes(info.nickname.toLowerCase())) continue;
		let obj = {Info: {}};
		obj._id = character.aid;
		obj.Info.Nickname = character.Info.Nickname;
		obj.Info.Side = character.Info.Side;
		obj.Info.Level = character.Info.Level;
		obj.Info.MemberCategory = character.Info.MemberCategory;
		obj.Info.Ignored = false;
		obj.Info.Banned = false;
		users.push(obj);
	}

	return response_f.getBody(users);
}