import { Dayjs } from 'dayjs';
import { TimelineKeys } from 'react-calendar-timeline';
import { BookingStatusEnum } from '../../apis/client-axios';

export enum TimelineMode {
  DATE = 'date',
  MONTH = 'month',
  WEEK = 'week',
}

export interface IFormData {
  time?: Dayjs;
  mode?: TimelineMode;
  keyword?: string;
}

export const n = (key: keyof IFormData) => key;

export const NOTES = [
  {
    borderColor: '#20BF6B',
    backgroundColor: 'rgba(32, 191, 107, 0.20)',
    messageId: 'timeline.doctor.note.complete',
    status: BookingStatusEnum.Completed,
  },
  {
    borderColor: '#3867D6',
    backgroundColor: 'rgba(56, 103, 214, 0.20)',
    messageId: 'timeline.doctor.note.reviewed',
    status: BookingStatusEnum.Approved,
  },
  {
    borderColor: '#F7B731',
    backgroundColor: 'rgba(247, 183, 49, 0.20)',
    messageId: 'timeline.doctor.note.awaitingReview',
    status: BookingStatusEnum.Pending,
  },
  {
    borderColor: '#FC5C65',
    backgroundColor: 'rgba(252, 92, 101, 0.20)',
    messageId: 'timeline.doctor.note.canceled',
    status: BookingStatusEnum.Cancelled,
  },
  {
    borderColor: '#E5E5E5',
    backgroundColor: '#F2F2F2',
    messageId: 'timeline.doctor.note.dayOff',
  },
];

export interface IFilter {
  page: number;
  size?: number;
  sort?: string;
}

export const timelineKeys: TimelineKeys = {
  groupIdKey: 'id',
  groupTitleKey: 'title',
  groupRightTitleKey: 'rightTitle',
  itemIdKey: 'id',
  itemTitleKey: 'title',
  itemDivTitleKey: 'divTitle',
  itemGroupKey: 'group',
  itemTimeStartKey: 'start_time',
  itemTimeEndKey: 'end_time',
};

export interface TimelineDragStart {
  x: number;
  y: number;
  clientX: number;
  offset: number;
  itemTimeStart: string;
}
