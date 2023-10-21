import { useMutation } from '@tanstack/react-query';
import { Form, FormInstance, Popover, message } from 'antd';
import dayjs from 'dayjs';
import moment, { Moment } from 'moment';
import { FC, useEffect, useState } from 'react';
import Timeline, {
  DateHeader,
  IntervalRenderer,
  SidebarHeader,
  SidebarHeaderChildrenFnProps,
  TimelineGroupBase,
  TimelineHeaders,
  TimelineItemBase,
} from 'react-calendar-timeline';
import 'react-calendar-timeline/lib/Timeline.css';
import { useIntl } from 'react-intl';
import { adminClinicBookingApi } from '../../apis';
import { AdminClinicUpdateBookingDto, Booking } from '../../apis/client-axios';
import { TIME_FORMAT } from '../../util/constant';
import { IFormData, NOTES, n } from '../TimelineControl/constants';
import SidebarHeaderContent from './SidebarHeaderContent';

interface TimelineDayProps {
  form: FormInstance<IFormData>;
  listBookingDay: Booking[];
  onRefetchDay: () => void;
}

const getMinutesOfDay = (date: Moment | number) => {
  return moment(date).hours() * 60 + moment(date).minutes();
};

const TimelineDay: FC<TimelineDayProps> = (props) => {
  const { form, listBookingDay, onRefetchDay } = props;

  const intl = useIntl();
  const time = Form.useWatch(n('time'), form);

  const [groups, setGroups] = useState<TimelineGroupBase[]>([]);
  const [items, setItems] = useState<TimelineItemBase<Moment>[]>([]);

  useEffect(() => {
    if (listBookingDay.length >= 0) {
      let groups: TimelineGroupBase[] = [];
      const items: TimelineItemBase<Moment>[] = [];

      for (const booking of listBookingDay) {
        const groupTitle = (
          <Popover
            placement="right"
            content={<SidebarHeaderContent doctorClinicId={booking.doctorClinicId} />}
            title={null}
            arrow={false}
            trigger={['click']}
            overlayClassName="timeline-custom-day-popover"
          >
            <span className="font-size-16 font-weight-400 cursor-pointer">
              {booking?.doctorClinic?.fullName
                ? booking?.doctorClinic?.deletedAt
                  ? `${booking?.doctorClinic?.fullName} ${intl.formatMessage({ id: 'timeline.doctor.deleted' })}`
                  : booking?.doctorClinic?.fullName
                : ''}
            </span>
          </Popover>
        );

        const itemTitle = (
          <div className="d-flex flex-column justify-content-between">
            <span className="font-size-12 font-weight-600">#{booking?.order ?? ''}</span>
            <span className="font-size-14 font-weight-600">{booking?.customer?.fullName ?? ''}</span>
          </div>
        );

        const group = {
          id: booking?.doctorClinicId || '',
          title: groupTitle,
        };

        groups.push(group);

        const findStatus = NOTES.find((note) => note.status === booking.status);
        const item: TimelineItemBase<Moment> = {
          id: booking.id,
          group: booking?.doctorClinicId || '',
          title: itemTitle,
          start_time: moment(booking.appointmentStartTime),
          end_time: moment(booking.appointmentEndTime),
          itemProps: {
            style: {
              border: `1px solid ${findStatus?.borderColor || '#E5E5E5'}`,
              background: findStatus?.backgroundColor || '#F2F2F2',
              borderColor: findStatus?.borderColor || '#E5E5E5',
            },
          },
        };

        items.push(item);
      }

      if (groups.length === 0) {
        groups.push({
          id: -1,
          title: '',
        });
      }

      if (items.length === 0) {
        items.push({
          id: -1,
          group: -1,
          title: '',
          start_time: moment(dayjs(time).toDate()).startOf('days'),
          end_time: moment(dayjs(time).toDate()).endOf('days'),
          itemProps: {
            style: {
              border: 0,
              background: 'transparent',
            },
          },
        });
      }

      setItems(items);
      setGroups([...(new Map(groups.map((group) => [group.id, group])).values() as any)]);
    }
  }, [listBookingDay, time, intl]);

  const updateBookingMutation = useMutation(
    (payload: { id: string; dto: AdminClinicUpdateBookingDto }) =>
      adminClinicBookingApi.adminClinicBookingControllerUpdate(payload.id, payload.dto),
    {
      onError: ({ response }) => {
        message.error(response?.data?.message);
      },
      onSettled: () => {
        onRefetchDay();
      },
    }
  );

  const handleTimeChange = (
    visibleTimeStart: number,
    visibleTimeEnd: number,
    updateScrollCanvas: (start: number, end: number) => void
  ) => {
    const minTime = moment(dayjs(time).toDate()).startOf('days').valueOf();
    const maxTime = moment(dayjs(time).toDate()).endOf('days').valueOf();

    if (visibleTimeStart < minTime && visibleTimeEnd > maxTime) {
      updateScrollCanvas(minTime, maxTime);
    } else if (visibleTimeStart < minTime) {
      updateScrollCanvas(minTime, minTime + (visibleTimeEnd - visibleTimeStart));
    } else if (visibleTimeEnd > maxTime) {
      updateScrollCanvas(maxTime - (visibleTimeEnd - visibleTimeStart), maxTime);
    } else {
      updateScrollCanvas(visibleTimeStart, visibleTimeEnd);
    }
  };

  const renderVerticalLineClassNamesForTime = (start: number, end: number) => {
    const classes: string[] = [];

    const current = getMinutesOfDay(moment());
    const timelineStart = getMinutesOfDay(moment(start));
    const timelineEnd = getMinutesOfDay(moment(end));

    if (current >= timelineStart && current <= timelineEnd) {
      classes.push('timeline-custom-day-current');
    }

    return classes;
  };

  const renderSidebarHeaderChildren = (props: SidebarHeaderChildrenFnProps<any>) => {
    return (
      <div
        {...props.getRootProps()}
        className="d-flex flex-column justify-content-center align-items-center timeline-custom-day-sidebar"
      >
        <p>
          <span>{intl.formatMessage({ id: 'timeline.schedule' })}</span>
          <span>/</span>
        </p>
        <p>{intl.formatMessage({ id: 'timeline.doctor' })}</p>
      </div>
    );
  };

  const renderIntervalRenderer = (props?: IntervalRenderer<any>) => {
    let className: string = 'rct-dateHeader';

    const current = getMinutesOfDay(moment());
    const timelineStart = getMinutesOfDay(moment(props?.intervalContext.interval.startTime));
    const timelineEnd = getMinutesOfDay(moment(props?.intervalContext.interval.endTime));

    if (current >= timelineStart && current <= timelineEnd) {
      className = `${className} timeline-custom-day-current-header`;
    }

    return (
      <div {...props?.getIntervalProps()} className={className}>
        <span>{props?.intervalContext.intervalText}</span>
      </div>
    );
  };

  const handleItemMove = (itemId: string, dragTime: number, newGroupOrder: number) => {
    const findGroup = groups[newGroupOrder];
    const findBooking = listBookingDay.find((booking) => booking.id === itemId);

    updateBookingMutation.mutate({
      id: itemId,
      dto: {
        doctorClinicId: findGroup.id.toString(),
        id: itemId,
        appointmentStartTime: moment(dragTime).toISOString(),
        appointmentEndTime: moment(dragTime).add(30, 'minutes').toISOString(),
        clinicId: findBooking?.clinicId,
      },
    });
  };

  const handleItemResize = (itemId: string, endTimeOrStartTime: number, edge: 'left' | 'right') => {
    //change canResize from false to "both" at line 261 to using this resize function
    const findBooking = listBookingDay.find((booking) => booking.id === itemId);

    updateBookingMutation.mutate({
      id: itemId,
      dto: {
        doctorClinicId: findBooking?.doctorClinicId,
        id: itemId,
        appointmentStartTime:
          edge === 'right'
            ? moment(findBooking?.appointmentStartTime).toISOString()
            : moment(endTimeOrStartTime).toISOString(),
        appointmentEndTime:
          edge === 'left'
            ? moment(findBooking?.appointmentEndTime).toISOString()
            : moment(endTimeOrStartTime).toISOString(),
        clinicId: findBooking?.clinicId,
      },
    });
  };

  return (
    <>
      {groups.length > 0 && items.length > 0 && (
        <Timeline
          groups={groups}
          items={items}
          defaultTimeStart={moment(dayjs(time).toDate())}
          defaultTimeEnd={moment(dayjs(time).toDate()).add(4, 'hour')}
          timeSteps={{
            second: 0,
            minute: 0,
            hour: 0.5,
            day: 0,
            month: 0,
            year: 0,
          }}
          stackItems
          itemHeightRatio={0.78125}
          lineHeight={64}
          sidebarWidth={182}
          className="timeline-custom-day"
          maxZoom={4 * 60 * 60 * 1000}
          canResize={false}
          onTimeChange={handleTimeChange}
          onItemMove={handleItemMove}
          onItemResize={handleItemResize}
          verticalLineClassNamesForTime={renderVerticalLineClassNamesForTime}
          canChangeGroup={!updateBookingMutation.isLoading}
          canMove={!updateBookingMutation.isLoading}
        >
          <TimelineHeaders>
            <SidebarHeader>{renderSidebarHeaderChildren}</SidebarHeader>
            <DateHeader unit="hour" height={72} labelFormat={TIME_FORMAT} intervalRenderer={renderIntervalRenderer} />
          </TimelineHeaders>
        </Timeline>
      )}
    </>
  );
};

export default TimelineDay;
