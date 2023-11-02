import { BookingStatusEnum } from '../apis/client-axios';

export const MONTH_FORMAT = 'MM/YYYY';
export const DATE_FORMAT = 'dddd, DD/MM/YYYY';
export const SHORT_DATE_FORMAT = 'DD/MM/YYYY';
export const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';
export const TIME_FORMAT = 'HH:mm';
export const FULL_TIME_FORMAT = 'HH:mm:ss';
export const WEEK_DAYS = [
  {
    value: 1,
    messageId: 'common.timeline.monday',
  },
  {
    value: 2,
    messageId: 'common.timeline.tuesday',
  },
  {
    value: 3,
    messageId: 'common.timeline.wednesday',
  },
  {
    value: 4,
    messageId: 'common.timeline.thursday',
  },
  {
    value: 5,
    messageId: 'common.timeline.friday',
  },
  {
    value: 6,
    messageId: 'common.timeline.saturday',
  },
  {
    value: 0,
    messageId: 'common.timeline.sunday',
  },
];
export const statusBackgroundColor = {
  [BookingStatusEnum.Approved]: '#3867D6',
  [BookingStatusEnum.Pending]: '#F7B731',
  [BookingStatusEnum.Cancelled]: '#D63A3A',
  [BookingStatusEnum.Completed]: '#20BF6B',
};

export const BookingStatus = [
  {
    label: 'booking.status.completed',
    value: BookingStatusEnum.Completed,
  },
  {
    label: 'booking.status.cancelled',
    value: BookingStatusEnum.Cancelled,
  },
  {
    label: 'booking.status.pending',
    value: BookingStatusEnum.Pending,
  },
  {
    label: 'booking.status.approved',
    value: BookingStatusEnum.Approved,
  },
];
