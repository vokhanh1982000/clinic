import { Card, DatePicker, Form, message, Upload } from 'antd';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import IconSVG from '../../../components/icons/icons';
import CustomInput from '../../../components/input/CustomInput';
import CustomSelect from '../../../components/select/CustomSelect';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import FormWrap from '../../../components/FormWrap';
import CustomButton from '../../../components/buttons/CustomButton';
import { AdministratorClinic, Cadastral, UpdateAdminClinicDto } from '../../../apis/client-axios';
import { adminClinicApi, authApi, cadastralApi } from '../../../apis';
import dayjs from 'dayjs';

const AdminClinicProfile = () => {
  const intl = useIntl();
  const { id } = useParams();
  const [form] = Form.useForm<any>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isDeleteDoctor, setIsDeleteDoctor] = useState<boolean>(false);
  const [avatar, setAvatar] = useState<string>();
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

  const { data: adminClinicProfile } = useQuery({
    queryKey: ['adminClinicProfile'],
    queryFn: () => authApi.authControllerAdminClinicMe(),
  });

  const { mutate: updateAdminClinic, status: statusUpdateAdminClinic } = useMutation(
    (updateAdministratorClinicDto: UpdateAdminClinicDto) =>
      adminClinicApi.administratorClinicControllerUpdateMe(updateAdministratorClinicDto),
    {
      onSuccess: ({ data }) => {
        queryClient.invalidateQueries(['adminClinicProfile']);
      },
      onError: (error) => {
        message.error(intl.formatMessage({ id: 'admin-clinic.update.error' }));
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
    const adminClinic: AdministratorClinic | undefined = adminClinicProfile?.data;
    form.setFieldsValue({
      ...adminClinic,
      dateOfBirth: adminClinic?.dateOfBirth ? dayjs(adminClinic?.dateOfBirth, 'DD/MM/YYYY') : undefined,
    });
    setSelectedProvince(adminClinic?.province);
    setSelectedDistrict(adminClinic?.district);
    setSelectedWard(adminClinic?.ward);
  }, [adminClinicProfile]);

  const onFinish = () => {
    const data = form.getFieldsValue();
    data.dateOfBirth = data.dateOfBirth ? dayjs(data.dateOfBirth).format('DD/MM/YYYY') : null;
    updateAdminClinic(data);
  };

  return (
    <Card id="admin-clinic-profile-management">
      <div className="admin-clinic-profile-title">
        {intl.formatMessage({
          id: 'admin-clinic.title',
        })}
      </div>
      <FormWrap form={form} onFinish={onFinish} layout="vertical" className="form-admin-clinic">
        <Form.Item name={'id'} hidden={true}></Form.Item>
        <div className="admin-clinic-info">
          <div className="admin-clinic-info__header">
            <div className="admin-clinic-info__header__title">
              <div className="admin-clinic-info__header__title__label">
                {intl.formatMessage({
                  id: 'admin-clinic.title',
                })}
              </div>
              <div className="line-title"></div>
            </div>
          </div>
          <div className="admin-clinic-info__content">
            <div className="admin-clinic-info__content__avatar">
              <span className="admin-clinic-info__content__avatar__img">
                <Upload name={'avatar'}>
                  {avatar ? <img src={avatar} /> : <IconSVG type="avatar-default" />}
                  <span className="admin-clinic-info__content__avatar__camera">
                    <IconSVG type="camera" />
                  </span>
                </Upload>
              </span>
            </div>
            <div className="admin-clinic-info__content__info">
              <div className="admin-clinic-info__content__info__rows">
                <Form.Item
                  className="name"
                  label={intl.formatMessage({
                    id: 'admin-clinic.form.fullName',
                  })}
                  name={'fullName'}
                  rules={[{ required: true }]}
                >
                  <CustomInput />
                </Form.Item>
                <Form.Item
                  className="code"
                  label={intl.formatMessage({
                    id: 'admin-clinic.form.code',
                  })}
                  name={'code'}
                  rules={[{ required: true }]}
                >
                  <CustomInput />
                </Form.Item>
              </div>
              <div className="admin-clinic-info__content__info__rows">
                <Form.Item
                  className="email"
                  label={intl.formatMessage({
                    id: 'admin-clinic.form.email',
                  })}
                  name={'emailAddress'}
                  rules={[{ required: true }]}
                >
                  <CustomInput />
                </Form.Item>
                <Form.Item
                  className="phone"
                  label={intl.formatMessage({
                    id: 'admin-clinic.form.phone',
                  })}
                  name={'phoneNumber'}
                  rules={[{ required: true }]}
                >
                  <CustomInput />
                </Form.Item>
              </div>

              <div className="admin-clinic-info__content__info__rows">
                <Form.Item
                  className="dob"
                  label={intl.formatMessage({
                    id: 'admin-clinic.form.dob',
                  })}
                  name={'dateOfBirth'}
                  rules={[{ required: true }]}
                >
                  <DatePicker format={'DD/MM/YYYY'} />
                  {/* <TimePicker.RangePicker format={FORMAT_TIME} /> */}
                </Form.Item>
                <Form.Item
                  className="gender"
                  label={intl.formatMessage({
                    id: 'admin-clinic.form.gender',
                  })}
                  name={'gender'}
                  rules={[{ required: true }]}
                >
                  <CustomSelect
                    options={[
                      {
                        value: 'male',
                        label: intl.formatMessage({
                          id: 'common.gender.male',
                        }),
                      },
                      {
                        value: 'female',
                        label: intl.formatMessage({
                          id: 'common.gender.female',
                        }),
                      },
                    ]}
                  />
                </Form.Item>
              </div>
              <div className="admin-clinic-info__content__info__rows">
                <Form.Item
                  className="province"
                  label={intl.formatMessage({
                    id: 'admin-clinic.form.province',
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
                    id: 'admin-clinic.form.district',
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
              <div className="admin-clinic-info__content__info__rows">
                <Form.Item
                  className={'ward'}
                  label={intl.formatMessage({
                    id: 'admin-clinic.form.ward',
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
                    id: 'admin-clinic.form.address',
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

        <div className={'action-wrap'}>
          <div className="button-action">
            {id ? (
              <div className="more-action">
                <CustomButton className="button-save" onClick={() => form.submit()}>
                  {intl.formatMessage({
                    id: 'admin-clinic.edit.button.save',
                  })}
                </CustomButton>
                <CustomButton
                  className="button-delete"
                  onClick={() => {
                    setIsDeleteDoctor(true);
                  }}
                >
                  {intl.formatMessage({
                    id: 'admin-clinic.edit.button.delete',
                  })}
                </CustomButton>
              </div>
            ) : (
              <div className="more-action">
                <CustomButton className="button-create" onClick={() => form.submit()}>
                  {intl.formatMessage({
                    id: 'admin-clinic.button-save',
                  })}
                </CustomButton>
                <CustomButton
                  className="button-cancel"
                  onClick={() => {
                    navigate(-1);
                  }}
                >
                  {intl.formatMessage({
                    id: 'admin-clinic.button-cancelled',
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

export default AdminClinicProfile;