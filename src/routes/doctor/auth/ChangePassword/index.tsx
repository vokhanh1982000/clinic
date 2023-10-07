import React from 'react';
import ChangePassword from '../../../../components/auth/change-password';
import { IntlShape } from 'react-intl';
import useIntl from '../../../../util/useIntl';
import useForm from 'antd/es/form/hooks/useForm';
import { useMutation } from '@tanstack/react-query';
import { ChangePasswordDto } from '../../../../apis/client-axios';
import { authApi } from '../../../../apis';
import { Card, Form, message } from 'antd';
import CustomButton from '../../../../components/buttons/CustomButton';

const ChangePasswordDoctorClinic = () => {
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
    onError: () => {
      message.error(
        intl.formatMessage({
          id: 'change-password.message-error',
        })
      );
    },
  });
  const handleSubmit = () => {
    const data = form.getFieldsValue();
    UpdatePassword(data);
    form.resetFields();
  };
  return (
    <Card id={'doctor-clinic-change-password'}>
      <Form form={form} layout={'vertical'}>
        <ChangePassword />
        <div className={'action'}>
          <CustomButton className={'button-submit'} onClick={handleSubmit}>
            {intl.formatMessage({
              id: 'change-password.button-submit',
            })}
          </CustomButton>
        </div>
      </Form>
    </Card>
  );
};

export default ChangePasswordDoctorClinic;
