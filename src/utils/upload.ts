const OSS = require('ali-oss');
export interface OSSConfig {
  region: string,
  accessKeyId: string,
  accessKeySecret: string,
  bucket: string,
}

export const upLoadImageToOss = async (localFile: string,remoteFile: string, ossConfig: OSSConfig) => {
  const client = new OSS({
    ...ossConfig
  });
  try{
    const result = await client.put(remoteFile, localFile);
    return Promise.resolve(result);
  } catch (err) {
    return Promise.reject(err);
  }
};