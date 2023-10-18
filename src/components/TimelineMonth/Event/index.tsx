import { Col, Row, Switch } from 'antd';
import { FC, useState, MouseEvent } from 'react';
import { EventProps } from 'react-big-calendar';
import { useIntl } from 'react-intl';
import { TimelineEvent } from '../index';
import { NOTES } from '../../../routes/doctor/booking';
import { CountBookingByMonthDto } from '../../../apis/client-axios';

interface TimelineMonthEventProps {
  eventProps: EventProps<TimelineEvent>;
}

const TimelineMonthEvent: FC<TimelineMonthEventProps> = (props) => {
  const { eventProps } = props;

  const intl = useIntl();
  const [isWork, setIsWork] = useState<boolean>(() => Boolean(eventProps.event.resource?.isWork));

  const handleChangeSwitch = (checked: boolean, event: MouseEvent<HTMLButtonElement>) => {
    setIsWork(checked);
  };

  return (
    <Row gutter={[0, 24]} wrap>
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
      <Col span={24}>
        <Row align="middle" justify="center" wrap gutter={4}>
          {eventProps.event.resource?.data &&
            isWork &&
            Object.keys(eventProps.event.resource?.data).map((status) => {
              const findStatus = NOTES.find((note) => note.status === status);

              return (
                <Col>
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
