exports.execute = (url, info, sessionID) => response_f.getBody(trader_f.handler.getPurchasesData(url.substr(url.lastIndexOf('/') + 1), sessionID));
