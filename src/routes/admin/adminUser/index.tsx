import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, Input, Button, message, Modal, Dropdown, Space, Row } from 'antd';

import Column from 'antd/es/table/Column';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import { adminApi, roleApi } from '../../../apis';
import { ADMIN_ROUTE_NAME, ADMIN_ROUTE_PATH } from '../../../constants/route';
import CustomButton from '../../../components/buttons/CustomButton';
import IconSVG from '../../../components/icons/icons';
import CustomInput from '../../../components/input/CustomInput';
import TableWrap from '../../../components/TableWrap';
import { DownOutlined, UserOutlined } from '@ant-design/icons';
const ListRole = () => {
  const intl = useIntl();
  const navigate = useNavigate();
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  const [sort, setSort] = useState<string>('');
  const [fullTextSearch, setFullTextSearch] = useState<any>(null);

  const queryClient = useQueryClient();

  const deleteRole = useMutation((id: string) => roleApi.roleControllerDelete(id), {
    onSuccess: ({ data }) => {
      console.log(data);
      queryClient.invalidateQueries(['getUsers']);
      navigate(`/admin/${ADMIN_ROUTE_NAME.ROLE_MANAGEMENT}`);
    },
    onError: (error) => {
      message.error(intl.formatMessage({ id: 'role.permission.delete.error' }));
    },
  });

  const { data, isLoading } = useQuery({
    queryKey: ['getAdminUser', { page, size, sort, fullTextSearch }],
    queryFn: () => adminApi.administratorControllerGet(page, size, sort, fullTextSearch),
  });
  const handleDeleteRole = (text: any) => {
    Modal.confirm({
      title: 'Confirm',
      content: 'Are You Sure?',
      icon: null,
      okText: 'Confirm',
      cancelText: 'Cancel',
      onOk() {
        if (text) deleteRole.mutate(text);
      },
      onCancel() {
        console.log('cancel');
      },
      centered: true,
    });
  };

  const items: any = [
    {
      key: '1',
      label: (
        <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
          1st menu item
        </a>
      ),
    },
  ];

  const handleSearch = (e: any) => {
    if (e.target.value.trim() === '') return setFullTextSearch(null);
    setFullTextSearch(e.target.value);
  };

  console.log(data);
  return (
    <Card id="role-management">
      <div className="role-management__header">
        <div className="role-management__header__title">
          {intl.formatMessage({
            id: 'admin.user.title',
          })}
        </div>
        <CustomButton
          className="button-add"
          icon={<IconSVG type="create" />}
          onClick={() => {
            navigate(ADMIN_ROUTE_PATH.CREATE_ADMIN);
          }}
        >
          {intl.formatMessage({
            id: 'role.list.button.add',
          })}
        </CustomButton>
      </div>
      <Row>
        <CustomInput
          onChange={(e) => handleSearch(e)}
          placeholder={intl.formatMessage({
            id: 'admin.user.search',
          })}
          prefix={<IconSVG type="search" />}
          className="input-search"
        />
        <Dropdown className="cart-role-dropdown" menu={{ items }} placement="bottomLeft">
          <Button style={{ height: '48px', textAlign: 'left', marginLeft: '15px', borderRadius: '32px' }}>
            <Space style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Space>
                <IconSVG type="specialized"></IconSVG>
                <div className="front-base" style={{ paddingRight: '15px' }}>
                  {intl.formatMessage({
                    id: 'admin.user.specialized',
                  })}
                </div>
              </Space>
              <DownOutlined />
            </Space>
          </Button>
        </Dropdown>
      </Row>
      <TableWrap
        className="custom-table"
        data={data?.data.content}
        isLoading={isLoading}
        page={page}
        size={size}
        total={data?.data.total}
        setSize={setSize}
        setPage={setPage}
        showPagination={true}
      >
        <Column
          title={intl.formatMessage({
            id: 'role.list.table.code',
          })}
          dataIndex="roles_code"
          width={'15%'}
        />
        <Column
          title={intl.formatMessage({
            id: 'admin.user.fullName',
          })}
          dataIndex="administrator_fullName"
        />
        <Column
          title={intl.formatMessage({
            id: 'Email',
          })}
          dataIndex="administrator_emailAddress"
        />
        <Column
          title={intl.formatMessage({
            id: 'admin.user.phone',
          })}
          dataIndex="administrator_phoneNumber"
        />{' '}
        <Column
          title={intl.formatMessage({
            id: 'admin.user.specialized',
          })}
          dataIndex="administrator_phoneNumber"
        />
        <Column
          title={intl.formatMessage({
            id: 'admin.user.specialized',
          })}
          dataIndex="users_type"
        />
        <Column
          title={intl.formatMessage({
            id: 'role.list.table.action',
          })}
          dataIndex="action"
          width={'15%'}
          render={(_, record: any) => (
            <div className="action-role">
              <div onClick={() => navigate(`detail/${record.id}`)}>
                <IconSVG type="edit" />
              </div>
              <span className="divider"></span>
              <div onClick={() => handleDeleteRole(record.id)}>
                <IconSVG type="delete" />
              </div>
            </div>
          )}
          align="center"
        />
      </TableWrap>
    </Card>
  );
};

export default ListRole;
