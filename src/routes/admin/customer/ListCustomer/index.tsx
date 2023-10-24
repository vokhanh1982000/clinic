import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, message } from 'antd';
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
import { ConfirmDeleteModal } from '../../../../components/modals/ConfirmDeleteModal';
import { Status } from '../../../../constants/enum';
import { debounce } from 'lodash';
import { formatPhoneNumber } from '../../../../constants/function';

const ListUser = () => {
  const intl = useIntl();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  const [sort, setSort] = useState<string>('');
  const [status, setStatus] = useState<boolean>();
  const [fullTextSearch, setFullTextSearch] = useState<string>('');
  const [isShowModalDelete, setIsShowModalDelete] = useState<{ id: string; name: string }>();
  const { data, isLoading } = useQuery({
    queryKey: ['customerList', { page, size, sort, fullTextSearch, status }],
    queryFn: () => customerApi.customerControllerGet(page, size, sort, fullTextSearch, status),
  });

  const { mutate: DeleteCustomer, status: statusDeleteCustomer } = useMutation(
    (id: string) => customerApi.customerControllerDeleteCustomerById(id),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['customerList']);
        message.success(intl.formatMessage({ id: `common.updateSuccess` }));
        // message.success(intl.formatMessage({ id: `customer.delete.success` }));
      },
      onError: (error: any) => {
        message.error(error.message);
      },
    }
  );

  const handleDelete = () => {
    if (isShowModalDelete && isShowModalDelete.id) {
      DeleteCustomer(isShowModalDelete.id);
    }
    setIsShowModalDelete(undefined);
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
          onChange={(e) => {
            if (debouncedUpdateInputValue.cancel) {
              debouncedUpdateInputValue.cancel();
            }
            debouncedUpdateInputValue(e.target.value);
          }}
          allowClear
        />
        <CustomSelect
          className="select-status"
          placeholder={intl.formatMessage({
            id: 'customer.list.select.status.place-holder',
          })}
          onChange={(e) => {
            if (e === '') {
              setStatus(undefined);
            } else {
              setStatus(Boolean(Number(e)));
            }
            setPage(1);
          }}
          options={[
            {
              value: '',
              label: intl.formatMessage({
                id: 'common.option.all',
              }),
            },
            {
              value: 1,
              label: intl.formatMessage({
                id: 'common.user.active',
              }),
            },
            {
              value: 0,
              label: intl.formatMessage({
                id: 'common.user.inactive',
              }),
            },
          ]}
        />
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
            id: 'customer.list.table.code',
          })}
          dataIndex="code"
          width={'10%'}
        />
        <Column
          title={intl.formatMessage({
            id: 'customer.list.table.name',
          })}
          dataIndex="fullName"
          width={'15%'}
        />
        <Column
          title={intl.formatMessage({
            id: 'customer.list.table.email',
          })}
          dataIndex="emailAddress"
          width={'15%'}
        />
        <Column
          title={intl.formatMessage({
            id: 'customer.list.table.phone',
          })}
          dataIndex="phoneNumber"
          width={'15%'}
          render={(_, record: any) => {
            return <div>{formatPhoneNumber(record.phoneNumber)}</div>;
          }}
        />
        <Column
          title={intl.formatMessage({
            id: 'customer.list.table.package',
          })}
          dataIndex="package"
          width={'15%'}
        />
        <Column
          title={intl.formatMessage({
            id: 'customer.list.table.status',
          })}
          dataIndex="status"
          width={'15%'}
          render={(_, record: any) => {
            let status = record.user ? (record.user.isActive ? Status.ACTIVE : Status.INACTIVE) : undefined;
            return (
              <div className="status-customer">
                {status ? (
                  <>
                    <span>
                      <IconSVG type={status} />
                    </span>
                    <div>
                      {intl.formatMessage({
                        id: `common.user.${status}`,
                      })}
                    </div>
                  </>
                ) : (
                  <></>
                )}
              </div>
            );
          }}
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
              <div onClick={() => setIsShowModalDelete({ id: record.id, name: record.fullName })}>
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
        }}
      />
    </Card>
  );
};

export default ListUser;
