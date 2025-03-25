export function isPast(ms: number) {
  return ms < Math.floor(Date.now());
}
