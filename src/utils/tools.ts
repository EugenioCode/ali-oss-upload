export const replaceBaseUrl = (originalUrl: string, newBaseUrl: string): string => {
  const regex = /^https?:\/\/[^/]+/;
  const replacedUrl = originalUrl.replace(regex, newBaseUrl);
  return replacedUrl;
};

export const deleteSpace = (spaceString: string): string => {
  return spaceString.replace(/\s/g, '');
};