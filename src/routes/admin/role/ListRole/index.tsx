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
  const [fullTextSearch, setFullTextSearch] = useState<string>('');

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
    queryKey: ['getUsers', { page, size, sort, fullTextSearch }],
    queryFn: () => roleApi.roleControllerGet(page, size, sort, fullTextSearch),
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
      centered: true, // Hiển thị Modal ở giữa trang
    });
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
            id: 'role.list.table.code',
          })}
          dataIndex="code"
          width={'15%'}
        />
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
