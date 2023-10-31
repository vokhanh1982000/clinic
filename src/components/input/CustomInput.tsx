import { Input, InputProps } from 'antd';
import { useIntl } from 'react-intl';

interface CustomInputProps extends InputProps {
  placeholder?: string;
  className?: string;
  isPassword?: boolean;
}

const CustomInput = (props: CustomInputProps) => {
  const intl = useIntl();
  const { placeholder, className, isPassword, ...restProps } = props;

  return !isPassword ? (
    <Input
      maxLength={255}
      placeholder={placeholder || undefined}
      className={`ant-custom-input ${className}`}
      {...restProps}
    />
  ) : (
    <Input.Password placeholder={placeholder || undefined} className={`ant-custom-input ${className}`} {...restProps} />
  );
};

export default CustomInput;
