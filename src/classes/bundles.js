"use strict";

const path = require('path');

class BundlesServer {
    constructor() {
        this.bundles = [];
        this.bundleBykey = {};
        this.backendUrl = `https://${serverConfig.ip}:${serverConfig.port}`;
    }

    initialize(sessionID) {
        for (const i in res.bundles) {
            if(!("manifest" in res.bundles[i])) {
                continue;
            }

            let manifestPath = res.bundles[i].manifest;
            let manifest = fileIO.readParsed(manifestPath).manifest;
            let modName = res.bundles[i].manifest.split("/")[2];
            let bundleDir = "";
            let manifestPathSplit = manifestPath.split("/");

            if(manifestPathSplit[3] === "res" && manifestPathSplit[4] === "bundles" && manifestPathSplit[6] === "manifest.json" ) {
                bundleDir = `${modName}/res/bundles/${manifestPathSplit[5]}/`;
            }

            for (const j in manifest) {
                let info = manifest[j];
                let dependencyKeys = ("dependencyKeys" in info) ? info.dependencyKeys : [];
                let httpPath = this.getHttpPath(bundleDir, info.key);
                let filePath = ("path" in info) ? info.path : this.getFilePath(bundleDir, info.key);
                let bundle = {
                    "key": info.key,
                    "path": httpPath,
                    "filePath" : filePath,
                    "dependencyKeys": dependencyKeys
                }

                this.bundles.push(bundle);
                this.bundleBykey[info.key] = bundle;
            }
        }
    }

    getBundles(local) {
        let bundles = helper_f.clone(this.bundles);
        for (const bundle of bundles) {
            if(local) {
                bundle.path = bundle.filePath;
            }
            delete bundle.filePath;
        }
        return bundles;
    }

    getBundleByKey(key, local) {
        let bundle = helper_f.clone(this.bundleBykey[key]);
        if(local) {
            bundle.path = bundle.filePath;
        }
        delete bundle.filePath;
        return bundle;
    }
    

    getFilePath(bundleDir, key) {
        return `${internal.path.join(__dirname).split("src")[0]}user/mods/${bundleDir}StreamingAssets/Windows/${key}`.replace(/\\/g, "/");
    }

    getHttpPath(bundleDir, key) {
        return `${this.backendUrl}/files/bundle/${key}`;
    }
}
module.exports.handler = new BundlesServer();