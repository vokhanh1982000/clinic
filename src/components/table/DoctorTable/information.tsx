import { DatePicker, Form, Switch } from 'antd';
import React, { useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import IconSVG from '../../icons/icons';
import CustomInput from '../../input/CustomInput';
import CustomSelect from '../../select/CustomSelect';
import { DoctorType, UserGender } from '../../../constants/enum';
import { useNavigate, useParams } from 'react-router-dom';
import { Category, CreateCategoryDto, CreateDoctorClinicDto } from '../../../apis/client-axios';
import { DefaultOptionType } from 'antd/es/select';

interface DoctorTableProps {
  placeHolder?: string;
  doctorType: DoctorType;
  n: any;
  category: Category[] | undefined;
}

interface OptionSpecialist {
  id: string;
  label: string;
}

interface OptionStatus {
  id: string;
  label: string;
}

const DoctorInfo = (props: DoctorTableProps) => {
  const intl = useIntl();
  const { placeHolder, doctorType, n, category } = props;
  const navigate = useNavigate();
  const [specialistSelect, setSpecialistSelect] = useState<OptionSpecialist>();
  const [statusSelect, setStatusSelect] = useState<OptionStatus>();
  const [avatar, setAvatar] = useState<string>();
  const id = useParams();
  const regexPhone = useRef(/^(0[1-9][0-9]{8}|0[1-9][0-9]{9}|84[1-9][0-9]{8}|84[1-9][0-9]{9})$/);

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
              name={n('fullName')}
              rules={[{ required: true }]}
            >
              <CustomInput />
            </Form.Item>
            <Form.Item
              className="code"
              label={intl.formatMessage({
                id: 'doctor.create.info.code',
              })}
              name={n('code')}
              rules={[{ required: true }]}
            >
              <CustomInput disabled={!id} />
            </Form.Item>
          </div>
          <div className="doctor-info__content__info__rows">
            <Form.Item
              className="email"
              label={intl.formatMessage({
                id: 'doctor.create.info.email',
              })}
              name={n('emailAddress')}
              rules={[
                { required: true },
                { type: 'email', message: intl.formatMessage({ id: 'admin.user.email.message' }) },
              ]}
            >
              <CustomInput />
            </Form.Item>
            <Form.Item
              className="phone"
              label={intl.formatMessage({
                id: 'doctor.create.info.phone',
              })}
              name={n('phoneNumber')}
              rules={[
                { required: true },
                {
                  pattern: regexPhone.current,
                  message: intl.formatMessage({ id: 'admin.user.phone.message' }),
                },
              ]}
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
              name={n('dateOfBirth')}
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
              name={n('gender')}
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
              name={n('categoryIds')}
              rules={[{ required: true }]}
            >
              <CustomSelect
                mode="multiple"
                options={category?.flatMap((item) => {
                  return { value: item.id, label: item.name } as DefaultOptionType;
                })}
              />
            </Form.Item>
          </div>
          <div className="doctor-info__content__info__rows">
            <Form.Item
              className="level block"
              label={intl.formatMessage({
                id: 'doctor.create.info.level',
              })}
              name={n('level')}
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
              name={n('status')}
              rules={[{ required: true }]}
            >
              <CustomSelect
                options={[
                  {
                    value: 1,
                    label: intl.formatMessage({
                      id: 'common.active',
                    }),
                  },
                  {
                    value: 0,
                    label: intl.formatMessage({
                      id: 'common.inactive',
                    }),
                  },
                ]}
              />
            </Form.Item>
            {doctorType === DoctorType.DOCTOR_SUPPORT && (
              <Form.Item
                className="request block"
                label={intl.formatMessage({
                  id: 'doctor.create.info.request',
                })}
                name={n('totalRequestReceniver')}
                rules={[{ required: true }]}
              >
                <CustomInput />
              </Form.Item>
            )}
          </div>
          {!id.id && (
            <div className="doctor-info__content__info__rows">
              <Form.Item
                className="password block"
                label={intl.formatMessage({
                  id: 'doctor.create.info.password',
                })}
                name={n('password')}
                rules={[{ required: true }]}
              >
                <CustomInput isPassword={true} />
              </Form.Item>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorInfo;
