import { Avatar, Button, Card, Checkbox, Col, DatePicker, Form, Modal, Row, Select, Switch, message } from 'antd';
import CustomInput from '../../../../components/input/CustomInput';
import { useIntl } from 'react-intl';
import DatePickerCustom from '../../../../components/date/datePicker';
import CustomAvatar from '../../../../components/avatar/avatarCustom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import { adminApi, assetsApi, roleApi } from '../../../../apis';
import CheckboxGroupCustom from '../../../../components/checkboxGroup/customCheckbox';
import { CreateAdminDto, CreateDoctorClinicDtoGenderEnum, Role, UpdateAdminDto } from '../../../../apis/client-axios';
import { useNavigate, useParams } from 'react-router-dom';
import { ADMIN_ROUTE_NAME } from '../../../../constants/route';
import moment from 'moment';
import { UserGender } from '../../../../constants/enum';
import dayjs from 'dayjs';
import { FORMAT_DATE } from '../../../../constants/common';
import UploadAvatar from '../../../../components/upload/UploadAvatar';
import { MyUploadProps } from '../../../../constants/dto';
import CustomSelect from '../../../../components/select/CustomSelect';
import { ConfirmDeleteModal } from '../../../../components/modals/ConfirmDeleteModal';
import { CadastalCustom } from '../../../../components/Cadastral';
import { ValidateLibrary } from '../../../../validate';
import { formatPhoneNumberInput, handleInputChangeUpperCase } from '../../../../constants/function';
import { CustomHandleError } from '../../../../components/response';
import { regexImage } from '../../../../validate/validator.validate';

