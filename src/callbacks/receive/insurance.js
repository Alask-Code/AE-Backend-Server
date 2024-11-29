exports.execute = (sessionID, req, resp, body, output) => {
    if (req.url === "/client/notifier/channel/create") {
        insurance_f.handler.checkExpiredInsurance();
    }
}