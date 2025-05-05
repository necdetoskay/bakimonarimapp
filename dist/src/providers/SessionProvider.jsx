"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SessionProvider;
var react_1 = require("next-auth/react");
function SessionProvider(_a) {
    var children = _a.children;
    return (<react_1.SessionProvider>{children}</react_1.SessionProvider>);
}
