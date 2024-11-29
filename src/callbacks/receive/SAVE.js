exports.execute = (sessionID, req, resp, body, output) => {
    if (global._database.gameplayConfig.autosave.saveOnReceive) {
        savehandler_f.saveOpenSessions();
    }
}