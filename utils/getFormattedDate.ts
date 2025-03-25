export function getFormattedDate(ms: number) {
  const date = new Date(ms);

  const year = date.getFullYear();
  const _month = date.getMonth() + 1;
  const month = `${_month < 10 ? "0" : ""}${_month}`;
  const _day = date.getDate();
  const day = `${_day < 10 ? "0" : ""}${_day}`;
  const _hour = date.getHours();
  const hour = `${_hour < 10 ? "0" : ""}${_hour}`;
  const _minute = date.getMinutes();
  const minute = `${_minute < 10 ? "0" : ""}${_minute}`;

  return { year, month, day, hour, minute };
}
