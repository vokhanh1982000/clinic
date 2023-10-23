import React from 'react';
import { IntlShape } from 'react-intl';
import useIntl from '../../util/useIntl';
import { Form, FormInstance } from 'antd';
import { ValidateLibrary } from '../../validate';
import CustomInput from '../input/CustomInput';
import CustomArea from '../input/CustomArea';
import { Clinic, Customer } from '../../apis/client-axios';

interface CustomerInfoProps {
  form: FormInstance;
  customer?: Customer;
  customerNote?: string;
}
const CustomerInfo = (props: CustomerInfoProps) => {
  const intl: IntlShape = useIntl();
  const { customer, customerNote }: CustomerInfoProps = props;
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
          >
            <CustomInput
              disabled={true}
              placeholder={intl.formatMessage({
                id: 'customer.create.name',
              })}
              value={customer?.fullName}
            />
          </Form.Item>
          <Form.Item
            className="code"
            label={intl.formatMessage({
              id: 'customer.create.code',
            })}
          >
            <CustomInput
              disabled={true}
              placeholder={intl.formatMessage({
                id: 'customer.create.code',
              })}
              value={customer?.code}
            />
          </Form.Item>
        </div>
        <div className="customer-info__content__rows">
          <Form.Item
            className="gender"
            label={intl.formatMessage({
              id: 'customer.create.gender',
            })}
          >
            <CustomInput
              disabled={true}
              placeholder={intl.formatMessage({
                id: 'customer.create.gender',
              })}
              value={intl.formatMessage({ id: `common.gender.${customer?.gender}` })}
            />
          </Form.Item>
          <Form.Item
            className="phone"
            label={intl.formatMessage({
              id: 'customer.create.phone',
            })}
          >
            <CustomInput
              disabled={true}
              placeholder={intl.formatMessage({
                id: 'customer.create.phone',
              })}
              value={customer?.phoneNumber}
            />
          </Form.Item>
        </div>
        <div className={'customer-info__content__rows'}>
          <Form.Item
            className={'customerNote'}
            label={intl.formatMessage({
              id: 'booking.create.customerNote',
            })}
            name={'customerNote'}
          >
            <CustomArea
              disabled={true}
              rows={6}
              style={{ resize: 'none' }}
              placeholder={intl.formatMessage({
                id: 'booking.create.customerNote',
              })}
              value={customerNote}
            />
          </Form.Item>
        </div>
      </div>
    </div>
  );
};

export default CustomerInfo;