const CreateAdmin = () => {
  const intl = useIntl();
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  const [sort, setSort] = useState<string>('');
  const [fullTextSearch, setFullTextSearch] = useState<any>('null');
  const [form] = Form.useForm();
  const regexPhone = useRef(/^0[1-9][0-9]{8}$/);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { id } = useParams();
  const [avatar, setAvatar] = useState<string>();
  const [loadingImg, setLoadingImg] = useState<boolean>(false);
  const [isShowModalDelete, setIsShowModalDelete] = useState<{ id: string | undefined; name: string | undefined }>();
  const [provinceId, setProvinceId] = useState<string>();
  const [districtId, setDistrictId] = useState<string>();

  const n = (key: keyof CreateAdminDto) => {
    return key;
  };

  const { data: roleData } = useQuery({
    queryKey: ['getRoles'],
    queryFn: () => roleApi.roleControllerGetAllRole(),
    onSuccess: (reponse) => {
      console.log(reponse);
    },
  });

  const { data: detailAdmin } = useQuery(
    ['getDetailAdmin', id],
    () => adminApi.administratorControllerGetById(id as string),
    {
      onError: (error) => {},
      onSuccess: (response) => {
        setIsShowModalDelete({ id: undefined, name: response.data.fullName });
        setProvinceId(response.data.provinceId);
        setDistrictId(response.data.districtId);
        form.setFieldValue(n('roleIds'), Array.from(response.data.user.roles.map((item) => item.id)));
        form.setFieldsValue({
          ...response.data,
          roleIds: Array.from(response.data.user.roles.map((item) => item.id)),
          dateOfBirth: response.data.dateOfBirth ? dayjs(moment(response.data.dateOfBirth).format(FORMAT_DATE)) : null,
        });
        if (response.data.avatar) {
          setAvatar(process.env.REACT_APP_URL_IMG_S3 + response.data.avatar.preview);
        }
      },
      enabled: !!id,
      refetchOnWindowFocus: false,
    }
  );

  const createAdmin = useMutation(
    (createAdmin: CreateAdminDto) => adminApi.administratorControllerCreate(createAdmin),
    {
      onSuccess: ({ data }) => {
        queryClient.invalidateQueries(['getAdminUser']);
        queryClient.invalidateQueries(['getAllAdmin']);
        queryClient.invalidateQueries(['getDetailAdmin', id]);
        message.success(intl.formatMessage({ id: `common.createSuccess` }));
        navigate(`/admin/${ADMIN_ROUTE_NAME.ADMIN_MANAGEMENT}`);
      },
      onError: (error: any) => {
        CustomHandleError(error.response.data, intl);
      },
    }
  );

  const updateAdmin = useMutation(
    (updateAdmin: UpdateAdminDto) => adminApi.administratorControllerUpdate(updateAdmin),
    {
      onSuccess: ({ data }) => {
        queryClient.invalidateQueries(['getAdminUser']);
        queryClient.invalidateQueries(['getAllAdmin']);
        queryClient.invalidateQueries(['getDetailAdmin', id]);
        message.success(intl.formatMessage({ id: `common.updateSuccess` }));
        navigate(`/admin/${ADMIN_ROUTE_NAME.ADMIN_MANAGEMENT}`);
      },
      onError: (error: any) => {
        CustomHandleError(error.response.data, intl);
      },
    }
  );
  const deleteAdmin = useMutation((id: string) => adminApi.administratorControllerDelete(id), {
    onSuccess: ({ data }) => {
      navigate(`/admin/${ADMIN_ROUTE_NAME.ADMIN_MANAGEMENT}`);
      message.success(intl.formatMessage({ id: `common.deleteeSuccess` }));
    },
    onError: (error) => {
      message.error(intl.formatMessage({ id: 'Fail' }));
    },
  });

  const handleDelete = () => {
    if (isShowModalDelete && isShowModalDelete.id) {
      deleteAdmin.mutate(isShowModalDelete.id);
      setIsShowModalDelete(undefined);
    }
  };

  const onFinish = (values: any) => {
    const roleIds = form.getFieldValue(n('roleIds'));
    if (!roleIds || (roleIds && roleIds.length < 1))
      return message.error(intl.formatMessage({ id: 'admin.user.role.message' }));

    if (id) {
      updateAdmin.mutate({
        ...values,
        // dateOfBirth: values.dateOfBirth ? dayjs(values.dateOfBirth).format(FORMAT_DATE) : null,
        roleIds,
        emailAddress: values.emailAddress ? values.emailAddress : '',
        userId: id,
      });
    } else {
      const data: CreateAdminDto = {
        ...values,
        // dateOfBirth: values.dateOfBirth ? dayjs(values.dateOfBirth).format(FORMAT_DATE) : null,
        roleIds,
      };
      createAdmin.mutate(data);
    }
  };

  const handeArrayCheckbox = (e: any) => {
    const item = new Set((form.getFieldValue(n('roleIds')) || []) as string[]);
    e.target.checked ? item.add(e.target.value) : item.delete(e.target.value);
    form.setFieldValue(n('roleIds'), Array.from(item));
  };

  // useEffect(() => {
  //   form.resetFields();
  // }, []);

  const renderCheckbox = (item: any) => {
    if (!id)
      return (
        <Checkbox value={item.id} onChange={(e) => handeArrayCheckbox(e)}>
          {item.name}
        </Checkbox>
      );
    if (item && detailAdmin?.data.user.roles) {
      const checked = detailAdmin?.data.user.roles?.some((val) => val.id === item.id);
      return (
        <Checkbox
          disabled={Boolean(item.name === 'SuperAdmin')}
          value={item.id}
          defaultChecked={checked}
          onChange={(e) => handeArrayCheckbox(e)}
        >
          {item.name}
        </Checkbox>
      );
    }
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
    <Card id="admin-management">
      <Form form={form} onFinish={onFinish} layout="vertical" autoComplete="off">
        <Row className="admin-management__header">
          <header>{intl.formatMessage({ id: id ? 'admin.user.info' : 'admin.user.label.create' })}</header>
        </Row>
        <Row className="admin-management__body">
          <div className="admin-management__body-info">
            <Card>
              <Row className="admin-management__info-header">
                <div>
                  <header>{intl.formatMessage({ id: 'admin.user.label' })}</header>
                  <div className="line-element"></div>
                </div>
                {/* <Row>
                  <span>{intl.formatMessage({ id: 'admin.user.online' })}</span>
                  <Switch disabled />
                </Row> */}
              </Row>
              <Row className="admin-management__body-data">
                <UploadAvatar avatar={avatar} loadingImg={loadingImg} customRequest={customRequest} />
                <div className="admin-management__info-form">
                  <Row className="admin-management__info-item" style={{ flexWrap: 'nowrap' }}>
                    <div className="fullName">
                      <Form.Item
                        label={intl.formatMessage({
                          id: 'admin.user.fullName',
                        })}
                        // rules={ValidateLibrary(intl).}

                        // rules={[
                        //   {
                        //     required: true,
                        //     message: intl.formatMessage({ id: 'common.noti.input' }),
                        //   },
                        //   {
                        //     max: 36,
                        //     message: intl.formatMessage({ id: 'common.noti.fullName.limit' }),
                        //   },
                        //   {
                        //     pattern: /^(?![\s])[\s\S]*/,
                        //     message: intl.formatMessage({ id: 'common.noti.space' }),
                        //   },
                        //   {
                        //     pattern: /^[^!@#$%^&%^&*+=\\_\-{}[/()|;:'".,>?<]*$/,
                        //     message: intl.formatMessage({
                        //       id: 'common.noti.special',
                        //     }),
                        //   },
                        // ]}
                        rules={ValidateLibrary(intl).fullName}
                        name={n('fullName')}
                      >
                        <CustomInput maxLength={36} placeholder={intl.formatMessage({ id: 'admin.user.fullName' })} />
                      </Form.Item>
                    </div>
                    <div className="code">
                      <Form.Item
                        label={intl.formatMessage({
                          id: 'admin.user.code',
                        })}
                        // rules={[
                        //   {
                        //     required: true,
                        //     message: intl.formatMessage({ id: 'common.noti.input' }),
                        //   },
                        //   {
                        //     max: 36,
                        //     message: intl.formatMessage({ id: 'common.noti.fullName.limit' }),
                        //   },
                        //   { pattern: /^(?![\s])[\s\S]*/, message: intl.formatMessage({ id: 'common.noti.space' }) },
                        //   {
                        //     pattern: /^[^!@#$%^&%^&*+=\\_\-{}[/()|;:'".,>?<]*$/,
                        //     message: intl.formatMessage({
                        //       id: 'common.noti.special',
                        //     }),
                        //   },
                        // ]}
                        rules={ValidateLibrary(intl).code}
                        name={n('code')}
                      >
                        <CustomInput
                          placeholder={intl.formatMessage({ id: 'admin.user.code' })}
                          maxLength={36}
                          onInput={handleInputChangeUpperCase}
                        />
                      </Form.Item>
                    </div>
                  </Row>
                  <Row className="admin-management__info-item">
                    <header>Email</header>
                    <Form.Item
                      // rules={[
                      //   {
                      //     pattern: /^(?![\s])[\s\S]*/,
                      //     message: intl.formatMessage({ id: 'common.noti.space' }),
                      //   },
                      //   { type: 'email', message: intl.formatMessage({ id: 'admin.user.email.message' }) },
                      // ]}
                      rules={ValidateLibrary(intl).email}
                      name={n('emailAddress')}
                    >
                      <CustomInput
                        name={n('emailAddress')}
                        placeholder="Email"
                        // defaultValue={'example@gmail.com'}
                      />
                    </Form.Item>
                  </Row>
                  <Row className="admin-management__info-item">
                    <Form.Item
                      label={intl.formatMessage({
                        id: 'admin.user.phone',
                      })}
                      // rules={[
                      //   { required: true, message: intl.formatMessage({ id: 'common.noti.input' }) },
                      //   // { len: 10, message: intl.formatMessage({ id: 'sigin.validate.phone' }) },
                      //   {
                      //     pattern: /^0[1-9][0-9]{8}$/,
                      //     message: intl.formatMessage({ id: 'sigin.validate.phone' }),
                      //   },
                      // ]}
                      rules={ValidateLibrary(intl).phoneNumber}
                      name={n('phoneNumber')}
                    >
                      <CustomInput
                        placeholder={intl.formatMessage({ id: 'admin.user.phone' })}
                        onInput={formatPhoneNumberInput}
                      />
                    </Form.Item>
                  </Row>
                  <div className="admin-management__info-item">
                    <div className="admin-management__item-col">
                      <header>{intl.formatMessage({ id: 'admin.user.dateOfBirth' })}</header>
                      <Form.Item name={n('dateOfBirth')}>
                        <DatePickerCustom
                          dateFormat={FORMAT_DATE}
                          className="date-select"
                          placeHolder={intl.formatMessage({
                            id: 'common.place-holder.dob',
                          })}
                        ></DatePickerCustom>
                      </Form.Item>
                    </div>
                    <div className="admin-management__item-col">
                      <header>{intl.formatMessage({ id: 'admin.user.gender' })}</header>
                      <Form.Item name={n('gender')} rules={ValidateLibrary(intl).dbo}>
                        <CustomSelect
                          className="admin-management__item-select"
                          placeholder={intl.formatMessage({ id: 'admin.user.gender' })}
                          options={[
                            { value: UserGender.MALE, label: intl.formatMessage({ id: 'common.gender.male' }) },
                            { value: UserGender.FEMALE, label: intl.formatMessage({ id: 'common.gender.female' }) },
                          ]}
                        />
                      </Form.Item>
                    </div>
                  </div>
                  <CadastalCustom
                    form={form}
                    setProvinceId={setProvinceId}
                    setDistrictId={setDistrictId}
                    districtId={districtId}
                    provinceId={provinceId}
                  ></CadastalCustom>
                  <Row className="admin-management__info-item">
                    <header>{intl.formatMessage({ id: 'admin.user.position' })}</header>
                    <Form.Item
                      // rules={[
                      //   { pattern: /^(?![\s])[\s\S]*/, message: intl.formatMessage({ id: 'common.noti.space' }) },
                      //   {
                      //     pattern: /^[^!@#$%^&%^&*+=\\_\-{}[/()|;:'".,>?<]*$/,
                      //     message: intl.formatMessage({
                      //       id: 'common.noti.special',
                      //     }),
                      //   },
                      // ]}
                      rules={ValidateLibrary(intl).position}
                      name={n('position')}
                    >
                      <CustomInput placeholder={intl.formatMessage({ id: 'admin.user.position' })} />
                    </Form.Item>
                  </Row>
                  {!id && (
                    <Row className="admin-management__info-item">
                      <Form.Item
                        name={n('password')}
                        label={intl.formatMessage({
                          id: 'admin.user.password',
                        })}
                        // rules={[
                        //   { required: true, message: intl.formatMessage({ id: 'common.noti.input' }) },
                        //   { min: 8, message: intl.formatMessage({ id: 'common.password.min' }) },
                        //   { max: 16, message: intl.formatMessage({ id: 'common.password.max' }) },
                        //   { pattern: /^\S*$/, message: intl.formatMessage({ id: 'common.password.space' }) },
                        //   {
                        //     pattern: /^[A-Za-z\d#$@!%&*?.]{8,16}$/,
                        //     message: intl.formatMessage({ id: 'common.password.regex' }),
                        //   },
                        // ]}
                        rules={ValidateLibrary(intl).passwordCustom}
                      >
                        <CustomInput placeholder="********" isPassword={true} maxLength={16} />
                      </Form.Item>
                    </Row>
                  )}
                </div>
              </Row>
            </Card>
          </div>
          <div className="admin-management__body-role">
            <Card className="admin-management__role-checkox">
              <Row className="admin-management__role-header">
                <div>
                  <header>{intl.formatMessage({ id: 'admin.user.type' })}</header>
                  <div className="line-element"></div>
                </div>
              </Row>
              <Row className="admin-management__role-checkboxGroup">
                <Form.Item className="custom-checkbox">{roleData?.data.map((item) => renderCheckbox(item))}</Form.Item>
              </Row>
            </Card>
            <Row className="admin-management__role-submit">
              <Button type="primary" block onClick={() => form.submit()}>
                {id ? intl.formatMessage({ id: 'admin.btn.save' }) : intl.formatMessage({ id: 'admin.btn.create' })}
              </Button>
              {id ? (
                <Button
                  type="text"
                  block
                  className="admin-submit-remove"
                  onClick={() => setIsShowModalDelete({ id: id, name: isShowModalDelete?.name })}
                >
                  {intl.formatMessage({ id: 'admin.user.delete' })}
                </Button>
              ) : (
                <Button type="text" block className="admin-submit-remove" onClick={() => navigate(-1)}>
                  {intl.formatMessage({ id: 'admin.btn.cancel' })}
                </Button>
              )}
            </Row>
          </div>
        </Row>
      </Form>
      <ConfirmDeleteModal
        name={isShowModalDelete && isShowModalDelete.name ? isShowModalDelete.name : ''}
        visible={!!isShowModalDelete?.id}
        onSubmit={handleDelete}
        onClose={() => {
          setIsShowModalDelete({ id: undefined, name: isShowModalDelete?.name });
        }}
      />
    </Card>
  );
};

export default CreateAdmin;
