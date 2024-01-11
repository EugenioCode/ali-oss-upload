"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.upLoadImageToOss = void 0;
const OSS = require('ali-oss');
const upLoadImageToOss = async (localFile, remoteFile, ossConfig) => {
    const client = new OSS({
        ...ossConfig
    });
    try {
        const result = await client.put(remoteFile, localFile);
        return Promise.resolve(result);
    }
    catch (err) {
        return Promise.reject(err);
    }
};
exports.upLoadImageToOss = upLoadImageToOss;
//# sourceMappingURL=upload.js.map