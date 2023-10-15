import { Button, Col, DatePicker, Form, FormInstance, Row } from 'antd';
import locale from 'antd/es/date-picker/locale/vi_VN';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import 'moment/locale/vi';
import { FC } from 'react';
import { IFormData, TimelineMode, n } from '../../../routes/doctor/booking';
import IconSVG from '../../icons/icons';

interface TimelineControlPickerProps {
  form: FormInstance<IFormData>;
}

dayjs.locale('vi');

const TimelineControlPicker: FC<TimelineControlPickerProps> = (props) => {
  const { form } = props;

  const mode: TimelineMode | undefined = Form.useWatch(n('mode'), form) as TimelineMode | undefined;
  const time = Form.useWatch(n('time'), form);

  const handleChangeDate = (amount: -1 | 1) => {
    if (time && amount) {
      const newTime = dayjs(time).add(amount, 'days');

      form.setFieldValue(n('time'), newTime);
    }
  };

  return (
    <Row align="middle" gutter={64}>
      <Col>
        <Button className="timeline-custom-control-picker-button" onClick={() => handleChangeDate(-1)}>
          <IconSVG type="prev-time" />
        </Button>
      </Col>
      <Col>
        <Form.Item name={n('time')} className="timeline-custom-control-picker-form">
          <DatePicker
            picker={mode}
            allowClear={false}
            inputReadOnly
            suffixIcon={null}
            locale={locale}
            format={mode === 'date' ? 'dddd, DD/MM/YYYY' : 'MM/YYYY'}
            popupClassName="timeline-custom-control-picker-form-popup"
          />
        </Form.Item>
      </Col>
      <Col>
        <Button className="timeline-custom-control-picker-button" onClick={() => handleChangeDate(1)}>
          <IconSVG type="next-time" />
        </Button>
      </Col>
    </Row>
  );
};

export default TimelineControlPicker;
