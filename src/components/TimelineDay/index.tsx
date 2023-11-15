import { useMutation, useQuery } from '@tanstack/react-query';
import { Form, FormInstance, Popover, message } from 'antd';
import dayjs from 'dayjs';
import moment, { Moment } from 'moment';
import { FC, useEffect, useRef, useState } from 'react';
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
import { useInView } from 'react-intersection-observer';
import { useIntl } from 'react-intl';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { adminBookingApi, adminClinicBookingApi, clinicsApi } from '../../apis';
import {
  AdminClinicUpdateBookingDto,
  AdminUpdateBookingDto,
  Administrator,
  AdministratorClinic,
  Booking,
  BookingStatusEnum,
  Customer,
  DoctorClinic,
  DoctorClinicControllerGetAll200Response,
} from '../../apis/client-axios';
import { ADMIN_CLINIC_ROUTE_PATH, ADMIN_ROUTE_PATH } from '../../constants/route';
import { useAppDispatch } from '../../store';
import { updateClinic } from '../../store/clinicSlice';
import { TIME_FORMAT } from '../../util/constant';
import { IFilter, IFormData, NOTES, TimelineDragStart, n, timelineKeys } from '../TimelineControl/constants';
import SidebarHeaderContent from './SidebarHeaderContent';

interface TimelineDayProps {
  form: FormInstance<IFormData>;
  listBookingDay: Booking[];
  onRefetchDay: () => void;
  user: Administrator | Customer | AdministratorClinic | DoctorClinic;
  listDoctorClinics?: DoctorClinicControllerGetAll200Response;
  filter: IFilter;
  onChangeFilter: (newFilter: IFilter) => void;
}

const TimelineDay: FC<TimelineDayProps> = (props) => {
  const { form, listBookingDay, onRefetchDay, user, listDoctorClinics, filter, onChangeFilter } = props;

  const intl = useIntl();
  const time = Form.useWatch(n('time'), form);
  const keyword = Form.useWatch(n('keyword'), form);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [groups, setGroups] = useState<TimelineGroupBase[]>([]);
  const [items, setItems] = useState<TimelineItemBase<Moment>[]>([]);

  const timelineComponentRef = useRef<any>(null);

  const [ref, inView] = useInView({
    threshold: 0,
  });
  const dispatch = useAppDispatch();
  const [clinicId, setClinicId] = useState<string>();

  const { data: clinic } = useQuery({
    queryKey: ['detailClinicTopbar', { clinicId }],
    queryFn: () => clinicsApi.clinicControllerGetById(clinicId || ''),
    enabled: !!clinicId,
  });

  useEffect(() => {
    dispatch(updateClinic(clinic?.data));
  }, [clinic, dispatch]);

  useEffect(() => {
    if (
      inView &&
      Number(listDoctorClinics?.content?.length || 0) > 0 &&
      Number(listDoctorClinics?.content?.length || 0) >= Number(filter.size) &&
      Number(filter.size) * Number(filter.page) <= Number(listDoctorClinics?.total)
    ) {
      onChangeFilter({ page: filter.page + 1 });
    }
  }, [inView]);

  useEffect(() => {
    if (listDoctorClinics && Array.isArray(listDoctorClinics.content) && listDoctorClinics.content.length >= 0) {
      const groups: TimelineGroupBase[] = [
        {
          id: -1,
          title: '',
        },
      ];

      let index = 0;

      for (const doctor of listDoctorClinics.content) {
        index++;

        const groupTitle = (
          <Popover
            placement="right"
            content={<SidebarHeaderContent doctorClinicId={doctor.id} user={user} clinicId={doctor.clinicId} />}
            title={null}
            arrow={false}
            trigger={['click']}
            overlayClassName="timeline-custom-day-popover"
          >
            <span
              className="font-size-14 font-weight-400 cursor-pointer max-width-170 d-inline-block text-truncate p-l-20 p-r-4"
              ref={index === listDoctorClinics.content.length ? ref : undefined}
            >
              {doctor?.fullName
                ? doctor?.deletedAt
                  ? `${doctor?.fullName} ${intl.formatMessage({ id: 'timeline.doctor.deleted' })}`
                  : doctor?.fullName
                : ''}
            </span>
          </Popover>
        );

        const group = {
          id: doctor.id,
          title: groupTitle,
        };

        groups.push(group);
      }

      if (keyword && filter.page === 1) {
        setGroups([...(new Map(groups.map((group) => [group.id, group])).values() as any)]);
      } else {
        setGroups((prev) => [...(new Map([...prev, ...groups].map((group) => [group.id, group])).values() as any)]);
      }
    }
  }, [listDoctorClinics, intl, filter.page, keyword]);

  useEffect(() => {
    if (listBookingDay.length >= 0 && groups.length >= 0) {
      const items: TimelineItemBase<Moment>[] = [];

      for (const booking of listBookingDay) {
        const itemTitle = (
          <div className="d-flex flex-column justify-content-between">
            <span className="font-size-12 font-weight-600">#{booking?.order ?? ''}</span>
            <span className="font-size-14 font-weight-600">{booking?.customer?.fullName ?? ''}</span>
          </div>
        );

        const findStatus = NOTES.find((note) => note.status === booking.status);
        const item: TimelineItemBase<Moment> = {
          id: booking.id,
          group: booking?.doctorClinicId || -1,
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
          // canResize: booking.status === BookingStatusEnum.Pending ? true : false,
          canMove: booking.status === BookingStatusEnum.Pending ? true : false,
          canChangeGroup: booking.status === BookingStatusEnum.Pending ? true : false,
          divTitle: booking.customer.fullName,
        } as TimelineItemBase<Moment>;

        items.push(item);
      }

      const filterEmptyGroups = groups.filter((group) => items.findIndex((item) => item.group === group.id) === -1);

      filterEmptyGroups.forEach((group, index) => {
        items.push({
          id: `empty_${index}`,
          group: group.id,
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
          canResize: false,
          canMove: false,
          canChangeGroup: false,
        });
      });

      setItems(items);
    }
  }, [listBookingDay, time, intl, groups]);

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
      onSettled: () => {
        onRefetchDay();
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
        <p>{intl.formatMessage({ id: 'timeline.doctor' })}</p>
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
    const findBooking = listBookingDay.find((booking) => booking.id === itemId);

    if (findGroup?.id === -1) return;

    const payload = {
      id: itemId,
      dto: {
        doctorClinicId: findGroup.id.toString(),
        id: itemId,
        appointmentStartTime: moment(dragTime).toISOString(),
        appointmentEndTime: moment(dragTime).add(30, 'minutes').toISOString(),
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
    const findBooking = listBookingDay.find((booking) => booking.id === itemId);

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

  const handleItemDoubleClick = (itemId: string) => {
    if (itemId.includes('empty')) return;

    const route = user.user.type === 'administrator' ? ADMIN_ROUTE_PATH : ADMIN_CLINIC_ROUTE_PATH;
    const currentBooking = listBookingDay.find((booking) => booking.id === itemId);
    setClinicId(currentBooking?.clinicId);
    navigate(
      `${route.DETAIL_BOOKING}/${itemId}?&routeClinicId=${currentBooking?.clinicId}&routeDate=${searchParams.get(
        'date'
      )}`
    );
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
        !adminClinicUpdateBookingMutation.isLoading &&
        !adminUpdateBookingMutation.isLoading && (
          <Timeline
            ref={timelineComponentRef}
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
            canChangeGroup={true}
            canMove={true}
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

export default TimelineDay;
