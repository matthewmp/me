/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 6);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var stylesInDom = {};

var	memoize = function (fn) {
	var memo;

	return function () {
		if (typeof memo === "undefined") memo = fn.apply(this, arguments);
		return memo;
	};
};

var isOldIE = memoize(function () {
	// Test for IE <= 9 as proposed by Browserhacks
	// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
	// Tests for existence of standard globals is to allow style-loader
	// to operate correctly into non-standard environments
	// @see https://github.com/webpack-contrib/style-loader/issues/177
	return window && document && document.all && !window.atob;
});

var getElement = (function (fn) {
	var memo = {};

	return function(selector) {
		if (typeof memo[selector] === "undefined") {
			var styleTarget = fn.call(this, selector);
			// Special case to return head of iframe instead of iframe itself
			if (styleTarget instanceof window.HTMLIFrameElement) {
				try {
					// This will throw an exception if access to iframe is blocked
					// due to cross-origin restrictions
					styleTarget = styleTarget.contentDocument.head;
				} catch(e) {
					styleTarget = null;
				}
			}
			memo[selector] = styleTarget;
		}
		return memo[selector]
	};
})(function (target) {
	return document.querySelector(target)
});

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__(12);

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton && typeof options.singleton !== "boolean") options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
	if (!options.insertInto) options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (!options.insertAt) options.insertAt = "bottom";

	var styles = listToStyles(list, options);

	addStylesToDom(styles, options);

	return function update (newList) {
		var mayRemove = [];

		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			domStyle.refs--;
			mayRemove.push(domStyle);
		}

		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}

		for (var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];

			if(domStyle.refs === 0) {
				for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom (styles, options) {
	for (var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];

		if(domStyle) {
			domStyle.refs++;

			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}

			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];

			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}

			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles (list, options) {
	var styles = [];
	var newStyles = {};

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};

		if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
		else newStyles[id].parts.push(part);
	}

	return styles;
}

function insertStyleElement (options, style) {
	var target = getElement(options.insertInto)

	if (!target) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}

	var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

	if (options.insertAt === "top") {
		if (!lastStyleElementInsertedAtTop) {
			target.insertBefore(style, target.firstChild);
		} else if (lastStyleElementInsertedAtTop.nextSibling) {
			target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			target.appendChild(style);
		}
		stylesInsertedAtTop.push(style);
	} else if (options.insertAt === "bottom") {
		target.appendChild(style);
	} else if (typeof options.insertAt === "object" && options.insertAt.before) {
		var nextSibling = getElement(options.insertInto + " " + options.insertAt.before);
		target.insertBefore(style, nextSibling);
	} else {
		throw new Error("[Style Loader]\n\n Invalid value for parameter 'insertAt' ('options.insertAt') found.\n Must be 'top', 'bottom', or Object.\n (https://github.com/webpack-contrib/style-loader#insertat)\n");
	}
}

