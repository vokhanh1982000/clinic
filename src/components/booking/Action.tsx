import React from 'react';
import { Checkbox, Form, FormInstance } from 'antd';
import CustomButton from '../buttons/CustomButton';
import useIntl from '../../util/useIntl';
import { IntlShape } from 'react-intl';

interface ActionProp {
  form: FormInstance;
  role?: 'doctor' | 'admin' | 'adminClinic';
}
const Action = (props: ActionProp) => {
  const { form, role }: ActionProp = props;
  const intl: IntlShape = useIntl();
  return (
    <div className={'action'}>
      <div className={'rows'}>
        <Form.Item className={'checkbox'} name={'isPrioritize'} valuePropName={'checked'}>
          <Checkbox
            className={role === 'doctor' ? 'custom-checkbox-disabled' : 'custom-checkbox'}
            // disabled={role === 'doctor'}
          >
            {intl.formatMessage({ id: 'booking.create.is-prioritize' })}
          </Checkbox>
        </Form.Item>
      </div>
      <div className={'rows'}>
        <Form.Item className={'checkbox'} name={'hasBookedAssistant'} valuePropName={'checked'}>
          <Checkbox
            className={role === 'doctor' ? 'custom-checkbox-disabled' : 'custom-checkbox'}
            // disabled={role === 'doctor'}
          >
            {intl.formatMessage({ id: 'booking.create.has-booked-assistant' })}
          </Checkbox>
        </Form.Item>
      </div>
      <div className={'rows'}>
        <CustomButton className="button-save" htmlType={'submit'}>
          Lưu
        </CustomButton>
      </div>
    </div>
  );
};

export default Action;
