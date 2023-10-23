import { BookingStatusEnum } from '../../../../apis/client-axios';

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
