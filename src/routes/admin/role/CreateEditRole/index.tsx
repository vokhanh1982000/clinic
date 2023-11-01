import { Button, Card, Checkbox, Col, Form, Input, Modal, Row, Table, message } from 'antd';
import Column from 'antd/es/table/Column';
import TableWrap from '../../../../components/TableWrap';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { permissionApi, roleApi } from '../../../../apis';
import { CreateRoleDto, PermissionGroupDto, UpdateRoleDto } from '../../../../apis/client-axios';
import { useCallback, useEffect, useState } from 'react';
import SaveButton from '../../../../components/buttons/SaveButton';
import FormWrap from '../../../../components/FormWrap';
import { useNavigate, useParams } from 'react-router-dom';
import CustomInput from '../../../../components/input/CustomInput';
import { useIntl } from 'react-intl';
import CustomButton from '../../../../components/buttons/CustomButton';
import { ADMIN_ROUTE_NAME } from '../../../../constants/route';
import { ConfirmDeleteModal } from '../../../../components/modals/ConfirmDeleteModal';
import CheckPermission, { Permission } from '../../../../util/check-permission';
import { PERMISSIONS } from '../../../../constants/enum';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store';

const CreateRole = () => {
  const intl = useIntl();
  const { id } = useParams();
  const [form] = Form.useForm<CreateRoleDto>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isShowModalDelete, setIsShowModalDelete] = useState<{ id: string; name: string | undefined }>();
  const [roleName, setRoleName] = useState<string>();
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
        read: Boolean(CheckPermission(PERMISSIONS.ReadRole, authUser)),
        create: Boolean(CheckPermission(PERMISSIONS.CreateRole, authUser)),
        delete: Boolean(CheckPermission(PERMISSIONS.DeleteRole, authUser)),
        update: Boolean(CheckPermission(PERMISSIONS.UpdateRole, authUser)),
      });
    }
  }, [authUser]);
  const { data: dataPermissions } = useQuery({
    queryKey: ['getPermissions'],
    queryFn: () => permissionApi.permissionControllerGet(),
    enabled: permisstion.read,
  });

  const { data: dataRole } = useQuery({
    queryKey: ['getRoleDetail', id],
    queryFn: () => roleApi.roleControllerGetById(id as string),
    enabled: !!id && permisstion.read,
    onSuccess: ({ data }) => {
      setRoleName(data.name);
    },
  });

  const createRole = useMutation((createRole: CreateRoleDto) => roleApi.roleControllerCreate(createRole), {
    onSuccess: ({ data }) => {
      queryClient.invalidateQueries(['getUsers']);
      queryClient.invalidateQueries(['getAdminUser']);
      queryClient.invalidateQueries(['getAllAdmin']);
      message.success(intl.formatMessage({ id: `common.createSuccess` }));
      navigate(`/admin/${ADMIN_ROUTE_NAME.ROLE_MANAGEMENT}`);
    },
    onError: (error) => {
      message.error(intl.formatMessage({ id: 'role.create.error' }));
    },
  });

  const updateRole = useMutation(
    (updateRole: UpdateRoleDto) => roleApi.roleControllerUpdate(id as string, updateRole),
    {
      onSuccess: ({ data }) => {
        queryClient.invalidateQueries(['getAdminUser']);
        queryClient.invalidateQueries(['getAllAdmin']);
        queryClient.invalidateQueries(['getRoleDetail', id]);
        message.success(intl.formatMessage({ id: `common.updateSuccess` }));
        navigate(`/admin/${ADMIN_ROUTE_NAME.ROLE_MANAGEMENT}`);
      },
      onError: (error) => {
        message.error(intl.formatMessage({ id: 'role.update.error' }));
      },
    }
  );

  const deleteRole = useMutation((id: string) => roleApi.roleControllerDelete(id), {
    onSuccess: ({ data }) => {
      queryClient.invalidateQueries(['getPermissions']);
      queryClient.invalidateQueries(['getRoleDetail', id]);
      message.success(intl.formatMessage({ id: 'common.deleteeSuccess' }));
      navigate(`/admin/${ADMIN_ROUTE_NAME.ROLE_MANAGEMENT}`);
    },
    onError: (error) => {
      message.error(intl.formatMessage({ id: 'role.permission.delete.error' }));
    },
  });

  const [numOfCol, setNumOfCol] = useState<number>(0);
  const n = (key: keyof CreateRoleDto) => {
    return key;
  };

  useEffect(() => {
    if (dataPermissions) {
      setNumOfCol(
        Math.max.apply(
          Math,
          dataPermissions.data.map((d) => d.permissions.length)
        )
      );
    }
  }, [dataPermissions]);

  useEffect(() => {
    if (dataRole) {
      const role = dataRole.data;
      form.setFieldsValue({
        name: role.name,
        // code: role.code,
        permissions: role.permissions,
      });
    }
  }, [dataRole]);

  const onPermissionChecked = (permissionName: string, checked: boolean) => {
    console.log(permissionName);
    const permissions = new Set((form.getFieldValue(n('permissions')) || []) as string[]);
    if (checked) {
      permissions.add(permissionName);
    } else {
      permissions.delete(permissionName);
    }
    form.setFieldValue(n('permissions'), Array.from(permissions));
  };

  const renderColumn = (index: number, record: PermissionGroupDto) => {
    if (record.permissions[index].name) {
      let i;
      if (index == 0) {
        i = 1;
      } else if (index == 1) {
        i = 0;
      } else {
        i = index;
      }
      const permissionName = record.permissions[i].name;
      if (id) {
        if (dataRole?.data?.permissions) {
          const checked = dataRole?.data?.permissions.includes(permissionName);
          return (
            <Checkbox
              defaultChecked={checked}
              onChange={(e) => {
                onPermissionChecked(permissionName, e.target.checked);
              }}
            ></Checkbox>
          );
        }
      } else {
        return (
          <Checkbox
            onChange={(e) => {
              onPermissionChecked(permissionName, e.target.checked);
            }}
          ></Checkbox>
        );
      }
    } else {
      return <></>;
    }
  };

  const handleDeleteRole = () => {
    if (isShowModalDelete && isShowModalDelete.id) {
      deleteRole.mutate(isShowModalDelete.id);
      setIsShowModalDelete(undefined);
    }
  };

  const onFinish = (values: any) => {
    const permissions = Array.from(new Set(form.getFieldValue(n('permissions')))) as string[];

    id
      ? updateRole.mutate({
          // code: values.code,
          name: values.name,
          permissions: permissions,
          id: id,
        })
      : createRole.mutate({
          // code: values.code,
          name: values.name,
          permissions: permissions,
        });
  };

  const getAction = (col: number) => {
    switch (col) {
      case 0:
        return intl.formatMessage({
          id: 'role.create.read',
        });
      case 1:
        return intl.formatMessage({
          id: 'role.create.create',
        });
      case 2:
        return intl.formatMessage({
          id: 'role.create.edit',
        });
      case 3:
        return intl.formatMessage({
          id: 'role.create.delete',
        });
      default:
        return '';
    }
  };

  console.log(dataPermissions?.data);
  return (
    <Card id="create-role-management">
      {/* <SaveButton className="float-end" onClick={form.submit} /> */}
      <div className="create-role-title">
        {id
          ? intl.formatMessage({
              id: 'role.edit.title',
            })
          : intl.formatMessage({
              id: 'role.create.title',
            })}
      </div>
      <FormWrap form={form} onFinish={onFinish} layout="vertical" className="form-create-role">
        <Form.Item
          className="role"
          label={intl.formatMessage({
            id: 'role.create.role',
          })}
          name={n('name')}
          rules={[
            {
              required: true,
              message: intl.formatMessage({
                id: 'role.input.err',
              }),
            },
            // {
            //   pattern: /^(?![\s])[\s\S]*$/,
            //   message: intl.formatMessage({
            //     id: 'common.noti.space',
            //   }),
            // },
            {
              pattern: /^[^!@#$%^&%^&*+=\\_\-{}[/()|;:'".,>?<]*$/,
              message: intl.formatMessage({
                id: 'common.noti.special',
              }),
            },
          ]}
        >
          <CustomInput />
        </Form.Item>
      </FormWrap>

      <TableWrap className="custom-table" data={dataPermissions?.data} showPagination={false}>
        <Column
          title={
            <span className="">
              {intl.formatMessage({
                id: 'role.create.role',
              })}
            </span>
          }
          key={'label'}
          dataIndex={'label'}
          render={(value, record) => {
            return <>{intl.formatMessage({ id: `role.permisstion.${value}` })}</>;
          }}
        ></Column>
        {[...Array(numOfCol)].map((x, i) => (
          <Column<PermissionGroupDto>
            title={
              <span className="">
                {intl.formatMessage({
                  id: getAction(i),
                })}
              </span>
            }
            align="center"
            key={`col-${i}`}
            render={(value, record) => <div className="custom-checkbox item-center">{renderColumn(i, record)}</div>}
          ></Column>
        ))}
      </TableWrap>
      <div className="button-action">
        {id ? (
          <div className="more-action">
            <CustomButton className="button-save" onClick={() => form.submit()} disabled={!permisstion.update}>
              {intl.formatMessage({
                id: 'role.edit.button.save',
              })}
            </CustomButton>
            <CustomButton
              className="button-delete"
              onClick={() => setIsShowModalDelete({ id: id, name: roleName })}
              disabled={!permisstion.delete}
            >
              {intl.formatMessage({
                id: 'role.edit.button.delete',
              })}
            </CustomButton>
          </div>
        ) : (
          <CustomButton className="button-create" onClick={() => form.submit()} disabled={!permisstion.create}>
            {intl.formatMessage({
              id: 'role.create.button.create',
            })}
          </CustomButton>
        )}
      </div>
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

export default CreateRole;
