import { QueryClient, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, Form, message } from 'antd';
import useForm from 'antd/es/form/hooks/useForm';
import Column from 'antd/es/table/Column';
import { debounce } from 'lodash';
import { useState } from 'react';
import { IntlShape } from 'react-intl';
import { medicineApi } from '../../../apis';
import { CreateMedicineDto, UpdateMedicineDto } from '../../../apis/client-axios';
import TableWrap from '../../../components/TableWrap';
import CustomButton from '../../../components/buttons/CustomButton';
import IconSVG from '../../../components/icons/icons';
import CustomInput from '../../../components/input/CustomInput';
import { ConfirmDeleteModal } from '../../../components/modals/ConfirmDeleteModal';
import { MedicineModal } from '../../../components/modals/MedicineModal';
import CustomSelect from '../../../components/select/CustomSelect';
import { ActionUser, MedicineStatus, MedicineUnit, PERMISSIONS } from '../../../constants/enum';
import CheckPermission, { Permission } from '../../../util/check-permission';
import useIntl from '../../../util/useIntl';
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
  // const [permisstion, setPermisstion] = useState<Permission>({
  //   read: Boolean(CheckPermission(PERMISSIONS.ReadMedicine)),
  //   create: Boolean(CheckPermission(PERMISSIONS.CreateMedicine)),
  //   delete: Boolean(CheckPermission(PERMISSIONS.DeleteMedicine)),
  //   update: Boolean(CheckPermission(PERMISSIONS.UpdateMedicine)),
  // });
  const { data, isLoading } = useQuery({
    queryKey: ['medicineList', { page, size, sort, fullTextSearch, status, unit }],
    queryFn: () =>
      fullTextSearch
        ? medicineApi.medicineControllerFindAll(page, size, sort, fullTextSearch, status, unit)
        : medicineApi.medicineControllerFindAll(page, size, sort, undefined, status, unit),
  });

  const { mutate: CreateMedicine, status: statusCreateMedicine } = useMutation(
    (createMedicine: CreateMedicineDto) => medicineApi.medicineControllerCreate(createMedicine),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['medicineList']);
        CustomHandleSuccess(ActionUser.CREATE, intl);
      },
      onError: (error: any): void => {
        CustomHandleError(error.response.data, intl);
      },
    }
  );

  const { mutate: UpdateMedicine, status: statusUpdateMedicine } = useMutation(
    (updateMedicine: UpdateMedicineDto) => medicineApi.medicineControllerUpdate(isShowModalUpdate!.id, updateMedicine),
    {
      onSuccess: (data) => {
        setIsShowModalUpdate(undefined);
        setIsShowModalDelete(undefined);
        queryClient.invalidateQueries(['medicineList']);
        CustomHandleSuccess(ActionUser.EDIT, intl);
      },
      onError: (error: any): void => {
        CustomHandleError(error.response.data, intl);
      },
    }
  );

  const { mutate: DeleteMedicine, status: statusDeleteMedicine } = useMutation(
    () => medicineApi.medicineControllerRemove(isShowModalDelete!.id),
    {
      onSuccess: (data) => {
        setIsShowModalDelete(undefined);
        setIsShowModalUpdate(undefined);
        queryClient.invalidateQueries(['medicineList']);
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

  const dropDownUnits: any = [
    {
      key: '1',
      label: (
        <div
          onClick={(): void => {
            setUnit(undefined);
          }}
        >
          {intl.formatMessage({
            id: 'medicine.list.dropdown.unit',
          })}
        </div>
      ),
    },
    {
      key: '2',
      label: (
        <div
          onClick={(): void => {
            setUnit(MedicineUnit.JAR);
          }}
        >
          {intl.formatMessage({
            id: 'medicine.unit.jar',
          })}
        </div>
      ),
    },
    {
      key: '3',
      label: (
        <div
          onClick={(): void => {
            setUnit(MedicineUnit.PELLET);
          }}
        >
          {intl.formatMessage({
            id: 'medicine.unit.pellet',
          })}
        </div>
      ),
    },
  ];

  const dropDownStatus: any = [
    {
      key: '1',
      label: (
        <div
          onClick={(): void => {
            setStatus(undefined);
          }}
        >
          {intl.formatMessage({
            id: 'medicine.list.dropdown.status',
          })}
        </div>
      ),
    },
    {
      key: '2',
      label: (
        <div
          onClick={(): void => {
            setStatus(MedicineStatus.NONE_LEFT);
          }}
        >
          {intl.formatMessage({
            id: 'medicine.status.none-left',
          })}
        </div>
      ),
    },
    {
      key: '3',
      label: (
        <div
          onClick={(): void => {
            setStatus(MedicineStatus.STILL);
          }}
        >
          {intl.formatMessage({
            id: 'medicine.status.still',
          })}
        </div>
      ),
    },
  ];

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
            // disabled={!permisstion.create}
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
          <CustomSelect
            className="select-unit"
            placeholder={intl.formatMessage({
              id: 'medicine.list.dropdown.unit',
            })}
            onChange={(e) => {
              if (e === '') {
                setUnit(undefined);
              } else {
                setUnit(e as MedicineUnit);
              }
              setPage(1);
            }}
            options={[
              {
                value: '',
                label: intl.formatMessage({
                  id: 'medicine.list.dropdown.unit',
                }),
              },
              {
                value: MedicineUnit.JAR,
                label: intl.formatMessage({
                  id: 'medicine.unit.jar',
                }),
              },
              {
                value: MedicineUnit.PELLET,
                label: intl.formatMessage({
                  id: 'medicine.unit.pellet',
                }),
              },
            ]}
          />
          <CustomSelect
            className="select-status"
            placeholder={intl.formatMessage({
              id: 'medicine.list.dropdown.status',
            })}
            onChange={(e) => {
              if (e === '') {
                setStatus(undefined);
              } else {
                setStatus(e as MedicineStatus);
              }
              setPage(1);
            }}
            options={[
              {
                value: '',
                label: intl.formatMessage({
                  id: 'medicine.list.dropdown.status',
                }),
              },
              {
                value: MedicineStatus.NONE_LEFT,
                label: intl.formatMessage({
                  id: 'medicine.status.none-left',
                }),
              },
              {
                value: MedicineStatus.STILL,
                label: intl.formatMessage({
                  id: 'medicine.status.still',
                }),
              },
            ]}
          />
        </div>
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
          <Column
            title={intl.formatMessage({
              id: 'medicine.list.table.status',
            })}
            dataIndex="status"
            width={'15%'}
            render={(value) => {
              return intl.formatMessage({
                id: `medicine.status.${value}`,
              });
            }}
          />
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
                  // className={permisstion.delete ? '' : 'disable'}
                  onClick={() => setIsShowModalDelete({ id: record.id, name: record.name })}
                >
                  <IconSVG type="delete" />
                </div>
              </div>
            )}
            align="center"
          />
        </TableWrap>
        <ConfirmDeleteModal
          name={isShowModalDelete && isShowModalDelete.name ? isShowModalDelete.name : ''}
          visible={!!isShowModalDelete}
          onSubmit={handleDelete}
          onClose={() => {
            setIsShowModalDelete(undefined);
            form.resetFields();
          }}
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
            isSuperAdmin={false}
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
            isSuperAdmin={false}
          />
        )}
      </Form>
    </Card>
  );
};
export default ListMedicine;
