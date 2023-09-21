import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, Input, Button, message, Modal } from 'antd';

import Column from 'antd/es/table/Column';
import { useState } from 'react';
import { roleApi } from '../../../../apis';
import { Customer, Role, User } from '../../../../apis/client-axios';
import TableWrap from '../../../../components/TableWrap';
import { useIntl } from 'react-intl';
import CustomButton from '../../../../components/buttons/CustomButton';
import IconSVG from '../../../../components/icons/icons';
import CustomInput from '../../../../components/input/CustomInput';
import { useNavigate } from 'react-router-dom';
import { ADMIN_ROUTE_PATH } from '../../../../constants/route';

import { EditOutlined, DeleteOutlined, SearchOutlined, PlusOutlined } from '@ant-design/icons';
import { ADMIN_ROUTE_NAME } from '../../../../constants/route';

const ListRole = () => {
  const intl = useIntl();
  const navigate = useNavigate();
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  const [sort, setSort] = useState<string>('');
  const [fullTextSearch, setFullTextSearch] = useState<any>(null);

  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['getUsers', { page, size, sort, fullTextSearch }],
    queryFn: () => roleApi.roleControllerGet(page, size, sort, fullTextSearch),
  });
  const handleDeleteRole = (id: string, name: string) => {
    Modal.confirm({
      content:
        intl.formatMessage({ id: 'role.remove.confirm.prefix' }) +
        name +
        intl.formatMessage({ id: 'role.remove.confirm.suffixes' }),
      icon: null,
      okText: 'Confirm',
      cancelText: 'Cancel',
      onOk() {
        if (id) deleteRole.mutate(id);
      },
      onCancel() {
        console.log('cancel');
      },
      centered: true,
    });
  };

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

  const handleSearch = (e: any) => {
    if (e.target.value === ' ') return setFullTextSearch(null);
    setFullTextSearch(e.target.value);
  };

  console.log(data);
  return (
    <Card id="role-management">
      <div className="role-management__header">
        <div className="role-management__header__title">
          {intl.formatMessage({
            id: 'role.list.title',
          })}
        </div>
        <CustomButton
          className="button-add"
          icon={<IconSVG type="create" />}
          onClick={() => {
            navigate(ADMIN_ROUTE_PATH.CREATE_ROLE);
          }}
        >
          {intl.formatMessage({
            id: 'role.list.button.add',
          })}
        </CustomButton>
      </div>
      <CustomInput
        value={fullTextSearch}
        onChange={(e) => handleSearch(e)}
        placeholder={intl.formatMessage({
          id: 'role.list.search',
        })}
        prefix={<IconSVG type="search" />}
        className="input-search"
      />
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
            id: 'role.list.table.role',
          })}
          dataIndex="name"
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
              <div onClick={() => handleDeleteRole(record.id, record.name)}>
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
