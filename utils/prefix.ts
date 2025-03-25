export function prefix(number: number) {
  if (number > 9) return number.toString();
  else return `0${number}`;
}
