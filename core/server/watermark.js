"use strict";

const textTable = [
"  ___  _ _                    _   _____                         ",
    " / _ \\| | |                  | | |  ___|                        ",
    "/ /_\\ \\ | |_ ___ _ __ ___  __| | | |__ ___  ___ __ _ _ __   ___ ",
    "|  _  | | __/ _ \\ '__/ _ \\/ _` | |  __/ __|/ __/ _` | '_ \\ / _ \\",
    "| | | | | ||  __/ | |  __/ (_| | | |__\\__ \\ (_| (_| | |_) |  __/",
    "\\_| |_/_|\\__\\___|_|  \\___|\\__,_| \\____/___/\\___\\__,_| .__/ \\___|",
    "                                                    | |         ",
    "                                                    |_|         ",
	"════════════════════════════════════════════════════════════════",

	"Version: " + server.version,
	"════════════════════════════════════════════════════════════════",

	"Author: https://github.com/Alask-Code",
  "2024 - Alask-Code",
  "Licensed under GPL License. see LICENSE or 'https://www.gnu.org/licenses/gpl-3.0.en.html#license-text'",
	"════════════════════════════════════════════════════════════════",

	"Tested with Altered Escape 2.2.0 and Tarkov 12.9.10988"
];

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
			box_spacing_between += (isUpper == 0)?" ":"═";//(isUpper == 1)?"─":(isUpper == 0)?" ":"─";
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
    logger.logRequest(`╔══${box_width_top}═════╗`);
    logger.logRequest(`║ ╔═${box_width_top}══╗ ║`);
	for (let idx of textTable){logger.logRequest(`║ ║ ${idx}${getBoxSpacing(0,idx)}  ║ ║`);	}
    logger.logRequest(`║ ╚══${box_width_top}═╝ ║`);
    logger.logRequest(`╚══${box_width_top}═════╝`);

}
// ├ ─ ┤ ║ ╗ ╔ ╝ ╚ ═ ╠ ╣ ╩