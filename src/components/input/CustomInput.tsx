import { Input, InputProps } from 'antd';
import { useIntl } from 'react-intl';

interface CustomInputProps extends InputProps {
  placeholder?: string;
  className?: string;
}

const CustomInput = (props: CustomInputProps) => {
  const intl = useIntl();
  const { placeholder, className, ...restProps } = props;

  return <Input placeholder={placeholder || undefined} className={`ant-custom-input ${className}`} {...restProps} />;
};

export default CustomInput;
