import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, Switch, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import CustomButton from '../../../../components/buttons/CustomButton';
import IconSVG from '../../../../components/icons/icons';
import { ADMIN_ROUTE_PATH } from '../../../../constants/route';
import CustomInput from '../../../../components/input/CustomInput';
import { newsApi } from '../../../../apis';
import { debounce } from 'lodash';
import CustomSelect from '../../../../components/select/CustomSelect';
import TableWrap from '../../../../components/TableWrap';
import Column from 'antd/es/table/Column';
import { ActionUser, PERMISSIONS, Status } from '../../../../constants/enum';
import { ConfirmDeleteModal } from '../../../../components/modals/ConfirmDeleteModal';
import moment from 'moment';
import { FORMAT_DATE, FORMAT_DATE_VN } from '../../../../constants/common';
import CheckPermission, { Permission } from '../../../../util/check-permission';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store';
import { CustomHandleSuccess } from '../../../../components/response/success';
import { CustomHandleError } from '../../../../components/response/error';

const ListNew = () => {
  const intl = useIntl();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  const [sort, setSort] = useState<string>('');
  const [status, setStatus] = useState<boolean>();
  const [fullTextSearch, setFullTextSearch] = useState<string>('');
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
        read: Boolean(CheckPermission(PERMISSIONS.ReadNew, authUser)),
        create: Boolean(CheckPermission(PERMISSIONS.CreateNew, authUser)),
        delete: Boolean(CheckPermission(PERMISSIONS.DeleteNew, authUser)),
        update: Boolean(CheckPermission(PERMISSIONS.UpdateNew, authUser)),
      });
    }
  }, [authUser]);

  const { data, isLoading } = useQuery({
    queryKey: ['newList', { page, size, sort, fullTextSearch, status }],
    queryFn: () => newsApi.newControllerGet(page, size, sort, fullTextSearch, status),
    enabled: permisstion.read,
  });

  const { mutate: UpdateStatusNew, status: statusUpdateStatusNew } = useMutation(
    (id: string) => newsApi.newControllerUpdateStatusNew(id),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['newList']);
        CustomHandleSuccess(ActionUser.EDIT, intl);
      },
      onError: (error: any) => {
        CustomHandleError(error.response.data, intl);
      },
    }
  );

  const { mutate: DeleteNew, status: statusDeleteNew } = useMutation(
    (id: string) => newsApi.newControllerDeleteNew(id),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['newList']);
        CustomHandleSuccess(ActionUser.DELETE, intl);
      },
      onError: (error: any) => {
        CustomHandleError(error.response.data, intl);
      },
    }
  );

  const handleDelete = () => {
    if (isShowModalDelete && isShowModalDelete.id) {
      DeleteNew(isShowModalDelete.id);
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
    <Card id="new-management">
      <div className="new-management__header">
        <div className="new-management__header__title">
          {intl.formatMessage({
            id: 'new.list.title',
          })}
        </div>
        <CustomButton
          disabled={!permisstion.create}
          className="button-add"
          icon={<IconSVG type="create" />}
          onClick={() => {
            navigate(ADMIN_ROUTE_PATH.CREATE_NEW);
          }}
        >
          {intl.formatMessage({
            id: 'new.list.button.add',
          })}
        </CustomButton>
      </div>
      <div className="new-management__filter">
        <CustomInput
          placeholder={intl.formatMessage({
            id: 'new.list.search',
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
            id: 'new.list.select.status.place-holder',
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
                id: 'new.list.filter.status.yes',
              }),
            },
            {
              value: 0,
              label: intl.formatMessage({
                id: 'new.list.filter.status.no',
              }),
            },
          ]}
        />
      </div>
      {permisstion.read && (
        <TableWrap
          className={`custom-table ${data?.data.content && data?.data.content?.length > 0 && 'table-new'}`}
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
              id: 'new.list.table.image',
            })}
            dataIndex="image"
            width={'25%'}
            render={(_, record: any) => {
              if (record.avatar && record.avatar.preview) {
                return <img className="image-new" src={process.env.REACT_APP_URL_IMG_S3 + record.avatar.preview} />;
              }
            }}
          />
          <Column
            title={intl.formatMessage({
              id: 'new.list.table.title',
            })}
            dataIndex="title"
            width={'30%'}
            render={(_, record: any) => {
              return <div className="title-new">{record.title}</div>;
            }}
          />
          <Column
            title={intl.formatMessage({
              id: 'new.list.table.createDate',
            })}
            dataIndex="createDate"
            width={'15%'}
            render={(_, record: any) => {
              return <div>{moment(record.createdOnDate).format(FORMAT_DATE_VN)}</div>;
            }}
          />
          {/* <Column
          title={intl.formatMessage({
            id: 'new.list.table.content',
          })}
          dataIndex="content"
          width={'25%'}
          render={(_, record: any) => {
            return <div className="content-new" dangerouslySetInnerHTML={{ __html: record.content }}></div>;
          }}
        /> */}
          <Column
            title={intl.formatMessage({
              id: 'new.list.table.status',
            })}
            dataIndex="status"
            width={'10%'}
            render={(_, record: any) => {
              return (
                <div className="item-center custom-switch">
                  <Switch
                    checked={record.status}
                    onChange={() => {
                      if (permisstion.update) {
                        UpdateStatusNew(record.id);
                      }
                    }}
                  />
                </div>
              );
            }}
          />
          <Column
            title={intl.formatMessage({
              id: 'new.list.table.action',
            })}
            dataIndex="action"
            width={'20%'}
            render={(_, record: any) => (
              <div className="action-new">
                <div
                  className={permisstion.read ? '' : 'disable'}
                  onClick={() => permisstion.read && navigate(`detail/${record.id}`)}
                >
                  <IconSVG type="edit" />
                </div>
                <span className="divider"></span>
                <div
                  className={permisstion.delete ? '' : 'disable'}
                  onClick={() => permisstion.delete && setIsShowModalDelete({ id: record.id, name: record.title })}
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
        onClose={() => {
          setIsShowModalDelete(undefined);
        }}
      />
    </Card>
  );
};
export default ListNew;
