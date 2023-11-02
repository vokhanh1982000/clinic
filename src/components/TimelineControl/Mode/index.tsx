import { Divider, Form, FormInstance, Radio } from 'antd';
import { FC, Fragment } from 'react';
import { useIntl } from 'react-intl';
import { useLocation } from 'react-router-dom';
import { Administrator, AdministratorClinic, Customer, DoctorClinic } from '../../../apis/client-axios';
import { IFilter, IFormData, TimelineMode, n } from '../constants';
import { scheduleDoctorRoutes } from '../index';
import dayjs from 'dayjs';

interface TimelineControlModeProps {
  user: Administrator | Customer | AdministratorClinic | DoctorClinic;
  onChangeFilter?: (filter: IFilter) => void;
  form: FormInstance<IFormData>;
}

const TimelineControlMode: FC<TimelineControlModeProps> = (props) => {
  const { user, onChangeFilter, form } = props;

  const intl = useIntl();
  const location = useLocation();

  const RADIO_MODE = [
    { value: TimelineMode.DATE, label: 'timeline.control.mode.date' },
    { value: TimelineMode.WEEK, label: 'timeline.control.mode.week' },
    { value: TimelineMode.MONTH, label: 'timeline.control.mode.month' },
  ].filter((_, index) =>
    user?.user?.type !== 'doctor_clinic' &&
    !scheduleDoctorRoutes.includes(location.pathname.slice(0, location.pathname.lastIndexOf('/')))
      ? index !== 1
      : index > 0
  );

  const handleChangeRadio = () => {
    if (onChangeFilter) onChangeFilter({ page: 1, size: 9 });

    form.setFieldsValue({
      [n('time')]: dayjs(),
    });
  };

  return (
    <Form.Item name={n('mode')} className="timeline-custom-control-mode-form">
      <Radio.Group buttonStyle="solid" className="d-flex align-items-center" onChange={handleChangeRadio}>
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
