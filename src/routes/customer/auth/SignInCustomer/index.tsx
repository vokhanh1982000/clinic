import { useMutation } from '@tanstack/react-query';
import { Button, Checkbox, Form, Input, message } from 'antd';
import { AuthApi, LoginDto } from '../../../../apis/client-axios';
import { useEffect } from 'react';
import { authApi } from '../../../../apis';
import { RootState, useAppDispatch } from '../../../../store';
import { login } from '../../../../store/authSlice';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useIntl } from 'react-intl';

const SignInCustomer = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const intl = useIntl();
  const { initCustomerURL } = useSelector((state: RootState) => state.setting);

  const loginMutation = useMutation((loginDto: LoginDto) => authApi.authControllerCustomerLogin(loginDto), {
    onSuccess: ({ data }) => {
      dispatch(login(data));
      navigate(initCustomerURL);
    },
    onError: (error) => {
      message.error(intl.formatMessage({ id: 'sigin.emailOrPasswordWrong' }));
    },
  });

  const onFinish = (values: any) => {
    console.log('value: ', values);
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
          label={intl.formatMessage({ id: 'sigin.username' })}
          name="username"
          className="mb-3"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>

        <Form.Item label={intl.formatMessage({ id: 'sigin.password' })} name="password" rules={[{ required: true }]}>
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

export default SignInCustomer;
