"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var cors_1 = require("cors");
var port = process.env.PORT;
var authRoutes_1 = require("./routes/authRoutes");
// const authRoutes = require('./routes/authRoutes')
var app = (0, express_1.default)();
// Configurations
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: "".concat(process.env.CORS_ORIGIN),
    optionsSuccessStatus: 200
}));
// Routes
app.use('/auth', authRoutes_1.router);
app.use('/test', function (req, res) {
    var number = '2';
    var anotherNumber = 2 * number;
    res.send(anotherNumber);
});
app.listen(port, function () {
    console.log("Server is running on port ".concat(port));
});
