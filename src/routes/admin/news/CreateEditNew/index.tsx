import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, DatePicker, Form, Spin, Upload, message } from 'antd';
import moment from 'moment';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import { useNavigate, useParams } from 'react-router-dom';
import { assetsApi, newsApi } from '../../../../apis';
import FormWrap from '../../../../components/FormWrap';
import CustomButton from '../../../../components/buttons/CustomButton';
import IconSVG from '../../../../components/icons/icons';
import CustomInput from '../../../../components/input/CustomInput';
import { ConfirmDeleteModal } from '../../../../components/modals/ConfirmDeleteModal';
import CustomSelect from '../../../../components/select/CustomSelect';
import { Status, UserGender } from '../../../../constants/enum';
import { ADMIN_ROUTE_NAME, ADMIN_ROUTE_PATH } from '../../../../constants/route';
import { MyUploadProps } from '../../../../constants/dto';
import dayjs from 'dayjs';
import UploadAvatar from '../../../../components/upload/UploadAvatar';
import { FORMAT_DATE } from '../../../../constants/common';

const CreateNew = () => {
  const intl = useIntl();
  const { id } = useParams();
  const [form] = Form.useForm<any>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [avatar, setAvatar] = useState<string>();
  const [isDeletenew, setIsDeletenew] = useState<boolean>(false);
  const [loadingImg, setLoadingImg] = useState<boolean>(false);

  const { data: dataNew } = useQuery(['getDetailnew', id], () => newsApi.newControllerGetDetail(id as string), {
    onError: (error) => {},
    onSuccess: (response) => {
      // form.setFieldsValue({
      //   ...response.data,
      //   status: response.data.user.isActive ? 1 : 0,
      //   dateOfBirth: response.data.dateOfBirth ? dayjs(response.data.dateOfBirth, FORMAT_DATE) : null,
      // });
      // if (response.data.avatar) {
      //   setAvatar(process.env.REACT_APP_URL_IMG_S3 + response.data.avatar.preview);
      // }
    },
    enabled: !!id,
    refetchOnWindowFocus: false,
  });

  const { mutate: DeleteNew, status: statusDeleteNew } = useMutation(
    (id: string) => newsApi.newControllerDeleteNew(id),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['newList']);
        navigate(`/admin/${ADMIN_ROUTE_NAME.USER_MANAGEMENT}`);
      },
      onError: (error: any) => {
        message.error(error.message);
      },
    }
  );

  // const { mutate: newCreate, status: statusCreateNew } = useMutation(
  //   (createnew: CreateNewDto) => newApi.(createnew),
  //   {
  //     onSuccess: ({ data }) => {
  //       queryClient.invalidateQueries(['getUsers']);
  //       navigate(`/admin/${ADMIN_ROUTE_NAME.USER_MANAGEMENT}`);
  //     },
  //     onError: (error) => {
  //       message.error(intl.formatMessage({ id: 'new.create.error' }));
  //     },
  //   }
  // );

  // const { mutate: newUpdate, status: statusUpdatenew } = useMutation(
  //   (updatenew: UpdatenewDto) => newApi.newControllerUpdatenew(id as string, updatenew),
  //   {
  //     onSuccess: ({ data }) => {
  //       queryClient.invalidateQueries(['getnewDetail', id]);
  //       navigate(`/admin/${ADMIN_ROUTE_NAME.USER_MANAGEMENT}`);
  //     },
  //     onError: (error) => {
  //       message.error(intl.formatMessage({ id: 'new.update.error' }));
  //     },
  //   }
  // );

  const onFinish = (values: any) => {
    // if (id) {
    //   newUpdate({
    //     ...values,
    //     status: Boolean(Number(values.status)),
    //   });
    // } else {
    //   newCreate({
    //     ...values,
    //     status: Boolean(Number(values.status)),
    //   });
    // }
  };

  const handleDelete = () => {
    if (isDeletenew && id) {
      DeleteNew(id);
    }
    setIsDeletenew(false);
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
        message.error(error.message);
      },
    }
  );

  const customRequest = async (options: any) => {
    const { file, onSuccess, onError } = options;
    setLoadingImg(true);
    UploadImage({ file, assetFolderId: undefined, s3FilePath: 'avatar' });
  };

  return (
    <Card id="create-new-management">
      <div className="create-new-header">
        <div className="create-new-header__title">
          {id
            ? intl.formatMessage({
                id: 'new.edit.title',
              })
            : intl.formatMessage({
                id: 'new.create.title',
              })}
        </div>
        {id && (
          <CustomButton
            className="button-chat"
            icon={<IconSVG type="chat" />}
            onClick={() => {
              navigate(ADMIN_ROUTE_PATH.CREATE_USER);
            }}
          >
            {intl.formatMessage({
              id: 'new.edit.button.chat',
            })}
          </CustomButton>
        )}
      </div>

      <FormWrap form={form} onFinish={onFinish} layout="vertical" className="form-create-new">
        <div className="new-info">
          <div className="new-info__header">
            <div className="new-info__header__title">
              <div className="new-info__header__title__label">
                {intl.formatMessage({
                  id: 'new.create.info',
                })}
              </div>
              <div className="line-title"></div>
            </div>
          </div>
          <div className="new-info__content">
            <div className="new-info__content__avatar">
              <UploadAvatar avatar={avatar} loadingImg={loadingImg} customRequest={customRequest} />
            </div>
            <div className="new-info__content__info">
              <div className="new-info__content__info__rows">
                <Form.Item
                  className="name"
                  label={intl.formatMessage({
                    id: 'new.create.name',
                  })}
                  name={'fullName'}
                >
                  <CustomInput />
                </Form.Item>
                <Form.Item
                  className="code"
                  label={intl.formatMessage({
                    id: 'new.create.code',
                  })}
                  name={'code'}
                >
                  <CustomInput />
                </Form.Item>
              </div>
              <div className="new-info__content__info__rows">
                <Form.Item
                  className="email"
                  label={intl.formatMessage({
                    id: 'new.create.email',
                  })}
                  name={'emailAddress'}
                >
                  <CustomInput />
                </Form.Item>
                <Form.Item
                  className="phone"
                  label={intl.formatMessage({
                    id: 'new.create.phone',
                  })}
                  name={'phoneNumber'}
                  rules={[{ required: true }]}
                >
                  <CustomInput />
                </Form.Item>
              </div>

              <div className="new-info__content__info__rows">
                <Form.Item
                  className="dob"
                  label={intl.formatMessage({
                    id: 'new.create.dob',
                  })}
                  name={'dateOfBirth'}
                >
                  <DatePicker />
                  {/* <TimePicker.RangePicker format={FORMAT_TIME} /> */}
                </Form.Item>
                <Form.Item
                  className="gender"
                  label={intl.formatMessage({
                    id: 'new.create.gender',
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
                  />
                </Form.Item>
              </div>
              <div className="new-info__content__info__rows">
                {/* disable -> phase2 */}
                <Form.Item
                  className="package"
                  label={intl.formatMessage({
                    id: 'new.create.package',
                  })}
                  name={'package'}
                  // rules={[{ required: true }]}
                >
                  <CustomSelect disabled />
                </Form.Item>
                <Form.Item
                  className="status"
                  label={intl.formatMessage({
                    id: 'new.create.status',
                  })}
                  name={'status'}
                >
                  <CustomSelect
                    options={[
                      {
                        value: 1,
                        label: intl.formatMessage({
                          id: `common.${Status.ACTIVE}`,
                        }),
                      },
                      {
                        value: 0,
                        label: intl.formatMessage({
                          id: `common.${Status.INACTIVE}`,
                        }),
                      },
                    ]}
                  />
                </Form.Item>
              </div>
              {!id && (
                <Form.Item
                  name={'password'}
                  label={intl.formatMessage({
                    id: 'new.create.password',
                  })}
                  rules={[{ required: true }]}
                >
                  <CustomInput
                    isPassword={true}
                    placeholder={intl.formatMessage({
                      id: 'sigin.password',
                    })}
                  />
                </Form.Item>
              )}
            </div>
          </div>
        </div>
        <div className="button-action">
          {id ? (
            <div className="more-action">
              <CustomButton className="button-save" onClick={() => form.submit()}>
                {intl.formatMessage({
                  id: 'new.edit.button.save',
                })}
              </CustomButton>
              <CustomButton
                className="button-delete"
                onClick={() => {
                  setIsDeletenew(true);
                }}
              >
                {intl.formatMessage({
                  id: 'new.edit.button.delete',
                })}
              </CustomButton>
            </div>
          ) : (
            <div className="more-action">
              <CustomButton className="button-create" onClick={() => form.submit()}>
                {intl.formatMessage({
                  id: 'new.create.button.create',
                })}
              </CustomButton>
              <CustomButton
                className="button-cancel"
                onClick={() => {
                  navigate(-1);
                }}
              >
                {intl.formatMessage({
                  id: 'new.create.button.cancel',
                })}
              </CustomButton>
            </div>
          )}
        </div>
      </FormWrap>

      <ConfirmDeleteModal
        name={''}
        visible={isDeletenew}
        onSubmit={handleDelete}
        onClose={() => setIsDeletenew(false)}
      />
    </Card>
  );
};

export default CreateNew;
