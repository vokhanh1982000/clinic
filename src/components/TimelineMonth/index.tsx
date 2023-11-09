import { useMutation } from '@tanstack/react-query';
import { Form, FormInstance, Spin, message } from 'antd';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import { FC, HTMLAttributes, useEffect, useMemo, useRef, useState } from 'react';
import {
  Calendar,
  CalendarProps,
  Culture,
  Event,
  EventProps,
  SlotInfo,
  Views,
  dayjsLocalizer,
} from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useIntl } from 'react-intl';
import { useLocation } from 'react-router-dom';
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
import { scheduleDoctorRoutes } from '../TimelineControl';
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

  const intl = useIntl();

  const time = Form.useWatch(n('time'), form);

  const [events, setEvents] = useState<TimelineEvent[]>([]);

  const location = useLocation();
  const isSwitchRef = useRef<boolean>(false);

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
        message.error(
          response?.data?.message
            ? intl.formatMessage({ id: `timeline.updateBooking.error.${response?.data?.message}` })
            : response?.data?.message
        );
      },
      onSettled: () => {
        isSwitchRef.current = false;
      },
    }
  );

  const deleteHolidayMutation = useMutation((id: string) => holidayScheduleApi.holidayScheduleControllerRemove(id), {
    onSuccess: () => {
      onRefetchMonth();
    },
    onError: ({ response }) => {
      message.error(
        response?.data?.message
          ? intl.formatMessage({ id: `timeline.updateBooking.error.${response?.data?.message}` })
          : response?.data?.message
      );
    },
    onSettled: () => {
      isSwitchRef.current = false;
    },
  });

  const renderEvent = (props: EventProps<TimelineEvent>) => {
    return createHolidayMutation.isLoading || deleteHolidayMutation.isLoading ? (
      <Spin />
    ) : (
      <TimelineMonthEvent
        eventProps={props}
        onChangeHoliday={handleChangeHoliday}
        user={user}
        isSwitchRef={isSwitchRef}
      />
    );
  };

  const renderDayPropGetter = (date: Date): HTMLAttributes<HTMLDivElement> => {
    const booking = listBookingMonth.find((booking) =>
      dayjs(booking.day).startOf('days').isSame(dayjs(date).startOf('days'))
    );

    const isCurrentMonth = dayjs(time).startOf('days').isSame(dayjs(date).startOf('days'), 'month');
    const isCurrentDate = dayjs(new Date()).startOf('days').isSame(dayjs(date).startOf('days'));

    return {
      style: {
        background: isCurrentMonth
          ? isCurrentDate
            ? 'rgba(238, 88, 36, 0.10)'
            : booking?.isWork
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

  const handleSelectSlot = (slotInfo: SlotInfo) => {
    const booking = listBookingMonth.find((booking) =>
      dayjs(booking.day).startOf('days').isSame(dayjs(slotInfo.start).startOf('days'))
    );

    if (!booking?.isWork) return;

    form.setFieldsValue({
      [n('mode')]:
        user?.user?.type === 'doctor_clinic' ||
        scheduleDoctorRoutes.includes(location.pathname.slice(0, location.pathname.lastIndexOf('/')))
          ? TimelineMode.WEEK
          : TimelineMode.DATE,
      [n('time')]: dayjs(slotInfo.start)
        .set('hour', dayjs(new Date()).hour())
        .set('minute', dayjs(new Date()).minute()),
    });
  };

  const handleSelectEvent = (event: TimelineEvent) => {
    if (isSwitchRef.current) return;

    const booking = listBookingMonth.find((booking) =>
      dayjs(booking.day).startOf('days').isSame(dayjs(event.start).startOf('days'))
    );

    if (!booking?.isWork) return;

    form.setFieldsValue({
      [n('mode')]:
        user?.user?.type === 'doctor_clinic' ||
        scheduleDoctorRoutes.includes(location.pathname.slice(0, location.pathname.lastIndexOf('/')))
          ? TimelineMode.WEEK
          : TimelineMode.DATE,
      [n('time')]: dayjs(event.start).set('hour', dayjs(new Date()).hour()).set('minute', dayjs(new Date()).minute()),
    });
  };

  return (
    <>
      <Calendar
        localizer={localizer}
        defaultView={view}
        toolbar={false}
        formats={formats}
        date={dayjs(time).startOf('month').toDate()}
        events={events}
        showMultiDayTimes
        className="timeline-custom-month"
        dayPropGetter={renderDayPropGetter}
        components={{
          event: renderEvent,
        }}
        drilldownView={null}
        selectable
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
      />
    </>
  );
};

export default TimelineMonth;
