"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Home;
var navigation_1 = require("next/navigation");
function Home() {
    (0, navigation_1.redirect)("/login");
}
