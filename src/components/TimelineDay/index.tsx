import { useMutation } from '@tanstack/react-query';
import { Form, FormInstance, Popover, message } from 'antd';
import dayjs from 'dayjs';
import moment, { Moment } from 'moment';
import { FC, SyntheticEvent, useEffect, useState } from 'react';
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
import { useNavigate } from 'react-router-dom';
import { adminClinicBookingApi } from '../../apis';
import {
  AdminClinicUpdateBookingDto,
  Administrator,
  AdministratorClinic,
  Booking,
  BookingStatusEnum,
  Customer,
  DoctorClinic,
  DoctorClinicControllerGetAll200Response,
} from '../../apis/client-axios';
import { ADMIN_CLINIC_ROUTE_PATH } from '../../constants/route';
import { IFilter } from '../../routes/adminClinic/booking';
import { TIME_FORMAT } from '../../util/constant';
import { IFormData, NOTES, n } from '../TimelineControl/constants';
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

  const navigate = useNavigate();

  const [groups, setGroups] = useState<TimelineGroupBase[]>([]);
  const [items, setItems] = useState<TimelineItemBase<Moment>[]>([]);

  const [ref, inView] = useInView({
    threshold: 0,
  });

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
            content={<SidebarHeaderContent doctorClinicId={doctor.id} user={user} />}
            title={null}
            arrow={false}
            trigger={['click']}
            overlayClassName="timeline-custom-day-popover"
          >
            <span
              className="font-size-16 font-weight-400 cursor-pointer"
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

      setGroups((prev) => [...prev, ...groups]);
    }
  }, [listDoctorClinics, intl]);

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
        };

        items.push(item);
      }

      const filterEmptyGroups = groups.filter((group) => items.findIndex((item) => item.group === group.id) === -1);

      filterEmptyGroups.forEach((group, index) => {
        items.push({
          id: index,
          group: group.id,
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
      });

      setItems(items);
    }
  }, [listBookingDay, time, intl, groups]);

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

    if (findBooking?.status !== BookingStatusEnum.Pending) return;

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
    //change canResize Timeline's property from false to "both" to using this resize function
    const findBooking = listBookingDay.find((booking) => booking.id === itemId);

    if (findBooking?.status !== BookingStatusEnum.Pending) return;

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

  const handleItemDoubleClick = (itemId: string, e: SyntheticEvent, time: number) => {
    // when have an admin booking detail route change route variable like the line below
    // const route = user.user.type === 'administrator' ? ADMIN_ROUTE_PATH : ADMIN_CLINIC_ROUTE_PATH;
    const route = user.user.type === 'administrator' ? ADMIN_CLINIC_ROUTE_PATH : ADMIN_CLINIC_ROUTE_PATH;

    navigate(`${route.DETAIL_BOOKING}/${itemId}`);
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
          canChangeGroup={true}
          canMove={true}
          onItemDoubleClick={handleItemDoubleClick}
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
