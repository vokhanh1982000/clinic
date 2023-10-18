import { Form, FormInstance, Popover } from 'antd';
import dayjs from 'dayjs';
import moment, { Moment } from 'moment';
import { FC, useEffect, useState } from 'react';
import Timeline, {
  DateHeader,
  OnItemDragObjectMove,
  OnItemDragObjectResize,
  SidebarHeader,
  TimelineGroupBase,
  TimelineHeaders,
  TimelineItemBase,
} from 'react-calendar-timeline';
import 'react-calendar-timeline/lib/Timeline.css';
import { useIntl } from 'react-intl';
import { Booking } from '../../apis/client-axios';
import { IFormData, NOTES, n } from '../../routes/doctor/booking';
import SidebarHeaderContent from './SidebarHeaderContent';

interface TimelineDayProps {
  form: FormInstance<IFormData>;
  listBookingDay: Booking[];
}

const TimelineDay: FC<TimelineDayProps> = (props) => {
  const { form, listBookingDay } = props;

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
            content={<SidebarHeaderContent />}
            title={null}
            arrow={false}
            trigger={['click']}
            overlayClassName="timeline-custom-day-popover"
          >
            <span className="font-size-16 font-weight-400 cursor-pointer">{booking.doctorClinic.fullName}</span>
          </Popover>
        );

        const itemTitle = (
          <div className="d-flex flex-column justify-content-between">
            <span className="font-size-12 font-weight-600">#{booking.order}</span>
            <span className="font-size-14 font-weight-600">{booking.customer.fullName}</span>
          </div>
        );

        const group = {
          id: booking?.doctorClinicId || '',
          title: groupTitle,
        };

        groups.push(group);

        const findStatus = NOTES.find((note) => note.status === booking.status);
        const item = {
          id: booking.id,
          group: booking?.doctorClinicId || '',
          title: itemTitle,
          start_time: moment(booking.appointmentStartTime),
          end_time: moment(booking.appointmentEndTime),
          itemProps: {
            style: {
              border: `1px solid ${findStatus?.borderColor || '#E5E5E5'}`,
              background: findStatus?.backgroundColor || '#F2F2F2',
              borderRightWidth: 1,
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

      setItems(items);
      setGroups([...(new Map(groups.map((group) => [group.id, group])).values() as any)]);
    }
  }, [listBookingDay]);

  const handleTimeChange = (
    visibleTimeStart: number,
    visibleTimeEnd: number,
    updateScrollCanvas: (start: number, end: number) => void
  ) => {
    const minTime = moment(dayjs(time).toDate()).add(-6, 'month').valueOf();
    const maxTime = moment(dayjs(time).toDate()).add(6, 'month').valueOf();

    if (moment(visibleTimeStart).format('YYYY-MM-DD') !== dayjs(time).format('YYYY-MM-DD')) {
      form.setFieldValue(n('time'), dayjs(visibleTimeStart));
    }

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

  const handleItemDrag = (itemDragObject: OnItemDragObjectMove | OnItemDragObjectResize) => {
    console.log('itemDragObject:', itemDragObject);
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
          onTimeChange={handleTimeChange}
          onItemDrag={handleItemDrag}
        >
          <TimelineHeaders>
            <SidebarHeader>
              {({ getRootProps }) => {
                return (
                  <div
                    {...getRootProps()}
                    className="d-flex flex-column justify-content-center align-items-center timeline-custom-day-sidebar"
                  >
                    <p>
                      <span>{intl.formatMessage({ id: 'timeline.schedule' })}</span>
                      <span>/</span>
                    </p>
                    <p>{intl.formatMessage({ id: 'timeline.doctor' })}</p>
                  </div>
                );
              }}
            </SidebarHeader>
            <DateHeader unit="hour" height={72} labelFormat="HH:mm" />
          </TimelineHeaders>
        </Timeline>
      )}
    </>
  );
};

export default TimelineDay;
