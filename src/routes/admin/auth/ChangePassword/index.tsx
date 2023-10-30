import React from 'react';
import { Card, Form, message } from 'antd';
import useIntl from '../../../../util/useIntl';
import { IntlShape } from 'react-intl';
import ChangePassword from '../../../../components/auth/change-password';
import useForm from 'antd/es/form/hooks/useForm';
import CustomButton from '../../../../components/buttons/CustomButton';
import { useMutation } from '@tanstack/react-query';
import { ChangePasswordDto } from '../../../../apis/client-axios';
import { authApi } from '../../../../apis';
import { CustomHandleError } from '../../../../components/response';

const ChangePasswordAdmin = () => {
  const intl: IntlShape = useIntl();
  const [form] = useForm();

  const { mutate: UpdatePassword, status: updatePasswordStatus } = useMutation({
    mutationFn: (changePasswordDto: ChangePasswordDto) => authApi.authControllerChangePassword(changePasswordDto),
    onSuccess: () => {
      message.success(
        intl.formatMessage({
          id: 'change-password.message-success',
        })
      );
    },
    onError: (error: any) => {
      CustomHandleError(error.response.data, intl);
    },
  });
  const handleSubmit = () => {
    const data = form.getFieldsValue();
    UpdatePassword(data);
    form.resetFields();
  };
  return (
    <Card id={'admin-change-password'}>
      <Form form={form} layout={'vertical'} onFinish={handleSubmit}>
        <ChangePassword />
        <div className={'action'}>
          <CustomButton className={'button-submit'} htmlType="submit">
            {intl.formatMessage({
              id: 'change-password.button-submit',
            })}
          </CustomButton>
        </div>
      </Form>
    </Card>
  );
};

export default ChangePasswordAdmin;
