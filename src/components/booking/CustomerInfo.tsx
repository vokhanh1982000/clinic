import React from 'react';
import { IntlShape } from 'react-intl';
import useIntl from '../../util/useIntl';
import { Form } from 'antd';
import { ValidateLibrary } from '../../validate';
import CustomInput from '../input/CustomInput';
import CustomArea from '../input/CustomArea';

const CustomerInfo = () => {
  const intl: IntlShape = useIntl();
  // const { n } = props;
  return (
    <div className={'customer-info'}>
      <div className="customer-info__header">
        <div className="customer-info__header__title">
          <div className="customer-info__header__title__label">
            {intl.formatMessage({
              id: 'booking.customer.title',
            })}
          </div>
          <div className="line-title"></div>
        </div>
      </div>
      <div className={'customer-info__content'}>
        <div className="customer-info__content__rows">
          <Form.Item
            className="name"
            label={intl.formatMessage({
              id: 'customer.create.name',
            })}
            name={'fullName'}
            rules={ValidateLibrary(intl).name}
          >
            <CustomInput
              placeholder={intl.formatMessage({
                id: 'customer.create.name',
              })}
            />
          </Form.Item>
          <Form.Item
            className="code"
            label={intl.formatMessage({
              id: 'customer.create.code',
            })}
            name={'code'}
            rules={ValidateLibrary(intl).userCode}
          >
            <CustomInput
              placeholder={intl.formatMessage({
                id: 'customer.create.code',
              })}
            />
          </Form.Item>
        </div>
        <div className="customer-info__content__rows">
          <Form.Item
            className="gender"
            label={intl.formatMessage({
              id: 'customer.create.gender',
            })}
            name={'gender'}
            rules={ValidateLibrary(intl).gender}
          >
            <CustomInput
              placeholder={intl.formatMessage({
                id: 'customer.create.gender',
              })}
            />
          </Form.Item>
          <Form.Item
            className="phone"
            label={intl.formatMessage({
              id: 'customer.create.phone',
            })}
            name={'phoneNumber'}
            rules={ValidateLibrary(intl).phoneNumber}
          >
            <CustomInput
              placeholder={intl.formatMessage({
                id: 'customer.create.phone',
              })}
            />
          </Form.Item>
        </div>
        <div className={'customer-info__content__rows'}>
          <Form.Item
            className={'customerNote'}
            label={intl.formatMessage({
              id: 'booking.create.customerNote',
            })}
          >
            <CustomArea
              rows={6}
              style={{ resize: 'none' }}
              placeholder={intl.formatMessage({
                id: 'booking.create.customerNote',
              })}
            />
          </Form.Item>
        </div>
      </div>
    </div>
  );
};

export default CustomerInfo;
