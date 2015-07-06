// ==UserScript==
// @name         Pr0script
// @namespace    https://pr0gramm.com/
// @version      1.0.3
// @description  benis
// @author       gwz, flummi
// @match        http://pr0gramm.com/*
// @match        https://pr0gramm.com/*
// @updateURL    https://github.com/GoldenSpaceCat/Pr0script/raw/master/Pr0script.user.js
// @downloadURL  https://github.com/GoldenSpaceCat/Pr0script/raw/master/Pr0script.user.js
// @icon         http://pr0gramm.com/media/pr0gramm-favicon.png
// @grant        unsafeWindow
// @run-at       document-start
// ==/UserScript==

var window = unsafeWindow;
var document = window.document;
var head = document.querySelector("head");

// this will hold additional css
var style = document.createElement("style");

// this adds benis up / down votes to comments
var css = "\
.comments .score:before {\
	content: attr(title) \", \";\
}";

// this adds benis up / down votes to items
css += "\
.item-vote .score:before {\
	position: absolute;\
	font-size: 13px;\
	top: 50px;\
	width: 100px;\
	content: attr(title);\
}";

// benisBar will visualize item votes
css += "\
.benisBar.young {\
	opacity: 0.4;\
}\
.benisBar {\
	height: 60px;\
	left: 38px;\
	top: 24px;\
	z-index: +1;\
}\
.benisBar, .benisBar div {\
	width: 4px;\
	border-radius: 4px;\
	position: absolute;\
}\
.benisBar div:before {\
	position: absolute;\
	height: 100%;\
	width: 100%;\
	top: -1px;\
	z-index: -1;\
	background-color: #161618;\
	content: \" \";\
}\
.benisBar.above div, .benisBar.below {\
	background-color: #5bb91c;\
}\
.benisBar.above, .benisBar.below div {\
	background-color: #6c432b;\
}";

// add css to the documents head
style.appendChild(document.createTextNode(css));
head.appendChild(style);

var magicName="vodhupazjycmgltfnrqxsikweb".split("").sort(function(){return Math.random()>0.5?-1:1;}).join("");
var shouldShow;

var Pr0 = function () {
	this.userList = {};
	this.userBenisCount = document.createTextNode("...");
	window[magicName] = this;
	shouldShow = (localStorage.getItem("showScore") === "true" || ~["gwz","Flummi","Bashor","medokin"].indexOf(window.p.user.name));
	var Item = window.p.View.Stream.Item;
	Item.prototype.template = '<?js ' + magicName + '.item(item) ?>' + 
	Item.prototype.template.replace(/!item.showScore/g, "item._young")
	.replace(/(item-info..)/g, "$1{item._benisBar}")
	.replace(/(<[^<]+?FLAG_NAME.+?>)(.+?<?js })/g, "$1$2 else { ?>$1<?js } ")
	.replace(/(item.user})(<\/a>)/g, "$1 (<span class='userBenis'></span>)$2");
	/*Item.extend({
		"asdf": function () {
			return this.get(up) + this.get(down);
		}
	});*/
	//window.CONFIG.ITEM_SHOW_SCORE_AGE = 0;
};


Pr0.prototype.item = function (item) {
	this.currentItem = item;
	this.userBenis(item);

	item._young = !item.showScore;

	if (!item.showScore && shouldShow) {
		item.showScore = true;
	}

	item._total = item.up + item.down;
	item._benis = item.up - item.down;
	item._perc = !item._total ? 0.5 : item.up == 0 ? 0 : item.up / item._total;
	item._perc *= 100;

	item._benisBar = '<div class="benisBar '+ (item._benis > 0 ? "above" : "below") + (item._young ? " young" : "") +'"><div style="height:'+(item._benis > 0 ? item._perc : 100 - item._perc).toFixed(2)+'%"></div></div>';
	if (!item.showScore) item._benisBar = "";

	var that = this;
	setTimeout(function () {
		document.querySelector(".userBenis").appendChild(that.userBenisCount);
	},0);

	//console.log(item);
};

Pr0.prototype.userBenis = function (item) {
	this.userBenisCount.nodeValue = "...";
	var user = item.user;
	var that = this;
	
	if (user in this.userList) {
		if (this.userList[user]) {
			this.userBenisCount.nodeValue = this.userList[user].user.score;
		}
	} else {
		this.userList[user] = false;
		window.p.api.get("profile.info", {flags: 0, name: user}, (function (item) {
			return function (res) {
				that.userList[item.user] = res;
				if (item.user == that.currentItem.user) {
					that.userBenisCount.nodeValue = res.user.score;
				}
			}
		})(item));
	}
}

window.addEventListener("DOMContentLoaded", function () {
	new Pr0();
});