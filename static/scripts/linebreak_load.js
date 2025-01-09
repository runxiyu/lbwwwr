document.addEventListener("DOMContentLoaded", () => {
	var lib = window.texLineBreak_lib;
	var h = lib.createHyphenator(window['texLineBreak_hyphens_en-us']);
	var paras = [...document.querySelectorAll('p')];
	lib.justifyContent(paras, h);
});
