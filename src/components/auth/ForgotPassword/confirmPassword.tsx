import { useMutation } from '@tanstack/react-query';
import { Button, Form, Input, message } from 'antd';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import { authApi } from '../../../apis';
import { FindUserByIdentifierDto, UpdatePasswordDto } from '../../../apis/client-axios';
import ConfirmCode from './confirmCode';

const ConfirmPassword = ({ data, userType }: any) => {
  const n = (key: keyof UpdatePasswordDto) => {
    return key;
  };
  const intl = useIntl();
  const [pass, setPass] = useState<any>(null);
  const onFinish = (values: any) => {
    if (values.newPass !== values.confirmPass)
      return message.error(intl.formatMessage({ id: 'forgot.confirmPassword.error' }));
    // setPass({
    //   ...data,
    //   ...values,
    // });
    sendOTPMutation.mutate({
      ...data,
      ...values,
    });
  };

  const sendOTPMutation = useMutation(
    (findUserByIdentifierType: FindUserByIdentifierDto) =>
      authApi.authControllerSendOTPForgotPassword(findUserByIdentifierType),
    {
      onSuccess: ({ data }, findUserByIdentifierType): any => {
        setPass(findUserByIdentifierType);
      },
      onError: (error) => {
        message.error(intl.formatMessage({ id: 'forgot.error.tryAgain' }));
      },
    }
  );

  const onFinishFailed = () => {};

  return (
    <>
      {pass ? (
        <ConfirmCode data={pass} userType={userType} />
      ) : (
        <div className="vh-100 row justify-content-center align-items-center">
          <div id="login-form" className="row justify-content-center align-items-center">
            <div className="logo">
              <img src="/assets/images/logo.png" />
            </div>
            <div className="form-name">
              <header className="form-name-header">{intl.formatMessage({ id: 'forgot.inputPassword' })}</header>
              <p>{intl.formatMessage({ id: 'forgot.requiredInputPassword' })}</p>
              <div></div>
            </div>
            <Form
              name="basic"
              layout="vertical"
              style={{ maxWidth: 374 }}
              initialValues={{ remember: true }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
              requiredMark={false}
              className="form-data"
            >
              <Form.Item
                className="form-item-password"
                label={intl.formatMessage({ id: 'sigin.password' })}
                name={n('newPass')}
                rules={[{ required: true, min: 8, max: 16 }]}
              >
                <Input.Password placeholder={intl.formatMessage({ id: 'sigin.password.placeholder' })} />
              </Form.Item>

              <Form.Item
                className="form-item-password"
                label={intl.formatMessage({ id: 'forgot.confirmPassword' })}
                name={n('confirmPass')}
                rules={[{ required: true, min: 8, max: 16 }]}
              >
                <Input.Password placeholder={intl.formatMessage({ id: 'forgot.confirmPassword.placeholder' })} />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" shape="round" className="w-100">
                  {intl.formatMessage({ id: 'forgot.submit' })}
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      )}
    </>
  );
};
export default ConfirmPassword;
