export function splitDate(date: Date) {
  const day = date.getDate();
  const weekDay = date.getDay();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const hour = date.getHours();
  const minute = date.getMinutes();

  return {
    day,
    weekDay,
    month,
    year,
    hour,
    minute,
  };
}
