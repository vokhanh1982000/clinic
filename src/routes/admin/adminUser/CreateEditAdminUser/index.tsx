import { Avatar, Button, Card, Checkbox, Col, DatePicker, Form, Modal, Row, Select, Switch, message } from 'antd';
import CustomInput from '../../../../components/input/CustomInput';
import { useIntl } from 'react-intl';
import DatePickerCustom from '../../../../components/date/datePicker';
import CustomAvatar from '../../../../components/avatar/avatarCustom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRef, useState } from 'react';
import { adminApi, roleApi } from '../../../../apis';
import CheckboxGroupCustom from '../../../../components/checkboxGroup/customCheckbox';
import { CreateAdminDto, Role, UpdateAdminDto } from '../../../../apis/client-axios';
import { useNavigate, useParams } from 'react-router-dom';
import { ADMIN_ROUTE_NAME } from '../../../../constants/route';
import moment from 'moment';

const CreateAdmin = () => {
  const intl = useIntl();
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  const [sort, setSort] = useState<string>('');
  const [fullTextSearch, setFullTextSearch] = useState<any>('null');
  const [form] = Form.useForm();
  const regexPhone = useRef(/^(0[1-9][0-9]{8}|0[1-9][0-9]{9}|84[1-9][0-9]{8}|84[1-9][0-9]{9})$/);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { id } = useParams();

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
        form.setFieldValue(n('roleIds'), Array.from(response.data.user.roles.map((item) => item.id)));
        form.setFieldsValue({
          ...response.data,
          roleIds: response.data.user.roles,
          gender: response.data.gender ? 1 : 0,
          dateOfBirth: response.data.dateOfBirth
            ? moment(response.data.dateOfBirth, 'DD/MM/YYYY')
            : moment('', 'DD/MM/YYYY'),
        });
      },
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
      onError: (error) => {
        message.error(intl.formatMessage({ id: 'role.create.error' }));
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
      onError: (error) => {
        // message.error(intl.formatMessage({ id: error }));
        console.log(error);
      },
    }
  );
  const deleteAdmin = useMutation((id: string) => roleApi.roleControllerDelete(id), {
    onSuccess: ({ data }) => {
      navigate(`/admin/${ADMIN_ROUTE_NAME.ROLE_MANAGEMENT}`);
    },
    onError: (error) => {
      message.error(intl.formatMessage({ id: 'role.permission.delete.error' }));
    },
  });

  const handleDelete = (text: any) => {
    Modal.confirm({
      icon: null,
      content: intl.formatMessage({ id: 'admin.user.delete.confirm' }),
      okText: intl.formatMessage({ id: 'role.remove.confirm' }),
      cancelText: intl.formatMessage({ id: 'role.remove.cancel' }),
      onOk() {
        if (text) deleteAdmin.mutate(text);
      },
      onCancel() {
        console.log('cancel');
      },
      centered: true,
    });
  };

  const onFinish = (values: any) => {
    const roleIds = form.getFieldValue(n('roleIds'));
    if (!roleIds || (roleIds && roleIds.length < 1))
      return message.error(intl.formatMessage({ id: 'admin.user.role.message' }));

    if (id) {
      updateAdmin.mutate({
        ...values,
        dateOfBirth: moment(values.dateOfBirth).format('DD/MM/YYYY'),
        gender: 0 ? true : false,
        roleIds,
        userId: id,
      });
    } else {
      const data: CreateAdminDto = {
        ...values,
        gender: 0 ? true : false,
        dateOfBirth: moment(values.dateOfBirth).format('DD/MM/YYYY'),
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

  const renderCheckbox = (item: any, role: Role[] | undefined) => {
    if (item && role) {
      const checked = role?.some((val) => val.id === item.id);
      return id ? (
        <Checkbox value={item.id} defaultChecked={checked} onChange={(e) => handeArrayCheckbox(e)}>
          {item.name}
        </Checkbox>
      ) : (
        <Checkbox value={item.id} onChange={(e) => handeArrayCheckbox(e)}>
          {item.name}
        </Checkbox>
      );
    }
    <></>;
  };

  return (
    <Card id="admin-management">
      <Form form={form} onFinish={onFinish}>
        <Row className="admin-management__header">
          <header>Thông tin quản trị viên</header>
        </Row>
        <Row className="admin-management__body">
          <Col span={14} className="admin-management__body-info">
            <Card>
              <Row className="admin-management__info-header">
                <div>
                  <header>{intl.formatMessage({ id: 'admin.user.info' })}</header>
                  <div className="line-element"></div>
                </div>
                <Row>
                  <span>{intl.formatMessage({ id: 'admin.user.online' })}</span>
                  <Switch disabled />
                </Row>
              </Row>
              <Row className="admin-management__body-data">
                <Col span={10}>
                  <CustomAvatar size={180} />
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
                      <CustomInput
                        name={n('emailAddress')}
                        placeholder={intl.formatMessage({ id: 'admin.user.email.message' })}
                      />
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
                        <DatePickerCustom dateFormat="DD/MM/YYYY" className="date-select"></DatePickerCustom>
                      </Form.Item>
                    </Col>
                    <Col span={9}>
                      <header>{intl.formatMessage({ id: 'admin.user.gender' })}</header>
                      <Form.Item rules={[{ required: true }]} name={n('gender')}>
                        <Select
                          className="admin-management__item-select"
                          defaultValue="Gender"
                          options={[
                            { value: 0, label: 'Male' },
                            { value: 1, label: 'Female' },
                          ]}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row className="admin-management__info-item">
                    <header>
                      {intl.formatMessage({
                        id: 'sigin.password',
                      })}
                    </header>
                    <Form.Item name={n('password')}>
                      <CustomInput
                        isPassword={true}
                        placeholder={intl.formatMessage({
                          id: 'sigin.password',
                        })}
                      />
                    </Form.Item>
                  </Row>
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
                <Form.Item>
                  {roleData?.data.content?.map((item) => renderCheckbox(item, detailAdmin?.data.user.roles))}
                </Form.Item>
              </Row>
            </Card>
            <Row className="admin-management__role-submit">
              <Button type="primary" block onClick={() => form.submit()}>
                {intl.formatMessage({ id: 'common.action.save' })}
              </Button>
              {id && (
                <Button type="text" block className="admin-submit-remove" onClick={handleDelete}>
                  {intl.formatMessage({ id: 'admin.user.delete' })}
                </Button>
              )}
            </Row>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};

export default CreateAdmin;
