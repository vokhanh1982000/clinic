import { DownOutlined } from '@ant-design/icons';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, Dropdown } from 'antd';
import Column from 'antd/es/table/Column';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import { roleApi } from '../../../../apis';
import TableWrap from '../../../../components/TableWrap';
import CustomButton from '../../../../components/buttons/CustomButton';
import IconSVG from '../../../../components/icons/icons';
import CustomInput from '../../../../components/input/CustomInput';
import { ADMIN_ROUTE_PATH } from '../../../../constants/route';

import { ConfirmDeleteModal } from '../../../../components/modals/ConfirmDeleteModal';

interface optionLocation {
  id: string;
  label: string;
}

const ListClinic = () => {
  const intl = useIntl();
  const navigate = useNavigate();
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  const [sort, setSort] = useState<string>('');
  const [fullTextSearch, setFullTextSearch] = useState<string>('');
  const [locationSelect, setLocationSelect] = useState<optionLocation>();
  const [isShowModalDelete, setIsShowModalDelete] = useState<{ id: string; name: string }>();

  const queryClient = useQueryClient();

  // const deleteRole = useMutation((id: string) => roleApi.roleControllerDelete(id), {
  //   onSuccess: ({ data }) => {
  //     console.log(data);
  //     queryClient.invalidateQueries(['getUsers']);
  //     navigate(`/admin/${ADMIN_ROUTE_NAME.ROLE_MANAGEMENT}`);
  //   },
  //   onError: (error) => {
  //     message.error(intl.formatMessage({ id: 'role.permission.delete.error' }));
  //   },
  // });

  const { data: listClinic, isLoading } = useQuery({
    queryKey: ['getUsers', { page, size, sort, fullTextSearch }],
    queryFn: () => roleApi.roleControllerGet(page, size, sort, fullTextSearch),
  });

  const items: any = [
    {
      key: '1',
      label: (
        <div
          onClick={() => {
            setLocationSelect({ id: '1', label: 'Địa điểm' });
          }}
        >
          {intl.formatMessage({
            id: 'clinic.list.dropdown.location',
          })}
        </div>
      ),
    },
    {
      key: '2',
      label: (
        <div
          onClick={() => {
            setLocationSelect({ id: '2', label: 'Example1' });
          }}
        >
          Example1
        </div>
      ),
    },
  ];

  const data = {
    data: {
      content: [
        {
          id: 1,
          name: 'Phòng Khám Đa Khoa Quốc Tế Hà Nội',
          manager: 'Đức Toàn',
          address: '152 Xã Đàn - Đống Đa - Hà Nội ',
          workTime: '08:00 - 17:00',
          status: 'active',
        },
      ],
      total: 1,
    },
  };

  const handleDelete = () => {
    if (isShowModalDelete && isShowModalDelete.id) {
      console.log(isShowModalDelete.id);
      // deleteRole.mutate(isShowModalDelete.id);
    }
  };

  const handleClose = () => {
    setIsShowModalDelete(undefined);
  };

  return (
    <Card id="clinic-management">
      <div className="clinic-management__header">
        <div className="clinic-management__header__title">
          {intl.formatMessage({
            id: 'clinic.list.title',
          })}
        </div>
        <CustomButton
          className="button-add"
          icon={<IconSVG type="create" />}
          onClick={() => {
            navigate(ADMIN_ROUTE_PATH.CREATE_CLINIC);
          }}
        >
          {intl.formatMessage({
            id: 'clinic.list.button.add',
          })}
        </CustomButton>
      </div>
      <div className="clinic-management__filter">
        <CustomInput
          placeholder={intl.formatMessage({
            id: 'clinic.list.search',
          })}
          prefix={<IconSVG type="search" />}
          className="input-search"
        />
        <Dropdown className="dropdown-location" menu={{ items }} placement="bottomLeft" trigger={['click']}>
          <CustomButton className="button-location">
            <IconSVG type="location"></IconSVG>
            <div>
              {locationSelect
                ? locationSelect.label
                : intl.formatMessage({
                    id: 'clinic.list.dropdown.location',
                  })}
            </div>
            <DownOutlined />
          </CustomButton>
        </Dropdown>
      </div>

      <TableWrap
        className="custom-table"
        data={data?.data.content}
        // isLoading={isLoading}
        page={page}
        size={size}
        total={data?.data.total}
        setSize={setSize}
        setPage={setPage}
        showPagination={true}
      >
        <Column
          title={intl.formatMessage({
            id: 'clinic.list.table.name',
          })}
          dataIndex="name"
          width={'15%'}
        />
        <Column
          title={intl.formatMessage({
            id: 'clinic.list.table.manager',
          })}
          dataIndex="manager"
          width={'15%'}
          render={(_, record: any) => (
            <div className="manager-clinic">
              <div>{record.manager}</div>
              <IconSVG type="more" />
            </div>
          )}
        />
        <Column
          title={intl.formatMessage({
            id: 'clinic.list.table.address',
          })}
          dataIndex="address"
          width={'25%'}
        />
        <Column
          title={intl.formatMessage({
            id: 'clinic.list.table.workTime',
          })}
          dataIndex="workTime"
          width={'15%'}
        />
        <Column
          title={intl.formatMessage({
            id: 'clinic.list.table.status',
          })}
          dataIndex="status"
          width={'15%'}
          render={(_, record: any) => (
            <div className="status-clinic">
              <IconSVG type={record.status} />
              <div>
                {intl.formatMessage({
                  id: `common.${record.status}`,
                })}
              </div>
            </div>
          )}
        />
        <Column
          title={intl.formatMessage({
            id: 'clinic.list.table.action',
          })}
          dataIndex="action"
          width={'15%'}
          render={(_, record: any) => (
            <div className="action-clinic">
              <div onClick={() => navigate(`detail/${record.id}`)}>
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
        onClose={handleClose}
      />
    </Card>
  );
};

export default ListClinic;
