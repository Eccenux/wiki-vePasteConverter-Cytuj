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
		vePasta.initForm(`<span data-mw="{&quot;parts&quot;:[{&quot;template&quot;:{&quot;target&quot;:{&quot;wt&quot;:&quot;cite news&quot;,&quot;href&quot;:&quot;./Template:Cite_news&quot;},&quot;params&quot;:{&quot;title&quot;:{&quot;wt&quot;:&quot;Hagerty, 67, gained fame as comedian&quot;},&quot;url&quot;:{&quot;wt&quot;:&quot;https://www.beverlyreview.net/news/top_story/article_863200fc-d077-11ec-b60d-675bd020dc39.html&quot;},&quot;first&quot;:{&quot;wt&quot;:&quot;Bill&quot;},&quot;last&quot;:{&quot;wt&quot;:&quot;Figel&quot;},&quot;date&quot;:{&quot;wt&quot;:&quot;May 10, 2022&quot;},&quot;access-date&quot;:{&quot;wt&quot;:&quot;May 12, 2022&quot;},&quot;newspaper&quot;:{&quot;wt&quot;:&quot;The Beverly Review&quot;},&quot;archiveurl&quot;:{&quot;wt&quot;:&quot;https://web.archive.org/web/20220512013612/https://www.beverlyreview.net/news/top_story/article_863200fc-d077-11ec-b60d-675bd020dc39.html&quot;},&quot;archivedate&quot;:{&quot;wt&quot;:&quot;May 12, 2022&quot;},&quot;url-status&quot;:{&quot;wt&quot;:&quot;live&quot;}},&quot;i&quot;:0}}]}" data-ve-no-generated-contents="true" data-cx="[{&quot;adapted&quot;:false,&quot;targetExists&quot;:false}]" id="mwBJE" class="ve-pasteProtect" data-ve-attributes="{&quot;typeof&quot;:&quot;mw:Transclusion&quot;}">&nbsp;</span>`);

		// export
		this.vePasta = vePasta;
	}
	setupCss() {
		var el = document.createElement('style');
		el.type = 'text/css';
		el.media = 'screen';
		el.appendChild(document.createTextNode(window.plugin.mobileFoxUx.CSS));
		document.querySelector('head').appendChild(el);
	}
}
