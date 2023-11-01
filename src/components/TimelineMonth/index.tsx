import { useMutation } from '@tanstack/react-query';
import { Form, FormInstance, Spin, message } from 'antd';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import { FC, HTMLAttributes, useEffect, useMemo, useState } from 'react';
import { Calendar, CalendarProps, Culture, Event, EventProps, Views, dayjsLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { holidayScheduleApi } from '../../apis';
import {
  Administrator,
  AdministratorClinic,
  BookingByMonthDto,
  CreateHolidayScheduleDto,
  Customer,
  DoctorClinic,
  HolidaySchedule,
} from '../../apis/client-axios';
import { IFormData, TimelineMode, n } from '../TimelineControl/constants';
import TimelineMonthEvent from './Event';

interface TimelineMonthProps {
  form: FormInstance<IFormData>;
  listBookingMonth: BookingByMonthDto[];
  listHolidayMonth: HolidaySchedule[];
  onRefetchMonth: () => void;
  user: Administrator | Customer | AdministratorClinic | DoctorClinic;
}

export interface TimelineEvent extends Event {
  resource?: BookingByMonthDto;
  holiday?: HolidaySchedule;
}

const TimelineMonth: FC<TimelineMonthProps> = (props) => {
  const { form, listBookingMonth, listHolidayMonth, onRefetchMonth, user } = props;

  const time = Form.useWatch(n('time'), form);

  const [events, setEvents] = useState<TimelineEvent[]>([]);

  const { formats, view, localizer } = useMemo<CalendarProps<TimelineEvent>>(
    () => ({
      localizer: dayjsLocalizer(dayjs),
      formats: {
        weekdayFormat: (date: Date, culture?: Culture) => dayjsLocalizer(dayjs).format(date, 'dddd', culture),
      },
      view: Views.MONTH,
    }),
    []
  );

  useEffect(() => {
    if (listBookingMonth.length >= 0) {
      const events: TimelineEvent[] = [];

      for (const booking of listBookingMonth) {
        const findHoliday = listHolidayMonth.find((holiday) =>
          dayjs(holiday.date).startOf('days').isSame(dayjs(booking.day).startOf('days'))
        );

        const event: TimelineEvent = {
          start: dayjs(booking.day).startOf('days').toDate(),
          end: dayjs(booking.day).endOf('days').toDate(),
          resource: booking,
          title: null,
          holiday: findHoliday,
        };

        events.push(event);
      }

      setEvents(events);
    }
  }, [listBookingMonth, listHolidayMonth]);

  const createHolidayMutation = useMutation(
    (payload: CreateHolidayScheduleDto) => holidayScheduleApi.holidayScheduleControllerCreate(payload),
    {
      onSuccess: () => {
        onRefetchMonth();
      },
      onError: ({ response }) => {
        message.error(response?.data?.message);
      },
    }
  );

  const deleteHolidayMutation = useMutation((id: string) => holidayScheduleApi.holidayScheduleControllerRemove(id), {
    onSuccess: () => {
      onRefetchMonth();
    },
    onError: ({ response }) => {
      message.error(response?.data?.message);
    },
  });

  const renderEvent = (props: EventProps<TimelineEvent>) => {
    return createHolidayMutation.isLoading || deleteHolidayMutation.isLoading ? (
      <Spin />
    ) : (
      <TimelineMonthEvent eventProps={props} onChangeHoliday={handleChangeHoliday} user={user} />
    );
  };

  const renderDayPropGetter = (date: Date): HTMLAttributes<HTMLDivElement> => {
    const findBooking = listBookingMonth.find((booking) =>
      dayjs(booking.day).startOf('days').isSame(dayjs(date).startOf('days'))
    );

    const isCurrentDate = dayjs(new Date()).startOf('days').isSame(dayjs(date).startOf('days'));

    return {
      style: {
        background: isCurrentDate
          ? 'rgba(238, 88, 36, 0.10)'
          : findBooking
          ? findBooking?.isWork
            ? '#ffffff'
            : '#F2F2F2'
          : '#e6e6e6',
      },
    };
  };

  const handleChangeHoliday = (type: 'create' | 'delete', value?: string) => {
    if (!value) return;

    if (type === 'create') {
      createHolidayMutation.mutate({ date: value });
    } else if (type === 'delete') {
      deleteHolidayMutation.mutate(value);
    }
  };

  const handleSelectEvent = (event: TimelineEvent) => {
    if (
      dayjs(event.start).startOf('days').isAfter(dayjs(new Date()).startOf('days')) ||
      dayjs(event.start).startOf('days').isSame(dayjs(new Date()).startOf('days'))
    )
      return;

    form.setFieldsValue({
      [n('mode')]: user.user.type === 'doctor_clinic' ? TimelineMode.WEEK : TimelineMode.DATE,
      [n('time')]: dayjs(event.start),
    });
  };

  return (
    <>
      <Calendar
        localizer={localizer}
        defaultView={view}
        toolbar={false}
        formats={formats}
        defaultDate={dayjs(time).startOf('days').toDate()}
        events={events}
        showMultiDayTimes
        className="timeline-custom-month"
        dayPropGetter={renderDayPropGetter}
        components={{
          event: renderEvent,
        }}
        drilldownView={null}
        onSelectEvent={handleSelectEvent}
      />
    </>
  );
};

export default TimelineMonth;
