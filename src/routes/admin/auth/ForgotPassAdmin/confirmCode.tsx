import { Button, Form, Input } from 'antd';
import { useIntl } from 'react-intl';

const ConfirmCode = () => {
  const intl = useIntl();

  const onFinish = () => {};

  const onFinishFailed = () => {};

  return (
    <>
      <div className="form-name">
        <header className="form-name-header">{intl.formatMessage({ id: 'forgot.code' })}</header>
        <p>{intl.formatMessage({ id: 'forgot.requiredCode' })}</p>
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
            <Input />
            <Input />
            <Input />
            <Input />
          </div>
          <p className="confirm-code-messenger">{intl.formatMessage({ id: 'forgot.confirmCodeMessenger' })} (10s)</p>
        </div>
        <Form.Item>
          <Button type="primary" htmlType="submit" shape="round" className="w-100">
            {intl.formatMessage({ id: 'forgot.submit' })}
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};
export default ConfirmCode;
