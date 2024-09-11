"use strict";
exports.__esModule = true;
var utils_1 = require("@/lib/utils");
var link_1 = require("next/link");
var react_1 = require("react");
var MarkdownList = function (props) {
    var metaList = props.metaList, redirectBase = props.redirectBase;
    return (react_1["default"].createElement("ul", null, metaList.map(function (item) { return (react_1["default"].createElement("li", { key: item.id },
        react_1["default"].createElement(link_1["default"], { href: redirectBase + "/" + item.id, className: "flex items-center justify-between gap-2 mt-2 mb-4" },
            react_1["default"].createElement("div", { className: "max-w-lg" },
                react_1["default"].createElement("p", { className: "text-lg font-semibold" }, item.title),
                react_1["default"].createElement("p", { className: "text-sm font-light" }, item.summary)),
            item.publishDate && (react_1["default"].createElement("p", { className: "mt-1 text-sm font-light" }, utils_1.formatDate(item.publishDate)))))); })));
};
exports["default"] = MarkdownList;
