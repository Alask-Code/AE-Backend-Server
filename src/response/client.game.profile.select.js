exports.execute = (url, info, sessionID) => response_f.getBody({'status':'ok', 'notifier': {'server': server.getBackendUrl() + '/', 'channel_id': 'testChannel'}});
