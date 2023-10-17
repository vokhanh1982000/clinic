import { Divider, Form, Radio } from 'antd';
import { FC, Fragment } from 'react';
import { useIntl } from 'react-intl';
import { TimelineMode, n } from '../../../routes/doctor/booking';

interface TimelineControlModeProps {}

const TimelineControlMode: FC<TimelineControlModeProps> = (props) => {
  const intl = useIntl();

  const RADIO_MODE = [
    { value: TimelineMode.DATE, label: 'timeline.control.mode.date' },
    { value: TimelineMode.MONTH, label: 'timeline.control.mode.month' },
  ];

  return (
    <Form.Item name={n('mode')} className="timeline-custom-control-mode-form">
      <Radio.Group buttonStyle="solid" className="d-flex align-items-center">
        {RADIO_MODE.map((mode, index) =>
          index % 2 === 1 ? (
            <Fragment key={mode.value}>
              <Divider type="vertical" />
              <Radio.Button value={mode.value}>{intl.formatMessage({ id: mode.label })}</Radio.Button>
            </Fragment>
          ) : (
            <Radio.Button key={mode.value} value={mode.value}>
              {intl.formatMessage({ id: mode.label })}
            </Radio.Button>
          )
        )}
      </Radio.Group>
    </Form.Item>
  );
};

export default TimelineControlMode;
