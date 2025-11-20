"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const zod_1 = require("zod");
const HttpError_1 = require("../errors/HttpError");
const errorHandler = (err, _req, res, _next) => {
    if (err instanceof zod_1.ZodError) {
        return res.status(400).json({ error: err.issues.map((issue) => issue.message).join(', ') });
    }
    if (err instanceof HttpError_1.HttpError) {
        return res.status(err.status).json({ error: err.message });
    }
    // eslint-disable-next-line no-console
    console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
};
exports.errorHandler = errorHandler;
