// ==UserScript==
// @name        wiki vePasteConverter Cytuj
// @author      Eccenux
// @namespace   https://github.com/jonatkins/ingress-intel-total-conversion
// @version     0.1.3
// @description [0.1.3] Konwerter szablonów cytowania wklejonych z VE; Cytuj (refs).
// @updateURL   https://github.com/Eccenux/wiki-vePasteConverter-Cytuj/raw/master/vePasteConverter.meta.js
// @downloadURL https://github.com/Eccenux/wiki-vePasteConverter-Cytuj/raw/master/vePasteConverter.user.js
// @match       http://tools.wikimedia.pl/~malarz_pl/cgi-bin/convert.pl*
// @match       https://tools.wikimedia.pl/~malarz_pl/cgi-bin/convert.pl*
// @grant       none
// ==/UserScript==

var _css = /*css*/ `
#vepaste {
  display: block;
  border: 1px solid gray;
  padding: 0.5em;
}
#vepaste [data-ve-attributes] {
  display: block;
  background-color: lightcyan;
}
#vepaste [data-mw]::before {
  content: attr(data-mw);
}

`;

// init plugin namespace for exposed stuff
if(typeof window.plugin !== 'function') window.plugin = function() {};

// PLUGIN START //////////////////////////////////////////////////////////
// (function(){

/* global VePasta */
/**
 * Setup.
 */
// eslint-disable-next-line no-unused-vars
class Plugin {
	constructor(css) {
		this.css = css;
	}
	setup() {
		this.setupCss();

		const vePasta = new VePasta();
		//vePasta.initForm(`<span data-mw="{&quot;parts&quot;:[{&quot;template&quot;:{&quot;target&quot;:{&quot;wt&quot;:&quot;cite news&quot;,&quot;href&quot;:&quot;./Template:Cite_news&quot;},&quot;params&quot;:{&quot;title&quot;:{&quot;wt&quot;:&quot;Hagerty, 67, gained fame as comedian&quot;},&quot;url&quot;:{&quot;wt&quot;:&quot;https://www.beverlyreview.net/news/top_story/article_863200fc-d077-11ec-b60d-675bd020dc39.html&quot;},&quot;first&quot;:{&quot;wt&quot;:&quot;Bill&quot;},&quot;last&quot;:{&quot;wt&quot;:&quot;Figel&quot;},&quot;date&quot;:{&quot;wt&quot;:&quot;May 10, 2022&quot;},&quot;access-date&quot;:{&quot;wt&quot;:&quot;May 12, 2022&quot;},&quot;newspaper&quot;:{&quot;wt&quot;:&quot;The Beverly Review&quot;},&quot;archiveurl&quot;:{&quot;wt&quot;:&quot;https://web.archive.org/web/20220512013612/https://www.beverlyreview.net/news/top_story/article_863200fc-d077-11ec-b60d-675bd020dc39.html&quot;},&quot;archivedate&quot;:{&quot;wt&quot;:&quot;May 12, 2022&quot;},&quot;url-status&quot;:{&quot;wt&quot;:&quot;live&quot;}},&quot;i&quot;:0}}]}" data-ve-no-generated-contents="true" data-cx="[{&quot;adapted&quot;:false,&quot;targetExists&quot;:false}]" id="mwBJE" class="ve-pasteProtect" data-ve-attributes="{&quot;typeof&quot;:&quot;mw:Transclusion&quot;}">&nbsp;</span>`);
		vePasta.initForm();

		// export
		this.vePasta = vePasta;
	}
	setupCss() {
		var el = document.createElement('style');
		el.type = 'text/css';
		el.media = 'screen';
		el.appendChild(document.createTextNode(this.css));
		document.querySelector('head').appendChild(el);
	}
}

/* global vepaste */
/**
 * VE Paste core.
 */
