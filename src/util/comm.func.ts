export function roundTimeToNearestHalfHour(d?: Date): Date {
  let currentDate: Date = d ? d : new Date();
  let minutes: number = currentDate.getMinutes();

  if (minutes > 30) {
    currentDate.setHours(currentDate.getHours() + 1);
    currentDate.setMinutes(0);
  } else if (minutes > 0 && minutes <= 30) {
    currentDate.setMinutes(30);
  }
  currentDate.setSeconds(0);
  currentDate.setMilliseconds(0);
  return currentDate;
}
