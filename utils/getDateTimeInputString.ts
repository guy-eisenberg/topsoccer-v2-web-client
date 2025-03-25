import { getFormattedDate } from "./getFormattedDate";

export function getDateTimeInputString(seconds: number) {
  const { year, month, day, hour, minute } = getFormattedDate(seconds);

  return `${year}-${month}-${day}T${hour}:${minute}`;
}
