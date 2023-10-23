import { useQuery } from '@tanstack/react-query';
import { Col, Form, FormInstance, Row } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { FC, KeyboardEvent, useMemo } from 'react';
import { useIntl } from 'react-intl';
import { useLocation } from 'react-router-dom';
import { adminBookingApi } from '../../apis';
import { Administrator, AdministratorClinic, Customer, DoctorClinic } from '../../apis/client-axios';
import { ADMIN_CLINIC_ROUTE_PATH } from '../../constants/route';
import { DATE_TIME_FORMAT } from '../../util/constant';
import FormSearch from '../FormSearch';
import FormWrap from '../FormWrap';
import CustomButton from '../buttons/CustomButton';
import IconSVG from '../icons/icons';
import CustomSelect from '../select/CustomSelect';
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

const TimelineControl: FC<TimelineControlProps> = (props) => {
  const { form, user, onRefetchDay, onRefetchWeek, onRefetchMonth } = props;

  const intl = useIntl();
  const mode = Form.useWatch(n('mode'), form);
  const time = Form.useWatch(n('time'), form) as Dayjs | undefined;

  const location = useLocation();

  const { data: listBookingDay } = useQuery({
    queryKey: ['adminFilterBookingDay', time, mode, user],
    queryFn: () => adminBookingApi.adminBookingControllerGetBookingByDay(dayjs(time).format(DATE_TIME_FORMAT)),
    enabled: !!time && mode === TimelineMode.DATE && user.user?.type === 'administrator',
  });

  const clinicOptions = useMemo(() => {
    if (listBookingDay?.data) {
      const options = listBookingDay?.data.map((booking) => ({
        label: booking.clinic.fullName,
        value: booking.clinicId,
      }));

      return [...(new Map(options.map((option) => [option.value, option])).values() as any)];
    }

    return [];
  }, [listBookingDay]);

  const handleKeyDown = (e: KeyboardEvent<HTMLFormElement>) => {
    if (e.code === 'Enter') form.submit();
  };

  const onFinish = (_: IFormData) => {
    if (location.pathname.includes(ADMIN_CLINIC_ROUTE_PATH.SCHEDULE_DOCTOR)) return;

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
        <Col>
          <Row gutter={16} align="middle">
            {!location.pathname.includes(ADMIN_CLINIC_ROUTE_PATH.SCHEDULE_DOCTOR) && (
              <Col>
                <FormSearch
                  name={n('keyword')}
                  inputProps={{
                    placeholder: intl.formatMessage({ id: 'timeline.control.search.placeholder' }),
                  }}
                />
              </Col>
            )}

            {user.user?.type === 'administrator' && (
              <Form.Item name={n('clinicId')} className="m-b-0">
                <CustomSelect
                  className="width-184 height-48"
                  placeholder={intl.formatMessage({
                    id: 'timeline.clinic.title',
                  })}
                  showSearch={false}
                  options={clinicOptions}
                  allowClear
                />
              </Form.Item>
            )}
          </Row>
        </Col>
        <Col order={location.pathname.includes(ADMIN_CLINIC_ROUTE_PATH.SCHEDULE_DOCTOR) ? 2 : 1}>
          <TimelineControlPicker form={form} />
        </Col>
        <Col order={location.pathname.includes(ADMIN_CLINIC_ROUTE_PATH.SCHEDULE_DOCTOR) ? 1 : 2}>
          <TimelineControlMode user={user} />
        </Col>
        {location.pathname.includes(ADMIN_CLINIC_ROUTE_PATH.SCHEDULE_DOCTOR) && (
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
