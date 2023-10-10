import { Avatar, Button, Card, Checkbox, Col, DatePicker, Form, Modal, Row, Select, Switch, message } from 'antd';
import CustomInput from '../../../../components/input/CustomInput';
import { useIntl } from 'react-intl';
import DatePickerCustom from '../../../../components/date/datePicker';
import CustomAvatar from '../../../../components/avatar/avatarCustom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRef, useState } from 'react';
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

  const n = (key: keyof CreateAdminDto) => {
    return key;
  };

  const { data: roleData } = useQuery({
    queryKey: ['getRoles'],
    queryFn: () => roleApi.roleControllerGet(1, 10, sort),
  });

  const { data: detailAdmin } = useQuery(
    ['getDetailAdmin', id],
    () => adminApi.administratorControllerGetById(id as string),
    {
      onError: (error) => {},
      onSuccess: (response) => {
        setIsShowModalDelete({ id: undefined, name: response.data.fullName });
        form.setFieldValue(n('roleIds'), Array.from(response.data.user.roles.map((item) => item.id)));
        form.setFieldsValue({
          ...response.data,
          roleIds: Array.from(response.data.user.roles.map((item) => item.id)),
          dateOfBirth: response.data.dateOfBirth ? dayjs(response.data.dateOfBirth, FORMAT_DATE) : null,
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
        queryClient.invalidateQueries(['getDetailAdmin', id]);
        navigate(`/admin/${ADMIN_ROUTE_NAME.ADMIN_MANAGEMENT}`);
      },
      onError: ({ response }) => {
        message.error(intl.formatMessage({ id: `${response.data.message}` }));
      },
    }
  );

  const updateAdmin = useMutation(
    (updateAdmin: UpdateAdminDto) => adminApi.administratorControllerUpdate(updateAdmin),
    {
      onSuccess: ({ data }) => {
        queryClient.invalidateQueries(['getDetailAdmin', id]);
        navigate(`/admin/${ADMIN_ROUTE_NAME.ADMIN_MANAGEMENT}`);
      },
      onError: ({ response }) => {
        console.log('err');
        message.error(intl.formatMessage({ id: `${response.data.message}` }));
      },
    }
  );
  const deleteAdmin = useMutation((id: string) => adminApi.administratorControllerDelete(id), {
    onSuccess: ({ data }) => {
      navigate(`/admin/${ADMIN_ROUTE_NAME.ADMIN_MANAGEMENT}`);
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
        dateOfBirth: moment(values.dateOfBirth).format(FORMAT_DATE),
        roleIds,
        userId: id,
      });
    } else {
      const data: CreateAdminDto = {
        ...values,
        dateOfBirth: moment(values.dateOfBirth).format(FORMAT_DATE),
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
        <Checkbox value={item.id} defaultChecked={checked} onChange={(e) => handeArrayCheckbox(e)}>
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
    <Card id="admin-management">
      <Form form={form} onFinish={onFinish}>
        <Row className="admin-management__header">
          <header>{intl.formatMessage({ id: 'admin.user.info' })}</header>
        </Row>
        <Row className="admin-management__body">
          <Col span={14} className="admin-management__body-info">
            <Card>
              <Row className="admin-management__info-header">
                <div>
                  <header>{intl.formatMessage({ id: 'admin.user.info' })}</header>
                  <div className="line-element"></div>
                </div>
                {/* <Row>
                  <span>{intl.formatMessage({ id: 'admin.user.online' })}</span>
                  <Switch disabled />
                </Row> */}
              </Row>
              <Row className="admin-management__body-data">
                <Col span={10}>
                  <div className="admin-management__body-data__avatar">
                    <UploadAvatar avatar={avatar} loadingImg={loadingImg} customRequest={customRequest} />
                  </div>
                </Col>
                <Col span={14}>
                  <Row className="admin-management__info-item">
                    <Col span={12}>
                      <header>{intl.formatMessage({ id: 'admin.user.fullName' })}</header>
                      <Form.Item rules={[{ required: true }]} name={n('fullName')}>
                        <CustomInput placeholder={intl.formatMessage({ id: 'admin.user.fullName' })} />
                      </Form.Item>
                    </Col>
                    <Col span={11}>
                      <header>{intl.formatMessage({ id: 'admin.user.code' })}</header>
                      <Form.Item rules={[{ required: true }]} name={n('code')}>
                        <CustomInput placeholder={intl.formatMessage({ id: 'admin.user.code' })} />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row className="admin-management__info-item">
                    <header>Email</header>
                    <Form.Item
                      rules={[
                        { required: true },
                        { type: 'email', message: intl.formatMessage({ id: 'admin.user.email.message' }) },
                      ]}
                      name={n('emailAddress')}
                    >
                      <CustomInput name={n('emailAddress')} placeholder="email" />
                    </Form.Item>
                  </Row>
                  <Row className="admin-management__info-item">
                    <header>{intl.formatMessage({ id: 'admin.user.phone' })}</header>
                    <Form.Item
                      rules={[
                        { required: true },
                        {
                          pattern: regexPhone.current,
                          message: intl.formatMessage({ id: 'admin.user.phone.message' }),
                        },
                      ]}
                      name={n('phoneNumber')}
                    >
                      <CustomInput placeholder={intl.formatMessage({ id: 'admin.user.phone' })} />
                    </Form.Item>
                  </Row>
                  <Row className="admin-management__info-item">
                    <header>{intl.formatMessage({ id: 'admin.user.position' })}</header>
                    <Form.Item rules={[{ required: true }]} name={n('position')}>
                      <CustomInput placeholder={intl.formatMessage({ id: 'admin.user.position' })} />
                    </Form.Item>
                  </Row>
                  <Row className="admin-management__info-item">
                    <Col span={14}>
                      <header>{intl.formatMessage({ id: 'admin.user.dateOfBirth' })}</header>
                      <Form.Item rules={[{ required: true }]} name={n('dateOfBirth')}>
                        <DatePickerCustom dateFormat={FORMAT_DATE} className="date-select"></DatePickerCustom>
                      </Form.Item>
                    </Col>
                    <Col span={9}>
                      <header>{intl.formatMessage({ id: 'admin.user.gender' })}</header>
                      <Form.Item rules={[{ required: true }]} name={n('gender')}>
                        <CustomSelect
                          className="admin-management__item-select"
                          options={[
                            { value: UserGender.MALE, label: intl.formatMessage({ id: 'common.gender.male' }) },
                            { value: UserGender.FEMALE, label: intl.formatMessage({ id: 'common.gender.female' }) },
                          ]}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                  {!id && (
                    <Row className="admin-management__info-item">
                      <header>{intl.formatMessage({ id: 'admin.user.password' })}</header>
                      <Form.Item
                        name={n('password')}
                        rules={[
                          { required: true },
                          { min: 8, message: intl.formatMessage({ id: 'common.password.min' }) },
                          { max: 16, message: intl.formatMessage({ id: 'common.password.max' }) },
                        ]}
                      >
                        <CustomInput isPassword={true} />
                      </Form.Item>
                    </Row>
                  )}
                </Col>
              </Row>
            </Card>
          </Col>
          <Col span={9} className="admin-management__body-role">
            <Card className="admin-management__role-checkox">
              <Row className="admin-management__role-header">
                <div>
                  <header>{intl.formatMessage({ id: 'admin.user.type' })}</header>
                  <div className="line-element"></div>
                </div>
              </Row>
              <Row className="admin-management__role-checkboxGroup">
                <Form.Item className="custom-checkbox">
                  {roleData?.data.content?.map((item) => renderCheckbox(item))}
                </Form.Item>
              </Row>
            </Card>
            <Row className="admin-management__role-submit">
              <Button type="primary" block onClick={() => form.submit()}>
                {intl.formatMessage({ id: 'common.action.save' })}
              </Button>
              {id && (
                <Button
                  type="text"
                  block
                  className="admin-submit-remove"
                  onClick={() => setIsShowModalDelete({ id: id, name: isShowModalDelete?.name })}
                >
                  {intl.formatMessage({ id: 'admin.user.delete' })}
                </Button>
              )}
            </Row>
          </Col>
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
