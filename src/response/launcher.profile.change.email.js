exports.execute = (url, info, sessionID) => {
	let output = account_f.handler.changeEmail(info);
    return (output === "") ? "FAILED" : "OK";
}