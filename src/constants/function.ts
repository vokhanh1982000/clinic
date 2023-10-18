import dayjs, { Dayjs } from 'dayjs';

export function handleInputChangeUpperCase(e: any) {
  e.target.value = e.target.value.toUpperCase();
}

export function generateRandomId() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const length = 10;

  let result = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }

  return result;
}

export const disabledFutureDate = (current: Dayjs | undefined) => {
  if (current) {
    const today = dayjs();
    return current && dayjs(current).isAfter(today, 'day');
  }
  return false;
};

export const disabledPastDate = (current: Dayjs | undefined) => {
  if (current) {
    const today = dayjs();
    return current && dayjs(current).isBefore(today, 'day');
  }
  return false;
};
