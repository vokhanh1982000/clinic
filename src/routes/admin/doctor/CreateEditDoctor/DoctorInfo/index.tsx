import { DatePicker, Form, Switch } from 'antd';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import IconSVG from '../../../../../components/icons/icons';
import CustomInput from '../../../../../components/input/CustomInput';
import CustomSelect from '../../../../../components/select/CustomSelect';
import { UserGender } from '../../../../../constants/enum';

const DoctorInfo = () => {
  const intl = useIntl();
  const [avatar, setAvatar] = useState<string>();
  return (
    <div className="doctor-info">
      <div className="doctor-info__header">
        <div className="doctor-info__header__title">
          <div className="doctor-info__header__title__label">
            {intl.formatMessage({
              id: 'doctor.create.info.title',
            })}
          </div>
          <div className="line-title"></div>
        </div>
      </div>
      <div className="doctor-info__content">
        <div className="doctor-info__content__avatar">
          <span className="doctor-info__content__avatar__img">
            {avatar ? <img src={avatar} /> : <IconSVG type="avatar-default" />}
            <span className="doctor-info__content__avatar__camera">
              <IconSVG type="camera" />
            </span>
          </span>
        </div>
        <div className="doctor-info__content__info">
          <div className="doctor-info__content__info__rows">
            <Form.Item
              className="name"
              label={intl.formatMessage({
                id: 'doctor.create.info.name',
              })}
              name={'name'}
              rules={[{ required: true }]}
            >
              <CustomInput />
            </Form.Item>
            <Form.Item
              className="code"
              label={intl.formatMessage({
                id: 'doctor.create.info.code',
              })}
              name={'code'}
              rules={[{ required: true }]}
            >
              <CustomInput disabled />
            </Form.Item>
          </div>
          <div className="doctor-info__content__info__rows">
            <Form.Item
              className="email"
              label={intl.formatMessage({
                id: 'doctor.create.info.email',
              })}
              name={'email'}
              rules={[{ required: true }]}
            >
              <CustomInput />
            </Form.Item>
            <Form.Item
              className="phone"
              label={intl.formatMessage({
                id: 'doctor.create.info.phone',
              })}
              name={'phone'}
              rules={[{ required: true }]}
            >
              <CustomInput />
            </Form.Item>
          </div>

          <div className="doctor-info__content__info__rows">
            <Form.Item
              className="dob"
              label={intl.formatMessage({
                id: 'doctor.create.info.dob',
              })}
              name={'dob'}
              rules={[{ required: true }]}
            >
              <DatePicker />
              {/* <TimePicker.RangePicker format={FORMAT_TIME} /> */}
            </Form.Item>
            <Form.Item
              className="gender"
              label={intl.formatMessage({
                id: 'doctor.create.info.gender',
              })}
              name={'gender'}
              rules={[{ required: true }]}
            >
              <CustomSelect
                options={[
                  {
                    value: UserGender.MALE,
                    label: intl.formatMessage({
                      id: 'common.gender.male',
                    }),
                  },
                  {
                    value: UserGender.FEMALE,
                    label: intl.formatMessage({
                      id: 'common.gender.female',
                    }),
                  },
                ]}
              />
            </Form.Item>
          </div>
          <div className="doctor-info__content__info__rows">
            <Form.Item
              className="specialist block"
              label={intl.formatMessage({
                id: 'doctor.create.info.specialist',
              })}
              name={'specialist'}
              rules={[{ required: true }]}
            >
              <CustomSelect
                options={[
                  {
                    value: 'active',
                    label: intl.formatMessage({
                      id: 'common.active',
                    }),
                  },
                  {
                    value: 'inactive',
                    label: intl.formatMessage({
                      id: 'common.inactive',
                    }),
                  },
                ]}
              />
            </Form.Item>
          </div>
          <div className="doctor-info__content__info__rows">
            <Form.Item
              className="level block"
              label={intl.formatMessage({
                id: 'doctor.create.info.level',
              })}
              name={'level'}
              rules={[{ required: true }]}
            >
              <CustomInput />
            </Form.Item>
          </div>
          <div className="doctor-info__content__info__rows">
            <Form.Item
              className="status block"
              label={intl.formatMessage({
                id: 'doctor.create.info.status',
              })}
              name={'status'}
              rules={[{ required: true }]}
            >
              <CustomSelect
                options={[
                  {
                    value: 'active',
                    label: intl.formatMessage({
                      id: 'common.active',
                    }),
                  },
                  {
                    value: 'inactive',
                    label: intl.formatMessage({
                      id: 'common.inactive',
                    }),
                  },
                ]}
              />
            </Form.Item>
            <Form.Item
              className="request"
              label={intl.formatMessage({
                id: 'doctor.create.info.request',
              })}
              name={'request'}
              rules={[{ required: true }]}
            >
              <CustomInput />
            </Form.Item>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorInfo;
