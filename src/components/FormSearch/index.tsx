import { Form, FormItemProps, Input, InputProps } from 'antd';
import { NamePath } from 'antd/es/form/interface';
import { FC } from 'react';
import IconSVG from '../icons/icons';

interface FormSearchProps {
  name: string | NamePath;
  formItemProps?: FormItemProps;
  inputProps?: InputProps;
}

const FormSearch: FC<FormSearchProps> = (props) => {
  const { name, formItemProps, inputProps } = props;

  return (
    <Form.Item name={name} {...formItemProps} className={`form-search ${formItemProps?.className}`}>
      <Input autoComplete="off" prefix={<IconSVG type="input-search" />} {...inputProps} />
    </Form.Item>
  );
};

export default FormSearch;
