import { Button, Form, Input } from 'antd';
import { useIntl } from 'react-intl';

const ConfirmPassword = () => {
  const intl = useIntl();

  const onFinish = () => {};

  const onFinishFailed = () => {};

  return (
    <>
      <div className="form-name">
        <header className="form-name-header">{intl.formatMessage({ id: 'forgot.inputPassword' })}</header>
        <p>{intl.formatMessage({ id: 'forgot.requiredInputPassword' })}</p>
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
          name={'currentPassword'}
          rules={[{ required: true, min: 8, max: 16 }]}
        >
          <Input.Password placeholder={intl.formatMessage({ id: 'sigin.password.placeholder' })} />
        </Form.Item>

        <Form.Item
          className="form-item-password"
          label={intl.formatMessage({ id: 'forgot.confirmPassword' })}
          name={'newPassword'}
          rules={[{ required: true, min: 8, max: 16 }]}
        >
          <Input.Password placeholder={intl.formatMessage({ id: 'forgot.confirmPassword.placeholder' })} />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" shape="round" className="w-100">
            {intl.formatMessage({ id: 'forgot.submit' })}
          </Button>
        </Form.Item>
        <div className="d-flex justify-content-center txt-forgot">
          {intl.formatMessage({ id: 'forgot.backToLogin' })}
        </div>
      </Form>
    </>
  );
};
export default ConfirmPassword;
