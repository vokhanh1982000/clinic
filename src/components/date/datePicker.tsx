import dayjs from 'dayjs';
import { DatePicker, DatePickerProps } from 'antd';

interface CustomDateProps {
  dateFormat?: string;
  className?: string;
}

const DatePickerCustom = (props: CustomDateProps) => {
  const { dateFormat, className } = props;
  return <DatePicker className={`ant-custom-area ${className}`} format={dateFormat} {...props} />;
};

export default DatePickerCustom;
