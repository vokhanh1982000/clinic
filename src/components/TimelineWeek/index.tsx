import { useMutation } from '@tanstack/react-query';
import { Form, FormInstance, message } from 'antd';
import dayjs from 'dayjs';
import moment, { Moment } from 'moment';
import { FC, SyntheticEvent, useEffect, useRef, useState } from 'react';
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
import { useNavigate } from 'react-router';
import { useParams } from 'react-router-dom';
import { adminBookingApi, adminClinicBookingApi } from '../../apis';
import {
  AdminClinicUpdateBookingDto,
  AdminUpdateBookingDto,
  Administrator,
  AdministratorClinic,
  Booking,
  BookingByMonthDto,
  BookingStatusEnum,
  CreateHolidayScheduleDtoStatusEnum,
  Customer,
  DoctorClinic,
  HolidaySchedule,
} from '../../apis/client-axios';
import { ADMIN_CLINIC_ROUTE_PATH, ADMIN_ROUTE_PATH, DOCTOR_CLINIC_ROUTE_PATH } from '../../constants/route';
import { FULL_TIME_FORMAT, SHORT_DATE_FORMAT, TIME_FORMAT, WEEK_DAYS } from '../../util/constant';
import { IFormData, NOTES, TimelineDragStart, n, timelineKeys } from '../TimelineControl/constants';

interface TimelineWeekProps {
  form: FormInstance<IFormData>;
  listBookingWeek: Booking[];
  user: Administrator | Customer | AdministratorClinic | DoctorClinic;
  listBookingMonth: BookingByMonthDto[];
  listHolidayMonth: HolidaySchedule[];
  onRefetchWeek: () => void;
}

const getAllDaysOfWeek = (date: Moment) => {
  const startWeek = moment(date).clone().startOf('week');

  const days: string[] = [];

  for (let i = 0; i <= 7; i++) {
    days.push(moment(startWeek).add(i, 'day').format(SHORT_DATE_FORMAT));
  }

  return days;
};

