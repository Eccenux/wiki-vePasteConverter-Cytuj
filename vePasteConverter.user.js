// ==UserScript==
// @author      Eccenux
// @name        wiki vePasteConverter Cytuj
// @namespace   https://github.com/jonatkins/ingress-intel-total-conversion
// @version     0.0.1
// @description [0.0.1] Konwerter szablonów cytowania wklejonych z VE; Cytuj (refs).
// @updateURL   https://github.com/Eccenux/wiki-vePasteConverter-Cytuj/raw/master/vePasteConverter.meta.js
// @downloadURL https://github.com/Eccenux/wiki-vePasteConverter-Cytuj/raw/master/vePasteConverter.user.js
// @match       http://tools.wikimedia.pl/~malarz_pl/cgi-bin/convert.pl*
// @match       https://tools.wikimedia.pl/~malarz_pl/cgi-bin/convert.pl*
// @grant       none
// ==/UserScript==

var _css = /*css*/ `

`;

// init plugin namespace for exposed stuff
if(typeof window.plugin !== 'function') window.plugin = function() {};

// _css will be provided via `gulp` build.
window.plugin.vePasteConverter = {
	CSS: _css,
	setup: ()=>{},
};

/**
 * VE Paste core.
 */
var VePasta = class {
}
// PLUGIN END //////////////////////////////////////////////////////////

window.plugin.vePasteConverter.setup();