"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSpace = exports.replaceBaseUrl = void 0;
const replaceBaseUrl = (originalUrl, newBaseUrl) => {
    const regex = /^https?:\/\/[^/]+/;
    const replacedUrl = originalUrl.replace(regex, newBaseUrl);
    return replacedUrl;
};
exports.replaceBaseUrl = replaceBaseUrl;
const deleteSpace = (spaceString) => {
    return spaceString.replace(/\s/g, '');
};
exports.deleteSpace = deleteSpace;
//# sourceMappingURL=tools.js.map