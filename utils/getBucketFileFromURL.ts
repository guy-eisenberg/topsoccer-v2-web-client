export function getBucketFileFromURL(bucket: string, urlStr: string) {
  const url = new URL(urlStr);
  const pathSegments = url.pathname.split("/");
  const bucketIndex = pathSegments.findIndex((s) => s === bucket);

  const finalPath = pathSegments.slice(bucketIndex + 1).join("/");

  return finalPath;
}
