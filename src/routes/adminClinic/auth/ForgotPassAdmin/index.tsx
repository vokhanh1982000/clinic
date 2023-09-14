import { Button, Form, Input } from 'antd';
import { Component, useState } from 'react';
import { useIntl } from 'react-intl';
import ConfirmCode from './confirmCode';
import ConfirmPassword from './confirmPassword';
import ForgotSuccess from './forgotSuccess';

const ForgotPassAdmin = () => {
  const intl = useIntl();
  const [layout, setLayout] = useState('');

  const onFinish = () => {};

  const onFinishFailed = () => {};

  const handelClickBtn = () => {
    setLayout('code');
  };

  const layoutRender = layout == 'code' ? <ConfirmCode /> : <ConfirmPassword />;
  return (
    <div className="vh-100 row justify-content-center align-items-center">
      <div id="login-form" className="row justify-content-center align-items-center">
        <div className="logo">
          <img src="/assets/images/logo.png" />
        </div>
        {layout ? (
          <>{layoutRender}</>
        ) : (
          <>
            <div className="form-name">
              <header className="form-name-header">{intl.formatMessage({ id: 'forgot.innit' })}</header>
              <p>{intl.formatMessage({ id: 'forgot.requiredPhone' })}</p>
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
                label={intl.formatMessage({ id: 'sigin.username' })}
                name={'username'}
                className="mb-3"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>

              <Form.Item>
                <Button onClick={handelClickBtn} type="primary" htmlType="submit" shape="round" className="w-100">
                  {intl.formatMessage({ id: 'forgot.submit' })}
                </Button>
              </Form.Item>
              <div className="d-flex justify-content-center txt-forgot">
                {intl.formatMessage({ id: 'forgot.backToLogin' })}
              </div>
            </Form>
          </>
        )}
      </div>
    </div>
  );
};
export default ForgotPassAdmin;
