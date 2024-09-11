"use strict";
exports.__esModule = true;
var mock_1 = require("@/content/skills/mock");
var react_icons_1 = require("@radix-ui/react-icons");
var react_1 = require("react");
var SkillRating = function (props) {
    var level = props.level;
    return (react_1["default"].createElement("div", { className: "flex justify-start items-center" }, new Array(5).fill(0).map(function (item, index) { return (react_1["default"].createElement(react_icons_1.StarFilledIcon, { key: index, className: "" + (level >= index ? "text-orange-400" : "text-gray-300") })); })));
};
function SkillMetric() {
    return (react_1["default"].createElement("section", { className: "mt-10" },
        react_1["default"].createElement("h1", { className: "title text-xl no-underline font-bold" }, "Technologies And Skills"),
        react_1["default"].createElement("div", null, mock_1.SkillMetricMap.map(function (item) { return (react_1["default"].createElement("div", { className: "flex gap-10 mt-3", key: item.name },
            react_1["default"].createElement("span", { className: "text-sm text-bold w-20" }, item.name),
            react_1["default"].createElement(SkillRating, { level: item.level }))); }))));
}
exports["default"] = SkillMetric;
