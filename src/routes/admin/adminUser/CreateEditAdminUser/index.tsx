import { Avatar, Button, Card, Checkbox, Col, DatePicker, Form, Modal, Row, Select, Switch } from 'antd';
import CustomInput from '../../../../components/input/CustomInput';
import { useIntl } from 'react-intl';
import DatePickerCustom from '../../../../components/date/datePicker';
import CustomAvatar from '../../../../components/avatar/avatarCustom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { roleApi } from '../../../../apis';
import CheckboxGroupCustom from '../../../../components/checkboxGroup/customCheckbox';
import { CreateAdminDto } from '../../../../apis/client-axios';

const CreateAdmin = () => {
  const intl = useIntl();
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  const [sort, setSort] = useState<string>('');
  const [fullTextSearch, setFullTextSearch] = useState<any>('null');
  const [form] = Form.useForm<CreateAdminDto>();

  const n = (key: keyof CreateAdminDto) => {
    return key;
  };

  const { data, isLoading } = useQuery({
    queryKey: ['getUsers', { page, size, sort, fullTextSearch }],
    queryFn: () => roleApi.roleControllerGet(page, size, sort),
  });

  const handleDelete = (text: any) => {
    Modal.confirm({
      icon: null,
      content: intl.formatMessage({ id: 'admin.user.delete.confirm' }),
      okText: intl.formatMessage({ id: 'role.remove.confirm' }),
      cancelText: intl.formatMessage({ id: 'role.remove.cancel' }),
      onOk() {
        // if (text) deleteRole.mutate(text);
      },
      onCancel() {
        console.log('cancel');
      },
      centered: true,
    });
  };

  const onFinish = (values: any) => {
    console.log(values);
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
                      <Form.Item rules={[{ required: true }]} name="code">
                        <CustomInput placeholder={intl.formatMessage({ id: 'admin.user.code' })} />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row className="admin-management__info-item">
                    <Form.Item rules={[{ required: true }]} name="email">
                      <header>Email</header>
                      <CustomInput placeholder={intl.formatMessage({ id: 'Email' })} />
                    </Form.Item>
                  </Row>
                  <Row className="admin-management__info-item">
                    <Form.Item rules={[{ required: true }]} name={n('phoneNumber')}>
                      <header>{intl.formatMessage({ id: 'admin.user.phone' })}</header>
                      <CustomInput placeholder={intl.formatMessage({ id: 'admin.user.phone' })} />
                    </Form.Item>
                  </Row>
                  <Row className="admin-management__info-item">
                    <Col span={14}>
                      <header>{intl.formatMessage({ id: 'admin.user.dateOfBirth' })}</header>
                      <Form.Item rules={[{ required: true }]} name="">
                        <DatePickerCustom dateFormat="DD/MM/YYYY" className="date-select"></DatePickerCustom>
                      </Form.Item>
                    </Col>
                    <Col span={9}>
                      <header>{intl.formatMessage({ id: 'admin.user.gender' })}</header>
                      <Form.Item rules={[{ required: true }]} name={intl.formatMessage({ id: 'admin.user.gender' })}>
                        <Select
                          className="admin-management__item-select"
                          defaultValue="Gender"
                          options={[
                            { value: 'Male', label: 'Male' },
                            { value: 'Female', label: 'Female' },
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
                    <Form.Item rules={[{ required: true }]} name={intl.formatMessage({ id: 'sigin.password' })}>
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
              <Row>
                <Form.Item rules={[{ required: true }]} name={intl.formatMessage({ id: 'sigin.password' })}>
                  <CheckboxGroupCustom array={data?.data.content}></CheckboxGroupCustom>
                </Form.Item>
              </Row>
            </Card>
            <Row className="admin-management__role-submit">
              <Button type="primary" block onClick={() => form.submit()}>
                {intl.formatMessage({ id: 'common.action.save' })}
              </Button>
              <Button type="text" block className="admin-submit-remove" onClick={handleDelete}>
                {intl.formatMessage({ id: 'admin.user.delete' })}
              </Button>
            </Row>
          </Col>
        </Row>
      </Form>
    </Card>
  );
};

export default CreateAdmin;
