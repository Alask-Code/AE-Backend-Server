class Initializer 
{
  constructor() {
    this.initializeCore();
    this.initializeExceptions();
    this.initializeClasses();
    this.initializeItemRoute();
		
    // start watermark and server
    require('./server/watermark.js').run();

    server.start();
  }

  /* load core functionality */
  initializeCore() {
		
    global.internal = {};
    global.core = {};
    global.db = {}; // used only for caching
    global.res = {}; // used for deliver files
    global._database = {};

    global.startTimestamp = new Date().getTime();
		
    /* setup utilites */
    global.internal.fs = require('fs');
    global.internal.path = require('path');
    global.internal.util = require('util');
    global.internal.resolve = global.internal.path.resolve;
    global.internal.zlib = require('zlib');
    global.internal.https = require('https');
    global.internal.selfsigned = require('selfsigned');
    global.internal.psList = require('ps-list');
    global.internal.process = require('process');
    global.executedDir = internal.process.cwd();
		
    // internal packages
    global.fileIO = require('./util/fileIO.js');
    global.serverConfig = fileIO.readParsed('user/configs/server.json');
    global.modsConfig = fileIO.readParsed('user/configs/mods.json');
		
		
    global.utility = require('./util/utility.js');
    global.logger = (require('./util/logger.js').logger);
		
    /* setup core files */

    /* setup routes and cache */
    global.core.route = require('./server/route.js');
    global.core.route.all();

    /* core logic */
    global.router = (require('./server/router.js').router);
    global.events = require('./server/events.js');
    global.server = (require('./server/server.js').server);
  }

  /* load exception handler */
  initializeExceptions() {
    internal.process.on('uncaughtException', (error, promise) => {
      logger.logError('[Server]:' + server.getVersion());
      logger.logError('[Trace]:');
      logger.logData(error);
    });
  }

  /* load loadorder from cache */
  initializeItemRoute() {
    logger.logSuccess('Create: Item Action Callbacks');
    // Load Item Route's
    item_f.handler.updateRouteStruct();
    let itemHandlers = '';
    for(let iRoute in item_f.handler.routeStructure){
      itemHandlers += iRoute + ', ';
      item_f.handler.addRoute(iRoute, item_f.handler.routeStructure[iRoute]);
    }
    logger.logInfo('[Actions] ' + itemHandlers.slice(0, -2));
  }

  /* load classes */
  initializeClasses() {
    logger.logSuccess('Create: Classes as global variables');
    let path = executedDir + '/src/classes';
    let files = fileIO.readDir(path);
    let loadedModules = '';
    global['helper_f'] = require(executedDir + '/src/classes/helper.js');
    for(let file of files){
      loadedModules += file.replace('.js',', ');
      if(file === 'helper.js') continue;
      let name = file.replace('.js','').toLowerCase() + '_f';
      global[name] = require(executedDir + '/src/classes/' + file);
    }
    logger.logInfo('[Modules] ' + loadedModules.slice(0, -2));
  }
}
module.exports.initializer = new Initializer();