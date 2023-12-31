import React, { useEffect, useState } from 'react';
import { IntlShape } from 'react-intl';
import useIntl from '../../util/useIntl';
import { Form, FormInstance, Select } from 'antd';
import CustomInput from '../input/CustomInput';
import CustomSelect from '../select/CustomSelect';
import { AdministratorClinic, BookingStatusEnum, Clinic, DoctorClinic } from '../../apis/client-axios';
import { DefaultOptionType } from 'antd/es/select';
import { useQuery } from '@tanstack/react-query';
import { doctorClinicApi } from '../../apis';
import CustomSearchSelect from '../input/CustomSearchSelect';
import { debounce } from 'lodash';
import IconSVG from '../icons/icons';
import { useAppSelector } from '../../store';
import list from '../../routes/doctor/prescription-teamplate/list';
interface DoctorInfoProps {
  form: FormInstance;
  clinic?: Clinic;
  setDoctorClinic: Function;
  doctorClinic?: DoctorClinic;
  role?: 'admin' | 'adminClinic' | 'doctor';
  type?: 'create' | 'update';
  status?: BookingStatusEnum;
  defaultDoctorClinicId?: string | null;
}
const DoctorInfo = (props: DoctorInfoProps) => {
  const intl: IntlShape = useIntl();
  const { form, clinic, doctorClinic, setDoctorClinic, role, type, status, defaultDoctorClinicId }: DoctorInfoProps =
    props;
  const [listDoctor, setListDoctor] = useState<DoctorClinic[]>();
  const [searchNameDoctor, setSearchNameDoctor] = useState<string>();
  const user: AdministratorClinic = useAppSelector((state) => state.auth).authUser as AdministratorClinic;
  const { data: listDoctorData } = useQuery({
    queryKey: ['listDoctor', { searchNameDoctor, clinic, user }],
    queryFn: () => {
      return doctorClinicApi.doctorClinicControllerGetAllWithoutPaginate(searchNameDoctor, clinic?.id || user.clinicId);
    },
    enabled: !!clinic?.id || !!user.clinicId,
  });

  const debouncedUpdateInputValue = debounce((value) => {
    if (!value.trim()) {
      setSearchNameDoctor('');
    } else {
      setSearchNameDoctor(value);
    }
  }, 500);
  useEffect(() => {
    setListDoctor(listDoctorData?.data);
    if (type === 'create' && defaultDoctorClinicId) {
      setDoctorClinic(listDoctorData?.data.find((item) => item.id === defaultDoctorClinicId));
    }
  }, [listDoctorData, doctorClinic]);

  const isDisabled = () => {
    if ((role === 'adminClinic' || role === 'admin') && type === 'create') {
      return false;
    }
    return !(status === BookingStatusEnum.Pending && type === 'update');
  };
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
          >
            <CustomSearchSelect
              disabled={isDisabled()}
              suffixIcon={<IconSVG type={'dropdown'} />}
              placeholder={intl.formatMessage({
                id: 'doctor-profile.form.fullName',
              })}
              onSearch={debouncedUpdateInputValue}
              optionLabelProp={'label'}
              onChange={(value: string, option: any) => {
                setDoctorClinic(listDoctor?.find((item) => item.id === option?.key));
              }}
              defaultValue={doctorClinic?.id}
              value={doctorClinic?.fullName}
            >
              {listDoctor?.map((item: DoctorClinic) => {
                return (
                  <Select.Option value={item.fullName} key={item.id}>
                    <div className={'option-item'}>
                      <div className={'option-item__avatar'}>
                        <img
                          src={
                            item.avatar?.source
                              ? `${process.env.REACT_APP_URL_IMG_S3}${item.avatar?.source}`
                              : '/assets/images/user_default.svg'
                          }
                          alt={''}
                        />
                      </div>
                      <div className={'option-item__info'}>
                        <div className={'option-item__info__name'}>{item.fullName}</div>
                        <div className={'option-item__info__mail'}>{item.emailAddress}</div>
                        <div className={'option-item__info__category'}>{item.address}</div>
                      </div>
                    </div>
                  </Select.Option>
                );
              })}
            </CustomSearchSelect>
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
        <div className="doctor-info__content__rows">
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
        <div className={'doctor-info__content__rows'}>
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

export default DoctorInfo;
