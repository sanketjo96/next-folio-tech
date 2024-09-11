"use strict";
exports.__esModule = true;
var image_1 = require("next/image");
var react_1 = require("react");
var author_2_jpg_1 = require("@/public/author_2.jpg");
function Introduction() {
    return (react_1["default"].createElement("section", { className: "flex" },
        react_1["default"].createElement("div", { className: "mt-4 flex-1" },
            react_1["default"].createElement("h1", { className: "title text-2xl no-underline font-bold" }, "Hey, I'm Sanket"),
            react_1["default"].createElement("p", { className: "mt-4 font-light text-muted-foreground" }, "A seasoned JavaScript developer with extensive experience as a React.js lead, proficient in ES6, OOJS, TypeScript, Node.js, GraphQL, and REST, with intermediate expertise in Next.js. Passionate about web development, with a strong commitment to continuous learning and sharing knowledge. Dedicated to fostering growth in both personal development and the wider tech community")),
        react_1["default"].createElement("div", null,
            react_1["default"].createElement(image_1["default"], { className: "flex-1 rounded-full grayscale", src: author_2_jpg_1["default"], alt: "Sanket Joshi", width: 175, height: 175 }))));
}
exports["default"] = Introduction;
