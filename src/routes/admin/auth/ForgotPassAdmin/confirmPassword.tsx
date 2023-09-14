import { Button, Form, Input, message } from 'antd';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import ConfirmCode from './confirmCode';
import { useNavigate } from 'react-router-dom';
import { UpdatePasswordDto } from '../../../../apis/client-axios';

const ConfirmPassword = ({ data }: any) => {
  const n = (key: keyof UpdatePasswordDto) => {
    return key;
  };
  const intl = useIntl();
  const [pass, setPass] = useState(null);
  const onFinish = (values: any) => {
    if (values.currentPass !== values.newPass)
      return message.error(intl.formatMessage({ id: 'forgot.confirmPassword.error' }));
    setPass({
      ...data,
      ...values,
    });
  };

  const onFinishFailed = () => {};

  return (
    <>
      {pass ? (
        <ConfirmCode data={pass} />
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
                name={n('currentPass')}
                rules={[{ required: true, min: 8, max: 16 }]}
              >
                <Input.Password placeholder={intl.formatMessage({ id: 'sigin.password.placeholder' })} />
              </Form.Item>

              <Form.Item
                className="form-item-password"
                label={intl.formatMessage({ id: 'forgot.confirmPassword' })}
                name={n('newPass')}
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
