import { useMutation } from '@tanstack/react-query';
import { Button, Form, Input, message } from 'antd';
import { useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../../../apis';
import { FindUserByIdentifierDto, UpdatePasswordDtoTypeEnum } from '../../../apis/client-axios';
import { ADMIN_CLINIC_ROUTE_PATH, ADMIN_ROUTE_PATH, DOCTOR_CLINIC_ROUTE_PATH } from '../../../constants/route';
import ConfirmPassword from './confirmPassword';

export interface IForgotPassComponent {
  userType: UpdatePasswordDtoTypeEnum;
}
const ForgotPassComponent = (props: IForgotPassComponent) => {
  const { userType } = props;

  const n = (key: keyof FindUserByIdentifierDto) => {
    return key;
  };
  const regexPhone = useRef(/^(0[1-9][0-9]{8}|0[1-9][0-9]{9}|84[1-9][0-9]{8}|84[1-9][0-9]{9})$/);
  const intl = useIntl();
  const [pass, setPass] = useState({ identifier: '', type: '' });
  const navigate = useNavigate();

  const checkIdentifierMutation = useMutation(
    (findUserByIdentifierType: FindUserByIdentifierDto) =>
      authApi.authControllerCheckIdentierForgotPass(findUserByIdentifierType),
    {
      onSuccess: ({ data }, findUserByIdentifierType): any => {
        const res: any = data;
        if (!res?.result as any) return message.error(intl.formatMessage({ id: 'forgot.phoneInvalid' }));
        setPass({ ...findUserByIdentifierType });
      },
      onError: (error) => {
        console.log(error);
        message.error(intl.formatMessage({ id: 'forgot.phoneInvalid' }));
      },
    }
  );
  const onFinish = (values: any) => {
    if (!regexPhone.current.test(values.identifier))
      return message.error(intl.formatMessage({ id: 'forgot.phoneInvalid' }));
    checkIdentifierMutation.mutate({
      ...values,
      type: userType,
    });
  };

  const onFinishFailed = () => {};

  const backToLogin = () => {
    if (userType == UpdatePasswordDtoTypeEnum.Administrator) {
      navigate(ADMIN_ROUTE_PATH.SIGNIN);
    } else if (userType == UpdatePasswordDtoTypeEnum.AdministratorClinic) {
      navigate(ADMIN_CLINIC_ROUTE_PATH.SIGNIN);
    } else if (userType == UpdatePasswordDtoTypeEnum.DoctorClinic) {
      navigate(DOCTOR_CLINIC_ROUTE_PATH.SIGNIN);
    }
  };
  return pass?.identifier ? (
    <ConfirmPassword data={pass} userType={userType} />
  ) : (
    <div className="vh-100 row justify-content-center align-items-center">
      <div id="login-form" className="row justify-content-center align-items-center">
        <div className="logo">
          <img src="/assets/images/logo.png" />
        </div>
        <div className="form-name">
          <header className="form-name-header">{intl.formatMessage({ id: 'forgot.innit' })}</header>
          <p>{intl.formatMessage({ id: 'forgot.requiredPhone' })}</p>
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
            label={intl.formatMessage({ id: 'sigin.username' })}
            name={n('identifier')}
            className="mb-3"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              shape="round"
              className="w-100"
              loading={checkIdentifierMutation.isLoading}
            >
              {intl.formatMessage({ id: 'forgot.submit' })}
            </Button>
          </Form.Item>
          <div className="d-flex justify-content-center txt-forgot" onClick={backToLogin}>
            {intl.formatMessage({ id: 'forgot.backToLogin' })}
          </div>
        </Form>
      </div>
    </div>
  );
};
export default ForgotPassComponent;
