import { Form, FormInstance, Popover } from 'antd';
import dayjs from 'dayjs';
import moment, { Moment } from 'moment';
import { FC, useLayoutEffect, useState } from 'react';
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
import { IFormData, n } from '../../routes/doctor/booking';
import SidebarHeaderContent from './SidebarHeaderContent';

interface TimelineDayProps {
  form: FormInstance<IFormData>;
}

const dataGroups = [
  { id: 1, title: 'group 1' },
  { id: 2, title: 'group 2' },
];

const dataItems: TimelineItemBase<Moment>[] = [
  {
    id: 1,
    group: 1,
    title: (
      <div className="d-flex flex-column justify-content-between">
        <span className="font-size-12 font-weight-600">#2435</span>
        <span className="font-size-14 font-weight-600">Bảo Ngọc</span>
      </div>
    ),
    start_time: moment(),
    end_time: moment().add(1, 'hour'),
    itemProps: {
      style: {
        borderColor: '#20BF6B',
        backgroundColor: 'rgba(32, 191, 107, 0.20)',
      },
    },
  },
  {
    id: 2,
    group: 2,
    title: (
      <div className="d-flex flex-column justify-content-between">
        <span className="font-size-12 font-weight-600">#2435</span>
        <span className="font-size-14 font-weight-600">Bảo Ngọc</span>
      </div>
    ),
    start_time: moment(),
    end_time: moment().add(2, 'hour'),
    itemProps: {
      style: {
        borderColor: '#3867D6',
        backgroundColor: 'rgba(56, 103, 214, 0.20)',
      },
    },
  },
  {
    id: 3,
    group: 1,
    title: (
      <div className="d-flex flex-column justify-content-between">
        <span className="font-size-12 font-weight-600">#2435</span>
        <span className="font-size-14 font-weight-600">Bảo Ngọc</span>
      </div>
    ),
    start_time: moment(),
    end_time: moment().add(3, 'hour'),
    itemProps: {
      style: {
        borderColor: '#F7B731',
        backgroundColor: 'rgba(247, 183, 49, 0.20)',
      },
    },
  },
  {
    id: 4,
    group: 2,
    title: (
      <div className="d-flex flex-column justify-content-between">
        <span className="font-size-12 font-weight-600">#2435</span>
        <span className="font-size-14 font-weight-600">Bảo Ngọc</span>
      </div>
    ),
    start_time: moment(),
    end_time: moment().add(4, 'hour'),
    itemProps: {
      style: {
        borderColor: '#FC5C65',
        backgroundColor: 'rgba(252, 92, 101, 0.20)',
      },
    },
  },
];

const TimelineDay: FC<TimelineDayProps> = (props) => {
  const { form } = props;

  const intl = useIntl();
  const time = Form.useWatch(n('time'), form);

  const [groups, setGroups] = useState<TimelineGroupBase[]>([]);
  const [items, setItems] = useState<TimelineItemBase<Moment>[]>([]);

  useLayoutEffect(() => {
    if (dataGroups.length >= 0) {
      const groups: TimelineGroupBase[] = dataGroups.map((data) => {
        const title = (
          <Popover
            placement="right"
            content={<SidebarHeaderContent />}
            title={null}
            arrow={false}
            trigger={['click']}
            overlayClassName="timeline-custom-day-popover"
          >
            <span className="font-size-16 font-weight-400 cursor-pointer">{data.title}</span>
          </Popover>
        );

        return {
          id: data.id,
          title,
        };
      });

      setGroups(groups);
    }
  }, []);

  useLayoutEffect(() => {
    if (dataItems.length >= 0) {
      const filterItems = dataItems.filter((item) =>
        moment(item.start_time)
          .startOf('days')
          .isSame(moment(dayjs(time).toDate()).startOf('days'))
      );

      setItems(filterItems);
    }
  }, [time]);

  const handleTimeChange = (
    visibleTimeStart: number,
    visibleTimeEnd: number,
    updateScrollCanvas: (start: number, end: number) => void
  ) => {
    const minTime = moment(dayjs(time).toDate()).add(-6, 'month').valueOf();
    const maxTime = moment(dayjs(time).toDate()).add(6, 'month').valueOf();

    if (visibleTimeStart < minTime && visibleTimeEnd > maxTime) {
      updateScrollCanvas(minTime, maxTime);
    } else if (visibleTimeStart < minTime) {
      updateScrollCanvas(minTime, minTime + (visibleTimeEnd - visibleTimeStart));
    } else if (visibleTimeEnd > maxTime) {
      updateScrollCanvas(maxTime - (visibleTimeEnd - visibleTimeStart), maxTime);
    } else {
      updateScrollCanvas(visibleTimeStart, visibleTimeEnd);
      form.setFieldValue(n('time'), dayjs(visibleTimeStart));
    }
  };

  const handleItemDrag = (itemDragObject: OnItemDragObjectMove | OnItemDragObjectResize) => {
    console.log('itemDragObject:', itemDragObject);
  };

  return (
    <>
      <Timeline
        groups={groups}
        items={items}
        defaultTimeStart={moment(dayjs(time).toDate())}
        defaultTimeEnd={moment(dayjs(time).toDate()).add(8, 'hour')}
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
    </>
  );
};

export default TimelineDay;
