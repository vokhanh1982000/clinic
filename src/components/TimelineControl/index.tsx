import { Col, FormInstance, Row } from 'antd';
import { FC } from 'react';
import { useIntl } from 'react-intl';
import { Administrator, AdministratorClinic, Customer, DoctorClinic } from '../../apis/client-axios';
import FormSearch from '../FormSearch';
import FormWrap from '../FormWrap';
import TimelineControlMode from './Mode';
import TimelineControlPicker from './Picker';
import { IFormData, n } from './constants';

interface TimelineControlProps {
  form: FormInstance<IFormData>;
  user: Administrator | Customer | AdministratorClinic | DoctorClinic;
}

const TimelineControl: FC<TimelineControlProps> = (props) => {
  const { form, user } = props;

  const intl = useIntl();

  const onFinish = (formValues: IFormData) => {
    console.log('🚀 ~ onFinish ~ formValues:', formValues);
  };

  return (
    <FormWrap name="timelineControl" form={form} onFinish={onFinish} className="timeline-custom-control-form">
      <Row align="middle" justify="space-between" wrap gutter={[0, 10]}>
        <Col>
          <FormSearch
            name={n('keyword')}
            inputProps={{
              placeholder: intl.formatMessage({ id: 'timeline.control.search.placeholder' }),
            }}
          />
        </Col>
        <Col>
          <TimelineControlPicker form={form} />
        </Col>
        <Col>
          <TimelineControlMode user={user} />
        </Col>
      </Row>
    </FormWrap>
  );
};

export default TimelineControl;
