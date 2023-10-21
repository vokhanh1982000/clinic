import React from 'react';
import { IntlShape } from 'react-intl';
import useIntl from '../../util/useIntl';
import { Form } from 'antd';
import { ValidateLibrary } from '../../validate';
import CustomInput from '../input/CustomInput';
import CustomSelect from '../select/CustomSelect';

interface DoctorInfoProps {}
const DoctorInfo = (props: DoctorInfoProps) => {
  const intl: IntlShape = useIntl();
  // const { n } = props;
  return (
    <div className={'doctor-info'}>
      <div className="doctor-info__header">
        <div className="doctor-info__header__title">
          <div className="doctor-info__header__title__label">
            {intl.formatMessage({
              id: 'booking.doctor.title',
            })}
          </div>
          <div className="line-title"></div>
        </div>
      </div>
      <div className={'doctor-info__content'}>
        <div className="doctor-info__content__rows">
          <Form.Item
            className="name"
            label={intl.formatMessage({
              id: 'doctor-profile.form.fullName',
            })}
            name={'fullName'}
            rules={ValidateLibrary(intl).name}
          >
            <CustomInput
              placeholder={intl.formatMessage({
                id: 'doctor-profile.form.fullName',
              })}
            />
          </Form.Item>
          <Form.Item
            className="code"
            label={intl.formatMessage({
              id: 'doctor-profile.form.code',
            })}
            name={'code'}
            rules={ValidateLibrary(intl).userCode}
          >
            <CustomInput
              placeholder={intl.formatMessage({
                id: 'doctor-profile.form.code',
              })}
            />
          </Form.Item>
        </div>
        <div className="doctor-info__content__rows">
          <Form.Item
            className="email"
            label={intl.formatMessage({
              id: 'doctor-profile.form.email',
            })}
            name={'emailAddress'}
            rules={ValidateLibrary(intl).email}
          >
            <CustomInput
              placeholder={intl.formatMessage({
                id: 'doctor-profile.form.email',
              })}
            />
          </Form.Item>
          <Form.Item
            className="phone"
            label={intl.formatMessage({
              id: 'doctor-profile.form.phone',
            })}
            name={'phoneNumber'}
            rules={ValidateLibrary(intl).phoneNumber}
          >
            <CustomInput
              placeholder={intl.formatMessage({
                id: 'doctor-profile.form.phone',
              })}
            />
          </Form.Item>
        </div>
        <div className={'doctor-info__content__rows'}>
          <Form.Item
            className="category"
            label={intl.formatMessage({
              id: 'doctor.create.info.specialist',
            })}
            name={'category'}
            rules={ValidateLibrary(intl).specialist}
          >
            <CustomSelect
              placeholder={intl.formatMessage({ id: 'doctor.create.info.specialist' })}
              maxTagCount={2}
              showSearch={false}
              mode="multiple"
              // options={category?.flatMap((item) => {
              //   return { value: item.id, label: item.name } as DefaultOptionType;
              // }
              // )}
            />
          </Form.Item>
        </div>
      </div>
    </div>
  );
};

export default DoctorInfo;
