import { DatePicker, DatePickerProps } from 'antd';
import moment from 'moment';
import { disabledFutureDate } from '../../constants/function';

interface CustomDateProps {
  dateFormat?: string;
  className?: string;
  data?: string;
}

const DatePickerCustom = (props: CustomDateProps) => {
  const { dateFormat, className, data } = props;
  return (
    <DatePicker
      className={`ant-custom-area ${className}`}
      format={dateFormat}
      {...props}
      disabledDate={disabledFutureDate}
    />
  );
};

export default DatePickerCustom;
