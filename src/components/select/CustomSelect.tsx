import { Select, SelectProps } from 'antd';
import { useIntl } from 'react-intl';

interface CustomSelectProps<T = any> extends SelectProps<T> {}

const CustomSelect = <T extends any>(props: CustomSelectProps<T>) => {
  const intl = useIntl();
  return (
    <Select
      {...props}
      className={`ant-custom-select ${props.className}`}
      getPopupContainer={(trigger: any) => trigger.parentNode}
      placeholder={props?.placeholder ? props.placeholder : undefined}
    />
  );
};

export default CustomSelect;
