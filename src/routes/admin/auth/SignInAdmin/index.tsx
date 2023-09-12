import { useMutation } from '@tanstack/react-query';
import { Button, Checkbox, Form, Input, message } from 'antd';
import { AuthApi, LoginDto } from '../../../../apis/client-axios';
import { useEffect } from 'react';
import { authApi } from '../../../../apis';
import { RootState, useAppDispatch } from '../../../../store';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useIntl } from 'react-intl';
import { login } from '../../../../store/authSlice';

const SignInAdmin = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const intl = useIntl();
  const { initAdminURL } = useSelector((state: RootState) => state.setting);

  const n = (key: keyof LoginDto) => {
    return key;
  };

  const loginMutation = useMutation((loginDto: LoginDto) => authApi.authControllerAdminLogin(loginDto), {
    onSuccess: ({ data }) => {
      dispatch(login(data));
      navigate(initAdminURL);
    },
    onError: (error) => {
      message.error(intl.formatMessage({ id: 'sigin.emailOrPasswordWrong' }));
    },
  });

  const onFinish = (values: any) => {
    loginMutation.mutate({
      ...values,
    });
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div className="vh-100 row justify-content-center align-items-center">
      <div id="login-form" className="row justify-content-center align-items-center">
        <div className="logo">
          <img src="/assets/images/logo.png" />
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
        >
          <Form.Item
            label={intl.formatMessage({ id: 'sigin.email' })}
            name={n('username')}
            className="mb-3"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            className="form-item-password"
            label={intl.formatMessage({ id: 'sigin.password' })}
            name={n('password')}
            rules={[{ required: true }]}
          >
            <Input.Password />
          </Form.Item>

          <div className="d-flex justify-content-end txt-forgot">{intl.formatMessage({ id: 'sigin.forgot' })}</div>

          <Form.Item>
            <Button type="primary" htmlType="submit" shape="round" className="w-100" loading={loginMutation.isLoading}>
              {intl.formatMessage({ id: 'sigin.submit' })}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default SignInAdmin;
