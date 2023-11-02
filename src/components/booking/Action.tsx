import React, { Dispatch, SetStateAction } from 'react';
import { Checkbox, Form, FormInstance } from 'antd';
import CustomButton from '../buttons/CustomButton';
import useIntl from '../../util/useIntl';
import { IntlShape } from 'react-intl';
import { BookingStatusEnum } from '../../apis/client-axios';

interface ActionProp {
  form: FormInstance;
  role?: 'doctor' | 'admin' | 'adminClinic';
  type?: 'update' | 'create';
  onCancel?: () => void;
  status?: BookingStatusEnum;
}
const Action = (props: ActionProp) => {
  const { form, role, type, onCancel, status }: ActionProp = props;
  const intl: IntlShape = useIntl();

  const className = (): string => {
    if ((role === 'adminClinic' || role === 'admin') && type === 'create') {
      return 'custom-checkbox';
    }
    if ((role === 'adminClinic' || role === 'admin') && type === 'update' && status === BookingStatusEnum.Pending) {
      return 'custom-checkbox';
    }
    return 'custom-checkbox-disabled';
  };
  const isDisabled = () => {
    if ((role === 'adminClinic' || role === 'admin') && type === 'create') {
      return false;
    }
    if (
      role === 'doctor' &&
      type === 'update' &&
      (status === BookingStatusEnum.Approved || status === BookingStatusEnum.Completed)
    ) {
      return false;
    }
    return !(type === 'update' && (status === BookingStatusEnum.Pending || status === BookingStatusEnum.Approved));
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
        <CustomButton className="button-save" htmlType={'submit'} disabled={isDisabled()}>
          {(role === 'admin' || role === 'adminClinic') && intl.formatMessage({ id: 'booking.button.admin-save' })}
          {role === 'doctor' && intl.formatMessage({ id: 'booking.button.doctor.provide-medicine' })}
        </CustomButton>

        <CustomButton className="button-cancel" onClick={onCancel} disabled={isDisabled()}>
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
