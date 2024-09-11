"use strict";
exports.__esModule = true;
exports.ContactFormSchema = void 0;
var zod_1 = require("zod");
exports.ContactFormSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, { message: 'Name is Required' }).max(10, { message: 'Name should be limited to 10 chars' }),
    email: zod_1.z.string().min(1, { message: 'Email is required' }).email('Invalid email'),
    message: zod_1.z.string().min(1, { message: 'Message is required' }).max(256, { message: 'Keep message to 256 chars' })
});
