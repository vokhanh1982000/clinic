import React, { useState } from 'react';
import CustomButton from '../../../components/buttons/CustomButton';
import useIntl from '../../../util/useIntl';
import { IntlShape } from 'react-intl';
import IconSVG from '../../../components/icons/icons';
import CustomInput from '../../../components/input/CustomInput';
import { Card, Dropdown, Form } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import TableWrap from '../../../components/TableWrap';
import { useQuery } from '@tanstack/react-query';
import { roleApi } from '../../../apis';
import Column from 'antd/es/table/Column';
import { ConfirmDeleteModal } from '../../../components/modals/ConfirmDeleteModal';
import { MedicineModal } from '../../../components/modals/MedicineModal';
import { ActionUser } from '../../../constants/enum';
import useForm from 'antd/es/form/hooks/useForm';

interface optionUnit {
  id: string;
  label: string;
}

interface Medicine {
  id: string;
  name?: string;
  usage?: string;
  feature?: string;
  unit?: string;
  status?: string;
}
const ListMedicine = () => {
  const intl: IntlShape = useIntl();
  const [unitSelect, setUnitSelect] = useState<optionUnit>();
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  const [sort, setSort] = useState<string>('');
  const [fullTextSearch, setFullTextSearch] = useState<string>('');
  const [isShowModalDelete, setIsShowModalDelete] = useState<Medicine>();
  const [isShowModalCreate, setIsShowModalCreate] = useState<boolean>(false);
  const [isShowModalUpdate, setIsShowModalUpdate] = useState<{ id: string }>();
  const [form] = useForm();

  const { data: listMedicine, isLoading } = useQuery({
    queryKey: ['getUsers', { page, size, sort, fullTextSearch }],
    queryFn: () => roleApi.roleControllerGet(page, size, sort, fullTextSearch),
  });

  const handleDelete = (): void => {
    if (isShowModalUpdate && isShowModalUpdate.id) {
      setIsShowModalDelete(isShowModalUpdate);
      setIsShowModalUpdate(undefined);
      return;
    }
    if (isShowModalDelete && isShowModalDelete.id) {
      console.log(isShowModalDelete?.id);
      // Todo: call request delete
    }
    setIsShowModalDelete(undefined);
    form.resetFields();
  };

  const handleCloseModalDelete = (): void => {
    setIsShowModalDelete(undefined);
  };

  const handleCreate = (): void => {
    const data = form.getFieldsValue();
    console.log(data);
    setIsShowModalCreate(false);
    form.resetFields();
  };

  const handleUpdate = (): void => {
    const data = form.getFieldsValue();
    console.log(data);
    setIsShowModalUpdate(undefined);
    form.resetFields();
  };

  const dropDownUnits: any = [
    {
      key: '1',
      label: (
        <div
          onClick={(): void => {
            setUnitSelect({ id: '1', label: 'Đơn vị' });
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
            setUnitSelect({ id: '2', label: 'Unit2' });
          }}
        >
          Đơn vị 2
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
            setUnitSelect({ id: '1', label: 'Trạng thái' });
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
            setUnitSelect({ id: '2', label: 'Status 2' });
          }}
        >
          Status 23
        </div>
      ),
    },
  ];
  const data = {
    data: {
      content: [
        {
          id: 1,
          name: 'Panadol',
          usage: 'Giảm đau',
          feature: 'nhanh die',
          unit: 'Viên',
          status: 'Còn',
        },
      ],
      total: 1,
    },
  };
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
          />
          <Dropdown className={'dropdown-unit'} menu={{ items: dropDownUnits }}>
            <CustomButton className="button-unit">
              <div>
                {unitSelect
                  ? unitSelect.label
                  : intl.formatMessage({
                      id: 'medicine.list.dropdown.unit',
                    })}
              </div>
              <DownOutlined />
            </CustomButton>
          </Dropdown>

          <Dropdown className={'dropdown-status'} menu={{ items: dropDownStatus }}>
            <CustomButton className="button-status">
              <div>
                {unitSelect
                  ? unitSelect.label
                  : intl.formatMessage({
                      id: 'medicine.list.dropdown.status',
                    })}
              </div>
              <DownOutlined />
            </CustomButton>
          </Dropdown>
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
            width={'15%'}
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
          />
          <Column
            title={intl.formatMessage({
              id: 'medicine.list.table.status',
            })}
            dataIndex="status"
            width={'15%'}
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
                <div onClick={() => setIsShowModalDelete({ id: record.id, name: record.name })}>
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
          onClose={handleCloseModalDelete}
        />
        {isShowModalCreate && (
          <MedicineModal
            form={form}
            visible={isShowModalCreate}
            onSubmit={handleCreate}
            onClose={() => setIsShowModalCreate(false)}
            action={ActionUser.CREATE}
            title={intl.formatMessage({
              id: 'medicine.list.modal.create',
            })}
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
            onClose={() => setIsShowModalUpdate(undefined)}
            onDelete={handleDelete}
          />
        )}
      </Form>
    </Card>
  );
};
export default ListMedicine;
