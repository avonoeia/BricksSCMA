"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
var express_1 = require("express");
exports.router = express_1.default.Router();
exports.router.post('/login', function (req, res) {
    res.send('Login route');
});
exports.router.post('/register', function (req, res) {
    res.send('Register route');
});
exports.default = exports.router;
