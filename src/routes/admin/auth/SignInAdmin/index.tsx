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
      <Form
        name="basic"
        layout="vertical"
        style={{ maxWidth: 400 }}
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
          label={intl.formatMessage({ id: 'sigin.password' })}
          name={n('password')}
          rules={[{ required: true }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" className="w-100" loading={loginMutation.isLoading}>
            {intl.formatMessage({ id: 'sigin.submit' })}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default SignInAdmin;
