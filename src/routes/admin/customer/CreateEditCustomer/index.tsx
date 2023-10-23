import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, DatePicker, Form, Spin, Upload, message } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useNavigate, useParams } from 'react-router-dom';
import { assetsApi, customerApi } from '../../../../apis';
import { CreateCustomerDto, UpdateCustomerDto } from '../../../../apis/client-axios';
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
import { CadastalCustom } from '../../../../components/Cadastral';
import { ValidateLibrary } from '../../../../validate';
import { disabledFutureDate } from '../../../../constants/function';
import { CustomHandleError } from '../../../../components/response';
import DatePickerCustom from '../../../../components/date/datePicker';
import { regexImage } from '../../../../validate/validator.validate';

const CreateCustomer = () => {
  const intl = useIntl();
  const { id } = useParams();
  const [form] = Form.useForm<any>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [avatar, setAvatar] = useState<string>();
  const [isDeleteCustomer, setIsDeleteCustomer] = useState<boolean>(false);
  const [loadingImg, setLoadingImg] = useState<boolean>(false);
  const [provinceId, setProvinceId] = useState<string>();
  const [districtId, setDistrictId] = useState<string>();

  const { data: datacustomer } = useQuery(
    ['getDetailCustomer', id],
    () => customerApi.customerControllerGetById(id as string),
    {
      onError: (error) => {},
      onSuccess: (response) => {
        form.setFieldsValue({
          ...response.data,
          status: response.data.user.isActive ? 1 : 0,
          dateOfBirth: response.data.dateOfBirth ? dayjs(response.data.dateOfBirth, FORMAT_DATE) : null,
        });
        if (response.data.avatar) {
          setAvatar(process.env.REACT_APP_URL_IMG_S3 + response.data.avatar.preview);
        }
        setProvinceId(response.data.provinceId ? response.data.provinceId : undefined);
        setDistrictId(response.data.districtId ? response.data.districtId : undefined);
      },
      enabled: !!id,
      refetchOnWindowFocus: false,
    }
  );

  const { mutate: DeleteCustomer, status: statusDeleteCustomer } = useMutation(
    (id: string) => customerApi.customerControllerDeleteCustomerById(id),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['customerList']);
        message.success(intl.formatMessage({ id: `common.deleteeSuccess` }));
        navigate(`/admin/${ADMIN_ROUTE_NAME.USER_MANAGEMENT}`);
      },
      onError: (error: any) => {
        CustomHandleError(error.response.data, intl);
      },
    }
  );

  const { mutate: CustomerCreate, status: statusCreateCustomer } = useMutation(
    (createCustomer: CreateCustomerDto) => customerApi.customerControllerCreateCustomer(createCustomer),
    {
      onSuccess: ({ data }) => {
        queryClient.invalidateQueries(['getUsers']);
        message.success(intl.formatMessage({ id: `common.createSuccess` }));
        navigate(`/admin/${ADMIN_ROUTE_NAME.USER_MANAGEMENT}`);
      },
      onError: (error: any) => {
        CustomHandleError(error.response.data, intl);
      },
    }
  );

  const { mutate: CustomerUpdate, status: statusUpdateCustomer } = useMutation(
    (updatecustomer: UpdateCustomerDto) => customerApi.customerControllerUpdateCustomer(id as string, updatecustomer),
    {
      onSuccess: ({ data }) => {
        queryClient.invalidateQueries(['getcustomerDetail', id]);
        message.success(intl.formatMessage({ id: `common.updateSuccess` }));
        navigate(`/admin/${ADMIN_ROUTE_NAME.USER_MANAGEMENT}`);
      },
      onError: (error: any) => {
        CustomHandleError(error.response.data, intl);
      },
    }
  );

  const onFinish = (values: any) => {
    if (id) {
      CustomerUpdate({
        ...values,
        status: Boolean(Number(values.status)),
      });
    } else {
      CustomerCreate({
        ...values,
        status: values.status ? Boolean(Number(values.status)) : true,
      });
    }
  };

  const handleDelete = () => {
    if (isDeleteCustomer && id) {
      DeleteCustomer(id);
    }
    setIsDeleteCustomer(false);
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
    if (!file || !regexImage.test(file.type)) {
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

  useEffect(() => {
    if (!id) {
      form.setFieldValue('status', 1);
    }
  }, []);

  return (
    <Card id="create-customer-management">
      <div className="create-customer-header">
        <div className="create-customer-header__title">
          {id
            ? intl.formatMessage({
                id: 'customer.edit.title',
              })
            : intl.formatMessage({
                id: 'customer.create.title',
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
              id: 'customer.edit.button.chat',
            })}
          </CustomButton>
        )}
      </div>

      <FormWrap form={form} onFinish={onFinish} layout="vertical" className="form-create-customer">
        <div className="customer-info">
          <div className="customer-info__header">
            <div className="customer-info__header__title">
              <div className="customer-info__header__title__label">
                {intl.formatMessage({
                  id: 'customer.create.info',
                })}
              </div>
              <div className="line-title"></div>
            </div>
          </div>
          <div className="customer-info__content">
            <UploadAvatar avatar={avatar} loadingImg={loadingImg} customRequest={customRequest} />
            <div className="customer-info__content__info">
              <div className="customer-info__content__info__rows">
                <Form.Item
                  className="name"
                  label={intl.formatMessage({
                    id: 'customer.create.name',
                  })}
                  name={'fullName'}
                  rules={ValidateLibrary(intl).nameCustomer}
                >
                  <CustomInput
                    placeholder={intl.formatMessage({
                      id: 'customer.create.name',
                    })}
                  />
                </Form.Item>
                <Form.Item
                  className="code"
                  label={intl.formatMessage({
                    id: 'customer.create.code',
                  })}
                  name={'code'}
                  rules={ValidateLibrary(intl).customerCode}
                >
                  <CustomInput
                    placeholder={intl.formatMessage({
                      id: 'customer.create.code',
                    })}
                  />
                </Form.Item>
              </div>
              <div className="customer-info__content__info__rows">
                <Form.Item
                  className="email"
                  label={intl.formatMessage({
                    id: 'customer.create.email',
                  })}
                  name={'emailAddress'}
                  rules={ValidateLibrary(intl).email}
                >
                  <CustomInput
                    placeholder={intl.formatMessage({
                      id: 'customer.create.email',
                    })}
                  />
                </Form.Item>
                <Form.Item
                  className="phone"
                  label={intl.formatMessage({
                    id: 'customer.create.phone',
                  })}
                  name={'phoneNumber'}
                  rules={ValidateLibrary(intl).phoneNumber}
                >
                  <CustomInput
                    placeholder={intl.formatMessage({
                      id: 'customer.create.phone',
                    })}
                  />
                </Form.Item>
              </div>

              <div className="customer-info__content__info__rows">
                <Form.Item
                  className="dob"
                  label={intl.formatMessage({
                    id: 'customer.create.dob',
                  })}
                  name={'dateOfBirth'}
                >
                  <DatePickerCustom
                    placeHolder={intl.formatMessage({
                      id: 'common.place-holder.dob',
                    })}
                  />
                  {/* <TimePicker.RangePicker format={FORMAT_TIME} /> */}
                </Form.Item>
                <Form.Item
                  className="gender"
                  label={intl.formatMessage({
                    id: 'customer.create.gender',
                  })}
                  name={'gender'}
                >
                  <CustomSelect
                    placeholder={intl.formatMessage({
                      id: 'customer.create.gender',
                    })}
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
              <CadastalCustom
                form={form}
                provinceId={provinceId}
                districtId={districtId}
                setProvinceId={setProvinceId}
                setDistrictId={setDistrictId}
              ></CadastalCustom>
              <div className="customer-info__content__info__rows">
                {/* disable -> phase2 */}
                <Form.Item
                  className="package"
                  label={intl.formatMessage({
                    id: 'customer.create.package',
                  })}
                  name={'package'}
                  // rules={[{ required: true }]}
                >
                  <CustomSelect
                    disabled
                    placeholder={intl.formatMessage({
                      id: 'customer.create.package',
                    })}
                  />
                </Form.Item>
                <Form.Item
                  className="status"
                  label={intl.formatMessage({
                    id: 'customer.create.status',
                  })}
                  name={'status'}
                >
                  <CustomSelect
                    placeholder={intl.formatMessage({
                      id: 'customer.create.status',
                    })}
                    options={[
                      {
                        value: 1,
                        label: intl.formatMessage({
                          id: `common.user.${Status.ACTIVE}`,
                        }),
                      },
                      {
                        value: 0,
                        label: intl.formatMessage({
                          id: `common.user.${Status.INACTIVE}`,
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
                    id: 'customer.create.password',
                  })}
                  rules={ValidateLibrary(intl).password}
                >
                  <CustomInput
                    isPassword={true}
                    placeholder={intl.formatMessage({
                      id: 'sigin.password',
                    })}
                    maxLength={16}
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
                  id: 'customer.edit.button.save',
                })}
              </CustomButton>
              <CustomButton
                className="button-delete"
                onClick={() => {
                  setIsDeleteCustomer(true);
                }}
              >
                {intl.formatMessage({
                  id: 'customer.edit.button.delete',
                })}
              </CustomButton>
            </div>
          ) : (
            <div className="more-action">
              <CustomButton className="button-create" onClick={() => form.submit()}>
                {intl.formatMessage({
                  id: 'customer.create.button.create',
                })}
              </CustomButton>
              <CustomButton
                className="button-cancel"
                onClick={() => {
                  navigate(-1);
                }}
              >
                {intl.formatMessage({
                  id: 'customer.create.button.cancel',
                })}
              </CustomButton>
            </div>
          )}
        </div>
      </FormWrap>

      <ConfirmDeleteModal
        name={''}
        visible={isDeleteCustomer}
        onSubmit={handleDelete}
        onClose={() => setIsDeleteCustomer(false)}
      />
    </Card>
  );
};

export default CreateCustomer;
