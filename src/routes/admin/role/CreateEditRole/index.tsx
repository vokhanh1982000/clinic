import { Button, Card, Checkbox, Col, Form, Input, Row, Table } from 'antd';
import Column from 'antd/es/table/Column';
import TableWrap from '../../../../components/TableWrap';
import { useMutation, useQuery } from '@tanstack/react-query';
import { permissionApi, roleApi } from '../../../../apis';
import { CreateRoleDto, PermissionGroupDto, UpdateRoleDto } from '../../../../apis/client-axios';
import { useCallback, useEffect, useState } from 'react';
import SaveButton from '../../../../components/buttons/SaveButton';
import FormWrap from '../../../../components/FormWrap';
import { useNavigate, useParams } from 'react-router-dom';
import { log } from 'console';

const CreateRole = () => {
  const { id } = useParams();
  const [form] = Form.useForm<CreateRoleDto>();
  const navigate = useNavigate();
  const { data: dataPermissions } = useQuery({
    queryKey: ['getPermissions'],
    queryFn: () => permissionApi.permissionControllerGet(),
  });

  const { data: dataRole } = useQuery({
    queryKey: ['getRoleDetail'],
    queryFn: () => roleApi.roleControllerGetById(id as string),
    enabled: !!id,
  });

  const createRole = useMutation((createRole: CreateRoleDto) => roleApi.roleControllerCreate(createRole), {
    onSuccess: ({ data }) => {
      // navigate();
    },
    onError: (error) => {
      // message.error(intl.formatMessage({ id: "sigin.emailOrPasswordWrong" }));
    },
  });

  const updateRole = useMutation(
    (updateRole: UpdateRoleDto) => roleApi.roleControllerUpdate(id as string, updateRole),
    {
      onSuccess: ({ data }) => {
        // navigate();
      },
      onError: (error) => {
        // message.error(intl.formatMessage({ id: "sigin.emailOrPasswordWrong" }));
      },
    }
  );

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
        code: role.code,
        permissions: role.permissions,
      });
    }
  }, [dataRole]);

  const onPermissionChecked = (permissionName: string, checked: boolean) => {
    const permissions = new Set((form.getFieldValue(n('permissions')) || []) as string[]);
    if (checked) {
      permissions.add(permissionName);
    } else {
      permissions.delete(permissionName);
    }
    form.setFieldValue(n('permissions'), Array.from(permissions));
  };

  const renderColumn = (index: number, record: PermissionGroupDto) => {
    if (record.permissions[index]) {
      const permissionName = record.permissions[index].name;
      const checked = form.getFieldValue(n('permissions'))?.includes(permissionName);
      return (
        <Checkbox
          defaultChecked={checked}
          onChange={(e) => {
            onPermissionChecked(permissionName, e.target.checked);
          }}
        >
          {permissionName}
        </Checkbox>
      );
    } else {
      return <></>;
    }
  };

  const onFinish = (values: any) => {
    const permissions = form.getFieldValue(n('permissions'));
    if (!id) {
      createRole.mutate({
        ...values,
        permissions,
      });
    } else {
      updateRole.mutate({
        ...values,
        permissions,
      });
    }
  };

  return (
    <Card>
      <SaveButton className="float-end" onClick={form.submit} />

      <FormWrap form={form} onFinish={onFinish}>
        <Form.Item label="Tên quyền" name={n('name')} rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Mã quyền" name={n('code')} rules={[{ required: true }]}>
          <Input />
        </Form.Item>
      </FormWrap>

      <Table pagination={false} dataSource={dataPermissions?.data}>
        <Column title="Tên" dataIndex={'label'}></Column>
        <Column title="Mô tả" dataIndex={'description'}></Column>
        {[...Array(numOfCol)].map((x, i) => (
          <Column<PermissionGroupDto> render={(value, record) => renderColumn(i, record)}></Column>
        ))}
      </Table>
    </Card>
  );
};

export default CreateRole;
