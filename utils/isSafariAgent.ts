export default function isSafariAgent() {
  if (typeof navigator === "undefined") return false;

  const chromeAgent = /(chrome)/i.test(navigator.userAgent);
  const safariAgent = /(safari)/i.test(navigator.userAgent);

  if (chromeAgent && safariAgent) return false;

  return safariAgent;
}
