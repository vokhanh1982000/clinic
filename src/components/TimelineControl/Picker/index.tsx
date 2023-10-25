import { Button, Col, DatePicker, Form, FormInstance, Row } from 'antd';
import locale from 'antd/es/date-picker/locale/vi_VN';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';
import { FC } from 'react';
import { DATE_FORMAT, MONTH_FORMAT, SHORT_DATE_FORMAT } from '../../../util/constant';
import IconSVG from '../../icons/icons';
import { IFormData, TimelineMode, n } from '../constants';

interface TimelineControlPickerProps {
  form: FormInstance<IFormData>;
}

dayjs.locale('vi');

const pickerFormat = (mode?: TimelineMode) => {
  let format = '';

  switch (mode) {
    case TimelineMode.DATE:
      format = DATE_FORMAT;
      break;
    case TimelineMode.MONTH:
      format = MONTH_FORMAT;
      break;
    case TimelineMode.WEEK:
      break;
    default:
      break;
  }

  return format;
};

const TimelineControlPicker: FC<TimelineControlPickerProps> = (props) => {
  const { form } = props;

  const mode: TimelineMode | undefined = Form.useWatch(n('mode'), form) as TimelineMode | undefined;
  const time = Form.useWatch(n('time'), form);

  const handleChangeDate = (amount: -1 | 1) => {
    if (time && amount) {
      const newTime = dayjs(time).add(amount, mode === TimelineMode.DATE ? 'days' : mode);

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
        <Form.Item
          name={n('time')}
          className={`timeline-custom-control-picker-form height-32 ${
            mode === TimelineMode.WEEK ? 'timeline-custom-control-picker-form-week' : ''
          }`}
        >
          <DatePicker
            picker={mode}
            allowClear={false}
            inputReadOnly
            suffixIcon={null}
            locale={locale}
            format={pickerFormat(mode)}
            popupClassName="timeline-custom-control-picker-form-popup"
            bordered={false}
          />
        </Form.Item>
        {mode === TimelineMode.WEEK && (
          <div className="d-flex align-items-center position-absolute gap-2 top-0 bg-transparent timeline-custom-control-picker-form-label">
            <span className="font-size-24 font-weight-700 color-1A1A1A font-family-primary">
              {dayjs(time).startOf('weeks').format(SHORT_DATE_FORMAT)}
            </span>
            <span className="font-size-24 font-weight-700 color-1A1A1A font-family-primary">-</span>
            <span className="font-size-24 font-weight-700 color-1A1A1A font-family-primary">
              {dayjs(time).endOf('weeks').format(SHORT_DATE_FORMAT)}
            </span>
          </div>
        )}
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
