import { Select, SelectProps } from 'antd';
import { IntlShape, useIntl } from 'react-intl';
import IconSVG from '../icons/icons';

interface CustomSearchSelectProps<T = any> extends SelectProps<T> {}

const CustomSearchSelect = <T extends any>(props: CustomSearchSelectProps<T>) => {
  const intl: IntlShape = useIntl();
  return (
    <Select
      {...props}
      className={`ant-custom-select ${props.className}`}
      getPopupContainer={(trigger: any) => trigger.parentNode}
      placeholder={props?.placeholder ? props.placeholder : undefined}
      allowClear
      showSearch
    />
  );
};

export default CustomSearchSelect;
