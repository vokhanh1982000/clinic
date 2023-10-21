import React from 'react';
import { Checkbox, Form, FormInstance } from 'antd';
import CustomCheckbox from '../checkboxGroup/customCheckbox';
import useForm from 'antd/es/form/hooks/useForm';
import CustomButton from '../buttons/CustomButton';
import useIntl from '../../util/useIntl';
import { IntlShape } from 'react-intl';

const Action = () => {
  const intl: IntlShape = useIntl();
  return (
    <div className={'action'}>
      <div className={'rows'}>
        <Form.Item className={'checkbox'}>
          <Checkbox className={'custom-checkbox'}>
            {intl.formatMessage({ id: 'booking.create.is-prioritize' })}
          </Checkbox>
        </Form.Item>
      </div>
      <div className={'rows'}>
        <Form.Item className={'checkbox'}>
          <Checkbox className={'custom-checkbox'}>
            {intl.formatMessage({ id: 'booking.create.has-booked-assistant' })}
          </Checkbox>
        </Form.Item>
      </div>
      <div className={'rows'}>
        <CustomButton className="button-save">Lưu</CustomButton>
      </div>
    </div>
  );
};

export default Action;
