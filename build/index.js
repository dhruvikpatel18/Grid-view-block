/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/edit.js":
/*!*********************!*\
  !*** ./src/edit.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Edit)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _editor_scss__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./editor.scss */ "./src/editor.scss");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_5__);

/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */


/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */


/**
 * Includes WordPress components for creating custom controls.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-components/
 */


/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */


/**
 * Importing necessary hooks from WordPress Element package
 */


/**
 * Main Edit function for the WordPress custom block.
 *
 * This function defines the editing behavior of the block and is
 * responsible for rendering controls in the editor and managing state.
 *
 * @param {Object} props - Props passed by WordPress block editor.
 * @returns {JSX.Element} - JSX representation of the block editor view.
 */
function Edit(props) {
  // Destructure props to extract block attributes and setAttributes function
  const {
    attributes,
    setAttributes
  } = props;

  // Use useBlockProps to apply default block styles
  const blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.useBlockProps)();

  // Default terms for the taxonomy selections
  const defaultSelectedTerms = {
    projecttype: "",
    projectcategory: "",
    projectclient: ""
  };

  // Get selected terms from attributes or use default values
  const {
    selectedTerms = defaultSelectedTerms
  } = attributes;

  // Local state to manage selected terms within the block
  const [localSelectedTerms, setLocalSelectedTerms] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_5__.useState)(selectedTerms);

  // State to hold taxonomy terms for filtering options
  const [taxonomyTerms, setTaxonomyTerms] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_5__.useState)({
    projecttype: [],
    projectcategory: [],
    projectclient: []
  });

  // State to store fetched portfolio data
  const [portfolioData, setPortfolioData] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_5__.useState)(null);

  /**
      * Fetches taxonomy terms when the block is first mounted.
      */
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_5__.useEffect)(() => {
    fetchTaxonomyTerms("projecttype");
    fetchTaxonomyTerms("projectcategory");
    fetchTaxonomyTerms("projectclient");
  }, []); // Empty dependency array ensures this only runs on mount

  /**
      * Fetches portfolio data and updates block attributes when localSelectedTerms changes.
      */
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_5__.useEffect)(() => {
    fetchPortfolioData();
    setAttributes({
      selectedTerms: localSelectedTerms
    });
  }, [localSelectedTerms]); // Re-run when selected terms change

  /**
   * Fetches portfolio data based on selected terms.
   * The data is retrieved from a custom REST API endpoint.
   */
  const fetchPortfolioData = async () => {
    // Base URL for fetching portfolio data
    let url = `http://localhost:1234/wp-test/wp-json/md-custom/gb-portfolio`;

    // Construct query parameters based on local selected terms
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(localSelectedTerms)) {
      if (value) {
        params.append(key, value);
      }
    }

    // If there are query parameters, add them to the URL
    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    // Fetch portfolio data from the constructed URL
    const response = await fetch(url);
    const data = await response.json(); // Parse JSON response
    // Update the local state with the fetched portfolio data
    setPortfolioData(data);
  };

  /**
   * Fetches terms for a specific taxonomy and updates the corresponding state.
   * Handles errors gracefully and logs them to the console.
   *
   * @param {string} taxonomy - The taxonomy for which terms are fetched.
   */
  const fetchTaxonomyTerms = async taxonomy => {
    try {
      const response = await fetch(`http://localhost:1234/wp-test/wp-json/wp/v2/${taxonomy}`);
      // Parse JSON response to get terms
      const terms = await response.json();
      // Update the state with fetched terms for the specified taxonomy
      setTaxonomyTerms(prevState => ({
        ...prevState,
        [taxonomy]: terms
      }));
    } catch (error) {
      // Log error to console if fetching terms fails
      console.error(`Error fetching ${taxonomy} terms:`, error);
    }
  };

  /**
   * Handles changes in the selected term for a specific taxonomy.
   * Updates the local state with the new selected value.
   *
   * @param {string} taxonomy - The taxonomy that is being changed.
   * @param {string} value - The new selected value.
   */
  const handleTermChange = (taxonomy, value) => {
    const updatedTerms = {
      [taxonomy]: value === "all" ? "" : value
    };
    setLocalSelectedTerms(prevState => ({
      ...prevState,
      ...updatedTerms
    }));
  };

  /**
   * Renders the block's user interface, including inspector controls
   * and the portfolio data based on the selected terms.
   */
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    ...blockProps
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.InspectorControls, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
    title: "Filters"
  }, " ", (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.SelectControl, {
    label: "Project Type",
    value: localSelectedTerms.projecttype,
    onChange: value => handleTermChange("projecttype", value),
    options: [{
      label: "All",
      value: "all"
    }, ...taxonomyTerms.projecttype.map(term => ({
      label: term.name,
      value: term.slug
    }))]
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.SelectControl, {
    label: "Project Category",
    value: localSelectedTerms.projectcategory,
    onChange: value => handleTermChange("projectcategory", value),
    options: [{
      label: "All",
      value: "all"
    }, ...taxonomyTerms.projectcategory.map(term => ({
      label: term.name,
      value: term.slug
    }))]
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.SelectControl, {
    label: "Project Client",
    value: localSelectedTerms.projectclient,
    onChange: value => handleTermChange("projectclient", value),
    options: [{
      label: "All",
      value: "all"
    }, ...taxonomyTerms.projectclient.map(term => ({
      label: term.name,
      value: term.slug
    }))]
  }))), portfolioData ? (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(PortfolioList, {
    portfolioData: portfolioData
  }) : (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", null, "Loading..."));
}

/**
 * Component to render a list of portfolio items in a grid format.
 * It displays project details like title, thumbnail, and content excerpt, along with links to the full project.
 *
 * @param {Object} props - The component properties.
 * @param {Array} props.portfolioData - Array of portfolio project objects to display.
 * @returns {JSX.Element} - The JSX element representing the portfolio grid.
 */
function PortfolioList({
  portfolioData
}) {
  /**
   * Function to truncate content to a specified length, appending an ellipsis ("...") if truncated.
   *
   * @param {string} content - The original content string to be truncated.
   * @param {number} maxLength - The maximum allowed length before truncation.
   * @returns {string} - The truncated content, with ellipsis if needed.
   */
  const truncateContent = (content, maxLength) => {
    if (content.length > maxLength) {
      return content.substring(0, maxLength) + "..."; // Truncate and add ellipsis
    } else {
      return content; // No truncation needed
    }
  };
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "portfolio-grid"
  }, portfolioData.map(project =>
  // Render each portfolio project as a grid item
  (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    key: project.id,
    className: "portfolio-item"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("a", {
    href: project.permalink,
    target: "_blank",
    rel: "noopener noreferrer"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("h2", null, project.title), " "), project.thumbnail ? (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("img", {
    src: project.thumbnail,
    alt: project.title
  }) : (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", null, "No image available") // Fallback if no thumbnail
  , (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    dangerouslySetInnerHTML: {
      __html: truncateContent(project.content, 100) // Truncate content to 100 characters
    }
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("a", {
    href: project.permalink,
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Read more"))));
}

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./style.scss */ "./src/style.scss");
/* harmony import */ var _edit__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./edit */ "./src/edit.js");
/* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./block.json */ "./src/block.json");
/**
 * Registers a new block provided a unique name and an object defining its behavior.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 */


/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * All files containing `style` keyword are bundled together. The code used
 * gets applied both to the front of your site and to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */


/**
 * Internal dependencies
 */



/**
 * Every block starts by registering a new block type definition.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-registration/
 */
(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockType)(_block_json__WEBPACK_IMPORTED_MODULE_3__.name, {
  /**
      * Block attributes define the data structure for the block.
      * Attributes can be used to store block-specific data.
      */
  attributes: {
    selectedTerms: {
      type: 'object',
      default: {
        projecttype: '',
        projectcategory: '',
        projectclient: ''
      }
    }
  },
  /**
   * @see ./edit.js
   */
  edit: _edit__WEBPACK_IMPORTED_MODULE_2__["default"],
  save: () => null // For dynamic blocks, return null or a function
});

/***/ }),

/***/ "./src/editor.scss":
/*!*************************!*\
  !*** ./src/editor.scss ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/style.scss":
/*!************************!*\
  !*** ./src/style.scss ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "React" ***!
  \************************/
/***/ ((module) => {

module.exports = window["React"];

/***/ }),

/***/ "@wordpress/block-editor":
/*!*************************************!*\
  !*** external ["wp","blockEditor"] ***!
  \*************************************/
/***/ ((module) => {

module.exports = window["wp"]["blockEditor"];

/***/ }),

/***/ "@wordpress/blocks":
/*!********************************!*\
  !*** external ["wp","blocks"] ***!
  \********************************/
/***/ ((module) => {

module.exports = window["wp"]["blocks"];

/***/ }),

/***/ "@wordpress/components":
/*!************************************!*\
  !*** external ["wp","components"] ***!
  \************************************/
/***/ ((module) => {

module.exports = window["wp"]["components"];

/***/ }),

/***/ "@wordpress/element":
/*!*********************************!*\
  !*** external ["wp","element"] ***!
  \*********************************/
/***/ ((module) => {

module.exports = window["wp"]["element"];

/***/ }),

/***/ "@wordpress/i18n":
/*!******************************!*\
  !*** external ["wp","i18n"] ***!
  \******************************/
/***/ ((module) => {

module.exports = window["wp"]["i18n"];

/***/ }),

/***/ "./src/block.json":
/*!************************!*\
  !*** ./src/block.json ***!
  \************************/
/***/ ((module) => {

module.exports = /*#__PURE__*/JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":3,"name":"grid-view/gridview-plugin","version":"1.0.0","title":"Grid view","category":"widgets","icon":"grid-view","description":"A custom Gutenberg dynamic block for publishing frontend view of list all projects in gridview.","example":{},"supports":{"html":false},"textdomain":"gridview-plugin","editorScript":"file:./index.js","editorStyle":"file:./index.css","style":"file:./style-index.css","render":"file:./render.php","viewScript":"file:./view.js"}');

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"index": 0,
/******/ 			"./style-index": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = globalThis["webpackChunkgridview_plugin"] = globalThis["webpackChunkgridview_plugin"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["./style-index"], () => (__webpack_require__("./src/index.js")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
//# sourceMappingURL=index.js.map