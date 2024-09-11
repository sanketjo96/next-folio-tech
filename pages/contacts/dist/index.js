"use strict";
exports.__esModule = true;
var ContactForm_1 = require("@/components/ui/Business/Contact/ContactForm");
function Page() {
    return (React.createElement("section", { className: "pb-24 pt-20" },
        React.createElement("div", { className: "container max-w-3xl" },
            React.createElement("h1", { className: "title text-xl mb-8" }, "Lett's Build Something Great Together!"),
            React.createElement("p", { className: "text-muted-foreground text-md" }, "I'm always excited to explore new opportunities and collaborations. If you have an interesting project or idea, I'd love to hear about it. Drop me a message, and let's make it happen!"),
            React.createElement(ContactForm_1["default"], null))));
}
exports["default"] = Page;
