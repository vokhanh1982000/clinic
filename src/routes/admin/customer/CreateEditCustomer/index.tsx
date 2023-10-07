import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, DatePicker, Form, Upload, message } from 'antd';
import moment from 'moment';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import { useNavigate, useParams } from 'react-router-dom';
import { customerApi } from '../../../../apis';
import { CreateCustomerDto, UpdateCustomerDto } from '../../../../apis/client-axios';
import FormWrap from '../../../../components/FormWrap';
import CustomButton from '../../../../components/buttons/CustomButton';
import IconSVG from '../../../../components/icons/icons';
import CustomInput from '../../../../components/input/CustomInput';
import { ConfirmDeleteModal } from '../../../../components/modals/ConfirmDeleteModal';
import CustomSelect from '../../../../components/select/CustomSelect';
import { Status, UserGender } from '../../../../constants/enum';
import { ADMIN_ROUTE_NAME, ADMIN_ROUTE_PATH } from '../../../../constants/route';

const CreateCustomer = () => {
  const intl = useIntl();
  const { id } = useParams();
  const [form] = Form.useForm<any>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [avatar, setAvatar] = useState<string>();
  const [isDeleteCustomer, setIsDeleteCustomer] = useState<boolean>(false);

  const { data: datacustomer } = useQuery(
    ['getDetailCustomer', id],
    () => customerApi.customerControllerGetById(id as string),
    {
      onError: (error) => {},
      onSuccess: (response) => {
        form.setFieldsValue({
          ...response.data,
          gender: response.data.gender ? 1 : 0,
          dateOfBirth: response.data.dateOfBirth ? moment(response.data.dateOfBirth, 'YYYY-MM-DD') : null,
        });
      },
      enabled: !!id,
    }
  );

  const { mutate: DeleteCustomer, status: statusDeleteCustomer } = useMutation(
    (id: string) => customerApi.customerControllerDeleteCustomerById(id),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['customerList']);
        navigate(`/admin/${ADMIN_ROUTE_NAME.USER_MANAGEMENT}`);
      },
      onError: (error: any) => {
        message.error(error.message);
      },
    }
  );

  const { mutate: CustomerCreate, status: statusCreateCustomer } = useMutation(
    (createCustomer: CreateCustomerDto) => customerApi.customerControllerCreateCustomer(createCustomer),
    {
      onSuccess: ({ data }) => {
        queryClient.invalidateQueries(['getUsers']);
        navigate(`/admin/${ADMIN_ROUTE_NAME.USER_MANAGEMENT}`);
      },
      onError: (error) => {
        message.error(intl.formatMessage({ id: 'customer.create.error' }));
      },
    }
  );

  const { mutate: CustomerUpdate, status: statusUpdateCustomer } = useMutation(
    (updatecustomer: UpdateCustomerDto) => customerApi.customerControllerUpdateCustomer(id as string, updatecustomer),
    {
      onSuccess: ({ data }) => {
        queryClient.invalidateQueries(['getcustomerDetail', id]);
        navigate(`/admin/${ADMIN_ROUTE_NAME.USER_MANAGEMENT}`);
      },
      onError: (error) => {
        message.error(intl.formatMessage({ id: 'customer.update.error' }));
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
        status: Boolean(Number(values.status)),
      });
    }
  };

  const handleDelete = () => {
    if (isDeleteCustomer && id) {
      DeleteCustomer(id);
    }
    setIsDeleteCustomer(false);
  };

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
            <div className="customer-info__content__avatar">
              <span className="customer-info__content__avatar__img">
                <Upload
                  name="avatar"
                  // listType="picture-card"
                  className="avatar-uploader"
                  showUploadList={false}
                  // action="https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188"
                  // beforeUpload={beforeUpload}
                  // onChange={handleChange}
                >
                  {avatar ? <img src={avatar} /> : <IconSVG type="avatar-default" />}
                  <span className="customer-info__content__avatar__camera">
                    <IconSVG type="camera" />
                  </span>
                </Upload>
              </span>
            </div>
            <div className="customer-info__content__info">
              <div className="customer-info__content__info__rows">
                <Form.Item
                  className="name"
                  label={intl.formatMessage({
                    id: 'customer.create.name',
                  })}
                  name={'fullName'}
                >
                  <CustomInput />
                </Form.Item>
                <Form.Item
                  className="code"
                  label={intl.formatMessage({
                    id: 'customer.create.code',
                  })}
                  name={'code'}
                >
                  <CustomInput />
                </Form.Item>
              </div>
              <div className="customer-info__content__info__rows">
                <Form.Item
                  className="email"
                  label={intl.formatMessage({
                    id: 'customer.create.email',
                  })}
                  name={'emailAddress'}
                >
                  <CustomInput />
                </Form.Item>
                <Form.Item
                  className="phone"
                  label={intl.formatMessage({
                    id: 'customer.create.phone',
                  })}
                  name={'phoneNumber'}
                  rules={[{ required: true }]}
                >
                  <CustomInput />
                </Form.Item>
              </div>

              <div className="customer-info__content__info__rows">
                <Form.Item
                  className="dob"
                  label={intl.formatMessage({
                    id: 'customer.create.dob',
                  })}
                  name={'dob'}
                >
                  <DatePicker />
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
                  <CustomSelect disabled />
                </Form.Item>
                <Form.Item
                  className="status"
                  label={intl.formatMessage({
                    id: 'customer.create.status',
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
                    id: 'customer.create.password',
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
