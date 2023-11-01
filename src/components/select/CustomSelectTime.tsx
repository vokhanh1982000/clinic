import { Select, SelectProps } from 'antd';
import { useIntl } from 'react-intl';
import IconSVG from '../icons/icons';

interface CustomSelectTimeProps<T = any> extends SelectProps<T> {}

const CustomSelectTime = <T extends any>(props: CustomSelectTimeProps<T>) => {
  const intl = useIntl();
  return (
    <Select
      {...props}
      suffixIcon={<IconSVG type="suffix-time" />}
      className={`ant-custom-select ${props.className}`}
      getPopupContainer={(trigger: any) => trigger.parentNode}
      placeholder={props?.placeholder ? props.placeholder : undefined}
      // allowClear
    />
  );
};

export default CustomSelectTime;
