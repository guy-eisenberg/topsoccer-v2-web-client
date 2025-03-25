export default function isChromeAndroid() {
  const chromeAgent = /(chrome)/i.test(navigator.userAgent);
  const androidAgent = /(android)/i.test(navigator.userAgent);

  if (chromeAgent && androidAgent) return true;

  return false;
}
