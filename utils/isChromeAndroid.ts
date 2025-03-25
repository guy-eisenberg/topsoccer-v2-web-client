export default function isChromeAndroid() {
  if (typeof navigator === "undefined") return false;

  const chromeAgent = /(chrome)/i.test(navigator.userAgent);
  const androidAgent = /(android)/i.test(navigator.userAgent);

  if (chromeAgent && androidAgent) return true;

  return false;
}
