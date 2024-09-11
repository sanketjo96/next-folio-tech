"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
require("../styles/globals.css");
var AppThemeProvider_1 = require("@/components/providers/AppThemeProvider");
var AppHeader_1 = require("@/components/ui/Business/AppHeader");
var AppFooter_1 = require("@/components/ui/Business/AppFooter");
var toaster_1 = require("@/components/ui/toaster");
function App(_a) {
    var Component = _a.Component, pageProps = _a.pageProps;
    return (React.createElement("div", { className: "flex min-h-screen flex-col font-sans" },
        React.createElement(AppThemeProvider_1["default"], null,
            React.createElement(AppHeader_1["default"], null),
            React.createElement("main", { className: "grow" },
                React.createElement(Component, __assign({}, pageProps))),
            React.createElement(toaster_1.Toaster, null),
            React.createElement(AppFooter_1["default"], null))));
}
exports["default"] = App;
