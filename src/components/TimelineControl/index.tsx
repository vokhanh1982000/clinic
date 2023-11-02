import { Col, Form, FormInstance, Row } from 'antd';
import { debounce } from 'lodash';
import { ChangeEvent, FC, KeyboardEvent } from 'react';
import { useIntl } from 'react-intl';
import { useLocation, useNavigate } from 'react-router-dom';
import { Administrator, AdministratorClinic, Customer, DoctorClinic } from '../../apis/client-axios';
import { ADMIN_CLINIC_ROUTE_PATH, ADMIN_ROUTE_PATH } from '../../constants/route';
import FormWrap from '../FormWrap';
import CustomButton from '../buttons/CustomButton';
import IconSVG from '../icons/icons';
import CustomInput from '../input/CustomInput';
import TimelineControlMode from './Mode';
import TimelineControlPicker from './Picker';
import { IFilter, IFormData, n } from './constants';

interface TimelineControlProps {
  form: FormInstance<IFormData>;
  user: Administrator | Customer | AdministratorClinic | DoctorClinic;
  onChangeFilter?: (filter: IFilter) => void;
}

export const scheduleDoctorRoutes = [ADMIN_ROUTE_PATH.SCHEDULE_DOCTOR, ADMIN_CLINIC_ROUTE_PATH.SCHEDULE_DOCTOR];

const TimelineControl: FC<TimelineControlProps> = (props) => {
  const { form, user, onChangeFilter } = props;

  const intl = useIntl();

  const location = useLocation();

  const navigate = useNavigate();
  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    if (debouncedUpdateInputValue.cancel) {
      debouncedUpdateInputValue.cancel();
    }

    debouncedUpdateInputValue(e.target.value);
  };

  const debouncedUpdateInputValue = debounce((value) => {
    form.setFieldValue(n('keyword'), value);
    if (onChangeFilter) onChangeFilter({ page: 1 });
  }, 500);

  const handlePressEnter = (e: KeyboardEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    form.setFieldValue(n('keyword'), value);
    if (onChangeFilter) onChangeFilter({ page: 1 });
  };

  const navigateCreate = () => {
    const route = user?.user?.type === 'administrator' ? ADMIN_ROUTE_PATH : ADMIN_CLINIC_ROUTE_PATH;
    navigate(route.CREATE_BOOKING);
  };

  return (
    <FormWrap name="timelineControl" form={form} className="timeline-custom-control-form">
      <Row align="middle" justify="space-between" wrap gutter={[0, 10]}>
        {!scheduleDoctorRoutes.includes(location.pathname.slice(0, location.pathname.lastIndexOf('/'))) && (
          <Col>
            <Form.Item name={n('keyword')} className="m-b-0">
              <CustomInput
                placeholder={intl.formatMessage({ id: 'timeline.control.search.placeholder' })}
                prefix={<IconSVG type="search" />}
                className="input-search width-350"
                allowClear
                onChange={handleSearch}
                onPressEnter={handlePressEnter}
              />
            </Form.Item>
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
          <TimelineControlMode user={user} onChangeFilter={onChangeFilter} form={form} />
        </Col>
        {scheduleDoctorRoutes.includes(location.pathname.slice(0, location.pathname.lastIndexOf('/'))) && (
          <Col order={3}>
            <CustomButton
              onClick={navigateCreate}
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
