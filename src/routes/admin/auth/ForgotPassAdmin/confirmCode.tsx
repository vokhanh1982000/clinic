import { Button, Form, Input, message } from 'antd';
import { forEach } from 'lodash';
import { useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import ForgotSuccess from './forgotSuccess';
import { useMutation } from '@tanstack/react-query';
import { UpdatePasswordDto } from '../../../../apis/client-axios';
import { authApi } from '../../../../apis';

const ConfirmCode = ({ data }: any) => {
  const intl = useIntl();
  const [pass, setPass] = useState(false);
  const [codes, setCodes] = useState([]);
  const regex = useRef(/^[a-zA-Z0-9]{6}$/);

  const onFinish = ({ code }: any) => {
    // confirm code
    console.log(code);

    //
    const sendData: UpdatePasswordDto = { ...data };
    forgotPasswordMutation.mutate(sendData);
  };

  const forgotPasswordMutation = useMutation(
    (updatePasswordData: UpdatePasswordDto) => authApi.authControllerForgotPassword(updatePasswordData),
    {
      onSuccess: ({ data }) => {
        if (!data) return message.error(intl.formatMessage({ id: 'forgot.phoneInvalid' }));
        setPass(true);
      },
      onError: (error) => {
        console.log(error);
        message.error(intl.formatMessage({ id: 'forgot.phoneInvalid' }));
      },
    }
  );

  const onFinishFailed = () => {};

  const handlleOnpaste = (e: any) => {
    const pastedData = e.clipboardData.getData('text');
    if (regex.current.test(pastedData)) setCodes(Array.from(pastedData));
  };

  return pass ? (
    <ForgotSuccess />
  ) : (
    <>
      <div className="vh-100 row justify-content-center align-items-center">
        <div id="login-form" className="row justify-content-center align-items-center">
          <div className="logo">
            <img src="/assets/images/logo.png" />
          </div>
          <div className="form-name">
            <header className="form-name-header">{intl.formatMessage({ id: 'forgot.code' })}</header>
            <p>{intl.formatMessage({ id: 'forgot.requiredCode' })}</p>
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
            <div className="confirm-code">
              <div className="confirm-code-input">
                {codes.length > 0 ? (
                  <>
                    {codes.map((val, index) => (
                      <Input key={index} value={val} onPaste={handlleOnpaste} />
                    ))}
                  </>
                ) : (
                  <>
                    <Input onPaste={handlleOnpaste} />
                    <Input onPaste={handlleOnpaste} />
                    <Input onPaste={handlleOnpaste} />
                    <Input onPaste={handlleOnpaste} />
                    <Input onPaste={handlleOnpaste} />
                    <Input onPaste={handlleOnpaste} />
                  </>
                )}
              </div>
              <p className="confirm-code-messenger">
                {intl.formatMessage({ id: 'forgot.confirmCodeMessenger' })} (10s)
              </p>
            </div>
            <Form.Item>
              <Button type="primary" htmlType="submit" shape="round" className="w-100">
                {intl.formatMessage({ id: 'forgot.submit' })}
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </>
  );
};
export default ConfirmCode;
