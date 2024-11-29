"use strict";


const textTable = [
	"Altered Escape Backend Server | " + server.version,
	"« Discord no Longer Exists »"
];
console.log(server);

/* Calculate Box Sizes - START */
var longestTextTableIndex = 0;
function getBoxSpacing(isUpper = 0, text = ""){
	let box_spacing_between = "";
	if(text != "")
	{ // isUpper [0]; text [(!= "")]
		let diffrence = Math.abs(text.length - textTable[longestTextTableIndex].length);
		for (let i = 0; i < diffrence; i++) {
			box_spacing_between += " ";
		}
	} else 
	{ // isUpper [0 => "", 1 => "▄", 2 => "▀"]; text [(== "")]
		for (let i = 0; i < textTable[longestTextTableIndex].length; i++) {
			box_spacing_between += (isUpper == 0)?" ":"─";//(isUpper == 1)?"─":(isUpper == 0)?" ":"─";
		}
	}
	return box_spacing_between;
}
/* Calculate Box Sizes - END */

module.exports.run = () => {
    /* set window name */
	internal.process.stdout.setEncoding('utf8');
    internal.process.title = textTable[0];

	// Get longest string here
	let lastText = "";
	for(let idx in textTable){
		if (textTable[idx].length >= lastText.length) {
			lastText = textTable[idx];
			longestTextTableIndex = idx;
		}
	}
	
    let box_width_top = getBoxSpacing(1);
    let box_width_bot = getBoxSpacing(2);
    let box_width_spa = getBoxSpacing();

    /* reset cursor to begin */
    internal.process.stdout.write('\u001B[2J\u001B[0;0f');

    /* Intro Display */
    logger.logRequest(`┌─${box_width_top}─┐`);
	for (let idx of textTable)
	{
		logger.logRequest(`│ ${idx}${getBoxSpacing(0,idx)} │`);
	}
    logger.logRequest(`└─${box_width_bot}─┘`);
}