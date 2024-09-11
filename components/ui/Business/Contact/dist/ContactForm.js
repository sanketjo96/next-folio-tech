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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var schemas_1 = require("@/lib/schema/schemas");
var react_1 = require("react");
var react_hook_form_1 = require("react-hook-form");
var zod_1 = require("@hookform/resolvers/zod");
var input_1 = require("../../input");
var textarea_1 = require("../../textarea");
var button_1 = require("../../button");
var use_toast_1 = require("@/hooks/use-toast");
var ErrorLine = function (_a) {
    var message = _a.message;
    return (react_1["default"].createElement("p", { className: "ml-1 mt-2 text-sm text-rose-400" }, message));
};
function ContactForm() {
    var _this = this;
    var _a, _b, _c;
    var toast = use_toast_1.useToast().toast;
    var _d = react_hook_form_1.useForm({
        resolver: zod_1.zodResolver(schemas_1.ContactFormSchema),
        defaultValues: {
            name: "",
            message: "",
            email: ""
        }
    }), register = _d.register, handleSubmit = _d.handleSubmit, reset = _d.reset, _e = _d.formState, errors = _e.errors, isSubmitting = _e.isSubmitting;
    var onSubmitHandler = function (data) { return __awaiter(_this, void 0, void 0, function () {
        var e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, 3, 4]);
                    return [4 /*yield*/, fetch("/api/contact", {
                            method: "POST",
                            body: JSON.stringify({ message: data }),
                            headers: {
                                "Content-type": "application/json"
                            }
                        })];
                case 1:
                    _a.sent();
                    toast({ title: "Thanks for reaching out!! We will revert soon" });
                    return [3 /*break*/, 4];
                case 2:
                    e_1 = _a.sent();
                    toast({ title: "Something went wrong, will comeback soon" });
                    console.log("Error", e_1);
                    return [3 /*break*/, 4];
                case 3:
                    reset();
                    return [7 /*endfinally*/];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    return (react_1["default"].createElement("section", { className: "relative isolate" },
        react_1["default"].createElement("form", { onSubmit: handleSubmit(onSubmitHandler), noValidate: true, className: "mt-8 lg:flex-auto" },
            react_1["default"].createElement("div", { className: "flex flex-col gap-6" },
                react_1["default"].createElement(input_1.Input, __assign({ id: "name", type: "text" }, register("name"), { placeholder: "Enter your Name" })),
                ((_a = errors.name) === null || _a === void 0 ? void 0 : _a.message) && (react_1["default"].createElement(ErrorLine, { message: errors.name.message })),
                react_1["default"].createElement(input_1.Input, __assign({ id: "email", type: "text" }, register("email"), { placeholder: "Enter your Email" })),
                ((_b = errors.email) === null || _b === void 0 ? void 0 : _b.message) && (react_1["default"].createElement(ErrorLine, { message: errors.email.message })),
                react_1["default"].createElement(textarea_1.Textarea, __assign({ id: "message" }, register("message"), { placeholder: "Your Message" })),
                ((_c = errors.message) === null || _c === void 0 ? void 0 : _c.message) && (react_1["default"].createElement(ErrorLine, { message: errors.message.message })),
                react_1["default"].createElement(button_1.Button, { disabled: isSubmitting, id: "submit-bt", type: "submit" }, "Contact Me")))));
}
exports["default"] = ContactForm;
