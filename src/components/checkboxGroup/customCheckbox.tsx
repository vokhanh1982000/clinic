import dayjs from 'dayjs';
import { Checkbox, CheckboxProps } from 'antd';

interface CustomCheckbox {
  array?: any[];
  className?: string;
}

const CheckboxGroupCustom = (props: CustomCheckbox) => {
  const { array, className } = props;
  return (
    <>
      {array?.map((item) => (
        <Checkbox value={item.id} className={`ant-custom-checkboxGroup ${className}`} {...props}>
          {item.name}
        </Checkbox>
      ))}
    </>
  );
};

export default CheckboxGroupCustom;
