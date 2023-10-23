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
import { adminClinicApi, assetsApi, authApi, cadastralApi } from '../../../apis';
import dayjs from 'dayjs';
import { UserGender } from '../../../constants/enum';
import { FORMAT_DATE } from '../../../constants/common';
import { ValidateLibrary } from '../../../validate';
import UploadAvatar from '../../../components/upload/UploadAvatar';
import { MyUploadProps } from '../../../constants/dto';
import { regexImage } from '../../../validate/validator.validate';

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
  const [loadingImg, setLoadingImg] = useState<boolean>(false);

  const { data: listProvince } = useQuery({
    queryKey: ['listProvince'],
    queryFn: () => cadastralApi.cadastralControllerGetProvince(),
  });

  const { data: listDistrict } = useQuery({
    queryKey: ['listDistrict', selectedProvince],
    queryFn: () => cadastralApi.cadastralControllerGetDistrictByProvinceId(selectedProvince?.id, undefined),
    enabled: !!selectedProvince,
  });

  const { data: listWard } = useQuery({
    queryKey: ['listWard', selectedDistrict],
    queryFn: () => cadastralApi.cadastralControllerGetWardByDistrictId(undefined, selectedDistrict?.id),
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
        queryClient.invalidateQueries(['adminClinicMe']);
        message.success(intl.formatMessage({ id: 'common.updateSuccess' }));
      },
      onError: (error) => {
        message.error(intl.formatMessage({ id: 'message.update-profile.fail' }));
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
      dateOfBirth: adminClinic?.dateOfBirth ? dayjs(adminClinic?.dateOfBirth) : null,
    });
    if (adminClinic?.avatar) {
      setAvatar(process.env.REACT_APP_URL_IMG_S3 + adminClinic?.avatar.preview);
    }
    setSelectedProvince(adminClinic?.province);
    setSelectedDistrict(adminClinic?.district);
    setSelectedWard(adminClinic?.ward);
  }, [adminClinicProfile]);

  const onFinish = () => {
    const data = form.getFieldsValue();
    data.dateOfBirth = data.dateOfBirth ? dayjs(data.dateOfBirth).format(FORMAT_DATE) : null;
    updateAdminClinic(data);
  };

  const { mutate: UploadImage, status: statusUploadImage } = useMutation(
    (uploadProps: MyUploadProps) =>
      assetsApi.assetControllerUploadFile(uploadProps.file, undefined, uploadProps.s3FilePath),
    {
      onSuccess: ({ data }) => {
        const newData = data as any;
        form.setFieldValue('avatarId', newData.id);
        setAvatar(process.env.REACT_APP_URL_IMG_S3 + newData.preview);
        setLoadingImg(false);
      },
      onError: (error: any) => {
        setLoadingImg(false);
        message.error(
          intl.formatMessage({
            id: 'error.IMAGE_INVALID',
          })
        );
      },
    }
  );

  const customRequest = async (options: any) => {
    const { file, onSuccess, onError } = options;
    if (!file || !regexImage.test(file.name)) {
      message.error(
        intl.formatMessage({
          id: 'error.IMAGE_INVALID',
        })
      );
      return;
    }
    setLoadingImg(true);
    UploadImage({ file, assetFolderId: undefined, s3FilePath: 'avatar' });
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
                  id: 'admin-clinic.form.title',
                })}
              </div>
              <div className="line-title"></div>
            </div>
          </div>
          <div className="admin-clinic-info__content">
            <UploadAvatar avatar={avatar} loadingImg={loadingImg} customRequest={customRequest} />
            <div className="admin-clinic-info__content__info">
              <div className="admin-clinic-info__content__info__rows">
                <Form.Item
                  className="name"
                  label={intl.formatMessage({
                    id: 'admin-clinic.form.fullName',
                  })}
                  name={'fullName'}
                  rules={ValidateLibrary(intl).fullName}
                >
                  <CustomInput
                    maxLength={36}
                    placeholder={intl.formatMessage({
                      id: 'admin-clinic.form.fullName',
                    })}
                  />
                </Form.Item>
                <Form.Item
                  className="code"
                  label={intl.formatMessage({
                    id: 'admin-clinic.form.code',
                  })}
                  name={'code'}
                  rules={ValidateLibrary(intl).staffCode}
                >
                  <CustomInput
                    placeholder={intl.formatMessage({
                      id: 'admin-clinic.form.code',
                    })}
                  />
                </Form.Item>
              </div>
              <div className="admin-clinic-info__content__info__rows">
                <Form.Item
                  className="email"
                  label={intl.formatMessage({
                    id: 'admin-clinic.form.email',
                  })}
                  name={'emailAddress'}
                  rules={ValidateLibrary(intl).email}
                >
                  <CustomInput
                    placeholder={intl.formatMessage({
                      id: 'admin-clinic.form.email',
                    })}
                  />
                </Form.Item>
                <Form.Item
                  className="phone"
                  label={intl.formatMessage({
                    id: 'admin-clinic.form.phone',
                  })}
                  name={'phoneNumber'}
                  rules={ValidateLibrary(intl).phoneNumber}
                >
                  <CustomInput
                    placeholder={intl.formatMessage({
                      id: 'admin-clinic.form.phone',
                    })}
                  />
                </Form.Item>
              </div>

              <div className="admin-clinic-info__content__info__rows">
                <Form.Item
                  className="dob"
                  label={intl.formatMessage({
                    id: 'admin-clinic.form.dob',
                  })}
                  name={'dateOfBirth'}
                  rules={ValidateLibrary(intl).dob}
                >
                  <DatePicker
                    format={FORMAT_DATE}
                    disabledDate={(current) => {
                      const today = dayjs();
                      return current && dayjs(current).isAfter(today, 'day');
                    }}
                    placeholder={intl.formatMessage({
                      id: 'admin-clinic.form.dob',
                    })}
                  />
                  {/* <TimePicker.RangePicker format={FORMAT_TIME} /> */}
                </Form.Item>
                <Form.Item
                  className="gender"
                  label={intl.formatMessage({
                    id: 'admin-clinic.form.gender',
                  })}
                  name={'gender'}
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
                    placeholder={intl.formatMessage({
                      id: 'admin-clinic.form.gender',
                    })}
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
                    placeholder={intl.formatMessage({
                      id: 'admin-clinic.form.province',
                    })}
                  />
                </Form.Item>
                <Form.Item
                  className="district"
                  label={intl.formatMessage({
                    id: 'admin-clinic.form.district',
                  })}
                  name={'districtId'}
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
                    placeholder={intl.formatMessage({
                      id: 'admin-clinic.form.district',
                    })}
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
                    placeholder={intl.formatMessage({
                      id: 'admin-clinic.form.ward',
                    })}
                  />
                </Form.Item>
                <Form.Item
                  className="level"
                  label={intl.formatMessage({
                    id: 'admin-clinic.form.address',
                  })}
                  name={'address'}
                  rules={ValidateLibrary(intl).space}
                >
                  <CustomInput
                    placeholder={intl.formatMessage({
                      id: 'admin-clinic.form.address',
                    })}
                  />
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
                {/*<CustomButton*/}
                {/*  className="button-cancel"*/}
                {/*  onClick={() => {*/}
                {/*    navigate(-1);*/}
                {/*  }}*/}
                {/*>*/}
                {/*  {intl.formatMessage({*/}
                {/*    id: 'admin-clinic.button-cancelled',*/}
                {/*  })}*/}
                {/*</CustomButton>*/}
              </div>
            )}
          </div>
        </div>
      </FormWrap>
    </Card>
  );
};

export default AdminClinicProfile;
