import { fromAbsolute } from "@internationalized/date";

export function getFormattedDate(ms: number) {
  const date = fromAbsolute(ms, "Asia/Jerusalem");

  const year = date.year;
  const _month = date.month;
  const month = `${_month < 10 ? "0" : ""}${_month}`;
  const _day = date.day;
  const day = `${_day < 10 ? "0" : ""}${_day}`;
  const _hour = date.hour;
  const hour = `${_hour < 10 ? "0" : ""}${_hour}`;
  const _minute = date.minute;
  const minute = `${_minute < 10 ? "0" : ""}${_minute}`;

  return { year, month, day, hour, minute };
}
