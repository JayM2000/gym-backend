"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.legacyRequireAuth = void 0;
const legacyRequireAuth = (req, res, next) => {
    var _a;
    if (!((_a = req === null || req === void 0 ? void 0 : req.auth) === null || _a === void 0 ? void 0 : _a.userId)) {
        return next(new Error("Unauthenticated"));
    }
    next();
};
exports.legacyRequireAuth = legacyRequireAuth;