const TimelineWeek: FC<TimelineWeekProps> = (props) => {
  const { form, listBookingWeek, user, listBookingMonth, onRefetchWeek, listHolidayMonth } = props;

  const intl = useIntl();
  const time = Form.useWatch(n('time'), form);

  const navigate = useNavigate();

  const [groups, setGroups] = useState<TimelineGroupBase[]>([]);
  const [items, setItems] = useState<TimelineItemBase<Moment>[]>([]);

  const timelineComponentRef = useRef<any>(null);

  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (listBookingWeek.length >= 0) {
      const days = getAllDaysOfWeek(moment(dayjs(time).toDate()));

      const timelineGroups: TimelineGroupBase[] = WEEK_DAYS.map((weekDay) => {
        const day = days[weekDay.value === 0 ? 7 : weekDay.value];
        const findCurrentDay = moment(new Date()).day();
        const current = days[findCurrentDay === 0 ? 7 : findCurrentDay];

        return {
          id: day,
          title: (
            <div
              className={`d-flex align-items-center gap-2 p-l-20 p-r-4 ${
                current === day ? 'background-color-feefea' : ''
              }`}
            >
              <span className="font-size-14 font-weight-400 color-1A1A1A font-family-primary">
                {intl.formatMessage({ id: weekDay.messageId })}
              </span>
              <span className="font-size-14 font-weight-400 color-1A1A1A font-family-primary">-</span>
              <span className="font-size-14 font-weight-400 color-1A1A1A font-family-primary">
                {days[weekDay.value === 0 ? 7 : weekDay.value]}
              </span>
            </div>
          ),
        };
      });

      setGroups([...(new Map(timelineGroups.map((group) => [group.id, group])).values() as any)]);
    }
  }, [listBookingWeek, user, intl, time]);

  useEffect(() => {
    if (listBookingWeek.length >= 0) {
      const items: TimelineItemBase<Moment>[] = [];

      for (const booking of listBookingWeek) {
        const itemTitle = (
          <div className="d-flex flex-column justify-content-between">
            <span className="font-size-12 font-weight-600">#{booking?.order ?? ''}</span>
            <span className="font-size-14 font-weight-600">{booking?.customer?.fullName ?? ''}</span>
          </div>
        );

        const findStatus = NOTES.find((note) => note.status === booking.status);
        const bookingTime = {
          start: moment(booking.appointmentStartTime).format(FULL_TIME_FORMAT),
          end: moment(booking.appointmentEndTime).format(FULL_TIME_FORMAT),
        };

        const item: TimelineItemBase<Moment> = {
          id: booking.id,
          group: moment(booking.appointmentStartTime).format(SHORT_DATE_FORMAT),
          title: itemTitle,
          start_time: moment(
            `${dayjs(time).format(SHORT_DATE_FORMAT)} ${bookingTime.start}`,
            `${SHORT_DATE_FORMAT} ${FULL_TIME_FORMAT}`
          ),
          end_time: moment(
            `${dayjs(time).format(SHORT_DATE_FORMAT)} ${bookingTime.end}`,
            `${SHORT_DATE_FORMAT} ${FULL_TIME_FORMAT}`
          ),
          itemProps: {
            style: {
              border: `1px solid ${findStatus?.borderColor || '#E5E5E5'}`,
              background: findStatus?.backgroundColor || '#F2F2F2',
              borderColor: findStatus?.borderColor || '#E5E5E5',
            },
          },
          // canResize: booking.status === BookingStatusEnum.Pending && user.user?.type !== 'doctor_clinic' ? true : false,
          canMove: booking.status === BookingStatusEnum.Pending && user.user?.type !== 'doctor_clinic' ? true : false,
          canChangeGroup:
            booking.status === BookingStatusEnum.Pending && user.user?.type !== 'doctor_clinic' ? true : false,
          divTitle: booking.customer.fullName,
        } as TimelineItemBase<Moment>;

        items.push(item);
      }

      if (items.length === 0) {
        items.push({
          id: 'empty',
          group: -1,
          title: '',
          start_time: moment(dayjs(time).toDate()).startOf('days'),
          end_time: moment(dayjs(time).toDate()).endOf('days'),
          itemProps: {
            style: {
              border: 0,
              background: 'transparent',
              userSelect: 'none',
            },
          },
          canChangeGroup: false,
          canMove: false,
          canResize: false,
        });
      }

      setItems(items);
    }
  }, [listBookingWeek, time]);

  const adminClinicUpdateBookingMutation = useMutation(
    (payload: { id: string; dto: AdminClinicUpdateBookingDto }) =>
      adminClinicBookingApi.adminClinicBookingControllerUpdate(payload.id, payload.dto),
    {
      onError: ({ response }) => {
        message.error(
          response?.data?.message
            ? intl.formatMessage({ id: `timeline.updateBooking.error.${response?.data?.message}` })
            : response?.data?.message
        );
      },
      onSuccess: () => {
        onRefetchWeek();
      },
    }
  );

  const adminUpdateBookingMutation = useMutation(
    (payload: { id: string; dto: AdminUpdateBookingDto }) =>
      adminBookingApi.adminBookingControllerUpdate(payload.id, payload.dto),
    {
      onError: ({ response }) => {
        message.error(
          response?.data?.message
            ? intl.formatMessage({ id: `timeline.updateBooking.error.${response?.data?.message}` })
            : response?.data?.message
        );
      },
      onSuccess: () => {
        onRefetchWeek();
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

    const current = moment(new Date());
    const timelineStart = moment(start);
    const timelineEnd = moment(end);

    if (
      current.isAfter(timelineStart) &&
      current.isBefore(timelineEnd) &&
      current.startOf('days').isSame(moment(dayjs(time).toDate()).startOf('days'))
    ) {
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
        <p>{intl.formatMessage({ id: 'timeline.control.mode.week' })}</p>
      </div>
    );
  };

  const renderIntervalRenderer = (props?: IntervalRenderer<any>) => {
    let className: string = 'rct-dateHeader';

    const current = moment(new Date());
    const timelineStart = moment(props?.intervalContext.interval.startTime);
    const timelineEnd = moment(props?.intervalContext.interval.endTime);

    if (
      current.isAfter(timelineStart) &&
      current.isBefore(timelineEnd) &&
      current.startOf('days').isSame(moment(dayjs(time).toDate()).startOf('days'))
    ) {
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
    const findBooking = listBookingWeek.find((booking) => booking.id === itemId);

    const newTime = moment(
      `${findGroup.id.toString()} ${moment(dragTime).format(TIME_FORMAT)}`,
      `${SHORT_DATE_FORMAT} ${TIME_FORMAT}`
    );

    if (findGroup.id === -1) return;

    const payload = {
      id: itemId,
      dto: {
        doctorClinicId: findBooking?.doctorClinicId?.toString(),
        id: itemId,
        appointmentStartTime: moment(newTime).toISOString(),
        appointmentEndTime: moment(newTime).add(30, 'minutes').toISOString(),
        clinicId: findBooking?.clinicId,
      },
    };

    if (user.user?.type === 'administrator_clinic') {
      adminClinicUpdateBookingMutation.mutate(payload);
    } else if (user.user?.type === 'administrator') {
      adminUpdateBookingMutation.mutate(payload);
    }
  };

  const handleItemResize = (itemId: string, endTimeOrStartTime: number, edge: 'left' | 'right') => {
    //change canResize Timeline's property from false to "both" to using this resize function
    const findBooking = listBookingWeek.find((booking) => booking.id === itemId);

    const payload = {
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
    };

    if (user.user?.type === 'administrator_clinic') {
      adminClinicUpdateBookingMutation.mutate(payload);
    } else if (user.user?.type === 'administrator') {
      adminUpdateBookingMutation.mutate(payload);
    }
  };

  const handleItemDoubleClick = (itemId: string, e: SyntheticEvent, time: number) => {
    if (itemId.includes('empty')) return;

    const route =
      user.user.type === 'administrator'
        ? ADMIN_ROUTE_PATH
        : user.user.type === 'administrator_clinic'
        ? ADMIN_CLINIC_ROUTE_PATH
        : DOCTOR_CLINIC_ROUTE_PATH;

    navigate(`${route.DETAIL_BOOKING}/${itemId}`);
    const currentBooking = listBookingWeek.find((booking) => booking.id === itemId);
    navigate(`${route.DETAIL_BOOKING}/${itemId}?routeScheduleId=${id}&routeClinicId=${currentBooking?.clinicId}`);
  };

  const renderHorizontalLineClassNamesForGroup = (group: TimelineGroupBase) => {
    const classes: string[] = [];

    const days = getAllDaysOfWeek(moment(dayjs(time).toDate()));
    const findCurrentDay = moment(new Date()).day();
    const current = days[findCurrentDay === 0 ? 7 : findCurrentDay];

    if (group.id === current) {
      classes.push('background-color-feefea');
    }

    const booking = listBookingMonth.find((booking) =>
      dayjs(booking.day).startOf('days').isSame(dayjs(group.id, SHORT_DATE_FORMAT).startOf('days'))
    );

    const findHoliday = listHolidayMonth.find((holiday) =>
      dayjs(holiday.date).startOf('days').isSame(dayjs(group.id, SHORT_DATE_FORMAT).startOf('days'))
    );

    if (
      !(
        (findHoliday && findHoliday.status === CreateHolidayScheduleDtoStatusEnum.Work) ||
        (!findHoliday && booking?.isWork)
      )
    ) {
      classes.push('background-color-f2f2f2');
    }

    return classes;
  };

  const handleMoveResizeValidator = (
    action: 'move' | 'resize',
    item: TimelineItemBase<Moment>,
    timeValidator: number,
    resizeEdge: 'left' | 'right',
    e: DragEvent,
    dragStart: TimelineDragStart
  ) => {
    if (!timelineComponentRef.current || (timelineComponentRef.current && !timelineComponentRef.current?.state)) return;

    if (action === 'move') {
      const time = timelineComponentRef.current.timeFromItemEvent(e); // time from drag/resize event, DO NOT USE "time" param
      const stateFrom = timelineComponentRef.current.state.visibleTimeStart;
      const stateTo = timelineComponentRef.current.state.visibleTimeEnd;

      const zoomMillis = Math.round(stateTo - stateFrom);
      const closeToBorderTolerance = 5; // How close item to border enables the auto-scroll canvas, 2-5 are good values.

      // Percent of the window area will be used for activanting the move Time window, will change base on zoom level
      const timeBorderArea = Math.round((zoomMillis * closeToBorderTolerance) / 100);
      const duration = item.end_time.valueOf() - item.start_time.valueOf();
      const rightBorderTime = time + duration;

      // Moves timeline to right, when item close to right border
      if (rightBorderTime > stateTo - timeBorderArea) {
        const newFrom = stateFrom + timeBorderArea / closeToBorderTolerance;
        const newTo = stateTo + timeBorderArea / closeToBorderTolerance;
        const maxTime = moment(new Date()).endOf('days').valueOf();

        if (newTo > maxTime) {
          timelineComponentRef.current.updateScrollCanvas(maxTime - (newTo - newFrom), maxTime);

          return timeValidator;
        }

        timelineComponentRef.current.updateScrollCanvas(newFrom, newTo);

        return time + dragStart.offset;
      }

      // Moves canvas to left, when item close to left border
      if (time < stateFrom + timeBorderArea) {
        const newFrom = stateFrom - timeBorderArea / closeToBorderTolerance;
        const newTo = stateTo - timeBorderArea / closeToBorderTolerance;
        const minTime = moment(new Date()).startOf('days').valueOf();

        if (newFrom < minTime) {
          timelineComponentRef.current.updateScrollCanvas(minTime, minTime + (newTo - newFrom));

          return timeValidator;
        }

        timelineComponentRef.current.updateScrollCanvas(newFrom, newTo);

        return time + dragStart.offset;
      }
    } else if (action === 'resize') {
      const time = timelineComponentRef.current.timeFromItemEvent(e); // time from drag/resize event, DO NOT USE "time" param
      const stateFrom = timelineComponentRef.current.state.visibleTimeStart;
      const stateTo = timelineComponentRef.current.state.visibleTimeEnd;

      const zoomMillis = Math.round(stateTo - stateFrom);
      const closeToBorderTolerance = 2; // How close item to border enables the auto-scroll canvas, 2-5 are good values.

      // Percent of the window area will be used for activanting the move Time window, will change base on zoom level
      const timeBorderArea = Math.round((zoomMillis * closeToBorderTolerance) / 100);

      // Moves timeline to right, when item close to right border
      if (resizeEdge === 'right' && time > stateTo - timeBorderArea) {
        const newFrom = stateFrom + timeBorderArea / closeToBorderTolerance;
        const newTo = stateTo + timeBorderArea / closeToBorderTolerance;

        timelineComponentRef.current.updateScrollCanvas(newFrom, newTo);
        return time + timeBorderArea / 2;
      } else if (time < stateFrom + timeBorderArea) {
        // Moves canvas to left, when item close to left border
        const newFrom = stateFrom - timeBorderArea / closeToBorderTolerance;
        const newTo = stateTo - timeBorderArea / closeToBorderTolerance;

        timelineComponentRef.current.updateScrollCanvas(newFrom, newTo);
        return time - timeBorderArea / 2;
      }
    }

    return timeValidator;
  };

  return (
    <>
      {groups.length > 0 &&
        items.length > 0 &&
        listBookingMonth.length > 0 &&
        !adminClinicUpdateBookingMutation.isLoading &&
        !adminUpdateBookingMutation.isLoading && (
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
            sidebarWidth={210}
            className="timeline-custom-day"
            maxZoom={4 * 60 * 60 * 1000}
            onTimeChange={handleTimeChange}
            canResize={false}
            canMove={user?.user?.type !== 'doctor_clinic'}
            canChangeGroup={user?.user?.type !== 'doctor_clinic'}
            verticalLineClassNamesForTime={renderVerticalLineClassNamesForTime}
            horizontalLineClassNamesForGroup={renderHorizontalLineClassNamesForGroup}
            onItemMove={handleItemMove}
            onItemResize={handleItemResize}
            onItemDoubleClick={handleItemDoubleClick}
            keys={timelineKeys}
            moveResizeValidator={handleMoveResizeValidator as any}
            buffer={5}
            itemTouchSendsClick={false}
          >
            <TimelineHeaders className="timeline-custom-day-header">
              <SidebarHeader>{renderSidebarHeaderChildren}</SidebarHeader>
              <DateHeader unit="hour" height={72} labelFormat={TIME_FORMAT} intervalRenderer={renderIntervalRenderer} />
            </TimelineHeaders>
          </Timeline>
        )}
    </>
  );
};

export default TimelineWeek;
