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
import { assetsApi, authApi, cadastralApi, categoryApi, doctorClinicApi } from '../../../apis';
import dayjs from 'dayjs';
import { UserGender } from '../../../constants/enum';
import { FORMAT_DATE } from '../../../constants/common';
import { ValidateLibrary } from '../../../validate';
import { MyUploadProps } from '../../../constants/dto';
import { regexImage } from '../../../validate/validator.validate';
import UploadAvatar from '../../../components/upload/UploadAvatar';
import { CadastalCustom } from '../../../components/Cadastral';

const DoctorProfile = () => {
  const intl = useIntl();
  const { id } = useParams();
  const [form] = Form.useForm<any>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isDeleteDoctor, setIsDeleteDoctor] = useState<boolean>(false);
  const [avatar, setAvatar] = useState<string>();
  const [loadingImg, setLoadingImg] = useState<boolean>(false);
  // const [provinceList, setProvinceList] = useState<Cadastral>();
  // const [districtList, setDistrictList] = useState<Cadastral>();
  // const [wardList, setWardList] = useState<Cadastral>();

  const [provinceId, setProvinceId] = useState<string>();
  const [districtId, setDistrictId] = useState<string>();

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
        queryClient.invalidateQueries(['doctorMe']);
        message.success(intl.formatMessage({ id: 'message.update-profile.success' }));
      },
      onError: (error) => {
        message.error(intl.formatMessage({ id: 'message.update-profile.fail' }));
      },
    }
  );

  useEffect(() => {
    const doctor: DoctorClinic | undefined = doctorProfile?.data;
    form.setFieldsValue({
      ...doctor,
      dateOfBirth: doctor?.dateOfBirth ? dayjs(doctor.dateOfBirth) : null,
      status: doctor?.status ? Number(doctor.status) : 0,
      categoryIds: doctor?.categories?.map((item) => {
        return item.id;
      }),
    });
    setProvinceId(doctor?.provinceId);
    setDistrictId(doctor?.districtId);
    if (doctor?.avatar) {
      setAvatar(process.env.REACT_APP_URL_IMG_S3 + doctor?.avatar.preview);
    }
  }, [doctorProfile]);

  const onFinish = () => {
    const data = form.getFieldsValue();
    updateDoctorProfile({
      ...data,
      dateOfBirth: data.dateOfBirth ? dayjs(data.dateOfBirth).format(FORMAT_DATE) : null,
      status: !!data.status,
    });
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
                  id: 'doctor-profile.form.title',
                })}
              </div>
              <div className="line-title"></div>
            </div>
          </div>
          <div className="doctor-info__content">
            <UploadAvatar avatar={avatar} loadingImg={loadingImg} customRequest={customRequest} />
            <div className="doctor-info__content__info">
              <div className="doctor-info__content__info__rows">
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
              <div className="doctor-info__content__info__rows">
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

              <div className="doctor-info__content__info__rows">
                <Form.Item
                  className="dob"
                  label={intl.formatMessage({
                    id: 'doctor-profile.form.dob',
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
                      id: 'doctor-profile.form.dob',
                    })}
                  />
                  {/* <TimePicker.RangePicker format={FORMAT_TIME} /> */}
                </Form.Item>
                <Form.Item
                  className="gender"
                  label={intl.formatMessage({
                    id: 'doctor-profile.form.gender',
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
                      id: 'doctor-profile.form.gender',
                    })}
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
                  rules={ValidateLibrary(intl).specialist}
                >
                  <CustomSelect
                    className="select-multiple"
                    mode={'multiple'}
                    showSearch={false}
                    options={listCategory?.data?.content?.map((item: Category) => {
                      return {
                        label: item.name,
                        value: item.id,
                      };
                    })}
                    placeholder={intl.formatMessage({
                      id: 'doctor-profile.form.category',
                    })}
                  />
                </Form.Item>
              </div>
              <div className="doctor-info__content__info__rows">
                <Form.Item
                  className="level"
                  label={intl.formatMessage({
                    id: 'doctor-profile.form.level',
                  })}
                  name={'level'}
                >
                  <CustomInput
                    placeholder={intl.formatMessage({
                      id: 'doctor-profile.form.level',
                    })}
                  />
                </Form.Item>
                <Form.Item
                  className="status"
                  label={intl.formatMessage({
                    id: 'doctor-profile.form.status',
                  })}
                  name={'status'}
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
                    placeholder={intl.formatMessage({
                      id: 'doctor-profile.form.status',
                    })}
                  />
                </Form.Item>
              </div>
              <CadastalCustom
                form={form}
                setProvinceId={setProvinceId}
                setDistrictId={setDistrictId}
                districtId={districtId}
                provinceId={provinceId}
              ></CadastalCustom>
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
              <Form.Item className="name" name={'overview'}>
                <CustomArea
                  rows={6}
                  style={{ resize: 'none' }}
                  placeholder={intl.formatMessage({
                    id: 'doctor.create.achievement.history.title',
                  })}
                />
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
              <Form.Item className="name" name={'experience'}>
                <CustomArea
                  rows={6}
                  style={{ resize: 'none' }}
                  placeholder={intl.formatMessage({
                    id: 'doctor.create.achievement.experiment.title',
                  })}
                />
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
                {/*<CustomButton*/}
                {/*  className="button-cancel"*/}
                {/*  onClick={() => {*/}
                {/*    navigate(-1);*/}
                {/*  }}*/}
                {/*>*/}
                {/*  {intl.formatMessage({*/}
                {/*    id: 'doctor-profile.button-cancelled',*/}
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

export default DoctorProfile;
