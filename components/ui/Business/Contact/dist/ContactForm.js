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
    var onSubmitHandler = function (data) {
        console.log(data);
        toast({ title: "Thanks for reaching out!! We will revert soon" });
        reset();
    };
    return (react_1["default"].createElement("section", { className: "relative isolate" },
        react_1["default"].createElement("form", { onSubmit: handleSubmit(onSubmitHandler), noValidate: true, className: "mt-8 lg:flex-auto" },
            react_1["default"].createElement("div", { className: "flex flex-col gap-6" },
                react_1["default"].createElement(input_1.Input, __assign({ id: "name", type: "text" }, register("name"), { placeholder: "Enter your Name" })),
                ((_a = errors.name) === null || _a === void 0 ? void 0 : _a.message) && (react_1["default"].createElement(ErrorLine, { message: errors.name.message })),
                react_1["default"].createElement(input_1.Input, __assign({ id: "email", type: "text" }, register("email"), { placeholder: "Enter your Email" })),
                ((_b = errors.email) === null || _b === void 0 ? void 0 : _b.message) && (react_1["default"].createElement(ErrorLine, { message: errors.email.message })),
                react_1["default"].createElement(textarea_1.Textarea, __assign({ id: "message" }, register("message"), { placeholder: "Your Message" })),
                ((_c = errors.message) === null || _c === void 0 ? void 0 : _c.message) && (react_1["default"].createElement(ErrorLine, { message: errors.message.message })),
                react_1["default"].createElement(button_1.Button, { id: "submit-bt", type: "submit" }, "Submit")))));
}
exports["default"] = ContactForm;
