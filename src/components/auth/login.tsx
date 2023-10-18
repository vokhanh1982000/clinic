import { useMutation } from '@tanstack/react-query';
import { message, Form, Input, Button } from 'antd';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../../apis';
import { LoginDto, UpdatePasswordDtoTypeEnum } from '../../apis/client-axios';
import { ADMIN_CLINIC_ROUTE_PATH, ADMIN_ROUTE_PATH, DOCTOR_CLINIC_ROUTE_PATH } from '../../constants/route';
import { useAppDispatch, RootState } from '../../store';
import { login } from '../../store/authSlice';

export interface ISignInCommon {
  userType: UpdatePasswordDtoTypeEnum;
}
const SignInCommon = (props: ISignInCommon) => {
  const { userType } = props;
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const intl = useIntl();

  const n = (key: keyof LoginDto) => {
    return key;
  };

  const loginAdminMutation = useMutation((loginDto: LoginDto) => authApi.authControllerAdminLogin(loginDto), {
    onSuccess: ({ data }) => {
      dispatch(login(data));
      navigate(ADMIN_ROUTE_PATH.DASHBOARD);
    },
    onError: (error) => {
      message.error(intl.formatMessage({ id: 'sigin.emailOrPasswordWrong' }));
    },
  });

  const loginAdminClinicMutation = useMutation(
    (loginDto: LoginDto) => authApi.authControllerAdminClinicLogin(loginDto),
    {
      onSuccess: ({ data }) => {
        dispatch(login(data));
        navigate(ADMIN_CLINIC_ROUTE_PATH.DASHBOARD);
      },
      onError: (error) => {
        message.error(intl.formatMessage({ id: 'sigin.emailOrPasswordWrong' }));
      },
    }
  );

  const loginDoctorClinicMutation = useMutation(
    (loginDto: LoginDto) => authApi.authControllerDoctorsClinicLogin(loginDto),
    {
      onSuccess: ({ data }) => {
        dispatch(login(data));
        navigate(DOCTOR_CLINIC_ROUTE_PATH.DASHBOARD);
      },
      onError: (error) => {
        message.error(intl.formatMessage({ id: 'sigin.emailOrPasswordWrong' }));
      },
    }
  );

  const onFinish = (values: any) => {
    if (userType == UpdatePasswordDtoTypeEnum.Administrator) {
      loginAdminMutation.mutate({
        ...values,
      });
    } else if (userType == UpdatePasswordDtoTypeEnum.AdministratorClinic) {
      loginAdminClinicMutation.mutate({
        ...values,
      });
    } else if (userType == UpdatePasswordDtoTypeEnum.DoctorClinic) {
      loginDoctorClinicMutation.mutate({
        ...values,
      });
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  const navigateToForgotPassword = () => {
    if (userType == UpdatePasswordDtoTypeEnum.Administrator) {
      navigate(ADMIN_ROUTE_PATH.FORGOT_PASSWORD);
    } else if (userType == UpdatePasswordDtoTypeEnum.AdministratorClinic) {
      navigate(ADMIN_CLINIC_ROUTE_PATH.FORGOT_PASSWORD);
    } else if (userType == UpdatePasswordDtoTypeEnum.DoctorClinic) {
      navigate(DOCTOR_CLINIC_ROUTE_PATH.FORGOT_PASSWORD);
    }
  };

  return (
    <div className="vh-100 row justify-content-center align-items-center m-auto">
      <div id="login-form" className=" justify-content-center align-items-center">
        <div className="logo">
          <img src="/assets/images/logo.png" />
        </div>
        <div className="d-flex title">
          <div>{intl.formatMessage({ id: 'sigin.title' })}</div>
        </div>
        <Form
          name="basic"
          layout="vertical"
          style={{ maxWidth: 350 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          requiredMark={false}
        >
          <Form.Item
            label={intl.formatMessage({ id: 'sigin.username' })}
            name={n('username')}
            className="mb-3"
            rules={[
              {
                required: true,
                len: 10,
                pattern: /^0[1-9][0-9]{8}$/,
                message: intl.formatMessage({ id: 'sigin.validate.phone' }),
              },
            ]}
          >
            <Input placeholder={intl.formatMessage({ id: 'sigin.username.placeholder' })} />
          </Form.Item>

          <Form.Item
            className="form-item-password"
            label={intl.formatMessage({ id: 'sigin.password' })}
            name={n('password')}
            rules={[
              {
                required: true,
                min: 8,
                pattern: /^[A-Za-z\d#$@!%&*?.]{8,}$/,
                message: intl.formatMessage({ id: 'common.password.min' }),
              },
            ]}
          >
            <Input.Password placeholder={intl.formatMessage({ id: 'sigin.password.placeholder' })} />
          </Form.Item>

          <div className="d-flex justify-content-end txt-forgot">
            <p onClick={navigateToForgotPassword}>{intl.formatMessage({ id: 'sigin.forgot' })}</p>
          </div>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              shape="round"
              className="w-100"
              loading={loginAdminMutation.isLoading || loginAdminClinicMutation.isLoading}
            >
              {intl.formatMessage({ id: 'sigin.submit' })}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default SignInCommon;
