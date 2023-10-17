import { Form, FormInstance } from 'antd';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import { CSSProperties, FC, useMemo } from 'react';
import { Calendar, CalendarProps, Culture, EventProps, Views, dayjsLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useIntl } from 'react-intl';
import { IFormData, n } from '../../routes/doctor/booking';
import TimelineMonthEvent from './Event';

interface TimelineMonthProps {
  form: FormInstance<IFormData>;
}

const TimelineMonth: FC<TimelineMonthProps> = (props) => {
  const { form } = props;

  const intl = useIntl();
  const time = Form.useWatch(n('time'), form);

  const { formats, view, localizer } = useMemo<CalendarProps<any>>(
    () => ({
      localizer: dayjsLocalizer(dayjs),
      formats: {
        weekdayFormat: (date: Date, culture?: Culture) => dayjsLocalizer(dayjs).format(date, 'dddd', culture),
      },
      view: Views.MONTH,
    }),
    []
  );

  const renderEvent = (props: EventProps<any>) => <TimelineMonthEvent eventProps={props} />;

  const renderEventPropGetter = (event: any): { className?: string; style?: CSSProperties } => {
    return {
      style: {
        backgroundColor: 'transparent',
        border: 0,
        padding: 0,
        width: '100%',
        height: '100%',
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
        events={[]}
        showMultiDayTimes
        className="timeline-custom-month"
        eventPropGetter={renderEventPropGetter}
        components={{
          event: renderEvent,
        }}
        drilldownView={null}
      />
    </>
  );
};

export default TimelineMonth;
