import React from 'react';
import { Checkbox, Form, FormInstance } from 'antd';
import CustomButton from '../buttons/CustomButton';
import useIntl from '../../util/useIntl';
import { IntlShape } from 'react-intl';

interface ActionProp {
  form: FormInstance;
}
const Action = (props: ActionProp) => {
  const { form }: ActionProp = props;
  const intl: IntlShape = useIntl();
  return (
    <div className={'action'}>
      <div className={'rows'}>
        <Form.Item className={'checkbox'} name={'isPrioritize'} valuePropName={'checked'}>
          <Checkbox className={'custom-checkbox'}>
            {intl.formatMessage({ id: 'booking.create.is-prioritize' })}
          </Checkbox>
        </Form.Item>
      </div>
      <div className={'rows'}>
        <Form.Item className={'checkbox'} name={'hasBookedAssistant'} valuePropName={'checked'}>
          <Checkbox className={'custom-checkbox'}>
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
