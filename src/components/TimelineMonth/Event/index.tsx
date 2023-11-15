import { Col, Row, Switch } from 'antd';
import dayjs from 'dayjs';
import { FC, MutableRefObject, useMemo } from 'react';
import { EventProps } from 'react-big-calendar';
import { useIntl } from 'react-intl';
import {
  Administrator,
  AdministratorClinic,
  BookingStatusEnum,
  CountBookingByMonthDto,
  CreateHolidayScheduleDtoStatusEnum,
  Customer,
  DoctorClinic,
} from '../../../apis/client-axios';
import { NOTES } from '../../TimelineControl/constants';
import { TimelineEvent } from '../index';

interface TimelineMonthEventProps {
  eventProps: EventProps<TimelineEvent>;
  onChangeHoliday: (
    type: 'create' | 'update',
    date: string,
    status: CreateHolidayScheduleDtoStatusEnum,
    id?: string
  ) => void;
  user: Administrator | Customer | AdministratorClinic | DoctorClinic;
  isSwitchRef: MutableRefObject<boolean>;
}

const TimelineMonthEvent: FC<TimelineMonthEventProps> = (props) => {
  const { eventProps, onChangeHoliday, user, isSwitchRef } = props;

  const intl = useIntl();

  const isWork = useMemo(() => {
    const { event } = eventProps;

    if (event.holiday) return event.holiday.status === CreateHolidayScheduleDtoStatusEnum.Work;

    return event.resource?.isWork;
  }, [eventProps]);

  const handleChangeSwitch = (checked: boolean) => {
    isSwitchRef.current = true;

    const { event } = eventProps;

    if (!event.holiday) {
      onChangeHoliday('create', dayjs(event.resource?.day).toISOString(), checked ? 'work' : 'off');
    } else {
      onChangeHoliday('update', dayjs(event.resource?.day).toISOString(), checked ? 'work' : 'off', event.holiday.id);
    }
  };

  return (
    <Row gutter={[0, 24]} wrap style={{ marginTop: user.user.type === 'administrator_clinic' ? 0 : 62 }}>
      {user.user.type === 'administrator_clinic' && (
        <Col span={24}>
          <Row align="middle" justify="center" wrap gutter={4} className="timeline-custom-month-top">
            <Col>
              <span className="font-size-14 font-weight-600 timeline-custom-month-working">
                {isWork
                  ? intl.formatMessage({ id: 'timeline.month.workingDay' })
                  : intl.formatMessage({ id: 'timeline.doctor.note.dayOff' })}
              </span>
            </Col>
            <Col>
              <Switch className="timeline-custom-month-switch" checked={isWork} onChange={handleChangeSwitch} />
            </Col>
          </Row>
        </Col>
      )}
      <Col span={24}>
        <Row align="middle" justify="center" wrap gutter={4}>
          {eventProps.event.resource?.data &&
            isWork &&
            Object.keys(eventProps.event.resource?.data)
              .filter((status) => {
                if (
                  dayjs(eventProps.event.start).startOf('days').isSame(dayjs(new Date()).startOf('days')) ||
                  dayjs(eventProps.event.start).startOf('days').isAfter(dayjs(new Date()).startOf('days'))
                )
                  return status;
                else return status === BookingStatusEnum.Completed || status === BookingStatusEnum.Cancelled;
              })
              .map((status) => {
                const findStatus = NOTES.find((note) => note.status === status);
                const findIndexStatus = NOTES.findIndex((note) => note.status === status);
                const data = eventProps.event.resource?.data?.[status as keyof CountBookingByMonthDto];

                return (
                  Number(data) > 0 && (
                    <Col key={status} order={findIndexStatus}>
                      <span
                        className="font-size-14 font-weight-600 timeline-custom-month-data"
                        style={{
                          border: `1px solid ${findStatus?.borderColor || '#E5E5E5'}`,
                          background: findStatus?.backgroundColor || '#F2F2F2',
                        }}
                      >
                        {data}
                      </span>
                    </Col>
                  )
                );
              })}
        </Row>
      </Col>
    </Row>
  );
};

export default TimelineMonthEvent;
