import { DatePicker, DatePickerProps } from 'antd';
import moment from 'moment';

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
      disabledDate={(current) => {
        let customDate = moment().format('YYYY-MM-DD');
        return current && current > moment(customDate, 'YYYY-MM-DD');
      }}
    />
  );
};

export default DatePickerCustom;
