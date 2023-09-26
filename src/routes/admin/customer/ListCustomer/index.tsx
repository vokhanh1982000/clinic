import { useQuery } from '@tanstack/react-query';
import { Card } from 'antd';
import Column from 'antd/es/table/Column';
import { useState } from 'react';
import { customerApi } from '../../../../apis';
import { Customer, User } from '../../../../apis/client-axios';
import TableWrap from '../../../../components/TableWrap';
import { useIntl } from 'react-intl';
import { useNavigate } from 'react-router';
import CustomButton from '../../../../components/buttons/CustomButton';
import IconSVG from '../../../../components/icons/icons';
import { ADMIN_ROUTE_PATH } from '../../../../constants/route';
import CustomInput from '../../../../components/input/CustomInput';
import CustomSelect from '../../../../components/select/CustomSelect';

const ListUser = () => {
  const intl = useIntl();
  const navigate = useNavigate();
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  const [sort, setSort] = useState<string>('');
  const [fullTextSearch, setFullTextSearch] = useState<string>('');
  const [isShowModalDelete, setIsShowModalDelete] = useState<{ id: string; name: string }>();
  const { data, isLoading } = useQuery({
    queryKey: ['customerList', { page, size, sort, fullTextSearch }],
    queryFn: () =>
      fullTextSearch
        ? customerApi.customerControllerGet(page, size, sort, fullTextSearch)
        : customerApi.customerControllerGet(page, size, sort),
  });
  return (
    <Card id="customer-management">
      <div className="customer-management__header">
        <div className="customer-management__header__title">
          {intl.formatMessage({
            id: 'customer.list.title',
          })}
        </div>
        <CustomButton
          className="button-add"
          icon={<IconSVG type="create" />}
          onClick={() => {
            navigate(ADMIN_ROUTE_PATH.CREATE_USER);
          }}
        >
          {intl.formatMessage({
            id: 'customer.list.button.add',
          })}
        </CustomButton>
      </div>
      <div className="customer-management__filter">
        <CustomInput
          placeholder={intl.formatMessage({
            id: 'customer.list.search',
          })}
          prefix={<IconSVG type="search" />}
          className="input-search"
        />
        <CustomSelect
          className="select-status"
          placeholder={intl.formatMessage({
            id: 'customer.list.select.status.place-holder',
          })}
        />
      </div>
      <TableWrap
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
            id: 'customer.list.table.name',
          })}
          dataIndex="name"
          width={'15%'}
        />
        <Column
          title={intl.formatMessage({
            id: 'customer.list.table.manager',
          })}
          dataIndex="manager"
          width={'15%'}
          render={(_, record: any) => (
            <div className="manager-customer">
              <div>{record.manager}</div>
              <IconSVG type="more" />
            </div>
          )}
        />
        <Column
          title={intl.formatMessage({
            id: 'customer.list.table.address',
          })}
          dataIndex="address"
          width={'25%'}
        />
        <Column
          title={intl.formatMessage({
            id: 'customer.list.table.workTime',
          })}
          dataIndex="workTime"
          width={'15%'}
        />
        <Column
          title={intl.formatMessage({
            id: 'customer.list.table.status',
          })}
          dataIndex="status"
          width={'15%'}
          render={(_, record: any) => (
            <div className="status-customer">
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
            id: 'customer.list.table.action',
          })}
          dataIndex="action"
          width={'15%'}
          render={(_, record: any) => (
            <div className="action-customer">
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
    </Card>
  );
};

export default ListUser;
