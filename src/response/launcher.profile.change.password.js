exports.execute = (url, info, sessionID) => {
	let output = account_f.handler.changePassword(info);
    return (output === "") ? "FAILED" : "OK";
}