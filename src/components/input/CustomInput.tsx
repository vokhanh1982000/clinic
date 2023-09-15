import { Input, InputProps } from 'antd';
import { useIntl } from 'react-intl';

interface CustomInputProps extends InputProps {
  placeholder?: string;
  className?: string;
}

const CustomInput = (props: CustomInputProps) => {
  const intl = useIntl();
  const { placeholder, className } = props;

  return <Input placeholder={placeholder || undefined} className={`ant-custom-input ${className}`} {...props} />;
};

export default CustomInput;
