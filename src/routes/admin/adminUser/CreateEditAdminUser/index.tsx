import { Avatar, Button, Card, Checkbox, Col, DatePicker, Form, Modal, Row, Select, Switch } from 'antd';
import CustomInput from '../../../../components/input/CustomInput';
import { useIntl } from 'react-intl';
import DatePickerCustom from '../../../../components/date/datePicker';
import CustomAvatar from '../../../../components/avatar/avatarCustom';

const CreateAdmin = () => {
  const intl = useIntl();

  const plainOptions = ['Apple', 'Pear', 'Orange'];

  const options = [
    { label: 'Apple', value: 'Apple' },
    { label: 'Pear', value: 'Pear' },
    { label: 'Orange', value: 'Orange' },
    { label: 'Orange', value: 'Orange' },
    { label: 'Orange', value: 'Orange' },
    { label: 'Orange', value: 'Orange' },
  ];

  const handleDelete = (text: any) => {
    Modal.confirm({
      title: 'Confirm',
      content: 'Are You Sure?',
      icon: null,
      okText: 'Confirm',
      cancelText: 'Cancel',
      onOk() {
        // if (text) deleteRole.mutate(text);
      },
      onCancel() {
        console.log('cancel');
      },
      centered: true,
    });
  };

  return (
    <Card id="admin-management">
      <Form>
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
                      <Form.Item rules={[{ required: true }]}>
                        <CustomInput
                          placeholder={intl.formatMessage({
                            id: 'full name',
                          })}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={11}>
                      <header>Code</header>
                      <Form.Item rules={[{ required: true }]}>
                        <CustomInput
                          placeholder={intl.formatMessage({
                            id: 'code',
                          })}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row className="admin-management__info-item">
                    <Form.Item rules={[{ required: true }]}>
                      <header>Email</header>
                      <CustomInput placeholder={intl.formatMessage({ id: 'Email' })} />
                    </Form.Item>
                  </Row>
                  <Row className="admin-management__info-item">
                    <Form.Item rules={[{ required: true }]}>
                      <header>{intl.formatMessage({ id: 'admin.user.phone' })}</header>
                      <CustomInput placeholder={intl.formatMessage({ id: 'admin.user.phone' })} />
                    </Form.Item>
                  </Row>
                  <Row className="admin-management__info-item">
                    <Col span={14}>
                      <header>{intl.formatMessage({ id: 'admin.user.dateOfBirth' })}</header>
                      <Form.Item rules={[{ required: true }]}>
                        <DatePickerCustom dateFormat="DD/MM/YYYY" className="date-select"></DatePickerCustom>
                      </Form.Item>
                    </Col>
                    <Col span={9}>
                      <header>{intl.formatMessage({ id: 'admin.user.gender' })}</header>
                      <Form.Item rules={[{ required: true }]}>
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
                    <Col span={17}>
                      <header>
                        {intl.formatMessage({
                          id: 'sigin.password',
                        })}
                      </header>
                      <Form.Item rules={[{ required: true }]}>
                        <CustomInput
                          isPassword={true}
                          placeholder={intl.formatMessage({
                            id: 'sigin.password',
                          })}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={7} className="admin-management__info-change">
                      <span>
                        {intl.formatMessage({
                          id: 'admin.user.change.pass',
                        })}
                      </span>
                    </Col>
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
                <Checkbox.Group options={options} defaultValue={['Apple']} />
              </Row>
            </Card>
            <Row className="admin-management__role-submit">
              <Button type="primary" block>
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
