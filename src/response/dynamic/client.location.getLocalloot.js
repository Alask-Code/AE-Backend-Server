exports.execute = (url, info, sessionID) => {
	const params = new URL("https://127.0.0.1" + url).searchParams;
	return response_f.getBody(location_f.handler.get(params.get("locationId")));
}