function removeStyleElement (style) {
	if (style.parentNode === null) return false;
	style.parentNode.removeChild(style);

	var idx = stylesInsertedAtTop.indexOf(style);
	if(idx >= 0) {
		stylesInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement (options) {
	var style = document.createElement("style");

	options.attrs.type = "text/css";

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	options.attrs.type = "text/css";
	options.attrs.rel = "stylesheet";

	addAttrs(link, options.attrs);
	insertStyleElement(options, link);

	return link;
}

function addAttrs (el, attrs) {
	Object.keys(attrs).forEach(function (key) {
		el.setAttribute(key, attrs[key]);
	});
}

function addStyle (obj, options) {
	var style, update, remove, result;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    result = options.transform(obj.css);

	    if (result) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = result;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css.
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;

		style = singleton || (singleton = createStyleElement(options));

		update = applyToSingletonTag.bind(null, style, styleIndex, false);
		remove = applyToSingletonTag.bind(null, style, styleIndex, true);

	} else if (
		obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function"
	) {
		style = createLinkElement(options);
		update = updateLink.bind(null, style, options);
		remove = function () {
			removeStyleElement(style);

			if(style.href) URL.revokeObjectURL(style.href);
		};
	} else {
		style = createStyleElement(options);
		update = applyToTag.bind(null, style);
		remove = function () {
			removeStyleElement(style);
		};
	}

	update(obj);

	return function updateStyle (newObj) {
		if (newObj) {
			if (
				newObj.css === obj.css &&
				newObj.media === obj.media &&
				newObj.sourceMap === obj.sourceMap
			) {
				return;
			}

			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;

		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag (style, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (style.styleSheet) {
		style.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = style.childNodes;

		if (childNodes[index]) style.removeChild(childNodes[index]);

		if (childNodes.length) {
			style.insertBefore(cssNode, childNodes[index]);
		} else {
			style.appendChild(cssNode);
		}
	}
}

function applyToTag (style, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		style.setAttribute("media", media)
	}

	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		while(style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(css));
	}
}

function updateLink (link, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls) {
		css = fixUrls(css);
	}

	if (sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = link.href;

	link.href = URL.createObjectURL(blob);

	if(oldSrc) URL.revokeObjectURL(oldSrc);
}


/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = function escape(url) {
    // If url is already wrapped in quotes, remove them
    if (/^['"].*['"]$/.test(url)) {
        url = url.slice(1, -1);
    }
    // Should url be wrapped?
    // See https://drafts.csswg.org/css-values-3/#urls
    if (/["'() \t\n]/.test(url)) {
        return '"' + url.replace(/"/g, '\\"').replace(/\n/g, '\\n') + '"'
    }

    return url
}


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "./images/dishiq.png";

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "./images/netflix.png";

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "./images/wb.jpg";

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(8);
__webpack_require__(9);
__webpack_require__(10);
__webpack_require__(13);
__webpack_require__(15);
__webpack_require__(17);
__webpack_require__(19);
__webpack_require__(22);
__webpack_require__(24);
__webpack_require__(26);

$(document).ready(function () {
	$('.hamburger').click(function () {
		$('.hamburger').toggleClass('active', 5000);

		$('.mobile-menu').slideToggle('slow', function () {
			// Animation complete.
		});
	});

	$('a.scrollTo').click(function () {
		var scrollTo = $(this).attr('data-scrollTo');
		$('body, html').animate({
			'scrollTop': $('.' + scrollTo).offset().top
		}, 1000);
	});

	$('.menu-item').click(function () {
		$('.hamburger').toggleClass('active', 5000);
		$('.mobile-menu').slideToggle('slow', function () {
			// Animation complete.
		});
	});

	$('#spinner').fadeOut();

	$('#home').click(function () {
		alert('test');
	});

	$('.spHomeBtn').click(function () {
		var url = 'http://mattpalumbo.me';
		$(location).attr('href', url);
	});
});

/***/ }),
/* 7 */,
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "index.html";

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "spotify.html";

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(11);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../node_modules/css-loader/index.js!../../node_modules/postcss-loader/lib/index.js!./normalize.css", function() {
			var newContent = require("!!../../node_modules/css-loader/index.js!../../node_modules/postcss-loader/lib/index.js!./normalize.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, "/*! normalize.css v7.0.0 | MIT License | github.com/necolas/normalize.css */\n\n/* Document\n   ========================================================================== */\n\n/**\n * 1. Correct the line height in all browsers.\n * 2. Prevent adjustments of font size after orientation changes in\n *    IE on Windows Phone and in iOS.\n */\n\nhtml {\n  line-height: 1.15; /* 1 */\n  -ms-text-size-adjust: 100%; /* 2 */\n  -webkit-text-size-adjust: 100%; /* 2 */\n}\n\n/* Sections\n   ========================================================================== */\n\n/**\n * Remove the margin in all browsers (opinionated).\n */\n\nbody {\n  margin: 0;\n}\n\n/**\n * Add the correct display in IE 9-.\n */\n\narticle, aside, footer, header, nav, section {\n  display: block;\n}\n\n/**\n * Correct the font size and margin on `h1` elements within `section` and\n * `article` contexts in Chrome, Firefox, and Safari.\n */\n\nh1 {\n  font-size: 2em;\n  margin: 0.67em 0;\n}\n\n/* Grouping content\n   ========================================================================== */\n\n/**\n * Add the correct display in IE 9-.\n * 1. Add the correct display in IE.\n */\n\nfigcaption, figure, main { /* 1 */\n  display: block;\n}\n\n/**\n * Add the correct margin in IE 8.\n */\n\nfigure {\n  margin: 1em 40px;\n}\n\n/**\n * 1. Add the correct box sizing in Firefox.\n * 2. Show the overflow in Edge and IE.\n */\n\nhr {\n  -webkit-box-sizing: content-box;\n          box-sizing: content-box; /* 1 */\n  height: 0; /* 1 */\n  overflow: visible; /* 2 */\n}\n\n/**\n * 1. Correct the inheritance and scaling of font size in all browsers.\n * 2. Correct the odd `em` font sizing in all browsers.\n */\n\npre {\n  font-family: monospace, monospace; /* 1 */\n  font-size: 1em; /* 2 */\n}\n\n/* Text-level semantics\n   ========================================================================== */\n\n/**\n * 1. Remove the gray background on active links in IE 10.\n * 2. Remove gaps in links underline in iOS 8+ and Safari 8+.\n */\n\na {\n  background-color: transparent; /* 1 */\n  -webkit-text-decoration-skip: objects; /* 2 */\n}\n\n/**\n * 1. Remove the bottom border in Chrome 57- and Firefox 39-.\n * 2. Add the correct text decoration in Chrome, Edge, IE, Opera, and Safari.\n */\n\nabbr[title] {\n  border-bottom: none; /* 1 */\n  text-decoration: underline; /* 2 */\n  -webkit-text-decoration: underline dotted;\n          text-decoration: underline dotted; /* 2 */\n}\n\n/**\n * Prevent the duplicate application of `bolder` by the next rule in Safari 6.\n */\n\nb, strong {\n  font-weight: inherit;\n}\n\n/**\n * Add the correct font weight in Chrome, Edge, and Safari.\n */\n\nb, strong {\n  font-weight: bolder;\n}\n\n/**\n * 1. Correct the inheritance and scaling of font size in all browsers.\n * 2. Correct the odd `em` font sizing in all browsers.\n */\n\ncode, kbd, samp {\n  font-family: monospace, monospace; /* 1 */\n  font-size: 1em; /* 2 */\n}\n\n/**\n * Add the correct font style in Android 4.3-.\n */\n\ndfn {\n  font-style: italic;\n}\n\n/**\n * Add the correct background and color in IE 9-.\n */\n\nmark {\n  background-color: #ff0;\n  color: #000;\n}\n\n/**\n * Add the correct font size in all browsers.\n */\n\nsmall {\n  font-size: 80%;\n}\n\n/**\n * Prevent `sub` and `sup` elements from affecting the line height in\n * all browsers.\n */\n\nsub, sup {\n  font-size: 75%;\n  line-height: 0;\n  position: relative;\n  vertical-align: baseline;\n}\n\nsub {\n  bottom: -0.25em;\n}\n\nsup {\n  top: -0.5em;\n}\n\n/* Embedded content\n   ========================================================================== */\n\n/**\n * Add the correct display in IE 9-.\n */\n\naudio, video {\n  display: inline-block;\n}\n\n/**\n * Add the correct display in iOS 4-7.\n */\n\naudio:not([controls]) {\n  display: none;\n  height: 0;\n}\n\n/**\n * Remove the border on images inside links in IE 10-.\n */\n\nimg {\n  border-style: none;\n}\n\n/**\n * Hide the overflow in IE.\n */\n\nsvg:not(:root) {\n  overflow: hidden;\n}\n\n/* Forms\n   ========================================================================== */\n\n/**\n * 1. Change the font styles in all browsers (opinionated).\n * 2. Remove the margin in Firefox and Safari.\n */\n\nbutton, input, optgroup, select, textarea {\n  font-family: sans-serif; /* 1 */\n  font-size: 100%; /* 1 */\n  line-height: 1.15; /* 1 */\n  margin: 0; /* 2 */\n}\n\n/**\n * Show the overflow in IE.\n * 1. Show the overflow in Edge.\n */\n\nbutton, input { /* 1 */\n  overflow: visible;\n}\n\n/**\n * Remove the inheritance of text transform in Edge, Firefox, and IE.\n * 1. Remove the inheritance of text transform in Firefox.\n */\n\nbutton, select { /* 1 */\n  text-transform: none;\n}\n\n/**\n * 1. Prevent a WebKit bug where (2) destroys native `audio` and `video`\n *    controls in Android 4.\n * 2. Correct the inability to style clickable types in iOS and Safari.\n */\n\nbutton, html [type=\"button\"], [type=\"reset\"], [type=\"submit\"] {\n  -webkit-appearance: button; /* 2 */\n}\n\n/**\n * Remove the inner border and padding in Firefox.\n */\n\nbutton::-moz-focus-inner, [type=\"button\"]::-moz-focus-inner, [type=\"reset\"]::-moz-focus-inner, [type=\"submit\"]::-moz-focus-inner {\n  border-style: none;\n  padding: 0;\n}\n\n/**\n * Restore the focus styles unset by the previous rule.\n */\n\nbutton:-moz-focusring, [type=\"button\"]:-moz-focusring, [type=\"reset\"]:-moz-focusring, [type=\"submit\"]:-moz-focusring {\n  outline: 1px dotted ButtonText;\n}\n\n/**\n * Correct the padding in Firefox.\n */\n\nfieldset {\n  padding: 0.35em 0.75em 0.625em;\n}\n\n/**\n * 1. Correct the text wrapping in Edge and IE.\n * 2. Correct the color inheritance from `fieldset` elements in IE.\n * 3. Remove the padding so developers are not caught out when they zero out\n *    `fieldset` elements in all browsers.\n */\n\nlegend {\n  -webkit-box-sizing: border-box;\n          box-sizing: border-box; /* 1 */\n  color: inherit; /* 2 */\n  display: table; /* 1 */\n  max-width: 100%; /* 1 */\n  padding: 0; /* 3 */\n  white-space: normal; /* 1 */\n}\n\n/**\n * 1. Add the correct display in IE 9-.\n * 2. Add the correct vertical alignment in Chrome, Firefox, and Opera.\n */\n\nprogress {\n  display: inline-block; /* 1 */\n  vertical-align: baseline; /* 2 */\n}\n\n/**\n * Remove the default vertical scrollbar in IE.\n */\n\ntextarea {\n  overflow: auto;\n}\n\n/**\n * 1. Add the correct box sizing in IE 10-.\n * 2. Remove the padding in IE 10-.\n */\n\n[type=\"checkbox\"], [type=\"radio\"] {\n  -webkit-box-sizing: border-box;\n          box-sizing: border-box; /* 1 */\n  padding: 0; /* 2 */\n}\n\n/**\n * Correct the cursor style of increment and decrement buttons in Chrome.\n */\n\n[type=\"number\"]::-webkit-inner-spin-button, [type=\"number\"]::-webkit-outer-spin-button {\n  height: auto;\n}\n\n/**\n * 1. Correct the odd appearance in Chrome and Safari.\n * 2. Correct the outline style in Safari.\n */\n\n[type=\"search\"] {\n  -webkit-appearance: textfield; /* 1 */\n  outline-offset: -2px; /* 2 */\n}\n\n/**\n * Remove the inner padding and cancel buttons in Chrome and Safari on macOS.\n */\n\n[type=\"search\"]::-webkit-search-cancel-button, [type=\"search\"]::-webkit-search-decoration {\n  -webkit-appearance: none;\n}\n\n/**\n * 1. Correct the inability to style clickable types in iOS and Safari.\n * 2. Change font properties to `inherit` in Safari.\n */\n\n::-webkit-file-upload-button {\n  -webkit-appearance: button; /* 1 */\n  font: inherit; /* 2 */\n}\n\n/* Interactive\n   ========================================================================== */\n\n/*\n * Add the correct display in IE 9-.\n * 1. Add the correct display in Edge, IE, and Firefox.\n */\n\ndetails, menu {\n  display: block;\n}\n\n/*\n * Add the correct display in all browsers.\n */\n\nsummary {\n  display: list-item;\n}\n\n/* Scripting\n   ========================================================================== */\n\n/**\n * Add the correct display in IE 9-.\n */\n\ncanvas {\n  display: inline-block;\n}\n\n/**\n * Add the correct display in IE.\n */\n\ntemplate {\n  display: none;\n}\n\n/* Hidden\n   ========================================================================== */\n\n/**\n * Add the correct display in IE 10-.\n */\n\n[hidden] {\n  display: none;\n}", ""]);

// exports


/***/ }),
/* 12 */
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(14);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../node_modules/css-loader/index.js!../../node_modules/postcss-loader/lib/index.js!./contact.css", function() {
			var newContent = require("!!../../node_modules/css-loader/index.js!../../node_modules/postcss-loader/lib/index.js!./contact.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, "a{\n\tcolor: #fff;\n\ttext-decoration: none;\n}\n.contact-wrapper{\n\tbackground: #eee;\n\toverflow: hidden;\n\tposition: relative;\n\tclear: both;\n}\n.contact-header{\n\tmargin-bottom: 100px;\n}\n.vid{\n\tmargin: 100px auto;\n\t-webkit-filter: grayscale(1);\n\t        filter: grayscale(1);\n    max-width: 90%;\n    opacity: 0.3;\n    display: block;\n}\n.slogan-wrapper{\n\theight: 100px;\n\tbackground: #fbff12;\n\twidth: 100%;\n\tcolor: #0c0f0a;\n\tfont-size: 30px;\n\tfont-family: 'Roboto';\n\ttext-align: center;\n\tline-height: 100px;\n\tz-index: 2;\n}\n.slogan{\n\tmargin: 0;\n}\n.push{\n\theight:150px;\n\ttext-align: center;\n}\n.contact-me{\n\tline-height: 150px;\n\tfont-size: 2em;\n\tfont-family: 'Roboto Condensed';\n}\nfooter{\n\tmargin-top: 200px;\n\tfont-family: 'Kalam';\n\twidth: 100%;\n\theight:150px;\n\tbackground: #ff206e;\n\ttext-align: center;\n}\n.f{\n\tdisplay: inline-block;\n\twidth: 25%;\n\theight: 100%;\n\tbackground: #ff206e;\n\tcolor: #fff;\n}\n.fa:hover{\n\tcolor: #41ead4;\n}\n.email{\n\twidth: 100%;\n\tpadding-bottom: 20px;\n\tdisplay: inline-block;\n\tbackground: #2F2E33;\n\tcolor: #fff;\n\tfont-family: 'Roboto Condensed';\n}\n.email:hover{\n\tcolor: #3A5199;\n}\n.email2{\n\tcolor: #222;\n}\n.contact-me-link{\n\ttext-decoration: underline;\n    color: #ff206e;\n}\n@media only screen and (max-width: 520px) {\n\t.slogan-wrapper{\n\t\tfont-size: 25px;\n\t}\n}\n@media only screen and (max-width: 390px) {\n\t.slogan-wrapper{\n\t\tfont-size: 18px;\n\t}\n\n\t.me{\n\t\tfont-size: 2em;\n\t}\n\n\t.contact-me{\n\t\tfont-size: 1.5em;\n\t}\n}\n@media only screen and (max-width: 325px) {\n\t.me{\n\t\tfont-size: 1.5em;\n\t}\n\n\t.slogan-wrapper{\n\t\tfont-size: 15px;\n\t}\n}\n@media only screen and (max-width: 275px) {\n\t.me{\n\t\tdisplay: none;\n\t}\n\n\t.slogan-wrapper{\n\t\tfont-size: 8px;\n\t}\n}\n@media only screen and (max-device-width: 740px) and (max-device-height: 420px) and (orientation : landscape){\n\t.contact-wrapper{\n\t\toverflow: scroll;\n\t}\n\n\t.menu-item{\n\t\tpadding: 0;\n\t}\n\n\t.home{\n\t\tmargin-top: 60px;\n\t}\n}\n@media only screen and (max-height: 690px) {\n\t.contact-wrapper{\n\t\toverflow: scroll;\n\t}\n}\n", ""]);

// exports


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(16);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../node_modules/css-loader/index.js!../../node_modules/postcss-loader/lib/index.js!./grid.css", function() {
			var newContent = require("!!../../node_modules/css-loader/index.js!../../node_modules/postcss-loader/lib/index.js!./grid.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, "* {\n  -webkit-box-sizing: border-box;\n          box-sizing: border-box;\n}\n\n/* Grid measurements:\n *\n *   960px wide including 12 gutters (half gutters on both edges)\n *\n *   60px columns (12)\n *   20px gutters (two half-gutters + 11 full gutters, so 12 total)\n *\n *\n *   For smaller screens, we always want 20px of padding on either side,\n *   so 960 + 20 + 20 => 1000px\n *\n **/\n\n.row {\n  padding-left: 20px;\n  padding-right: 20px;\n  margin: 0 auto;\n}\n\n/* Clearfix */\n\n.row::before, .row::after {\n  display: table;\n  content: '';\n}\n\n.row::after {\n  clear: both;\n}\n\n.col-3, .col-4, .col-6, .col-12 {\n  float: left;\n\n  /* Gutters:\n   * Each column is padded by half-a-gutter on each side,\n   *\n   * Half a gutter is 10px, 10/960 (context) = 1.041666%\n   *\n   */\n  padding-left: 1.04166666%;\n  padding-right: 1.04166666%;\n}\n\n/* Mobile defaults */\n\n.col-3, .col-4, .col-6, .col-12 {\n  width: 100%;\n}\n\n/* Non-mobile, grid */\n\n@media only screen and (min-width: 860px) {\n  /* 3 columns, 3/12 in % */\n  .col-3 {\n    width: 25%;\n  }\n\n  /* 4 columns */\n  .col-4 {\n    width: 33%;\n  }\n\n  /* 6 columns */\n  .col-6 {\n    width: 50%;\n  }\n\n  /* 12 columns */\n  .col-12 {\n    width: 10%;\n  }\n}", ""]);

// exports


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(18);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../node_modules/css-loader/index.js!../../node_modules/postcss-loader/lib/index.js!./main.css", function() {
			var newContent = require("!!../../node_modules/css-loader/index.js!../../node_modules/postcss-loader/lib/index.js!./main.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, ".landing-page-wrapper{\n  width: 100%;\n  height: 100vh;\n}\n\nheader{\n  position: absolute;\n  z-index: 10;\n  top: 0;\n  background: #FF206E;\n  width: 100%;\n  height: 80px;\n}\n\n.me-wrapper{\n  padding: 0px;\n  background: #fff;\n  width: 100px;\n  height: 100px;\n  border-radius: 50%;\n  margin: 10px auto;\n}\n\n.me-header{\n  width: 100px;\n  height: 100px;\n  border-radius: 50%;\n  margin: auto;\n  background-size: cover;\n  border: 5px solid #fff;\n}\n\nnav{\n    position: absolute;\n    top: 0px;\n    height: 50px;\n    text-align: center;\n}\n\n.nav-left{\n    left: calc(50% - 330px);\n}\n\n.nav-right{\n    right: calc(50% - 290px);\n}\n\n.nav-item{\n    cursor: pointer;\n    display: inline-block;\n    font-family: arial;\n    font-size: 1.3em;\n    color: #fff;\n    border: 1px solid #fff;\n    border-top-right-radius: 5px;\n    border-top-left-radius: 5px;\n    border-bottom: none;\n    text-align: center;\n    width: 80px;\n}\n\n.nav-item:hover{\n   background: #fff;\n   color: #FF206E;\n}\n\n.name-wrapper{\n  height: 100vh;\n  background: #fff;\n}\n\n.name{\n  position: absolute;\n  top: 40%;\n  left: 50px;\n  font-size: 6vw;\n  font-family: 'Sedgwick Ave';\n  color: #222;\n\n}\n\n.name h1{\n  margin: 0;\n}\n\n.name h3{\n  font-size: 0.5em;\n  font-family: 'Roboto';\n  margin: 0;\n}\n\n.hamburger{\n\tposition: fixed;\n  z-index: 10;\n\twidth: 50px;\n\theight: 50px;\n\tright: 30px;\n\ttop: 10px;\n  cursor: pointer;\n}\n\n.hb{\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  -webkit-transform: translate(-50%, -50%);\n          transform: translate(-50%, -50%);\n\twidth: 60%;\n\theight: 2px;\n\tbackground: #0c0f0a;\n}\n\n.hb:before, .hb:after{\n  content: '';\n  width: 100%;\n  height: 2px;\n  background: #0c0f0a;\n  position: absolute;\n  -webkit-transition: .5s;\n  transition: .5s;\n}\n\n.hb:before{\n  top: -12px;\n}\n\n.hb:after{\n  top: 12px;\n}\n\n.hamburger.active .hb {\n  background: rgba(0,0,0,0);\n}\n\n.hamburger.active .hb:before{\n  top: 0;\n  -webkit-transform: rotate(45deg);\n          transform: rotate(45deg);\n}\n\n.hamburger.active .hb:after{\n  top: 0;\n  -webkit-transform: rotate(135deg);\n          transform: rotate(135deg);\n}\n\n.mobile-menu{\n  position: fixed;\n  display: none;\n  height: 100vh;\n  width: 30%;\n  background: #FF206E;\n  right: 0;\n  top: 80px;\n}\n\n.menu-items-wrapper{\n    letter-spacing: 5px;\n    color: #fff;\n    font-family: 'Roboto';\n    font-size: 30px;\n}\n\n.menu-item{\n  margin-bottom: 15%;\n  text-align: center;\n  padding: 30px;\n}\n\n.menu-item:hover{\n  background: #41ead4;\n  cursor: pointer;\n}\n\n.logo{\n  text-align: center;\n  width: 100%;\n  padding-top: 100px;\n\n}\n\n.me{\n  line-height: 50px;\n  position: absolute;\n  left: 50px;\n  top: 0px;\n  color: #fff;\n  font-family: 'Roboto Condensed';\n  font-size: 40px;\n}\n\n.me p{\n  margin: 0;\n}\n\n.title-wrapper{\n\tmargin: auto;\n\ttext-align: center;\n\tdisplay: inline-block;\n}\n\n.title{\n\tdisplay: inline-block;\n\tfont-size: 10vw;\n\tcolor: #222;\n\tvertical-align: middle;\n  font-size: 5em;\n  font-family: 'Nothing You Could Do', arial, serif;\n  margin-left: 125px;\n}\n\n/*  Heart  */\n\n.heart-wrapper{\n  position: absolute;\n  margin-right: 65px;\n  margin-top: -10px;\n  display: inline-block;\n}\n\n.bottom {\n  height: 0;\n  width: 0;\n  margin-top: -3px;\n  border-top: 50px solid #FF206E;\n  border-right: 50px solid transparent;\n  border-left: 50px solid transparent;\n  border-bottom: 50px solid transparent;\n  -webkit-animation: pulseBottom 1s infinite;\n          animation: pulseBottom 1s infinite;\n}\n\n.top-left {\n  display: inline-block;\n  height: 0;\n  width: 0;\n  border-bottom: 25px solid #FF206E;\n  border-right: 25px solid transparent;\n  border-left: 25px solid transparent;\n  border-top: 25px solid transparent;\n  -webkit-animation: pulseLeft 1s infinite;\n          animation: pulseLeft 1s infinite;\n}\n\n.top-right {\n  display: inline-block;\n  height: 0;\n  width: 0;\n  margin-left: -3px;\n  border-bottom: 25px solid #FF206E;\n  border-right: 25px solid transparent;\n  border-left: 25px solid transparent;\n  border-top: 25px solid transparent;\n  -webkit-animation: pulseLeft 1s infinite;\n          animation: pulseLeft 1s infinite;\n}\n\n@-webkit-keyframes pulseBottom{\n  93%{\n    border-top: 50px solid #FF206E;\n  }\n  100%{\n    border-top: 100px solid #FF206E;\n  }\n}\n\n@keyframes pulseBottom{\n  93%{\n    border-top: 50px solid #FF206E;\n  }\n  100%{\n    border-top: 100px solid #FF206E;\n  }\n}\n\n@-webkit-keyframes pulseLeft{\n  94%{\n    border-bottom: 25px solid #FF206E;\n  }\n  100%{\n    border-bottom: 50px solid #FF206E;\n  }\n}\n\n@keyframes pulseLeft{\n  94%{\n    border-bottom: 25px solid #FF206E;\n  }\n  100%{\n    border-bottom: 50px solid #FF206E;\n  }\n}\n\n@-webkit-keyframes pulseRight{\n  95%{\n    border-bottom: 25px solid #FF206E;\n  }\n  100%{\n    border-bottom: 50px solid #FF206E;\n  }\n}\n\n@keyframes pulseRight{\n  95%{\n    border-bottom: 25px solid #FF206E;\n  }\n  100%{\n    border-bottom: 50px solid #FF206E;\n  }\n}\n\n@media only screen and (max-width: 745px){\n.nav-right, .nav-left{\n    display: none;\n  }\n}\n\n@media only screen and (max-width: 645px){\n  .menu-items-wrapper{\n    font-size: 20px;\n  }\n}\n\n@media only screen and (max-width: 608px){\n  .tab{\n    font-size: 2em;\n  }\n}\n\n@media only screen and (max-height: 500px){\n  .tab{\n    bottom: auto;\n  }\n}\n\n@media only screen and (max-width: 475px){\n  .tab{\n    padding: 10px 30px;\n    font-size: 2em;\n  }\n}\n\n@media only screen and (max-height: 570px){\n  .menu-item{\n    padding: 0px;\n  }\n}\n\n@media only screen and (max-width: 410px){\n  .tab{\n    padding: 10px 20px;\n    font-size: 2em;\n  }\n}\n\n@media only screen and (max-width: 320px){\n  .tab{\n    padding: 10px 10px;\n    font-size: 1.5em;\n  }\n}\n\n@media only screen and (max-width: 235px){\n  .tab{\n    padding: 10px 0px;\n    font-size: 1em;\n  }\n}\n\n@media only screen and (max-device-width: 745px) and (max-device-height: 420px){\n  .tab{\n      bottom: auto;\n    }\n}\n\n@media only screen and (max-device-width: 608px) and (max-device-height: 420px){\n  .tab{\n      bottom: auto;\n    }\n}\n\n@media only screen and (max-width: 515px){\n  .menu-items-wrapper{\n    font-size: 1.5em;\n  }\n}\n\n@media only screen and (max-width: 415px){\n  .menu-items-wrapper{\n    font-size: 1em;\n  }\n}\n\n@media only screen and (max-width: 315px){\n  \n  .me-wrapper{\n    width: 80px;\n    height: 80px;\n    margin: auto;\n  }\n\n  .me-header{\n    width: 80px;\n    height: 80px;\n  }\n\n  .bottom {\n    border-top: 25px solid #ff206e;\n    border-right: 25px solid transparent;\n    border-left: 25px solid transparent;\n    border-bottom: 25px solid transparent;\n    -webkit-animation: none;\n            animation: none;\n  }\n\n  .top-left {\n    border-bottom: 12.5px solid #ff206e;\n    border-right: 12.5px solid transparent;\n    border-left: 12.5px solid transparent;\n    border-top: 12.5px solid transparent;\n    -webkit-animation: none;\n            animation: none;\n  }\n  .top-right {\n    border-bottom: 12.5px solid #ff206e;\n    border-right: 12.5px solid transparent;\n    border-left: 12.5px solid transparent;\n    border-top: 12.5px solid transparent;\n    -webkit-animation: none;\n            animation: none;\n  }\n\n  .title{\n    margin-left: 75px;\n    margin-top: -10px;\n    font-size: 3em;\n  }\n}\n\n@media only screen and (max-width: 255px){\n  .me-wrapper{\n    display: none;\n  }\n}\n\n@media only screen and (max-width: 200px){\n  .title{\n    margin-left: 50px;\n    margin-top: -1px;\n    font-size: 2em;\n  }\n}\n\n@media only screen and (max-height: 565px){\n  .name{\n    top: 60%; \n    font-size: 4vw;\n  }\n}\n\n@media only screen and (max-width: 670px){\n  .logo{\n    display: none;\n  }\n}\n\n@media only screen and (max-height: 390px){\n  .name{\n    top: 70%; \n    font-size: 2vw;\n  }\n}\n\n\n", ""]);

// exports


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(20);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../node_modules/css-loader/index.js!../../node_modules/postcss-loader/lib/index.js!./portfolio.css", function() {
			var newContent = require("!!../../node_modules/css-loader/index.js!../../node_modules/postcss-loader/lib/index.js!./portfolio.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

var escape = __webpack_require__(2);
exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, ".row{\n\tposition: relative;\n}\n\n.portfolio-wrapper{\n\tposition: relative;\n    background-size: cover;\n    background-position: 20%;\n}\n\n.portfolio-header, .skills-header, .contact-header{\n\twidth: 100%;\n\theight: 80px;\n\tbackground: #41EAD4;\n\tposition: static;\n\tmargin-top: -32px;\n}\n\n.portfolio-title, .skills-title, .contact-title{\n\tcolor: #fff;\n\ttext-align: left;\n\tfont-size: 2em;\n\tfont-family: 'Roboto Condensed';\n\tline-height: 80px;\n\tpadding-left: 30px;\n}\n\n.port-container{\n\tpadding: 100px 10px;\n\toverflow: auto; \n\tmargin: auto;\n\n}\n\n.top{\n\tbackground: #eee;\n}\n\n.middle{\n\tbackground: #fff;\n}\n\n.last{\n\tbackground: #fff;\n}\n\n.sh-wrapper{\n\ttext-align: center;\n}\n\n.screenshot{\n\twidth: 100%;\n\tdisplay: inline-block;\n\tbackground-size: cover;\t\n}\n\n.screenshot:hover{\n\t-webkit-filter: brightness(0.5);\n\t        filter: brightness(0.5);\n}\n\n.dish{\n\tbackground-image: url(" + escape(__webpack_require__(3)) + ");\n}\n\n.netflix{\n\tbackground-image: url(" + escape(__webpack_require__(4)) + ");\n}\n\n.gp{\n\tbackground-image: url(" + escape(__webpack_require__(21)) + ");\n}\n\n.project-title{\n\tmargin: 0;\n\ttext-align: center;\n}\n\n.project-title a{\n    font-size: 35px;\n    text-align: center;\n    font-family: 'Roboto';\n    color: #0c0f0a;\n}\n\n.border{\n\twidth: 50%;\n\theight: 1px;\n\tbackground: #ccc;\n\tmargin: auto;\n}\n\n.description-container{\n\tposition: relative;\n}\n\n.description{\n\tmargin: 0;\n\ttext-align: left;\n\tcolor: #222;\n\tfont-size: 23px;\n\tfont-family: 'Roboto Condensed';\n\tpadding: 30px;\n}\n\n.description-container{\n\tposition: relative;\n\tmin-height: 400px;\n}\n\n.description-absolute{\n\tposition: absolute;\n\twidth: 100%;\n\ttext-align: center;\n\ttop: 50%;\n\tleft: 50%;\n\t-webkit-transform: translate(-50%, -50%);\n\t        transform: translate(-50%, -50%);\n}\n\n.technologies-wrapper{\n\tmargin: 50px auto;\n\tmax-width: 500px;\n\tfont-family: 'Roboto Condensed';\n\tfont-size: 15px;\n\ttext-align: center;\n}\n\n.technologies{\n\tdisplay: inline-block;\n\tmargin: 1px;\n\tbackground: #ff206e;\n\tpadding: 10px 15px;\n\tborder-radius: 10px;\n\tfont-family: 'Roboto Condensed';\n\tcolor: #fff;\n\tcursor: pointer;\n}\n\n.technologies:active{\n\tbackground: #41EAD4;\n}\n\n@media only screen and (max-width: 860px) {\n\t.port-container.top{\n\t\tpadding-top: 100px;\n\t}\n\n\t.port-container{\n\t\tpadding: 50px 10px;\n\t}\n\n\t.description-absolute{\n\t\tposition: static;\n\t\t-webkit-transform: none;\n\t\t        transform: none;\n\t}\n\n\t.description-container{\n\t\tmin-height: 30px;\n\t}\n\n\t.description{\n\t\tfont-size: 20px;\n\t}\n\n\t.technologies-wrapper{\n\t\tmax-width: 80%;\n\t\tmargin: auto;\n\t}\n\n\t.screenshot{\n\t\twidth: 45%;\n\t}\n}\n\n@media only screen and (max-width: 860px) {\n\t.port-container{\n\t\tposition: static;\n\t\t-webkit-transform: none;\n\t\t        transform: none;\n\t}\n}\n\n@media only screen and (max-width: 750px) {\n\t.screenshot{\n\t\twidth: 50%;\n\t}\n}\n\n@media only screen and (max-width: 650px) {\n\t.screenshot{\n\t\twidth: 60%;\n\t}\n}\n\n@media only screen and (max-width: 650px) {\n\t.description{\n\t\tfont-size: 15px;\n\t}\n\n\t.technologies{\n\t\tfont-size: 12px;\n\t\tpadding: 10px 15px;\n\t}\n}\n\n@media only screen and (max-width: 550px) {\n\t.screenshot{\n\t\twidth: 70%;\n\t}\n\n\t.technologies-wrapper{\n\t\tpadding: 0;\n\t}\n\n\t.description{\n\t\tpadding: 10px 30px;\n\t}\n\n\t.project-title{\n\t\tfont-size: 25px;\n\t}\n\n\t.project-title a{\n\t\tfont-size: 25px;\n\t}\n}\n\n@media only screen and (max-width: 480px) {\n\t.screenshot{\n\t\twidth: 80%;\n\t}\n}", ""]);

// exports


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "./images/gamepiazza.png";

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(23);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../node_modules/css-loader/index.js!../../node_modules/postcss-loader/lib/index.js!./skills.css", function() {
			var newContent = require("!!../../node_modules/css-loader/index.js!../../node_modules/postcss-loader/lib/index.js!./skills.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

var escape = __webpack_require__(2);
exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, ".skills-wrapper{\n\tbackground: -webkit-gradient( linear, left top, left bottom, from(rgba(255, 255, 255, 0.97)), to(rgba(255, 255, 255, 0.74)) ), url(" + escape(__webpack_require__(5)) + ");\n\tbackground: linear-gradient( rgba(255, 255, 255, 0.97), rgba(255, 255, 255, 0.74) ), url(" + escape(__webpack_require__(5)) + ");\n}\n\n.skills-container{\n\ttext-align: center;\n}\n\n.skills-left-container, .skills-right-container{\n\tdisplay: inline-block;\n\tvertical-align: top;\n}\n\n.skills-left, .skills-right{\n\ttext-align: left;\n\tfont-size: 35px;\n\tfont-family: \n}\n\nli{\n\n\tlist-style: none;\n\tmargin: 20px;\n\tfont-family: 'Roboto Condensed';\n\theight: 60px;\n\tline-height: 60px;\n\tcolor: #555;\n}\n\n.skill-item:hover{\n\tcursor: pointer;\n\tcolor: #ff206e;\n}\n\n.skills-list-title{\n\tfont-family: 'Roboto';\n\tfont-size: 45px;\n\tmargin-bottom: 50px;\n\tcolor: #000;\n\ttext-shadow: 0px 0px 0px;\n}\n\n.skills-list-title:hover{\n\tcolor: #000;\n}\n\n@media only screen and (max-width: 680px) {\n\tli{\n\t\tfont-size: 25px;\n\t}\n\n\t.skills-list-title{\n\t\tfont-size: 35px;\n\t}\n}\n\n@media only screen and (max-width: 490px) {\n\t.skills-wrapper{\n\t\theight: auto;\n\t}\n}", ""]);

// exports


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(25);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../node_modules/css-loader/index.js!../../node_modules/postcss-loader/lib/index.js!./spinner.css", function() {
			var newContent = require("!!../../node_modules/css-loader/index.js!../../node_modules/postcss-loader/lib/index.js!./spinner.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, "#spinner{\n\twidth: 100px;\n\theight: 100px;\n\tborder: 2px solid #f25a41;\n\tborder-top: 3px solid #ff206e;\n\tborder-radius: 100%;\n\t-webkit-animation: spin 500ms infinite linear;\n\t        animation: spin 500ms infinite linear;\n\tposition: absolute;\n\tleft: 45%;\n\ttop: 30%;\n\t-webkit-transform: translate(-50%, -50%);\n\t        transform: translate(-50%, -50%);\n}\n\n@-webkit-keyframes spin{\n\tfrom {\n\t\t-webkit-transform: rotate(0deg);\n\t\t        transform: rotate(0deg);\n\t}\n\tto{\n\t\t-webkit-transform: rotate(360deg);\n\t\t        transform: rotate(360deg);\n\t}\n}\n\n@keyframes spin{\n\tfrom {\n\t\t-webkit-transform: rotate(0deg);\n\t\t        transform: rotate(0deg);\n\t}\n\tto{\n\t\t-webkit-transform: rotate(360deg);\n\t\t        transform: rotate(360deg);\n\t}\n}\n\n@media only screen and (max-width: 425px) {\n\t#spinner{\n\t\tleft: 40%;\n\t}\n}\n\n@media only screen and (max-width: 320px) {\n\t#spinner{\n\t\tleft: 35%;\n\t}\n}", ""]);

// exports


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(27);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {"hmr":true}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(1)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../node_modules/css-loader/index.js!../../node_modules/postcss-loader/lib/index.js!./spotify.css", function() {
			var newContent = require("!!../../node_modules/css-loader/index.js!../../node_modules/postcss-loader/lib/index.js!./spotify.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(0)(false);
// imports


// module
exports.push([module.i, ".vid-wrapper{\n\twidth: 50%;\n\tmargin: 10% auto;\n}\n\n.spHome {\n\tmin-width: 10%;\n    min-height: 50px;\n    display: block;\n    margin: auto;\n    color: #fff;\n    border-style: none;\n    border: 2px solid red;\n    background: #FF206E;\n    cursor: pointer;\n}\n\n.spContact{\n\twidth: 50%;\n\tmargin: auto;\n}\n\n.spotify{\n    z-index: 9;\n    font-family: 'Roboto';\n    position: absolute;\n    top: 100px;\n    right: 50px;\n    background: #65D26F;\n    border: 2px solid limegreen;\n    border-radius: 50%;\n    text-align: center;\n    min-height: 100px;\n    min-width: 100px;\n    width: 150px;\n    height: 150px;\n    padding: 15px;\n}\n\n@media only screen and (max-width: 670px){\n  .spotify{\n    left: 50%;\n    -webkit-transform: translate(-50%);\n            transform: translate(-50%);\n  }\n}", ""]);

// exports


/***/ })
/******/ ]);