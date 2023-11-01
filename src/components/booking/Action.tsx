import React, { Dispatch, SetStateAction } from 'react';
import { Checkbox, Form, FormInstance } from 'antd';
import CustomButton from '../buttons/CustomButton';
import useIntl from '../../util/useIntl';
import { IntlShape } from 'react-intl';

interface ActionProp {
  form: FormInstance;
  role?: 'doctor' | 'admin' | 'adminClinic';
  type?: 'update' | 'create';
  onCancel?: () => void;
}
const Action = (props: ActionProp) => {
  const { form, role, type, onCancel }: ActionProp = props;
  const intl: IntlShape = useIntl();

  const className = () => {
    if (role === 'doctor') {
      return 'custom-checkbox-disabled';
    }
    if (role === 'adminClinic' && type === 'update') {
      return 'custom-checkbox-disabled';
    }
    if (role === 'adminClinic' && type === 'create') {
      return 'custom-checkbox';
    }
    if (role === 'admin' && type === 'update') {
      return 'custom-checkbox-disabled';
    }
    if (role === 'admin' && type === 'create') {
      return 'custom-checkbox';
    }
  };
  return (
    <div className={'action'}>
      <div className={'rows'}>
        <Form.Item className={'checkbox'} name={'isPrioritize'} valuePropName={'checked'}>
          <Checkbox className={className()}>{intl.formatMessage({ id: 'booking.create.is-prioritize' })}</Checkbox>
        </Form.Item>
      </div>
      <div className={'rows'}>
        <Form.Item className={'checkbox'} name={'hasBookedAssistant'} valuePropName={'checked'}>
          <Checkbox className={className()}>
            {intl.formatMessage({ id: 'booking.create.has-booked-assistant' })}
          </Checkbox>
        </Form.Item>
      </div>
      <div className={'rows'}>
        <CustomButton className="button-save" htmlType={'submit'}>
          {(role === 'admin' || role === 'adminClinic') && intl.formatMessage({ id: 'booking.button.admin-save' })}
          {role === 'doctor' && intl.formatMessage({ id: 'booking.button.doctor.provide-medicine' })}
        </CustomButton>

        <CustomButton className="button-cancel" onClick={onCancel}>
          {(role === 'admin' || role === 'adminClinic') &&
            type === 'update' &&
            intl.formatMessage({ id: 'booking.button.admin-cancel-booking' })}
          {role === 'admin' && type === 'create' && intl.formatMessage({ id: 'booking.button.admin-cancel' })}
        </CustomButton>
      </div>
    </div>
  );
};

export default Action;
