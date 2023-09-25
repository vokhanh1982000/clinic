import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, Input, Button, message, Modal, Dropdown, Space, Row } from 'antd';

import Column from 'antd/es/table/Column';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import { adminApi, roleApi } from '../../../apis';
import { ADMIN_ROUTE_NAME, ADMIN_ROUTE_PATH } from '../../../constants/route';
import CustomButton from '../../../components/buttons/CustomButton';
import IconSVG from '../../../components/icons/icons';
import CustomInput from '../../../components/input/CustomInput';
import TableWrap from '../../../components/TableWrap';
import { DownOutlined, UserOutlined } from '@ant-design/icons';
import DropdownCustom from '../../../components/dropdown/CustomDropdow';
const ListRole = () => {
  const intl = useIntl();
  const navigate = useNavigate();
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  const [sort, setSort] = useState<string>('');
  const [fullTextSearch, setFullTextSearch] = useState<any>(null);
  const [positions, setPositions] = useState<string[]>(['']);

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
      icon: null,
      content: intl.formatMessage({ id: 'admin.user.delete.confirm' }),
      okText: intl.formatMessage({ id: 'role.remove.confirm' }),
      cancelText: intl.formatMessage({ id: 'role.remove.cancel' }),
      onOk() {
        if (text) deleteRole.mutate(text);
      },
      onCancel() {
        console.log('cancel');
      },
      centered: true,
    });
  };

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
            id: 'admin.user.create',
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
        <DropdownCustom data={data?.data.position} iconType="specialized" setFilterSearch={setFullTextSearch} />
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
          dataIndex="code"
        />
        <Column
          title={intl.formatMessage({
            id: 'admin.user.fullName',
          })}
          dataIndex="fullName"
        />
        <Column
          title={intl.formatMessage({
            id: 'Email',
          })}
          dataIndex="email"
        />
        <Column
          title={intl.formatMessage({
            id: 'admin.user.phone',
          })}
          dataIndex="phoneNumber"
        />{' '}
        <Column
          title={intl.formatMessage({
            id: 'admin.user.code',
          })}
          dataIndex="role"
        />
        <Column
          title={intl.formatMessage({
            id: 'admin.user.position',
          })}
          dataIndex="position"
        />
        <Column
          title={intl.formatMessage({
            id: 'role.list.table.action',
          })}
          dataIndex="action"
          width={'15%'}
          render={(_, record: any) => (
            <div className="action-role">
              <div onClick={() => navigate(`detail/${record.userId}`)}>
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
