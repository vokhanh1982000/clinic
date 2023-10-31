import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, Input, Button, message, Modal } from 'antd';

import Column from 'antd/es/table/Column';
import { useEffect, useState } from 'react';
import { roleApi } from '../../../../apis';
import TableWrap from '../../../../components/TableWrap';
import { useIntl } from 'react-intl';
import CustomButton from '../../../../components/buttons/CustomButton';
import IconSVG from '../../../../components/icons/icons';
import CustomInput from '../../../../components/input/CustomInput';
import { useNavigate } from 'react-router-dom';
import { ADMIN_ROUTE_PATH } from '../../../../constants/route';
import { ADMIN_ROUTE_NAME } from '../../../../constants/route';
import { ConfirmDeleteModal } from '../../../../components/modals/ConfirmDeleteModal';
import { debounce } from 'lodash';
import CheckPermission, { Permission } from '../../../../util/check-permission';
import { PERMISSIONS } from '../../../../constants/enum';

const ListRole = () => {
  const intl = useIntl();
  const navigate = useNavigate();
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  const [sort, setSort] = useState<string>('');
  const [fullTextSearch, setFullTextSearch] = useState<any>(null);
  const [isShowModalDelete, setIsShowModalDelete] = useState<{ id: string; name: string }>();
  const queryClient = useQueryClient();
  const [permisstion, setPermisstion] = useState<Permission>({
    read: Boolean(CheckPermission(PERMISSIONS.ReadRole)),
    create: Boolean(CheckPermission(PERMISSIONS.CreateRole)),
    delete: Boolean(CheckPermission(PERMISSIONS.DeleteRole)),
  });

  const { data, isLoading } = useQuery({
    queryKey: ['getUsers', { page, size, sort, fullTextSearch }],
    queryFn: () => roleApi.roleControllerGet(page, size, sort, fullTextSearch),
    enabled: !!permisstion.read,
  });
  const handleDeleteRole = () => {
    if (isShowModalDelete && isShowModalDelete.id) {
      deleteRole.mutate(isShowModalDelete.id);
      setIsShowModalDelete(undefined);
    }
  };

  const deleteRole = useMutation((id: string) => roleApi.roleControllerDelete(id), {
    onSuccess: ({ data }) => {
      message.success(intl.formatMessage({ id: 'common.deleteeSuccess' }));
      queryClient.invalidateQueries(['getUsers']);
      navigate(`/admin/${ADMIN_ROUTE_NAME.ROLE_MANAGEMENT}`);
    },
    onError: (error) => {
      message.error(intl.formatMessage({ id: 'role.permission.delete.error' }));
    },
  });

  const debouncedUpdateInputValue = debounce((value) => {
    if (!value.trim()) {
      setFullTextSearch(null);
    } else {
      setFullTextSearch(value);
    }
    setPage(1);
  }, 500);

  const handleSearch = (e: any) => {
    if (debouncedUpdateInputValue.cancel) {
      debouncedUpdateInputValue.cancel();
    }
    debouncedUpdateInputValue(e.target.value);
  };

  return (
    <Card id="role-management">
      <div className="role-management__header">
        <div className="role-management__header__title">
          {intl.formatMessage({
            id: 'role.title',
          })}
        </div>
        <CustomButton
          disabled={!permisstion.create}
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
        onChange={(e) => handleSearch(e)}
        placeholder={intl.formatMessage({
          id: 'role.list.search',
        })}
        prefix={<IconSVG type="search" />}
        className="input-search"
        allowClear
      />
      {permisstion.read && (
        <TableWrap
          className="custom-table role-management__header__table"
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
            title={
              <span style={{ fontWeight: 700 }}>
                {intl.formatMessage({
                  id: 'role.list.table.role',
                })}
              </span>
            }
            dataIndex="name"
          />
          <Column
            title={
              <span style={{ fontWeight: 700 }}>
                {intl.formatMessage({
                  id: 'role.list.table.action',
                })}
              </span>
            }
            dataIndex="action"
            width={'15%'}
            render={(_, record: any) => {
              return (
                <div className={record.name === 'SuperAdmin' ? 'action-role disable' : 'action-role'}>
                  <div onClick={() => Boolean(record.name !== 'SuperAdmin') && navigate(`detail/${record.id}`)}>
                    <IconSVG type="edit" />
                  </div>
                  <span className="divider"></span>
                  <div
                    className={permisstion.delete ? '' : 'disable'}
                    onClick={() => {
                      Boolean(record.name !== 'SuperAdmin') &&
                        permisstion.delete &&
                        setIsShowModalDelete({ id: record.id, name: record.name });
                    }}
                  >
                    <IconSVG type="delete" />
                  </div>
                </div>
              );
            }}
            align="center"
          />
        </TableWrap>
      )}
      <ConfirmDeleteModal
        name={isShowModalDelete && isShowModalDelete.name ? isShowModalDelete.name : ''}
        visible={!!isShowModalDelete}
        onSubmit={handleDeleteRole}
        onClose={() => {
          setIsShowModalDelete(undefined);
        }}
      />
    </Card>
  );
};

export default ListRole;
