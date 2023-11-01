import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, Input, Button, message, Modal, Dropdown, Space, Row, notification } from 'antd';

import Column from 'antd/es/table/Column';
import { useEffect, useRef, useState } from 'react';
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
import { debounce } from 'lodash';
import { ConfirmDeleteModal } from '../../../components/modals/ConfirmDeleteModal';
import CheckPermission, { Permission } from '../../../util/check-permission';
import { ActionUser, PERMISSIONS } from '../../../constants/enum';
import { formatPhoneNumber } from '../../../constants/function';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { CustomHandleError } from '../../../components/response/error';
import { CustomHandleSuccess } from '../../../components/response/success';

const ListRole = () => {
  const intl = useIntl();
  const navigate = useNavigate();
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  const [sort, setSort] = useState<string>('');
  const [fullTextSearch, setFullTextSearch] = useState<any>(null);
  const [position, setPosition] = useState<any>(null);
  const queryClient = useQueryClient();
  const [isShowListManager, setIsShowListManager] = useState<string>();
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [isShowModalDelete, setIsShowModalDelete] = useState<{ id: string; name: string }>();
  const { authUser } = useSelector((state: RootState) => state.auth);
  const [permisstion, setPermisstion] = useState<Permission>({
    read: false,
    create: false,
    delete: false,
    update: false,
  });

  useEffect(() => {
    if (authUser?.user?.roles) {
      setPermisstion({
        read: Boolean(CheckPermission(PERMISSIONS.ReadAdministrator, authUser)),
        create: Boolean(CheckPermission(PERMISSIONS.CreateAdministrator, authUser)),
        delete: Boolean(CheckPermission(PERMISSIONS.DeleteAdministrator, authUser)),
        update: Boolean(CheckPermission(PERMISSIONS.UpdateAdministrator, authUser)),
      });
    }
  }, [authUser]);

  const deleteAdmin = useMutation((id: string) => adminApi.administratorControllerDelete(id), {
    onSuccess: ({ data }) => {
      queryClient.invalidateQueries(['getAdminUser']);
      // navigate(`/admin/${ADMIN_ROUTE_NAME.ADMIN_MANAGEMENT}`);
      CustomHandleSuccess(ActionUser.DELETE, intl);
    },
    onError: (error: any) => {
      CustomHandleError(error.response.data, intl);
    },
  });

  const { data, isLoading } = useQuery({
    queryKey: ['getAdminUser', { page, size, sort, fullTextSearch, position }],
    queryFn: () => adminApi.administratorControllerGet(page, size, sort, fullTextSearch, position),
    enabled: permisstion.read,
  });

  const handleDeleteAdmin = () => {
    if (isShowModalDelete && isShowModalDelete.id) {
      deleteAdmin.mutate(isShowModalDelete.id);
      setIsShowModalDelete(undefined);
    }
  };

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
    <Card id="admin-management">
      <div className="admin-management__list">
        <div className="admin-management__list__title">
          {intl.formatMessage({
            id: 'admin.user.title',
          })}
        </div>
        <CustomButton
          disabled={!permisstion.create}
          style={{ width: '244px' }}
          className="button-add"
          icon={<IconSVG type="create" />}
          onClick={() => {
            navigate(ADMIN_ROUTE_PATH.CREATE_ADMIN);
          }}
        >
          {intl.formatMessage({
            id: 'admin.user.btn.create',
          })}
        </CustomButton>
      </div>
      <Row>
        <CustomInput
          allowClear
          onChange={(e) => handleSearch(e)}
          placeholder={intl.formatMessage({
            id: 'admin.user.search',
          })}
          prefix={<IconSVG type="search" />}
          className="input-search"
        />
        <DropdownCustom position={position} setPosition={setPosition} setPage={setPage} />
      </Row>
      {permisstion.read && (
        <div className="administrator-user">
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
              render={(_, record) => {
                return <>{_ ? String(_).toUpperCase() : ''}</>;
              }}
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
              dataIndex="emailAddress"
            />
            <Column
              title={intl.formatMessage({
                id: 'admin.user.phone',
              })}
              dataIndex="phoneNumber"
            />{' '}
            <Column
              title={intl.formatMessage({
                id: 'admin.user.position',
              })}
              dataIndex="position"
            />
            {/* <Column
          title={intl.formatMessage({
            id: 'admin.user.role',
          })}
          dataIndex="user"
          render={(_, record: any) => {
            const data = _.roles.map((item: any) => item.name);
            return (
              <Row style={{ justifyContent: 'space-between', alignItems: 'center' }} >
                <div>administrator</div>
                <Button type="text" onClick={() => openNotification(data)}>
                  ...
                </Button>
              </Row>
            );
          }}
        /> */}
            <Column
              title={intl.formatMessage({
                id: 'admin.user.role',
              })}
              dataIndex="user"
              width={'15%'}
              render={(_, record: any) => {
                const data = _.roles.map((item: any) => item.name);
                if (data && data.length > 0) {
                  return (
                    <div className="manager-clinic">
                      <div>{data[0]}</div>
                      {data.length > 1 && (
                        <div className="manager-clinic__more">
                          <span onClick={() => setIsShowListManager(record.id)}>
                            <IconSVG type="more" />
                          </span>
                          {isShowListManager === record.id && (
                            <div
                              className="manager-clinic__more__list"
                              ref={isShowListManager === record.id ? wrapperRef : undefined}
                            >
                              <div className="manager-clinic__more__list__title">
                                <div className="manager-clinic__more__list__title__label">Danh sách quản lý</div>
                                <span
                                  onClick={() => {
                                    setIsShowListManager(undefined);
                                  }}
                                >
                                  <IconSVG type="close" />
                                </span>
                              </div>
                              <div className="manager-clinic__more__list__content">
                                {data.map((e: any) => {
                                  return <div className="manager-clinic__more__list__content__item">{e}</div>;
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                } else {
                  return <></>;
                }
              }}
            />
            <Column
              title={intl.formatMessage({
                id: 'role.list.table.action',
              })}
              dataIndex="user"
              width={'15%'}
              render={(_, record: any) => {
                return (
                  <div className="action-admin">
                    <div
                      className={!permisstion.read ? 'disable' : ''}
                      onClick={() => permisstion.read && navigate(`detail/${_.id}`)}
                    >
                      <IconSVG type="edit" />
                    </div>
                    <span className="divider"></span>
                    <div
                      className={!permisstion.delete ? 'disable' : ''}
                      onClick={() =>
                        permisstion.delete && setIsShowModalDelete({ id: record.user.id, name: record.fullName })
                      }
                    >
                      <IconSVG type="delete" />
                    </div>
                  </div>
                );
              }}
              align="center"
            />
          </TableWrap>
        </div>
      )}
      <ConfirmDeleteModal
        name={isShowModalDelete && isShowModalDelete.name ? isShowModalDelete.name : ''}
        visible={!!isShowModalDelete}
        onSubmit={handleDeleteAdmin}
        onClose={() => {
          setIsShowModalDelete(undefined);
        }}
      />
    </Card>
  );
};

export default ListRole;
