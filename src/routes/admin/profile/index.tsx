import { Card, DatePicker, Form, message } from 'antd';
import CustomInput from '../../../components/input/CustomInput';
import CustomButton from '../../../components/buttons/CustomButton';
import React, { useEffect, useState } from 'react';
import IconSVG from '../../../components/icons/icons';
import useIntl from '../../../util/useIntl';
import { IntlShape } from 'react-intl';
import useForm from 'antd/es/form/hooks/useForm';
import { QueryClient, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { adminApi, assetsApi, authApi } from '../../../apis';
import CustomSelect from '../../../components/select/CustomSelect';
import { UpdateAdminDto } from '../../../apis/client-axios';
import dayjs from 'dayjs';
import { UserGender } from '../../../constants/enum';
import { FORMAT_DATE } from '../../../constants/common';
import { ValidateLibrary } from '../../../validate';
import { CadastalCustom } from '../../../components/Cadastral';
import { MyUploadProps } from '../../../constants/dto';
import { regexImage } from '../../../validate/validator.validate';
import UploadAvatar from '../../../components/upload/UploadAvatar';
import moment from 'moment';

const Profile = () => {
  const intl: IntlShape = useIntl();
  const [form] = useForm();
  const queryClient: QueryClient = useQueryClient();
  const [provinceId, setProvinceId] = useState<string>();
  const [districtId, setDistrictId] = useState<string>();
  const [avatar, setAvatar] = useState<string>();
  const [loadingImg, setLoadingImg] = useState<boolean>(false);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-profile'],
    queryFn: () => authApi.authControllerAdminMe(),
    onSuccess: ({ data }) => {
      if (data.avatar) {
        setAvatar(process.env.REACT_APP_URL_IMG_S3 + data.avatar.preview);
      }
      setProvinceId(data.provinceId);
      setDistrictId(data.districtId);
    },
  });

  const { mutate: UpdateAdmin, status: statusUpdateAdmin } = useMutation({
    mutationFn: (updateAdmin: UpdateAdminDto) => adminApi.administratorControllerUpdate(updateAdmin),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-profile']);
      message.success(intl.formatMessage({ id: 'common.updateSuccess' }));
    },
    onError: () => {
      queryClient.invalidateQueries(['admin-profile']);
      message.success(intl.formatMessage({ id: 'admin-profile.save.fail' }));
    },
  });

  useEffect(() => {
    if (data && form) {
      const dt = data.data;
      form.setFieldsValue({
        userId: dt.user.id,
        fullName: dt.fullName,
        code: dt.code,
        emailAddress: dt.emailAddress,
        phoneNumber: dt.phoneNumber,
        dateOfBirth: dt.dateOfBirth ? dayjs(moment(dt.dateOfBirth).format(FORMAT_DATE)) : null,
        gender: dt.gender,
        provinceId: dt.provinceId,
        districtId: dt.districtId,
        wardId: dt.wardId,
        address: dt.address,
      });
    }
  }, [data]);
  const handleUpdate = () => {
    const data = form.getFieldsValue();
    data.dateOfBirth = data.dateOfBirth ? data.dateOfBirth.format(FORMAT_DATE) : null;
    UpdateAdmin(data);
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
    <Card id={'admin-profile'}>
      <Form form={form} onFinish={handleUpdate} layout={'vertical'}>
        <Form.Item name={'userId'} hidden={true}></Form.Item>
        <div className={'admin-profile__header'}>
          {intl.formatMessage({
            id: 'admin-profile.table.title',
          })}
        </div>
        <div className={'admin-profile__form'}>
          <div className={'admin-profile__form__info'}>
            <div className={'admin-profile__form__info__header'}>
              <div className={'admin-profile__form__info__header.title'}>
                {intl.formatMessage({
                  id: 'admin-profile.table.title',
                })}
              </div>
              <div className="line-title"></div>
            </div>
            <div className={'admin-profile__form__info__content'}>
              <UploadAvatar avatar={avatar} loadingImg={loadingImg} customRequest={customRequest} />
              <div className={'admin-profile__form__info__content__input'}>
                <div className={'admin-profile__form__info__content__input__rows'}>
                  <Form.Item
                    name={'fullName'}
                    className={'name'}
                    label={intl.formatMessage({
                      id: 'admin-profile.fullName',
                    })}
                    rules={ValidateLibrary(intl).fullName}
                  >
                    <CustomInput
                      maxLength={36}
                      placeholder={intl.formatMessage({
                        id: 'admin-profile.fullName',
                      })}
                    />
                  </Form.Item>
                  <Form.Item
                    name={'code'}
                    className={'staff-code'}
                    label={intl.formatMessage({
                      id: 'admin-profile.code',
                    })}
                    rules={ValidateLibrary(intl).staffCode}
                  >
                    <CustomInput
                      placeholder={intl.formatMessage({
                        id: 'admin-profile.code',
                      })}
                    />
                  </Form.Item>
                </div>
                <div className={'admin-profile__form__info__content__input__rows'}>
                  <Form.Item
                    name={'emailAddress'}
                    className={'email'}
                    label={intl.formatMessage({
                      id: 'admin-profile.emailAddress',
                    })}
                    rules={ValidateLibrary(intl).email}
                  >
                    <CustomInput
                      placeholder={intl.formatMessage({
                        id: 'admin-profile.emailAddress',
                      })}
                    />
                  </Form.Item>
                  <Form.Item
                    name={'phoneNumber'}
                    className={'phone'}
                    label={intl.formatMessage({
                      id: 'admin-profile.phoneNumber',
                    })}
                    rules={ValidateLibrary(intl).phoneNumber}
                  >
                    <CustomInput
                      placeholder={intl.formatMessage({
                        id: 'admin-profile.phoneNumber',
                      })}
                    />
                  </Form.Item>
                </div>
                <div className={'admin-profile__form__info__content__input__rows'}>
                  <Form.Item
                    name={'dateOfBirth'}
                    className={'dob'}
                    label={intl.formatMessage({
                      id: 'admin-profile.dateOfBirth',
                    })}
                    rules={ValidateLibrary(intl).dob}
                  >
                    <DatePicker
                      format={FORMAT_DATE}
                      disabledDate={(current) => {
                        const today = dayjs();
                        return current && dayjs(current).isAfter(today, 'day');
                      }}
                      placeholder={intl.formatMessage({
                        id: 'admin-profile.dateOfBirth',
                      })}
                    />
                  </Form.Item>
                  <Form.Item
                    name={'gender'}
                    className={'gender'}
                    label={intl.formatMessage({
                      id: 'admin-profile.gender',
                    })}
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
                        id: 'admin-profile.gender',
                      })}
                    />
                  </Form.Item>
                </div>
                <CadastalCustom
                  form={form}
                  districtId={districtId}
                  setDistrictId={setDistrictId}
                  provinceId={provinceId}
                  setProvinceId={setProvinceId}
                ></CadastalCustom>
              </div>
            </div>
          </div>
          <div className={'admin-profile__form__action'}>
            <CustomButton className={'button-save'} htmlType="submit">
              {intl.formatMessage({
                id: 'admin-profile.save',
              })}
            </CustomButton>
            {/*<CustomButton className={'button-cancelled'}>*/}
            {/*  {intl.formatMessage({*/}
            {/*    id: 'admin-profile.cancelled',*/}
            {/*  })}*/}
            {/*</CustomButton>*/}
          </div>
        </div>
      </Form>
    </Card>
  );
};
export default Profile;
