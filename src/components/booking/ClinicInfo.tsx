import React from 'react';
import { IntlShape } from 'react-intl';
import useIntl from '../../util/useIntl';
import { Form, FormInstance, Select } from 'antd';
import CustomInput from '../input/CustomInput';
import CustomSelect from '../select/CustomSelect';
import { Clinic, DoctorClinic } from '../../apis/client-axios';
import { DefaultOptionType } from 'antd/es/select';

interface ClinicInfoProps {
  form: FormInstance;
  clinic?: Clinic;
  setDoctorClinic: Function;
  doctorClinic?: DoctorClinic;
}
const ClinicInfo = (props: ClinicInfoProps) => {
  const intl: IntlShape = useIntl();
  const { form, clinic, doctorClinic, setDoctorClinic } = props;
  const listDoctor: Array<DoctorClinic> | undefined = clinic?.doctorClinics;
  return (
    <div className={'clinic-info'}>
      <div className="clinic-info__header">
        <div className="clinic-info__header__title">
          <div className="clinic-info__header__title__label">
            {intl.formatMessage({
              id: 'booking.doctor.title',
            })}
          </div>
          <div className="line-title"></div>
        </div>
      </div>
      <div className={'clinic-info__content'}>
        <div className="clinic-info__content__rows">
          <Form.Item
            className="name"
            label={intl.formatMessage({
              id: 'doctor-profile.form.fullName',
            })}
          >
            <CustomSelect
              placeholder={intl.formatMessage({
                id: 'doctor-profile.form.fullName',
              })}
              onChange={(value, option) => {
                form.setFieldValue('doctorClinicId', value);
                setDoctorClinic(listDoctor?.find((item) => item.id === value));
              }}
              defaultValue={doctorClinic?.id}
              value={doctorClinic?.fullName}
            >
              {listDoctor?.map((item: DoctorClinic) => {
                return <Select.Option value={item.id}>{item.fullName}</Select.Option>;
              })}
            </CustomSelect>
          </Form.Item>
          <Form.Item
            className="code"
            label={intl.formatMessage({
              id: 'doctor-profile.form.code',
            })}
          >
            <CustomInput
              disabled={true}
              placeholder={intl.formatMessage({
                id: 'doctor-profile.form.code',
              })}
              value={doctorClinic?.code}
            />
          </Form.Item>
        </div>
        <div className="clinic-info__content__rows">
          <Form.Item
            className="email"
            label={intl.formatMessage({
              id: 'doctor-profile.form.email',
            })}
          >
            <CustomInput
              disabled={true}
              placeholder={intl.formatMessage({
                id: 'doctor-profile.form.email',
              })}
              value={doctorClinic?.emailAddress}
            />
          </Form.Item>
          <Form.Item
            className="phone"
            label={intl.formatMessage({
              id: 'doctor-profile.form.phone',
            })}
          >
            <CustomInput
              disabled={true}
              placeholder={intl.formatMessage({
                id: 'doctor-profile.form.phone',
              })}
              value={doctorClinic?.phoneNumber}
            />
          </Form.Item>
        </div>
        <div className={'clinic-info__content__rows'}>
          <Form.Item
            className="category"
            label={intl.formatMessage({
              id: 'doctor.create.info.specialist',
            })}
          >
            <CustomSelect
              disabled={true}
              placeholder={intl.formatMessage({ id: 'doctor.create.info.specialist' })}
              maxTagCount={2}
              showSearch={false}
              mode="multiple"
              value={doctorClinic?.categories?.map((item) => {
                return { value: item.id, label: item.name } as DefaultOptionType;
              })}
            />
          </Form.Item>
        </div>
      </div>
    </div>
  );
};

export default ClinicInfo;
