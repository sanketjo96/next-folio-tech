"use strict";
exports.__esModule = true;
var react_1 = require("react");
var MarkDownList_1 = require("../Markdown/MarkDownList");
var link_1 = require("next/link");
function RecentPosts(_a) {
    var list = _a.list;
    return (react_1["default"].createElement("section", { className: "mt-10" },
        react_1["default"].createElement("div", null,
            react_1["default"].createElement("h1", { className: "text-xl font-bold" }, "Recent Posts"),
            react_1["default"].createElement(MarkDownList_1["default"], { redirectBase: "posts", metaList: list }),
            react_1["default"].createElement(link_1["default"], { href: "/posts", className: "hover: text-foreground" },
                react_1["default"].createElement("span", { className: "text-sm text-blue-400" }, "See More")))));
}
exports["default"] = RecentPosts;
