import { useMutation } from '@tanstack/react-query';
import { Button, Form, message } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import OTPInput from 'react-otp-input';
import { authApi } from '../../../apis';
import { FindUserByIdentifierDto, ForgotPasswordDto } from '../../../apis/client-axios';
import ForgotSuccess from './forgot-success';
import { isNumber } from 'lodash';

const ConfirmCode = ({ data, userType }: any) => {
  const intl = useIntl();
  const [pass, setPass] = useState(false);
  const [time, setTime] = useState('');
  const [otp, setOTP] = useState('');

  useEffect(() => {
    startTimer(60 * 5);
  }, []);

  const onFinish = ({ code }: any) => {
    const sendData: ForgotPasswordDto = { ...data, otp: otp };
    forgotPasswordMutation.mutate(sendData);
  };

  const forgotPasswordMutation = useMutation(
    (updatePasswordData: ForgotPasswordDto) => authApi.authControllerForgotPassword(updatePasswordData),
    {
      onSuccess: (respon) => {
        if (!respon.data) return message.error(intl.formatMessage({ id: 'forgot.otp.fail' }));
        const data: any = respon.data;
        if (data.mes && data.mes.status === 400) return message.error(intl.formatMessage({ id: 'forgot.otp.fail' }));
        setPass(true);
      },
      onError: (error) => {
        console.log(error);
        message.error(intl.formatMessage({ id: 'forgot.otp.fail' }));
      },
    }
  );

  const sendOTPMutation = useMutation(
    (findUserByIdentifierType: FindUserByIdentifierDto) =>
      authApi.authControllerSendOTPForgotPassword(findUserByIdentifierType),
    {
      onSuccess: ({ data }, findUserByIdentifierType): any => {},
      onError: (error) => {
        message.error(intl.formatMessage({ id: 'forgot.error.tryAgain' }));
      },
    }
  );

  const handleResendOTP = () => {
    if (time !== '00:00s') return message.error(intl.formatMessage({ id: 'forgot.otp.time' }));
    sendOTPMutation.mutate(data);
    startTimer(60 * 5);
  };

  const onFinishFailed = () => {};

  const startTimer = (duration: number) => {
    let timer: number = duration,
      minutes: any,
      seconds: any;
    setInterval(function () {
      minutes = parseInt((timer / 60).toString(), 10);
      seconds = parseInt((timer % 60).toString(), 10);

      minutes = minutes < 10 ? '0' + minutes : minutes;
      seconds = seconds < 10 ? '0' + seconds : seconds;
      if (--timer < -1) {
        // timer = duration;
      } else {
        setTime(`${minutes}:${seconds}s`);
      }
    }, 1000);
  };
  const handleChangeOtp = (e: any) => {
    console.log(e);
    // console.log(isNumber(e.target.value));
  };

  return pass ? (
    <ForgotSuccess userType={userType} />
  ) : (
    <>
      <div className="vh-100 row justify-content-center align-items-center">
        <div id="login-form" className="row justify-content-center align-items-center">
          <div className="logo">
            <img src="/assets/images/logo.png" />
          </div>
          <div className="form-name">
            <header className="form-name-header">{intl.formatMessage({ id: 'forgot.code' })}</header>
            <p>
              {intl.formatMessage({ id: 'forgot.requiredCode' })} <span>{data.identifier}</span>{' '}
            </p>
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
            <div className="confirm-code">
              <div className="confirm-code-input">
                <OTPInput
                  onChange={setOTP}
                  value={otp}
                  inputStyle="inputStyle"
                  numInputs={6}
                  inputType="number"
                  renderSeparator={<span></span>}
                  renderInput={(props) => <input {...props} className="otp-input" />}
                />
                {/* {codes.length > 0 ? (
                  <>
                    {codes.map((val, index) => (
                      <Input key={index} value={val} onPaste={handlleOnpaste} />
                    ))}
                  </>
                ) : (
                  <>
                    <Input name={'otpIndex0'} onPaste={handlleOnpaste} />
                    <Input name={'otpIndex1'} onPaste={handlleOnpaste} />
                    <Input name={'otpIndex2'} onPaste={handlleOnpaste} />
                    <Input name={'otpIndex3'} onPaste={handlleOnpaste} />
                    <Input name={'otpIndex4'} onPaste={handlleOnpaste} />
                    <Input name={'otpIndex5'} onPaste={handlleOnpaste} />
                  </>
                )} */}
              </div>
              <p className="confirm-code-messenger">
                <span onClick={handleResendOTP}>
                  {intl.formatMessage({ id: 'forgot.confirmCodeMessenger' })} ({time})
                </span>
              </p>
            </div>
            <Form.Item>
              <Button type="primary" htmlType="submit" shape="round" className="w-100">
                {intl.formatMessage({ id: 'forgot.submit' })}
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </>
  );
};
export default ConfirmCode;
