import { Col, Form, FormInstance, Row } from 'antd';
import { FC, KeyboardEvent } from 'react';
import { useIntl } from 'react-intl';
import { useLocation } from 'react-router-dom';
import { Administrator, AdministratorClinic, Customer, DoctorClinic } from '../../apis/client-axios';
import { ADMIN_CLINIC_ROUTE_PATH, ADMIN_ROUTE_PATH } from '../../constants/route';
import FormSearch from '../FormSearch';
import FormWrap from '../FormWrap';
import CustomButton from '../buttons/CustomButton';
import IconSVG from '../icons/icons';
import TimelineControlMode from './Mode';
import TimelineControlPicker from './Picker';
import { IFormData, TimelineMode, n } from './constants';

interface TimelineControlProps {
  form: FormInstance<IFormData>;
  user: Administrator | Customer | AdministratorClinic | DoctorClinic;
  onRefetchDay?: () => void;
  onRefetchWeek?: () => void;
  onRefetchMonth: () => void;
}

export const scheduleDoctorRoutes = [ADMIN_ROUTE_PATH.SCHEDULE_DOCTOR, ADMIN_CLINIC_ROUTE_PATH.SCHEDULE_DOCTOR];

const TimelineControl: FC<TimelineControlProps> = (props) => {
  const { form, user, onRefetchDay, onRefetchWeek, onRefetchMonth } = props;

  const intl = useIntl();
  const mode = Form.useWatch(n('mode'), form);

  const location = useLocation();

  const handleKeyDown = (e: KeyboardEvent<HTMLFormElement>) => {
    if (e.code === 'Enter') form.submit();
  };

  const onFinish = (_: IFormData) => {
    if (scheduleDoctorRoutes.includes(location.pathname.slice(0, location.pathname.lastIndexOf('/')))) return;

    if (mode === TimelineMode.MONTH) onRefetchMonth();
    else if (mode === TimelineMode.DATE && onRefetchDay) onRefetchDay();
    else if (mode === TimelineMode.WEEK && onRefetchWeek) onRefetchWeek();
  };

  return (
    <FormWrap
      name="timelineControl"
      form={form}
      onFinish={onFinish}
      className="timeline-custom-control-form"
      onKeyDown={handleKeyDown}
    >
      <Row align="middle" justify="space-between" wrap gutter={[0, 10]}>
        {!scheduleDoctorRoutes.includes(location.pathname.slice(0, location.pathname.lastIndexOf('/'))) && (
          <Col>
            <FormSearch
              name={n('keyword')}
              inputProps={{
                placeholder: intl.formatMessage({ id: 'timeline.control.search.placeholder' }),
              }}
            />
          </Col>
        )}
        <Col
          order={scheduleDoctorRoutes.includes(location.pathname.slice(0, location.pathname.lastIndexOf('/'))) ? 2 : 1}
        >
          <TimelineControlPicker form={form} />
        </Col>
        <Col
          order={scheduleDoctorRoutes.includes(location.pathname.slice(0, location.pathname.lastIndexOf('/'))) ? 1 : 2}
        >
          <TimelineControlMode user={user} />
        </Col>
        {scheduleDoctorRoutes.includes(location.pathname.slice(0, location.pathname.lastIndexOf('/'))) && (
          <Col order={3}>
            <CustomButton
              icon={<IconSVG type="create" />}
              className="width-176 p-0 d-flex align-items-center justify-content-center background-color-primary timeline-custom-header-button"
            >
              <span className="font-weight-600 color-ffffff">
                {intl.formatMessage({ id: 'timeline.admin.button.create' })}
              </span>
            </CustomButton>
          </Col>
        )}
      </Row>
    </FormWrap>
  );
};

export default TimelineControl;
