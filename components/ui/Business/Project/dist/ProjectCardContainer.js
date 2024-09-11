"use strict";
exports.__esModule = true;
exports.ProjectCardContainer = void 0;
var react_1 = require("react");
var ProjectCard_1 = require("../ProjectCard");
exports.ProjectCardContainer = function (props) {
    return (react_1["default"].createElement("section", { className: "mt-10" },
        react_1["default"].createElement("h1", { className: "title no-underline font-bold" }, "Professional Projects"),
        react_1["default"].createElement(ProjectCard_1.ProjectCard, null)));
};
