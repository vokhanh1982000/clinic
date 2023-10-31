import { Col, Row, Switch } from 'antd';
import dayjs from 'dayjs';
import { FC } from 'react';
import { EventProps } from 'react-big-calendar';
import { useIntl } from 'react-intl';
import {
  Administrator,
  AdministratorClinic,
  CountBookingByMonthDto,
  Customer,
  DoctorClinic,
} from '../../../apis/client-axios';
import { NOTES } from '../../TimelineControl/constants';
import { TimelineEvent } from '../index';

interface TimelineMonthEventProps {
  eventProps: EventProps<TimelineEvent>;
  onChangeHoliday: (type: 'create' | 'delete', value?: string) => void;
  user: Administrator | Customer | AdministratorClinic | DoctorClinic;
}

const TimelineMonthEvent: FC<TimelineMonthEventProps> = (props) => {
  const { eventProps, onChangeHoliday, user } = props;

  const intl = useIntl();

  const handleChangeSwitch = (checked: boolean) => {
    onChangeHoliday(
      !checked ? 'create' : 'delete',
      !checked ? dayjs(eventProps.event.resource?.day).toISOString() : eventProps.event.holiday?.id
    );
  };

  return (
    <Row gutter={[0, 24]} wrap style={{ marginTop: user.user.type === 'administrator_clinic' ? 0 : 62 }}>
      {user.user.type === 'administrator_clinic' && (
        <Col span={24}>
          <Row align="middle" justify="center" wrap gutter={4} className="timeline-custom-month-top">
            <Col>
              <span className="font-size-14 font-weight-600 timeline-custom-month-working">
                {eventProps.event.resource?.isWork
                  ? intl.formatMessage({ id: 'timeline.month.workingDay' })
                  : intl.formatMessage({ id: 'timeline.doctor.note.dayOff' })}
              </span>
            </Col>
            <Col>
              <Switch
                className="timeline-custom-month-switch"
                checked={eventProps.event.resource?.isWork}
                onChange={handleChangeSwitch}
              />
            </Col>
          </Row>
        </Col>
      )}
      <Col span={24}>
        <Row align="middle" justify="center" wrap gutter={4}>
          {eventProps.event.resource?.data &&
            eventProps.event.resource?.isWork &&
            Object.keys(eventProps.event.resource?.data).map((status) => {
              const findStatus = NOTES.find((note) => note.status === status);

              return (
                <Col key={status}>
                  <span
                    className="font-size-16 font-weight-600 timeline-custom-month-data"
                    style={{
                      border: `1px solid ${findStatus?.borderColor || '#E5E5E5'}`,
                      background: findStatus?.backgroundColor || '#F2F2F2',
                    }}
                  >
                    {eventProps.event.resource?.data?.[status as keyof CountBookingByMonthDto]}
                  </span>
                </Col>
              );
            })}
        </Row>
      </Col>
    </Row>
  );
};

export default TimelineMonthEvent;