// eslint-disable-next-line no-unused-vars
var VePasta = class {
	initForm(initialPaste) {
		// remove previous
		const prev = document.querySelector('#vepaste-main');
		if (prev) {
			prev.remove();
		}

		// create html
		const container = document.getElementById('mw_content');
		container.insertAdjacentHTML('beforeend', `
			<section id="vepaste-main">
				<h2>Kopia z VE:</h2>
				<p>Poniżej możesz wkleić szablon Cite z VE. 
					Tylko pierwszy szablon zostanie odczytany.
					Przed wklejeniem następnego wyczyść pole.</p>
				<div id="vepaste" style="border:1xp solid gray" contenteditable>test</div>
				<p>
					<input type="button" id="vepaste-source" value="Generuj źródło">
					<input type="button" id="vepaste-clear" value="Wyczyść">
				</p>
			</section>
		`);
		// actions
		const source = document.querySelector('#vepaste-source');
		const clear = document.querySelector('#vepaste-clear');
		source.addEventListener('click', () => {
			this.convert();
		});
		clear.addEventListener('click', () => {
			this.clear();
		});

		// test/saved html
		if (initialPaste) {
			vepaste.innerHTML = initialPaste;
		}
	}

	/** Clear action. */
	clear() {
		vepaste.innerHTML = '';
	}

	/** Convert pasted code to wikitext. */
	async convert() {
		let html = vepaste.innerHTML;
		// ignore empty
		if (!vepaste.firstElementChild) {
			return;
		}
		// prepare typeof attribute
		// (data-veAttributes should contain required attributes)
		if (vepaste.firstElementChild.dataset.veAttributes) {
			let veAttributes = JSON.parse(vepaste.firstElementChild.dataset.veAttributes);
			for (const name in veAttributes) {
				console.log(name, veAttributes);
				vepaste.firstElementChild.setAttribute(name, veAttributes[name]);
			}
			html = vepaste.firstElementChild.outerHTML;
		}

		// convert
		let re = await this.convertToWiki(html);
		console.log(re, vepaste.firstElementChild.dataset);

		// insert into wikitext field
		const wikiCodeField = document.querySelector('[name="source"]');
		if (wikiCodeField) {
			wikiCodeField.value = re;
			// auto-submit
			document.querySelector('form').submit();
		} else {
			alert('Błąd! Nie znaleziono pola tekstem źródłowym. Napisz zgłoszenie do pl:Nux.');
		}
		return re;
	}

	/** Convert HTML to wikitext (MW API). */
	async convertToWiki(html) {
		const data = new URLSearchParams();
		data.append('html', html);

		let re = await fetch("https://pl.wikipedia.org/api/rest_v1/transform/html/to/wikitext/", {
			"credentials": "omit",
			"body": data,
			"method": "POST",
			"Api-User-Agent": "VePasta; author=pl:Nux",
			"mode": "cors"
		}).then(re => re.text());

		return re;
	}

	/** Static test */
	async convertTest() {
		//var html = vepaste.innerHTML;
		let html = "<span typeof=\"mw:Transclusion\" data-mw=\"{&quot;parts&quot;:[{&quot;template&quot;:{&quot;target&quot;:{&quot;wt&quot;:&quot;cite news&quot;,&quot;href&quot;:&quot;./Template:Cite_news&quot;},&quot;params&quot;:{&quot;title&quot;:{&quot;wt&quot;:&quot;Hagerty, 67, gained fame as comedian&quot;},&quot;url&quot;:{&quot;wt&quot;:&quot;https://www.beverlyreview.net/news/top_story/article_863200fc-d077-11ec-b60d-675bd020dc39.html&quot;},&quot;first&quot;:{&quot;wt&quot;:&quot;Bill&quot;},&quot;last&quot;:{&quot;wt&quot;:&quot;Figel&quot;},&quot;date&quot;:{&quot;wt&quot;:&quot;May 10, 2022&quot;},&quot;access-date&quot;:{&quot;wt&quot;:&quot;May 12, 2022&quot;},&quot;newspaper&quot;:{&quot;wt&quot;:&quot;The Beverly Review&quot;},&quot;archiveurl&quot;:{&quot;wt&quot;:&quot;https://web.archive.org/web/20220512013612/https://www.beverlyreview.net/news/top_story/article_863200fc-d077-11ec-b60d-675bd020dc39.html&quot;},&quot;archivedate&quot;:{&quot;wt&quot;:&quot;May 12, 2022&quot;},&quot;url-status&quot;:{&quot;wt&quot;:&quot;live&quot;}},&quot;i&quot;:0}}]}\" data-ve-no-generated-contents=\"true\" data-cx=\"[{&quot;adapted&quot;:false,&quot;targetExists&quot;:false}]\" id=\"mwBJE\">&nbsp;</span>"
		let re = await this.convertToWiki(html);
		console.log(re, vepaste.firstElementChild);
		return re;
	}
}

// var vePasta = new VePasta();
// vePasta.initForm(`<span data-mw="{&quot;parts&quot;:[{&quot;template&quot;:{&quot;target&quot;:{&quot;wt&quot;:&quot;cite news&quot;,&quot;href&quot;:&quot;./Template:Cite_news&quot;},&quot;params&quot;:{&quot;title&quot;:{&quot;wt&quot;:&quot;Hagerty, 67, gained fame as comedian&quot;},&quot;url&quot;:{&quot;wt&quot;:&quot;https://www.beverlyreview.net/news/top_story/article_863200fc-d077-11ec-b60d-675bd020dc39.html&quot;},&quot;first&quot;:{&quot;wt&quot;:&quot;Bill&quot;},&quot;last&quot;:{&quot;wt&quot;:&quot;Figel&quot;},&quot;date&quot;:{&quot;wt&quot;:&quot;May 10, 2022&quot;},&quot;access-date&quot;:{&quot;wt&quot;:&quot;May 12, 2022&quot;},&quot;newspaper&quot;:{&quot;wt&quot;:&quot;The Beverly Review&quot;},&quot;archiveurl&quot;:{&quot;wt&quot;:&quot;https://web.archive.org/web/20220512013612/https://www.beverlyreview.net/news/top_story/article_863200fc-d077-11ec-b60d-675bd020dc39.html&quot;},&quot;archivedate&quot;:{&quot;wt&quot;:&quot;May 12, 2022&quot;},&quot;url-status&quot;:{&quot;wt&quot;:&quot;live&quot;}},&quot;i&quot;:0}}]}" data-ve-no-generated-contents="true" data-cx="[{&quot;adapted&quot;:false,&quot;targetExists&quot;:false}]" id="mwBJE" class="ve-pasteProtect" data-ve-attributes="{&quot;typeof&quot;:&quot;mw:Transclusion&quot;}">&nbsp;</span>`);
// //await vePasta.convertTest();
// vePasta.convert();
// PLUGIN END //////////////////////////////////////////////////////////

// _css will be provided via `gulp` build.
window.plugin.vePasteConverter = new Plugin(_css);

// })();

window.plugin.vePasteConverter.setup();