"use strict";
exports.__esModule = true;
exports.EmailTemplate = void 0;
var React = require("react");
exports.EmailTemplate = function (_a) {
    var name = _a.name, message = _a.message;
    return (React.createElement("div", { className: "flex" },
        React.createElement("h1", { className: "text-orange-600" },
            "Hey there!! There is new message from ",
            name,
            "!"),
        React.createElement("p", { className: "text-sm" }, message)));
};
