import { Col, Row, Switch } from 'antd';
import { FC } from 'react';
import { EventProps } from 'react-big-calendar';
import { useIntl } from 'react-intl';

interface TimelineMonthEventProps {
  eventProps: EventProps<any>;
}

const TimelineMonthEvent: FC<TimelineMonthEventProps> = (props) => {
  const { eventProps } = props;

  const intl = useIntl();

  return (
    <Row gutter={[0, 24]} wrap>
      <Col span={24}>
        <Row align="middle" justify="center" wrap gutter={4} className="timeline-custom-month-top">
          <Col>
            <span className="font-size-14 font-weight-600 timeline-custom-month-working">
              {intl.formatMessage({ id: 'timeline.month.workingDay' })}
            </span>
          </Col>
          <Col>
            <Switch className="timeline-custom-month-switch" />
          </Col>
        </Row>
      </Col>
      <Col span={24}>
        <Row align="middle" justify="center" wrap gutter={4}>
          <Col>
            <span className="font-size-16 font-weight-600 timeline-custom-month-data">5</span>
          </Col>
          <Col>
            <span className="font-size-16 font-weight-600 timeline-custom-month-data">3</span>
          </Col>
          <Col>
            <span className="font-size-16 font-weight-600 timeline-custom-month-data">2</span>
          </Col>
          <Col>
            <span className="font-size-16 font-weight-600 timeline-custom-month-data">3</span>
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default TimelineMonthEvent;
