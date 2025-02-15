function DetectInput(data, name){
	//console.log(typeof data + " " + data)
	if(data == "true" || data == "false" || data == true || data == false){
		let SelectedOption = (data === "true" || data === true);
		return "<select name='" + name + "'>" +
		"<option value='true' "+((SelectedOption)?"selected":"")+">true</option>" +
		"<option value='false' "+((!SelectedOption)?"selected":"")+">false</option>" +
		"</select>";
	}
	if(typeof data === "string")
		return "<input type='text' size='10' name='" + name + "' value='" + data + "'/>"
	if(typeof data === "number")
		if(data.toString().match(/[.]/))
			return "<input type='number' step='0.001' size='10' name='" + name + "' value='" + data + "'/>";
		else
			return "<input type='number' size='10' name='" + name + "' value='" + data + "'/>";

	return data;
}
function PageHeader(content){
	return '<html><head><title>JustEmuTarkov</title><link rel="stylesheet" id="style" href="style.css" type="text/css" media="all"><style>h2{font-size:16px;padding:3px 0 0 10px;margin:0;} h3{font-size:14px;padding:3px 0 0 15px;margin:0;} p{font-size:12px;padding:3px 0 0 25px;margin:0;} body{color:#fff;background:#000} table{border-bottom:1px solid #aaa;} .right{text-align:right;}</style></head><body>'+content+'</body></html>';

}
module.exports.RenderHomePage = () => {
	let html = "";
	html += `<div class="container">
	<div class="row">
		<div class="twelve columns">
			<h1>${server.name} ${server.version}</h1>
		</div>
	</div>
	<div class="row">
		<div class="six columns">
			<ul>
				<li><a href="/server/config/gameplay"> Gameplay Config </a></li>
				<li><a href="/server/config/server"> Server Config </a></li>
				<li><a href="/server/config/mods"> Mod's Config </a></li>
				<li><a href="/server/config/accounts"> Account's Config </a></li>
				<li><a href="/server/config/profiles"> Profile's Config </a></li>
			</ul>
		</div>
		<div class="six columns">
			<br/>
			<p><i> Our Website: <a href="https://justemutarkov.github.io/">${server.name} Website</a> </i></p>
			<p><i> Our Github: <a href="https://github.com/justemutarkov">${server.name} Github</a> </i></p>
			<p><i> More on our discord: <a href="https://discord.gg/mpB9Utz">discord.gg/mpB9Utz</a> </i></p>
		</div>
	</div>`;
	html += `</div>`;
	html = PageHeader(html); // adds header and footer + some stypes etc.
	return html;
}
module.exports.RenderGameplayConfigPage = (url_return) => {
	let data = fileIO.readParsed(db.user.configs.gameplay);
	let html = '<form action="'+url_return+'" method="post" class="form"><div class="container-full"><div class="row">';
	for(let category in data){
		html += '<div class="four columns"><ul><li><h2>' + category + '</h2></li>';
		for (let sub in data[category])
		{
			if(typeof data[category][sub] == "object"){
				html += "<li><h3>" + sub + "</h3></li>";
				for(let subSub in data[category][sub])
				{
					html += "<li><label for='"+subSub+"'>" + subSub + "</label>" + DetectInput(data[category][sub][subSub],subSub) + "<span></span></li>";
				}
			} else {
				html += "<li><label for='"+sub+"'>" + sub + "</label>" + DetectInput(data[category][sub],sub) + "<span></span></li>";
			}
		}
		html += "</ul></div>"
	}
	html += '<div class="twelve columns"><ul><li class=submit><input type="submit" value="Save"></li></ul></div></div></div></form>';	
	html = PageHeader(html); // adds header and footer + some stypes etc.
	return html;
}
module.exports.RenderAccountsConfigPage = (url_return) => {
	let data = fileIO.readParsed(db.user.configs.accounts);
	let html = '<div class="container-full"><div class="row">';
	for(let category in data){
		html += '<div class="four columns"><form action="'+url_return+'" method="post" class="form"><ul><li><h2>' + category + '</h2></li>';
		for (let sub in data[category])
		{
			if(typeof data[category][sub] == "object"){
				html += "<li><h3>" + sub + "</h3></li>";
				for(let subSub in data[category][sub])
				{
					if(subSub != "id" && subSub != "nickname")
						html += "<li><label for='"+subSub+"'>" + subSub + "</label>" + DetectInput(data[category][sub][subSub],subSub) + "<span></span></li>";
					else
					{
						html += "<li><label for='"+subSub+"'>" + subSub + "</label>" + data[category][sub][subSub] + "<span></span></li>";
					}
				}
			} else {
				if(sub != "id" && sub != "nickname")
					html += "<li><label for='"+sub+"'>" + sub + "</label>" + DetectInput(data[category][sub],sub) + "<span></span></li>";
				else
					html += "<li><label for='"+sub+"'><input type='hidden' value='" + data[category][sub] + "' name='" + sub + "'/>" + sub + "</label>" + data[category][sub] + "<span></span></li>";
			}
		}
		html += "<li class=submit><input type='submit' value='Save'></li></ul></form></div>";
	}
	html += '</div></div>';	
	html = PageHeader(html); // adds header and footer + some stypes etc.
	return html;
}
module.exports.RenderServerConfigPage = (url_return) => {
	
	let data = fileIO.readParsed(db.user.configs.server);
	let html = '<form action="'+url_return+'" method="post" class="form"><div class="container-full"><div class="row">';
	for(let category in data){
		html += '<div class="four columns"><ul>';
		if(typeof data[category] == "object"){
			html += '<li><h2>' + category + '</h2></li>';
			for (let sub in data[category])
			{
				if(typeof data[category][sub] == "object"){
					html += "<li><h3>" + sub + "</h3></li>";
					for(let subSub in data[category][sub])
					{
						html += "<li><label for='"+subSub+"'>" + subSub + "</label>" + DetectInput(data[category][sub][subSub],subSub) + "<span></span></li>";
					}
				} else {
					html += "<li><label for='"+sub+"'>" + sub + "</label>" + DetectInput(data[category][sub],sub) + "<span></span></li>";
				}
			}
		} else {
			html += "<li><label for='"+category+"'>" + category + "</label>" + DetectInput(data[category],category) + "<span></span></li>";
		}
		html += "</ul></div>"
	}
	html += '</div><div class="row"><div class="twelve columns"><ul><li class=submit><input type="submit" value="Save"></li></ul></div></div></div></form>';	
	html = PageHeader(html); // adds header and footer + some stypes etc.
	return html;
}
module.exports.RenderModsConfigPage = (url_return) => {
	let data = fileIO.readParsed(global.internal.resolve("user/configs/mods.json"));
	let html = '<form action="'+url_return+'" method="post" class="form"><div class="container"><div class="row">';
	for(let category in data)
	{
		html += '<div class="twelwe columns" style="text-align:center;margin:0;"><ul><li><h2>' + data[category].author + ' - ' + data[category].name + ' - ' + data[category].version + '</h2></li>';
		html += "<li><label for='enabled'>Enabled</label>" + DetectInput(data[category].enabled, data[category].author + '-' + data[category].name + '-' + data[category].version) + "<span></span></li>";
		html += "</ul></div>";
	}
	html += '</div><div class="row"><div class="twelve columns"><ul><li class=submit><input type="submit" value="Save"></li></ul></div></div></div></form>';
	html = PageHeader(html); // adds header and footer + some stypes etc.
	return html;
}
module.exports.renderPage = () => {
	// loads data
	let data = fileIO.readParsed(db.user.configs.gameplay);
	// render page
	
	let html = '<div class="container-full"><div class="row">';
	html += "This is Example Page In HTML<br>";
	html += 'We can add shit to it later, it supports full html/css and javascript as normal website and it has javascript backend';
	html += '</div></div>';//we need to end this with 2 div closing tags
	html = PageHeader(html); // this will render footer and header + some styles title of the page etc.

	return html;
	
}
function OutputConvert(data){
	// its not nececerly needed but its ok.
	if((data.match(/./g) || []).length > 1){
		return data; // this is IP man...
	}
	if(data.match(/[0-9]/g)){
		// its a number
		if(data.match(/[.]/)){
			// this one is float point one
			return parseFloat(data);
		} else {
			return parseInt(data, 10);
		}
	}
	if(data.match(/^([Tt][Rr][Uu][Ee]|[Ff][Aa][Ll][Ss][Ee])$/g)){
		return (data.toLowerCase() === "true")
	}
	//if(typeof data === "string")
	return data;
}

