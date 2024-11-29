"use strict";
class LocaleServer {
    initialize() {
		global._database.locales.global['en'].interface["Attention! This is a Beta version of Escape from Tarkov for testing purposes."] = "Attention! This is Emulated version of \"Escape from Tarkov\". Provided by JustEmuTarkov Team (justemutarkov.eu).";
		global._database.locales.global['en'].interface["NDA free warning"] = "If you like this game make sure to support official creators of this game (BattleState Games).";
		global._database.locales.global['en'].interface["Offline raid description"] = "You are now entering an emulated version of a Tarkov raid. This emulated raid has all the features of a live version, but it has no connection to BSG's servers, and stays local on your PC.\nOther PMCs will spawn as emulated AI, and will spawn with randomized gear, levels, inventory, and names. This means you can loot, kill, and extract as you would online, and keep your inventory when you extract, but you cannot bring this loot into live EFT servers.\nIf you have any questions, don't hesitate to join the JustEmuTarkov Discord for assistance.";
		
		global._database.locales.global['ru'].interface["Attention! This is a Beta version of Escape from Tarkov for testing purposes."] = "Внимание! Это оффлайн версия игры \"Escape from Tarkov\", предоставленная командой JustEmuTarkov (justemutarkov.eu).";
		global._database.locales.global['ru'].interface["NDA free warning"] = "Поддержите создателей Escape From Tarkov - BattleState Games, если вам нравится эта игра.";
		global._database.locales.global['ru'].interface["Offline raid description"] = "Вы входите в оффлайн версию рейда. Он включает в себя все возможности оффициальной версии, но не имеет подключения к серверам BSG и работает локально на вашем ПК.\nДругие ЧВК появятся как ИИ и будут иметь случайное снаряжение, уровень, инвентарь и имена. Вы можете собирать лут, убивать других ЧВК и выходить с рейда так-же, как в онлайн версии, ваш инвентарь будет сохранен при выходе, но вы не можете перенести ваши вещи на оффициальную версию или наоборот.\nЕсли у вас есть вопросы, то присоедитесь к Discord серверу JustEmuTarkov.";
		
		global._database.locales.global['ge'].interface["Attention! This is a Beta version of Escape from Tarkov for testing purposes."] = "Achtung! Dies ist eine Emulierte Version von Escape From Tarkov! Zur verfügung gestellt vom JustEmutTarkov Team (justemutarkov.eu).";
		global._database.locales.global['ge'].interface["NDA free warning"] = "Wenn dir das Spiel gefällt unterstütze die Entwickler des Spiels (BattleState Games)";
		global._database.locales.global['ge'].interface["Offline raid description"] = "Du Betrittst eine Emulierte Version von Escape From Tarkov. Diese hat keine Verbindung zu den Servern von BattleState-Games und bleibt komplett auf deinem Computer. PMC Bots werden Spawnen mit zufälligen Namen, Level und Ausrüstung. Das bedeutet das du alles machen kannst was du auch in der Live-Version machen kannst sogar dein Inventar und dein Fortschritt im Spiel wird gespeichert. Falls du irgendwelche Fragen haben solltest kannst du dem JustEmuTarkov Discord Server beitreten!";
		
		global._database.locales.global['fr'].interface["Attention! This is a Beta version of Escape from Tarkov for testing purposes."] = "Attention! Ceci est la version émuler d'\"Escape from Tarkov\". Fournit par JustEmuTarkov Team (justemutarkov.eu).";
		global._database.locales.global['fr'].interface["NDA free warning"] = "Si vous aimez ce jeu, n'oubliez pas de supporter les créateurs officiels de ce jeu (BattleState Games).";
		global._database.locales.global['fr'].interface["Offline raid description"] = "Vous entez maintenant une version émuler d'un raid de Tarkov. Ce raid émulé contient toutes les fonctionnalités de la version \"live\" mais n'as pas de connexion au serveurs de BSG. Les autres joueurs dans le raid seront une AI qui apparaît avec des armures/niveaux/inventaire/nom aléatoires. Sa veut dire que vous pouvez loot, tuer et s'extraire de la map comme vous le feriez online, et garder votre inventaire quand vous vous enfuyez, mais vous pouvez pas transférer ce loot dans la version \"live\" du jeu. Si vous avez des questions, n'hésitez pas a rejoindre notre serveur discord \"JustEmuTarkov\" pour recevoir plus d'assistance.";
    }

    getLanguages() {
        return global._database.languages;
    }
    
    getMenu(lang = "en") {
		if(typeof global._database.locales.menu[lang] == "undefined")
			return global._database.locales.menu["en"];
        return global._database.locales.menu[lang];
    }
    
    getGlobal(lang = "en") {
		if(typeof global._database.locales.global[lang] == "undefined")
			return global._database.locales.global["en"];
        return global._database.locales.global[lang];
    }
}

module.exports.handler = new LocaleServer();