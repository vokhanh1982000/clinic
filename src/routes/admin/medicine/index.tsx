import React, { useEffect, useState } from 'react';
import CustomButton from '../../../components/buttons/CustomButton';
import useIntl from '../../../util/useIntl';
import { IntlShape } from 'react-intl';
import IconSVG from '../../../components/icons/icons';
import CustomInput from '../../../components/input/CustomInput';
import { Card, Dropdown, Form, message } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import TableWrap from '../../../components/TableWrap';
import { QueryClient, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { categoryApi, adminMedicineApi } from '../../../apis';
import Column from 'antd/es/table/Column';
import { ConfirmDeleteModal } from '../../../components/modals/ConfirmDeleteModal';
import { MedicineModal } from '../../../components/modals/MedicineModal';
import { ActionUser, MedicineStatus, MedicineUnit, PERMISSIONS } from '../../../constants/enum';
import useForm from 'antd/es/form/hooks/useForm';
import { CreateCategoryDto, CreateMedicineDto, UpdateCategoryDto, UpdateMedicineDto } from '../../../apis/client-axios';
import { debounce } from 'lodash';
import CheckPermission, { Permission } from '../../../util/check-permission';
import { RootState } from '../../../store';
import { useSelector } from 'react-redux';
import { CustomHandleSuccess } from '../../../components/response/success';
import { CustomHandleError } from '../../../components/response/error';

interface Unit {
  id: string;
  label: MedicineUnit;
}
interface Status {
  id: string;
  label: MedicineStatus;
}

interface Medicine {
  id: string;
  ingredient?: string;
  name?: string;
  usage?: string;
  feature?: string;
  unit?: string;
  status?: string;
}
const ListMedicine = () => {
  const intl: IntlShape = useIntl();
  const queryClient: QueryClient = useQueryClient();
  const [unit, setUnit] = useState<MedicineUnit>();
  const [status, setStatus] = useState<MedicineStatus>();
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  const [sort, setSort] = useState<string>('');
  const [fullTextSearch, setFullTextSearch] = useState<string>('');
  const [isShowModalDelete, setIsShowModalDelete] = useState<Medicine>();
  const [isShowModalCreate, setIsShowModalCreate] = useState<boolean>(false);
  const [isShowModalUpdate, setIsShowModalUpdate] = useState<{ id: string }>();
  const [form] = useForm();
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
        read: Boolean(CheckPermission(PERMISSIONS.ReadMedicine, authUser)),
        create: Boolean(CheckPermission(PERMISSIONS.CreateMedicine, authUser)),
        delete: Boolean(CheckPermission(PERMISSIONS.DeleteMedicine, authUser)),
        update: Boolean(CheckPermission(PERMISSIONS.UpdateMedicine, authUser)),
      });
    }
  }, [authUser]);

  const { data, isLoading } = useQuery({
    queryKey: ['adminMedicineList', { page, size, sort, fullTextSearch, status, unit }],
    queryFn: () =>
      fullTextSearch
        ? adminMedicineApi.medicineAdminControllerFindAll(page, size, sort, fullTextSearch, status, unit)
        : adminMedicineApi.medicineAdminControllerFindAll(page, size, sort, undefined, status, unit),
    enabled: permisstion.read,
  });
  const { mutate: CreateMedicine, status: statusCreateMedicine } = useMutation(
    (createMedicine: CreateMedicineDto) => adminMedicineApi.medicineAdminControllerCreate(createMedicine),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['adminMedicineList']);
        CustomHandleSuccess(ActionUser.CREATE, intl);
      },
      onError: (error: any): void => {
        CustomHandleError(error.response.data, intl);
      },
    }
  );

  const { mutate: UpdateMedicine, status: statusUpdateMedicine } = useMutation(
    (updateMedicine: UpdateMedicineDto) =>
      adminMedicineApi.medicineAdminControllerUpdate(isShowModalUpdate!.id, updateMedicine),
    {
      onSuccess: (data) => {
        setIsShowModalUpdate(undefined);
        setIsShowModalDelete(undefined);
        CustomHandleSuccess(ActionUser.EDIT, intl);
        queryClient.invalidateQueries(['adminMedicineList']);
      },
      onError: (error: any): void => {
        CustomHandleError(error.response.data, intl);
      },
    }
  );

  const { mutate: DeleteMedicine, status: statusDeleteMedicine } = useMutation(
    () => adminMedicineApi.medicineAdminControllerRemove(isShowModalDelete!.id),
    {
      onSuccess: (data) => {
        setIsShowModalDelete(undefined);
        setIsShowModalUpdate(undefined);
        queryClient.invalidateQueries(['adminMedicineList']);
        CustomHandleSuccess(ActionUser.DELETE, intl);
      },
      onError: (error: any): void => {
        CustomHandleError(error.response.data, intl);
      },
    }
  );

  const handleDelete = (): void => {
    DeleteMedicine();
    form.resetFields();
  };

  const handleCreate = (): void => {
    const data = form.getFieldsValue();
    CreateMedicine(data);
    setIsShowModalCreate(false);
    form.resetFields();
  };

  const handleUpdate = (): void => {
    const data = form.getFieldsValue();
    UpdateMedicine(data);
    form.resetFields();
  };

  const debouncedUpdateInputValue = debounce((value) => {
    if (!value.trim()) {
      setFullTextSearch('');
    } else {
      setFullTextSearch(value);
    }
    setPage(1);
  }, 500);

  return (
    <Card id="medicine-management">
      <Form form={form} onFinish={handleCreate} layout={'vertical'}>
        <div className={'medicine-management__header'}>
          <div className={'medicine-management__header__title'}>
            {intl.formatMessage({
              id: 'medicine.list.title',
            })}
          </div>
          <CustomButton
            disabled={!permisstion.read}
            className={'button-add'}
            icon={<IconSVG type="create" />}
            onClick={() => setIsShowModalCreate(true)}
          >
            <span className={'button-add__title'}>
              {intl.formatMessage({
                id: 'medicine.list.button.add',
              })}
            </span>
          </CustomButton>
        </div>
        <div className={'medicine-management__filter'}>
          <CustomInput
            className={'input-search'}
            placeholder={intl.formatMessage({
              id: 'medicine.list.search',
            })}
            prefix={<IconSVG type="search" />}
            onChange={(e) => {
              if (debouncedUpdateInputValue.cancel) {
                debouncedUpdateInputValue.cancel();
              }
              debouncedUpdateInputValue(e.target.value);
            }}
            allowClear={true}
          />
        </div>
        {permisstion.read && (
          <TableWrap
            className={'custom-table'}
            showPagination={true}
            page={page}
            size={size}
            setSize={setSize}
            setPage={setPage}
            data={data?.data.content}
            total={data?.data.total}
          >
            <Column
              title={intl.formatMessage({
                id: 'medicine.list.table.ingredient',
              })}
              dataIndex="ingredient"
              width={'15%'}
            />
            <Column
              title={intl.formatMessage({
                id: 'medicine.list.table.name',
              })}
              dataIndex="name"
              width={'15%'}
            />
            <Column
              title={intl.formatMessage({
                id: 'medicine.list.table.usage',
              })}
              dataIndex="usage"
              width={'25%'}
            />
            <Column
              title={intl.formatMessage({
                id: 'medicine.list.table.feature',
              })}
              dataIndex="feature"
              width={'15%'}
            />
            <Column
              title={intl.formatMessage({
                id: 'medicine.list.table.unit',
              })}
              dataIndex="unit"
              width={'15%'}
              render={(value) => {
                return intl.formatMessage({
                  id: `medicine.unit.${value}`,
                });
              }}
            />
            {/*<Column*/}
            {/*  title={intl.formatMessage({*/}
            {/*    id: 'medicine.list.table.status',*/}
            {/*  })}*/}
            {/*  dataIndex="status"*/}
            {/*  width={'15%'}*/}
            {/*  render={(value) => {*/}
            {/*    return intl.formatMessage({*/}
            {/*      id: `medicine.status.${value}`,*/}
            {/*    });*/}
            {/*  }}*/}
            {/*/>*/}
            <Column
              title={intl.formatMessage({
                id: 'medicine.list.table.action',
              })}
              dataIndex="action"
              width={'15%'}
              render={(_, record: Medicine) => (
                <div className="action-medicine">
                  <div
                    onClick={(): void => {
                      form.setFieldsValue({
                        ingredient: record.ingredient,
                        feature: record.feature,
                        id: record.id,
                        name: record.name,
                        status: record.status,
                        unit: record.unit,
                        usage: record.usage,
                      });
                      setIsShowModalUpdate({
                        id: record.id,
                      });
                    }}
                  >
                    <IconSVG type="edit" />
                  </div>
                  <span className="divider"></span>
                  <div
                    className={permisstion.delete ? '' : 'disable'}
                    onClick={() => permisstion.delete && setIsShowModalDelete({ id: record.id, name: record.name })}
                  >
                    <IconSVG type="delete" />
                  </div>
                </div>
              )}
              align="center"
            />
          </TableWrap>
        )}
        <ConfirmDeleteModal
          name={isShowModalDelete && isShowModalDelete.name ? isShowModalDelete.name : ''}
          visible={!!isShowModalDelete}
          onSubmit={handleDelete}
          onClose={() => setIsShowModalDelete(undefined)}
        />
        {isShowModalCreate && (
          <MedicineModal
            form={form}
            visible={isShowModalCreate}
            onSubmit={handleCreate}
            onClose={() => {
              setIsShowModalCreate(false);
              form.resetFields();
            }}
            action={ActionUser.CREATE}
            title={intl.formatMessage({
              id: 'medicine.list.modal.create',
            })}
            isSuperAdmin={true}
            permission={permisstion}
          />
        )}
        {isShowModalUpdate && (
          <MedicineModal
            form={form}
            visible={!!isShowModalUpdate}
            action={ActionUser.EDIT}
            title={intl.formatMessage({
              id: 'medicine.list.modal.update',
            })}
            onSubmit={handleUpdate}
            onClose={() => {
              setIsShowModalUpdate(undefined);
              form.resetFields();
            }}
            onDelete={() => {
              setIsShowModalUpdate(undefined);
              setIsShowModalDelete({
                id: form.getFieldValue('id'),
                name: form.getFieldValue('name'),
              });
              form.resetFields();
            }}
            isSuperAdmin={true}
            permission={permisstion}
          />
        )}
      </Form>
    </Card>
  );
};
export default ListMedicine;