module.exports.processSaveServerData = (data, fileName) => {
	if(JSON.stringify(data) == "{}") return; // if its empty return
	let _data = fileIO.readParsed(fileName);
	for(let category in _data)
	{
		if(typeof _data[category] == "object"){
			for(let name in _data[category]){
				_data[category][name] = OutputConvert(data[name]);
				if(typeof _data[category][name] == "string")
					_data[category][name] = _data[category][name].replace(/[+]/g, " ");
			}
		} else {
			_data[category] = OutputConvert(data[category]);
		}
	}
	fileIO.write(fileName, _data);
}
module.exports.processSaveData = (data, fileName) => {
	if(JSON.stringify(data) == "{}") return; // if its empty return
	let _data = fileIO.readParsed(fileName);
	for(let category in _data)
	{
		for (let sub of _data[category])
		{
			if(typeof _data[category][sub] == "object"){
				for(let subSub in _data[category][sub])
				{
					let dataToSave = OutputConvert(data[subSub]);
					_data[category][sub][subSub] = dataToSave;
				}
			} else {
				let dataToSave = OutputConvert(data[sub]);
				_data[category][sub] = dataToSave;
			}
		}
	}
	fileIO.write(fileName, _data);
}
module.exports.processSaveAccountsData = (data, fileName) => {
	if(JSON.stringify(data) == "{}") return; // if its empty return
	let _data = fileIO.readParsed(fileName);
	//_data[data.id].nickname = (data.nickname;
	_data[data.id].email = data.email;
	_data[data.id].password = data.password;
	_data[data.id].wipe = data.wipe;
	_data[data.id].edition = data.edition.replace("+", " ").replace("%2B", " ").replace("+", " ").replace("%2B", " ");
	
	fileIO.write(global.internal.resolve(fileName), _data);
}
module.exports.processSaveModData = (data, fileName) => {
	if(JSON.stringify(data) == "{}") return; // if its empty return
	let _data = fileIO.readParsed(fileName);

	for(let modToChange in data)
	{
		for(let mod of _data){
			if(`${mod.author}-${mod.name}-${mod.version}` == modToChange){
				mod.enabled = data[modToChange];
			}
		}
	}
	fileIO.write(fileName, _data);
}