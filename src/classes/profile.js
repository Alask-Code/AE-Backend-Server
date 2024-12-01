'use strict';
/*
* ProfileServer class maintains list of active profiles for each sessionID in memory. All first-time loads and save
* operations also write to disk.*
*/
class ProfileServer {
  constructor () {
    this.profiles = {};
  }
  initializeProfile (sessionID) {
    this.profiles[sessionID] = {};
    this.loadProfilesFromDisk(sessionID);
  }
  loadProfilesFromDisk (sessionID) {
    if(typeof sessionID == 'undefined')
      logger.throwErr('Session ID is undefined', '~/src/classes/profile.js | 19');
    try {
      this.profiles[sessionID]['pmc'] = fileIO.readParsed(getPmcPath(sessionID));
      this.generateScav(sessionID);
    } catch (e) {
      if (e instanceof SyntaxError) {
        return logger.logError(`There is a syntax error in the character.json file for AID ${sessionID}. This likely means you edited something improperly. Call stack: \n${e.stack}`);
      } else {
        return logger.logError(`There was an issue loading the user profile with session ID ${sessionID}. Call stack: \n${e.stack}`);
      }
    }
    logger.logSuccess(`Loaded profile for AID ${sessionID} successfully.`);
  }
  getOpenSessions () {
    return Object.keys(this.profiles);
  }
  saveToDisk (sessionID) {
    if ('pmc' in this.profiles[sessionID]) {
      fileIO.write(getPmcPath(sessionID), this.profiles[sessionID]['pmc']);
    }
  }
  /*
    * Get profile with sessionID of type (profile type in string, i.e. 'pmc').
    * If we don't have a profile for this sessionID yet, then load it and other related data
    * from disk.
    */
  getProfile (sessionID, type) {
    if (!(sessionID in this.profiles)) {
      this.initializeProfile(sessionID);
      dialogue_f.handler.initializeDialogue(sessionID);
      health_f.handler.initializeHealth(sessionID);
      insurance_f.handler.resetSession(sessionID);
    }
    return this.profiles[sessionID][type];
  }
  getProfileById (ID, type) {
    return fileIO.readParsed(`user/profiles/${ID}/character.json`);
  }
  getPmcProfile (sessionID) {
    return this.getProfile(sessionID, 'pmc');
  }
  getScavProfile (sessionID) {
    return this.getProfile(sessionID, 'scav');
  }
  setScavProfile (sessionID, scavData) {
    this.profiles[sessionID]['scav'] = scavData;
  }
  getCompleteProfile (sessionID) {
    let output = [];
    if (!account_f.handler.isWiped(sessionID)) {
      output.push(profile_f.handler.getPmcProfile(sessionID));
      output.push(profile_f.handler.getScavProfile(sessionID));
    }
    return output;
  }
  createProfile (info, sessionID) {
    let account = account_f.handler.find(sessionID);
    let folder = account_f.getPath(account.id);
    let ChoosedSide = info.side.toLowerCase();
    let ChoosedSideCapital = ChoosedSide.charAt(0).toUpperCase() + ChoosedSide.slice(1);
    let DefaultProfile = null;
    if (account.edition == 'Developer') {
      DefaultProfile = fileIO.readParsed(db.profile[account.edition]['character']);
    } else {
      DefaultProfile = fileIO.readParsed(db.profile[account.edition][('character_' + ChoosedSide)]);
    }
    //let Outfits = fileIO.readParsed(db.profile[account.edition].starting_outfit);
    let pmcData = DefaultProfile;
    // Set choosed side of player
    pmcData.Info.Side = pmcData.Info.Side.replace('__REPLACEME__', ChoosedSideCapital);
    pmcData.Info.Voice = pmcData.Info.Voice.replace('__REPLACEME__', ChoosedSideCapital);
    //pmcData.Customization = Outfits[ChoosedSide];
    let storage = { _id: '', suites: []};
    // delete existing profile
    if (this.profiles[account.id]) {
      delete this.profiles[account.id];
      events.scheduledEventHandler.wipeScheduleForSession(sessionID);
    }
    // pmc
    pmcData._id = 'pmc' + account.id;
    pmcData.aid = account.id;
    pmcData.savage = 'scav' + account.id;
    pmcData.Info.Nickname = info.nickname;
    pmcData.Info.LowerNickname = info.nickname.toLowerCase();
    pmcData.Info.Voice = customization_f.getCustomization()[info.voiceId]._name;
    pmcData.Customization.Head = info.headId;
    pmcData.Info.RegistrationDate = Math.floor(new Date() / 1000);
    pmcData.Health.UpdateTime = Math.round(Date.now() / 1000);
    // storage
    let def = fileIO.readParsed(db.profile[account.edition].storage);
    storage = {'err': 0,'errmsg': null,'data': { _id: pmcData._id, 'suites': def[ChoosedSide]}};
    // create profile
    fileIO.write(`${folder}character.json`, pmcData);
    fileIO.write(`${folder}storage.json`, storage);
    fileIO.write(`${folder}userbuilds.json`, {});
    fileIO.write(`${folder}dialogue.json`, {});
    // load to memory
    let profile = this.getProfile(account.id, 'pmc');
    // traders
    for (let traderID in db.traders) {
      trader_f.handler.resetTrader(account.id, traderID);
    }
    // don't wipe profile again
    account_f.handler.setWipe(account.id, false);
  }
  generateScav (sessionID) {
    let pmcData = this.getPmcProfile(sessionID);
    let scavData = bots_f.generatePlayerScav();
    scavData._id = pmcData.savage;
    scavData.aid = sessionID;
    // Set cooldown time.
    // Make sure to apply ScavCooldownTimer bonus from Hideout if the player has it.
    let currDt = Date.now() / 1000;
    let scavLockDuration = global._database.globals.config.SavagePlayCooldown;
    let modifier = 1;
    for (let bonus of pmcData.Bonuses) {
      if (bonus.type === 'ScavCooldownTimer') {
        // Value is negative, so add.
        // Also note that for scav cooldown, multiple bonuses stack additively.
        modifier += bonus.value / 100;
      }
    }
    scavLockDuration *= modifier;
    scavData.Info.SavageLockTime = currDt + scavLockDuration;
    this.profiles[sessionID]['scav'] = scavData;
    return scavData;
  }
  validateNickname (info, sessionID) {
    if (info.nickname.length < 3) {
      return 'tooshort';
    }
    if (account_f.handler.nicknameTaken(info)) {
      return 'taken';
    }
    return 'OK';
  }
  changeNickname (info, sessionID) {
    let output = this.validateNickname(info, sessionID);
    if (output === 'OK') {
      let pmcData = this.getPmcProfile(sessionID);
      pmcData.Info.Nickname = info.nickname;
      pmcData.Info.LowerNickname = info.nickname.toLowerCase();
    }
    return output;
  }
  changeVoice (info, sessionID) {
    let pmcData = this.getPmcProfile(sessionID);
    pmcData.Info.Voice = info.voice;
  }
}
function getPmcPath (sessionID) {
  let pmcPath = db.user.profiles.character;
  return pmcPath.replace('__REPLACEME__', sessionID);
}
function getStashType (sessionID) {
  let pmcData = profile_f.handler.getPmcProfile(sessionID);
  for (let item of pmcData.Inventory.items) {
    if (item._id === pmcData.Inventory.stash) {
      return item._tpl;
    }
  }
  logger.logError(`No stash found where stash ID is: ${pmcData.Inventory.stash}`);
  return '';
}
function calculateLevel (pmcData) {
  let exp = 0;
  for (let level in global._database.globals.config.exp.level.exp_table) {
    if (pmcData.Info.Experience < exp) {
      break;
    }
    pmcData.Info.Level = parseInt(level);
    exp += global._database.globals.config.exp.level.exp_table[level].exp;
  }
  return pmcData.Info.Level;
}
module.exports.handler = new ProfileServer();
module.exports.getStashType = getStashType;
module.exports.calculateLevel = calculateLevel;
