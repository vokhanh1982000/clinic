import { Form, FormInstance } from 'antd';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import { FC, HTMLAttributes, useEffect, useMemo, useState } from 'react';
import { Calendar, CalendarProps, Culture, Event, EventProps, Views, dayjsLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { BookingByMonthDto } from '../../apis/client-axios';
import { IFormData, n } from '../../routes/doctor/booking';
import TimelineMonthEvent from './Event';

interface TimelineMonthProps {
  form: FormInstance<IFormData>;
  listBookingMonth: BookingByMonthDto[];
}

export interface TimelineEvent extends Event {
  resource?: BookingByMonthDto;
}

const TimelineMonth: FC<TimelineMonthProps> = (props) => {
  const { form, listBookingMonth } = props;

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
        const event: TimelineEvent = {
          start: dayjs(booking.day).startOf('days').toDate(),
          end: dayjs(booking.day).endOf('days').toDate(),
          resource: booking,
          title: null,
        };

        events.push(event);
      }

      setEvents(events);
    }
  }, [listBookingMonth]);

  const renderEvent = (props: EventProps<TimelineEvent>) => <TimelineMonthEvent eventProps={props} />;

  const renderDayPropGetter = (date: Date): HTMLAttributes<HTMLDivElement> => {
    const findBooking = listBookingMonth.find((booking) =>
      dayjs(booking.day).startOf('days').isSame(dayjs(date).startOf('days'))
    );

    return {
      style: {
        background: findBooking ? (findBooking?.isWork ? '#ffffff' : '#F2F2F2') : '#e6e6e6',
      },
    };
  };

  return (
    <>
      <Calendar
        localizer={localizer}
        view={view}
        toolbar={false}
        formats={formats}
        date={dayjs(time).startOf('days').toDate()}
        events={events}
        showMultiDayTimes
        className="timeline-custom-month"
        dayPropGetter={renderDayPropGetter}
        components={{
          event: renderEvent,
        }}
        drilldownView={null}
      />
    </>
  );
};

export default TimelineMonth;
