import { Card, DatePicker, Form, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import IconSVG from '../../../components/icons/icons';
import CustomInput from '../../../components/input/CustomInput';
import CustomSelect from '../../../components/select/CustomSelect';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import FormWrap from '../../../components/FormWrap';
import CustomButton from '../../../components/buttons/CustomButton';
import CustomArea from '../../../components/input/CustomArea';
import { Cadastral, Category, DoctorClinic, UpdateDoctorClinicDto } from '../../../apis/client-axios';
import { authApi, cadastralApi, categoryApi, doctorClinicApi } from '../../../apis';
import dayjs from 'dayjs';
import { UserGender } from '../../../constants/enum';

const DoctorProfile = () => {
  const intl = useIntl();
  const { id } = useParams();
  const [form] = Form.useForm<any>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isDeleteDoctor, setIsDeleteDoctor] = useState<boolean>(false);
  const [avatar, setAvatar] = useState<string>();
  // const [provinceList, setProvinceList] = useState<Cadastral>();
  // const [districtList, setDistrictList] = useState<Cadastral>();
  // const [wardList, setWardList] = useState<Cadastral>();

  const [selectedProvince, setSelectedProvince] = useState<Cadastral>();
  const [selectedDistrict, setSelectedDistrict] = useState<Cadastral>();
  const [selectedWard, setSelectedWard] = useState<Cadastral>();

  const { data: listProvince } = useQuery({
    queryKey: ['listProvince'],
    queryFn: () => cadastralApi.cadastralControllerGetProvince(),
  });

  const { data: listDistrict } = useQuery({
    queryKey: ['listDistrict', selectedProvince],
    queryFn: () => cadastralApi.cadastralControllerGetDistrictByProvince(undefined, selectedProvince?.baseCode),
    enabled: !!selectedProvince,
  });

  const { data: listWard } = useQuery({
    queryKey: ['listWard', selectedDistrict],
    queryFn: () => cadastralApi.cadastralControllerGetWardByCode(undefined, undefined, selectedDistrict?.baseCode),
    enabled: !!selectedDistrict,
  });

  const { data: listCategory } = useQuery({
    queryKey: ['listCategory'],
    queryFn: () => categoryApi.categoryControllerFindCategory(1, 999),
  });

  const { data: doctorProfile } = useQuery({
    queryKey: ['doctorProfile'],
    queryFn: () => authApi.authControllerDoctorClinicMe(),
    // refetchOnWindowFocus: false,
  });

  const { mutate: updateDoctorProfile, status: statusUpdateDoctorProfile } = useMutation(
    (updateDoctorClinicDto: UpdateDoctorClinicDto) =>
      doctorClinicApi.doctorClinicControllerUpdateDoctorClinicForMe(updateDoctorClinicDto),
    {
      onSuccess: ({ data }) => {
        queryClient.invalidateQueries(['doctorProfile']);
      },
      onError: (error) => {
        message.error(intl.formatMessage({ id: 'doctor.update.error' }));
      },
    }
  );

  const handleSelectProvince = (value: any, option: any) => {
    setSelectedProvince(option.item);
    setSelectedDistrict(undefined);
    setSelectedWard(undefined);
    form.setFieldsValue({
      districtId: undefined,
      wardId: undefined,
    });
  };

  const handleSelectDistrict = (value: any, option: any) => {
    setSelectedDistrict(option.item);
    setSelectedWard(undefined);
    form.setFieldsValue({
      wardId: undefined,
    });
  };

  useEffect(() => {
    const doctor: DoctorClinic | undefined = doctorProfile?.data;
    form.setFieldsValue({
      ...doctor,
      dateOfBirth: doctor?.dateOfBirth ? dayjs(doctor.dateOfBirth, 'YYYY-MM-DD') : null,
      status: doctor?.status ? Number(doctor.status) : 0,
      categoryIds: doctor?.categories?.map((item) => {
        return item.id;
      }),
    });
    setSelectedProvince(doctor?.province);
    setSelectedDistrict(doctor?.district);
    setSelectedWard(doctor?.ward);
  }, [doctorProfile]);

  const onFinish = () => {
    const data = form.getFieldsValue();
    data.dateOfBirth = data.dateOfBirth ? dayjs(data.dateOfBirth).format('YYYY-MM-DD') : null;
    console.log(data);
    updateDoctorProfile(data);
  };

  return (
    <Card id="doctor-profile-management">
      <div className="doctor-profile-title">
        {intl.formatMessage({
          id: 'doctor-profile.title',
        })}
      </div>
      <FormWrap form={form} onFinish={onFinish} layout="vertical" className="form-doctor-profile">
        <Form.Item name={'id'} hidden={true}></Form.Item>
        <div className="doctor-info">
          <div className="doctor-info__header">
            <div className="doctor-info__header__title">
              <div className="doctor-info__header__title__label">
                {intl.formatMessage({
                  id: 'doctor-profile.title',
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
                    id: 'doctor-profile.form.fullName',
                  })}
                  name={'fullName'}
                  rules={[{ required: true }]}
                >
                  <CustomInput />
                </Form.Item>
                <Form.Item
                  className="code"
                  label={intl.formatMessage({
                    id: 'doctor-profile.form.code',
                  })}
                  name={'code'}
                  rules={[{ required: true }]}
                >
                  <CustomInput />
                </Form.Item>
              </div>
              <div className="doctor-info__content__info__rows">
                <Form.Item
                  className="email"
                  label={intl.formatMessage({
                    id: 'doctor-profile.form.email',
                  })}
                  name={'emailAddress'}
                  rules={[{ required: true }]}
                >
                  <CustomInput />
                </Form.Item>
                <Form.Item
                  className="phone"
                  label={intl.formatMessage({
                    id: 'doctor-profile.form.phone',
                  })}
                  name={'phoneNumber'}
                  rules={[{ required: true }]}
                >
                  <CustomInput />
                </Form.Item>
              </div>

              <div className="doctor-info__content__info__rows">
                <Form.Item
                  className="dob"
                  label={intl.formatMessage({
                    id: 'doctor-profile.form.dob',
                  })}
                  name={'dateOfBirth'}
                  rules={[{ required: true }]}
                >
                  <DatePicker format={'YYYY-MM-DD'} />
                  {/* <TimePicker.RangePicker format={FORMAT_TIME} /> */}
                </Form.Item>
                <Form.Item
                  className="gender"
                  label={intl.formatMessage({
                    id: 'doctor-profile.form.gender',
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
                  className="category"
                  label={intl.formatMessage({
                    id: 'doctor-profile.form.category',
                  })}
                  name={'categoryIds'}
                  rules={[{ required: true }]}
                >
                  <CustomSelect
                    mode={'multiple'}
                    options={listCategory?.data?.content?.map((item: Category) => {
                      return {
                        label: item.name,
                        value: item.id,
                      };
                    })}
                  />
                </Form.Item>
              </div>
              <div className="doctor-info__content__info__rows"></div>
              <div className="doctor-info__content__info__rows">
                <Form.Item
                  className="level"
                  label={intl.formatMessage({
                    id: 'doctor-profile.form.level',
                  })}
                  name={'level'}
                  rules={[{ required: true }]}
                >
                  <CustomInput />
                </Form.Item>
                <Form.Item
                  className="status"
                  label={intl.formatMessage({
                    id: 'doctor-profile.form.status',
                  })}
                  name={'status'}
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
              </div>
              <div className="doctor-info__content__info__rows">
                <Form.Item
                  className="province"
                  label={intl.formatMessage({
                    id: 'doctor-profile.form.province',
                  })}
                  name={'provinceId'}
                  rules={[{ required: true }]}
                >
                  <CustomSelect
                    options={listProvince?.data.map((item: Cadastral) => {
                      return {
                        label: item.name,
                        value: item.id,
                        item,
                      };
                    })}
                    onChange={handleSelectProvince}
                    value={selectedProvince?.id}
                  />
                </Form.Item>
                <Form.Item
                  className="district"
                  label={intl.formatMessage({
                    id: 'doctor-profile.form.district',
                  })}
                  name={'districtId'}
                  rules={[{ required: true }]}
                >
                  <CustomSelect
                    options={listDistrict?.data.map((item: Cadastral) => {
                      return {
                        label: item.name,
                        value: item.id,
                        item,
                      };
                    })}
                    onChange={handleSelectDistrict}
                    value={selectedDistrict?.id || undefined}
                  />
                </Form.Item>
              </div>
              <div className="doctor-info__content__info__rows">
                <Form.Item
                  className={'ward'}
                  label={intl.formatMessage({
                    id: 'doctor-profile.form.ward',
                  })}
                  name={'wardId'}
                  rules={[{ required: true }]}
                >
                  <CustomSelect
                    options={listWard?.data?.map((item: Cadastral) => {
                      return {
                        label: item.name,
                        value: item.id,
                        item,
                      };
                    })}
                    onChange={(value: string, option: any) => setSelectedWard(option.item)}
                    value={selectedWard?.id}
                  />
                </Form.Item>
                <Form.Item
                  className="level"
                  label={intl.formatMessage({
                    id: 'doctor-profile.form.address',
                  })}
                  name={'address'}
                  rules={[{ required: true }]}
                >
                  <CustomInput />
                </Form.Item>
              </div>
            </div>
          </div>
        </div>

        <div className={'achievement-wrap'}>
          <div className="achievement">
            <div className="achievement__history">
              <div className="achievement__history__title">
                <div className="achievement__history__title__label">
                  {intl.formatMessage({
                    id: 'doctor.create.achievement.history.title',
                  })}
                </div>
                <div className="line-title"></div>
              </div>
              <Form.Item className="name" name={'overview'} rules={[{ required: true }]}>
                <CustomArea rows={6} style={{ resize: 'none' }} />
              </Form.Item>
            </div>
            <div className="achievement__experiment">
              <div className="achievement__experiment__title">
                <div className="achievement__experiment__title__label">
                  {intl.formatMessage({
                    id: 'doctor.create.achievement.experiment.title',
                  })}
                </div>
                <div className="line-title"></div>
              </div>
              <Form.Item className="name" name={'experience'} rules={[{ required: true }]}>
                <CustomArea rows={6} style={{ resize: 'none' }} />
              </Form.Item>
            </div>
          </div>
          <div className="button-action">
            {id ? (
              <div className="more-action">
                <CustomButton className="button-save" onClick={() => form.submit()}>
                  {intl.formatMessage({
                    id: 'doctor.edit.button.save',
                  })}
                </CustomButton>
                <CustomButton
                  className="button-delete"
                  onClick={() => {
                    setIsDeleteDoctor(true);
                  }}
                >
                  {intl.formatMessage({
                    id: 'doctor.edit.button.delete',
                  })}
                </CustomButton>
              </div>
            ) : (
              <div className="more-action">
                <CustomButton className="button-create" onClick={() => form.submit()}>
                  {intl.formatMessage({
                    id: 'doctor-profile.button-save',
                  })}
                </CustomButton>
                <CustomButton
                  className="button-cancel"
                  onClick={() => {
                    navigate(-1);
                  }}
                >
                  {intl.formatMessage({
                    id: 'doctor-profile.button-cancelled',
                  })}
                </CustomButton>
              </div>
            )}
          </div>
        </div>
      </FormWrap>
    </Card>
  );
};

export default DoctorProfile;
