function typesetLineBreaks() {
    console.log("Typesetting line breaks...");
    const lib = window.texLineBreak_lib;
    const h = lib.createHyphenator(window['texLineBreak_hyphens_en-us']);
    const paras = [...document.querySelectorAll('p')];
    lib.justifyContent(paras, h);
    console.log("Done typesetting line breaks.");
}

document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM content loaded,");
    typesetLineBreaks();
});

window.addEventListener("resize", (event) => {
    console.log("Window resized,");
    typesetLineBreaks();
});
