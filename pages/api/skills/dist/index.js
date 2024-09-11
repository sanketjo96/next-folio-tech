"use strict";
exports.__esModule = true;
var mock_1 = require("@/content/skills/mock");
var handler = function (req, res) {
    res.status(200).json(mock_1.SkillMetricMap);
};
exports["default"] = handler;
