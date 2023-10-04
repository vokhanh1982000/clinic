import { Card, DatePicker, Form } from 'antd';
import CustomInput from '../../../components/input/CustomInput';
import CustomButton from '../../../components/buttons/CustomButton';
import React, { useEffect } from 'react';
import IconSVG from '../../../components/icons/icons';
import useIntl from '../../../util/useIntl';
import { IntlShape } from 'react-intl';
import useForm from 'antd/es/form/hooks/useForm';
import { QueryClient, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { adminApi, authApi } from '../../../apis';
import CustomSelect from '../../../components/select/CustomSelect';
import { UpdateAdminDto } from '../../../apis/client-axios';
import dayjs from 'dayjs';

const Profile = () => {
  const intl: IntlShape = useIntl();
  const [form] = useForm();
  const queryClient: QueryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['admin-profile'],
    queryFn: () => authApi.authControllerAdminMe(),
  });

  const { mutate: UpdateAdmin, status: statusUpdateAdmin } = useMutation({
    mutationFn: (updateAdmin: UpdateAdminDto) => adminApi.administratorControllerUpdate(updateAdmin),
    onSuccess: () => queryClient.invalidateQueries(['admin-profile']),
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
        dateOfBirth: dt.dateOfBirth ? dayjs(dt.dateOfBirth, 'DD/MM/YYYY') : null,
        gender: dt.gender,
      });
    }
  }, [data]);
  const handleUpdate = () => {
    const data = form.getFieldsValue();
    data.dateOfBirth = data.dateOfBirth.format('DD/MM/YYYY');
    UpdateAdmin(data);
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
              <div className={'admin-profile__form__info__content__avatar'}>
                <span className="admin-profile__form__info__content__avatar__img">
                  <IconSVG type="avatar-default" />
                  <span className="admin-profile__form__info__content__avatar__camera">
                    <IconSVG type="camera" />
                  </span>
                </span>
              </div>
              <div className={'admin-profile__form__info__content__input'}>
                <div className={'admin-profile__form__info__content__input__rows'}>
                  <Form.Item
                    name={'fullName'}
                    className={'name'}
                    label={intl.formatMessage({
                      id: 'admin-profile.fullName',
                    })}
                  >
                    <CustomInput />
                  </Form.Item>
                  <Form.Item
                    name={'code'}
                    className={'staff-code'}
                    label={intl.formatMessage({
                      id: 'admin-profile.code',
                    })}
                  >
                    <CustomInput />
                  </Form.Item>
                </div>
                <div className={'admin-profile__form__info__content__input__rows'}>
                  <Form.Item
                    name={'emailAddress'}
                    className={'email'}
                    label={intl.formatMessage({
                      id: 'admin-profile.emailAddress',
                    })}
                  >
                    <CustomInput />
                  </Form.Item>
                  <Form.Item
                    name={'phoneNumber'}
                    className={'phone'}
                    label={intl.formatMessage({
                      id: 'admin-profile.phoneNumber',
                    })}
                  >
                    <CustomInput />
                  </Form.Item>
                </div>
                <div className={'admin-profile__form__info__content__input__rows'}>
                  <Form.Item
                    name={'dateOfBirth'}
                    className={'dob'}
                    label={intl.formatMessage({
                      id: 'admin-profile.dateOfBirth',
                    })}
                  >
                    <DatePicker format={'DD/MM/YYYY'} />
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
              </div>
            </div>
          </div>
          <div className={'admin-profile__form__action'}>
            <CustomButton className={'button-save'} onClick={handleUpdate}>
              {intl.formatMessage({
                id: 'admin-profile.save',
              })}
            </CustomButton>
            <CustomButton className={'button-cancelled'}>
              {intl.formatMessage({
                id: 'admin-profile.cancelled',
              })}
            </CustomButton>
          </div>
        </div>
      </Form>
    </Card>
  );
};
export default Profile;
