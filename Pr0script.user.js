// ==UserScript==
// @name         Pr0script
// @namespace    https://pr0gramm.com/
// @version      0.3
// @description  benis
// @author       gwz, flummi
// @match        http://pr0gramm.com/*
// @match        https://pr0gramm.com/*
// @updateURL    https://github.com/GoldenSpaceCat/Pr0script/raw/master/Pr0script.user.js
// @downloadURL  https://github.com/GoldenSpaceCat/Pr0script/raw/master/Pr0script.user.js
// @grant        unsafeWindow
// ==/UserScript==

var document = unsafeWindow.document;

var head = document.querySelector("head");

var style = document.createElement("style");

var css = "\
.comments .score:before {\
    content: attr(title) \", \";\
}\
.item-vote .score:before {\
    position: absolute;\
    font-size: 32%;\
    top: 50px;\
    width: 100px;\
    content: attr(title);\
.item-vote .score:before {\
    position: absolute;\
    font-size: 32%;\
    top: 50px;\
    width: 100px;\
    content: attr(title);\
}";

style.appendChild(document.createTextNode(css));

head.appendChild(style);