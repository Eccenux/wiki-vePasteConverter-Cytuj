// init plugin namespace for exposed stuff
if(typeof window.plugin !== 'function') window.plugin = function() {};

// _css will be provided via `gulp` build.
window.plugin.vePasteConverter = {
	CSS: _css,
	setup: ()=>{},
};
