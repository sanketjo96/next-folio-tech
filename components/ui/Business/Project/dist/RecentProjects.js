"use strict";
exports.__esModule = true;
var react_1 = require("react");
var MarkDownList_1 = require("../Markdown/MarkDownList");
var link_1 = require("next/link");
function RecentProjects(_a) {
    var list = _a.list;
    return (react_1["default"].createElement("section", { className: "mt-10" },
        react_1["default"].createElement("div", null,
            react_1["default"].createElement("h2", { className: "title font-bold" }, "Recent Projects"),
            react_1["default"].createElement(MarkDownList_1["default"], { redirectBase: "projects", metaList: list }),
            react_1["default"].createElement(link_1["default"], { href: "/projects", className: "hover: text-foreground" },
                react_1["default"].createElement("span", { className: "text-sm text-blue-400" }, "See More")))));
}
exports["default"] = RecentProjects;
