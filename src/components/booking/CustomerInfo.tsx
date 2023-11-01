import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { IntlShape } from 'react-intl';
import useIntl from '../../util/useIntl';
import { Form, FormInstance, Select } from 'antd';
import CustomInput from '../input/CustomInput';
import CustomArea from '../input/CustomArea';
import { Customer } from '../../apis/client-axios';
import { useQuery } from '@tanstack/react-query';
import { customerApi } from '../../apis';
import CustomSearchSelect from '../input/CustomSearchSelect';
import { debounce } from 'lodash';

interface CustomerInfoProps {
  form: FormInstance;
  customer?: Customer;
  setCustomer: Dispatch<SetStateAction<Customer | undefined>>;
  customerNote?: string;
  role: 'admin' | 'adminClinic' | 'doctor';
  type: 'create' | 'update';
  isSubmit?: boolean;
}
const CustomerInfo = (props: CustomerInfoProps) => {
  const intl: IntlShape = useIntl();
  const { customer, customerNote, setCustomer, role, form, isSubmit, type }: CustomerInfoProps = props;
  const [listCustomer, setListCustomer] = useState<Customer[]>();
  const [searchNameCustomer, setSearchNameCustomer] = useState<string>();
  const { data: listCustomerData } = useQuery({
    queryKey: ['listCustomerData', { searchNameCustomer }],
    queryFn: () => customerApi.customerControllerGetAllWithoutPaginate(searchNameCustomer),
  });

  useEffect(() => {
    setListCustomer(listCustomerData?.data);
  }, [listCustomerData]);

  const debouncedUpdateInputValue = debounce((value) => {
    if (!value.trim()) {
      setSearchNameCustomer('');
    } else {
      setSearchNameCustomer(value);
    }
  }, 500);

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
            <CustomSearchSelect
              disabled={role === 'doctor' || type === 'update'}
              placeholder={intl.formatMessage({
                id: 'customer.create.name',
              })}
              optionLabelProp={'label'}
              key={customer?.id}
              value={customer?.fullName}
              onSearch={debouncedUpdateInputValue}
              onChange={(value: string, option: any) => {
                setCustomer(listCustomer?.find((item) => item.id === option?.key));
              }}
              allowClear={false}
            >
              {listCustomer?.map((item) => (
                <Select.Option value={item.fullName} key={item.id}>
                  <div className={'option-item'}>
                    <div className={'option-item__avatar'}>
                      <img src={`${process.env.REACT_APP_URL_IMG_S3}${item.avatar?.source}`} alt={''} />
                    </div>
                    <div className={'option-item__info'}>
                      <div className={'option-item__info__name'}>{item.fullName}</div>
                      <div className={'option-item__info__mail'}>{item.emailAddress}</div>
                      <div className={'option-item__info__category'}>{item.address}</div>
                    </div>
                  </div>
                </Select.Option>
              ))}
            </CustomSearchSelect>
            {isSubmit && (customer?.fullName?.trim() === '' || !customer?.fullName) && (
              <span className="text-error">
                {intl.formatMessage({
                  id: 'booking.create.error.content',
                })}
              </span>
            )}
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
              value={intl.formatMessage({ id: customer?.gender ? 'common.gender.male' : 'common.gender.female' })}
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
