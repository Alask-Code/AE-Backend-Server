"use strict";

class BundlesServer {
    constructor() {
        this.bundles = [];
        this.bundleBykey = {};
        this.backendUrl = `https://${serverConfig.ip}:${serverConfig.port}`;
    }

    initialize(sessionID) {
        for (const thisBundleName in res.bundles) {
            const thisBundle = res.bundles[thisBundleName];

            if (typeof thisBundle.manifest == 'undefined') {
                continue;
            }

            const serverDir = __dirname.replace(/\\/g, "/").replace('src/classes', '');
            const manifestPathSplit = thisBundle.manifest.split('/');
            const modName = manifestPathSplit[2];
            const manifestRead = fileIO.readParsed(serverDir + thisBundle.manifest).manifest;

            for (const thisItem of manifestRead) {
                if (typeof thisItem.relativePath == 'undefined' || typeof thisItem.key == 'undefined') {
                    continue;
                }
                const thisBundle = {
                    key: thisItem.key,
                    path: this.getHttpPath(thisItem.key),
                    filePath: serverDir + 'user/mods/' + modName + '/' + thisItem.relativePath,
                    dependencyKeys: (typeof thisItem.dependencyKeys != 'undefined') ? thisItem.dependencyKeys : []
                };

                this.bundles.push(thisBundle);
                this.bundleBykey[thisItem.key] = thisBundle;
            }
        }
    }

    getBundles(local) {
        let bundles = helper_f.clone(this.bundles);
        for (const bundle of bundles) {
            if (local) {
                bundle.path = bundle.filePath;
            }
            delete bundle.filePath;
        }
        return bundles;
    }

    getBundleByKey(key, local) {
        let bundle = helper_f.clone(this.bundleBykey[decodeURI(key)]);
        if (local) {
            bundle.path = bundle.filePath;
        }
        delete bundle.filePath;
        return bundle;
    }

    getHttpPath(key) {
        return `${this.backendUrl}/files/bundle/${key}`;
    }
}
module.exports.handler = new BundlesServer();