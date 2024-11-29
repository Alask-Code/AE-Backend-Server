exports.execute = (sessionID, req, resp, body) => {
    let bundleKey = req.url.split('/bundle/')[1];

	logger.logInfo(`[BUNDLE]: ${req.url}`);
    
    let bundle = bundles_f.handler.getBundleByKey(bundleKey, true);
    let path = bundle.path;

    // send bundle
    server.sendFile(resp, path);
}