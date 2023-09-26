import { DatePicker, DatePickerProps } from 'antd';

interface CustomDateProps {
  dateFormat?: string;
  className?: string;
  data?: string;
}

const DatePickerCustom = (props: CustomDateProps) => {
  const { dateFormat, className, data } = props;
  return <DatePicker className={`ant-custom-area ${className}`} format={dateFormat} {...props} />;
};

export default DatePickerCustom;
