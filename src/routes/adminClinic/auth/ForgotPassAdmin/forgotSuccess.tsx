import { Button, Form, Input, Result } from 'antd';
import { useIntl } from 'react-intl';

const ForgotSuccess = () => {
  const intl = useIntl();

  const onFinish = () => {};

  const onFinishFailed = () => {};

  return (
    <div className="vh-100 row justify-content-center align-items-center">
      <div id="login-form" className="row justify-content-center align-items-center">
        <Result
          status="success"
          title={intl.formatMessage({ id: 'forgot.success.title' })}
          subTitle={intl.formatMessage({ id: 'forgot.success.messenger' })}
        />
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
          <Form.Item>
            <Button type="primary" htmlType="submit" shape="round" className="w-100">
              {intl.formatMessage({ id: 'sigin.submit' })}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};
export default ForgotSuccess;
