import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { IntlShape } from 'react-intl';
import useIntl from '../../util/useIntl';
import { Form, FormInstance, Select } from 'antd';
import CustomInput from '../input/CustomInput';
import { BookingStatusEnum, Clinic, DoctorClinic } from '../../apis/client-axios';
import { debounce } from 'lodash';
import IconSVG from '../icons/icons';
import dayjs from 'dayjs';
import CustomSearchSelect from '../input/CustomSearchSelect';
import { useQuery } from '@tanstack/react-query';
import { clinicsApi } from '../../apis';

interface ClinicInfoProps {
  form: FormInstance;
  clinic?: Clinic;
  setClinic: Dispatch<SetStateAction<Clinic | undefined>>;
  setDoctorClinic: Dispatch<SetStateAction<DoctorClinic | undefined>>;
  role: 'admin' | 'adminClinic' | 'doctor';
  type: 'create' | 'update';
  isSubmit?: boolean;
  status?: BookingStatusEnum;
}
const ClinicInfo = (props: ClinicInfoProps) => {
  const intl: IntlShape = useIntl();
  const { form, clinic, setDoctorClinic, setClinic, isSubmit, status, type }: ClinicInfoProps = props;
  const [listClinic, setListClinic] = useState<Clinic[]>();
  const [searchNameClinic, setSearchNameClinic] = useState<string>();

  const debouncedUpdateInputValue = debounce((value) => {
    if (!value.trim()) {
      setSearchNameClinic('');
    } else {
      setSearchNameClinic(value);
    }
  }, 500);

  const { data: listClinicData } = useQuery({
    queryKey: ['listClinicData', { searchNameClinic }],
    queryFn: () => {
      return clinicsApi.clinicControllerGetAllWithoutPaginate(searchNameClinic);
    },
  });

  useEffect(() => {
    setListClinic(listClinicData?.data);
  }, [listClinicData]);
  const isDisabled = () => {
    if (status === BookingStatusEnum.Pending && type === 'update') return false;
    return type !== 'create';
  };
  return (
    <div className={'clinic-info'}>
      <div className="clinic-info__header">
        <div className="clinic-info__header__title">
          <div className="clinic-info__header__title__label">
            {intl.formatMessage({
              id: 'booking.clinic.title',
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
              id: 'booking.clinic.fullName',
            })}
          >
            <CustomSearchSelect
              disabled={isDisabled()}
              suffixIcon={<IconSVG type={'dropdown'} />}
              placeholder={intl.formatMessage({
                id: 'booking.clinic.fullName',
              })}
              optionLabelProp={'label'}
              onSearch={debouncedUpdateInputValue}
              onChange={(value: string, option: any) => {
                setDoctorClinic(undefined);
                setClinic(listClinic?.find((item) => item.id === option?.key));
              }}
              allowClear={false}
              value={clinic?.fullName}
              key={clinic?.id}
            >
              {listClinic &&
                listClinic?.map((item: Clinic) => {
                  return (
                    <Select.Option value={item.fullName} key={item.id}>
                      <div className={'option-item'}>
                        <div className={'option-item__avatar'}>
                          <img
                            src={
                              item.avatar?.source
                                ? `${process.env.REACT_APP_URL_IMG_S3}${item.avatar?.source}`
                                : '/assets/images/background_default_clinic.svg'
                            }
                            alt={''}
                          />
                        </div>
                        <div className={'option-item__info'}>
                          <div className={'option-item__info__name'}>{item.fullName}</div>
                          <div className={'option-item__info__mail'}>{item.phoneClinic}</div>
                          <div className={'option-item__info__category'}>{item.address}</div>
                        </div>
                      </div>
                    </Select.Option>
                  );
                })}
            </CustomSearchSelect>
            {isSubmit && (clinic?.fullName?.trim() === '' || !clinic?.fullName) && (
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
              id: 'booking.clinic.code',
            })}
          >
            <CustomInput
              disabled={true}
              placeholder={intl.formatMessage({
                id: 'booking.clinic.code',
              })}
              value={clinic?.code}
            />
          </Form.Item>
        </div>
        <div className="clinic-info__content__rows">
          <Form.Item
            className="province"
            label={intl.formatMessage({
              id: 'booking.clinic.province',
            })}
          >
            <CustomInput
              disabled={true}
              placeholder={intl.formatMessage({
                id: 'booking.clinic.province',
              })}
              value={clinic?.province?.name}
              suffix={<IconSVG type={'dropdown'} />}
            />
          </Form.Item>
          <Form.Item
            className="district"
            label={intl.formatMessage({
              id: 'booking.clinic.district',
            })}
          >
            <CustomInput
              disabled={true}
              placeholder={intl.formatMessage({
                id: 'booking.clinic.district',
              })}
              value={clinic?.district?.name}
              suffix={<IconSVG type={'dropdown'} />}
            />
          </Form.Item>
        </div>
        <div className="clinic-info__content__rows">
          <Form.Item
            className="ward"
            label={intl.formatMessage({
              id: 'booking.clinic.ward',
            })}
          >
            <CustomInput
              disabled={true}
              placeholder={intl.formatMessage({
                id: 'booking.clinic.ward',
              })}
              value={clinic?.ward?.name}
              suffix={<IconSVG type={'dropdown'} />}
            />
          </Form.Item>
          <Form.Item
            className="address"
            label={intl.formatMessage({
              id: 'booking.clinic.address',
            })}
          >
            <CustomInput
              disabled={true}
              placeholder={intl.formatMessage({
                id: 'booking.clinic.address',
              })}
              value={clinic?.address}
            />
          </Form.Item>
        </div>
        <div className="clinic-info__content__rows">
          <Form.Item
            className="phone-full-width"
            label={intl.formatMessage({
              id: 'booking.clinic.phone',
            })}
          >
            <CustomInput
              disabled={true}
              placeholder={intl.formatMessage({
                id: 'booking.clinic.phone',
              })}
              value={clinic?.phoneClinic}
            />
          </Form.Item>
        </div>
        <div className="clinic-info__content__rows">
          <Form.Item
            className="work-time"
            label={intl.formatMessage({
              id: 'booking.clinic.work-time',
            })}
          >
            <CustomInput
              disabled={true}
              placeholder={intl.formatMessage({
                id: 'booking.clinic.work-time',
              })}
              value={(() => {
                const data: any = clinic?.workSchedules?.find(
                  (item) => item.day === dayjs(form.getFieldValue('appointmentStartTime')).day()
                );
                if (data?.amFrom && data?.pmTo) {
                  return `${data?.amFrom} - ${data?.pmTo}`;
                } else {
                  return '';
                }
              })()}
            />
          </Form.Item>
          <Form.Item
            className="status"
            label={intl.formatMessage({
              id: 'booking.clinic.status',
            })}
          >
            <CustomInput
              disabled={true}
              placeholder={intl.formatMessage({
                id: 'booking.clinic.status',
              })}
              value={intl.formatMessage({
                id: clinic?.status ? 'common.active' : 'common.inactive',
              })}
            />
          </Form.Item>
        </div>
      </div>
    </div>
  );
};

export default ClinicInfo;
