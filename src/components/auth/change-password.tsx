import React from 'react';
import { Form } from 'antd';
import CustomInput from '../input/CustomInput';
import useIntl from '../../util/useIntl';
import { IntlShape } from 'react-intl';

const ChangePassword = () => {
  const intl: IntlShape = useIntl();
  return (
    <div id={'form-change-password'}>
      <div className={'form'}>
        <div className={'form__title'}>
          {intl.formatMessage({
            id: 'change-password.title',
          })}
        </div>
        <div className={'form__input'}>
          <div className={'form__input__rows'}>
            <Form.Item
              name={'oldPassword'}
              label={intl.formatMessage({
                id: 'change-password.oldPassword',
              })}
              rules={[{ required: true, min: 4, max: 255 }]}
            >
              <CustomInput isPassword={true} />
            </Form.Item>
          </div>
          <div className={'form__input__rows'}>
            <Form.Item
              name={'newPassword'}
              label={intl.formatMessage({
                id: 'change-password.newPassword',
              })}
              rules={[{ required: true, min: 4, max: 255 }]}
            >
              <CustomInput isPassword={true} />
            </Form.Item>
          </div>
          <div className={'form__input__rows'}>
            <Form.Item
              name={'confirmNewPassword'}
              label={intl.formatMessage({
                id: 'change-password.confirmNewPassword',
              })}
              rules={[{ required: true, min: 4, max: 255 }]}
            >
              <CustomInput isPassword={true} />
            </Form.Item>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
