import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, Modal, message } from 'antd';
import Column from 'antd/es/table/Column';
import { useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import { cadastralApi, clinicsApi } from '../../../../apis';
import TableWrap from '../../../../components/TableWrap';
import CustomButton from '../../../../components/buttons/CustomButton';
import IconSVG from '../../../../components/icons/icons';
import CustomInput from '../../../../components/input/CustomInput';
import { ADMIN_ROUTE_PATH } from '../../../../constants/route';

import { ConfirmDeleteModal } from '../../../../components/modals/ConfirmDeleteModal';
import CustomSelect from '../../../../components/select/CustomSelect';
import { ActionUser, PERMISSIONS, Status } from '../../../../constants/enum';
import { debounce } from 'lodash';
import CheckPermission, { Permission } from '../../../../util/check-permission';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store';
import { CustomHandleError } from '../../../../components/response/error';
import { CustomHandleSuccess } from '../../../../components/response/success';

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
  const [isShowListManager, setIsShowListManager] = useState<string>();
  const queryClient = useQueryClient();
  const [provinceSelected, setProvinceSelected] = useState<{ id: string; code: string }>();
  const [districtSelected, setDistrictSelected] = useState<{ id: string; code: string }>();
  const [wardSelected, setWardSelected] = useState<{ id: string; code: string }>();
  const wrapperRef = useRef<HTMLDivElement | null>(null);
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
        read: Boolean(CheckPermission(PERMISSIONS.ReadClinic, authUser)),
        create: Boolean(CheckPermission(PERMISSIONS.CreateClinic, authUser)),
        delete: Boolean(CheckPermission(PERMISSIONS.DeleteClinic, authUser)),
        update: Boolean(CheckPermission(PERMISSIONS.UpdateClinic, authUser)),
      });
    }
  }, [authUser]);

  const { data: listProvince } = useQuery({
    queryKey: ['provinceList'],
    queryFn: () => cadastralApi.cadastralControllerGetProvince(),
  });

  const { data: listDistrict } = useQuery({
    queryKey: ['districtList', provinceSelected],
    queryFn: () => cadastralApi.cadastralControllerGetDistrictByProvinceId(provinceSelected?.id, undefined),
    enabled: !!provinceSelected,
  });

  const { data: listWard } = useQuery({
    queryKey: ['wardList', districtSelected],
    queryFn: () => cadastralApi.cadastralControllerGetWardByDistrictId(undefined, districtSelected?.id),
    enabled: !!districtSelected,
  });

  const { data: listClinic, isLoading } = useQuery({
    queryKey: ['getClinics', { page, size, sort, fullTextSearch, provinceSelected, districtSelected, wardSelected }],
    queryFn: () =>
      clinicsApi.clinicControllerGetAll(
        page,
        size,
        sort,
        fullTextSearch,
        provinceSelected?.id,
        districtSelected?.id,
        wardSelected?.id
      ),
    enabled: permisstion.read,
  });

  const { mutate: DeleteClinic, status: statusDeleteClinic } = useMutation(
    (id: string) => clinicsApi.clinicControllerDeleteClinic(id),
    {
      onSuccess: (data) => {
        CustomHandleSuccess(ActionUser.DELETE, intl);
        queryClient.invalidateQueries(['getClinics']);
      },
      onError: (error: any) => {
        CustomHandleError(error.response.data, intl);
      },
    }
  );

  const handleDelete = () => {
    if (isShowModalDelete && isShowModalDelete.id) {
      DeleteClinic(isShowModalDelete.id);
    }
    setIsShowModalDelete(undefined);
  };

  const handleClose = () => {
    setIsShowModalDelete(undefined);
  };

  const handleChangeProvince = (value: any, option: any) => {
    if (option) {
      setProvinceSelected({ id: option.value, code: option.code });
    } else {
      setProvinceSelected(undefined);
    }
    setDistrictSelected(undefined);
    setWardSelected(undefined);
    setPage(1);
  };

  const handleChangeDistrict = (value: any, option: any) => {
    if (option) {
      setDistrictSelected({ id: option.value, code: option.code });
    } else {
      setDistrictSelected(undefined);
    }
    setWardSelected(undefined);
    setPage(1);
  };

  const handleChangeWard = (value: any, option: any) => {
    if (option) {
      setWardSelected({ id: option.value, code: option.code });
    } else {
      setWardSelected(undefined);
    }
    setPage(1);
  };

  const debouncedUpdateInputValue = debounce((value) => {
    if (!value.trim()) {
      setFullTextSearch('');
    } else {
      setFullTextSearch(value);
    }
    setPage(1);
  }, 500);

  useEffect(() => {
    function handleClickOutside(event: any) {
      if (wrapperRef.current instanceof HTMLElement && event.target instanceof HTMLElement) {
        if (!wrapperRef.current.contains(event.target)) {
          setIsShowListManager(undefined);
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <Card id="clinic-management">
      <div className="clinic-management__header">
        <div className="clinic-management__header__title">
          {intl.formatMessage({
            id: 'clinic.list.title',
          })}
        </div>
        <CustomButton
          disabled={!permisstion.create}
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
          className="input-search"
          placeholder={intl.formatMessage({
            id: 'clinic.list.search',
          })}
          prefix={<IconSVG type="search" />}
          onChange={(e) => {
            if (debouncedUpdateInputValue.cancel) {
              debouncedUpdateInputValue.cancel();
            }
            debouncedUpdateInputValue(e.target.value);
          }}
          allowClear
        />
        <CustomSelect
          className="select-province"
          value={provinceSelected?.id || undefined}
          placeholder={intl.formatMessage({
            id: 'common.province.name',
          })}
          options={
            listProvince && listProvince.data && listProvince.data.length > 0
              ? listProvince.data.map((item) => ({
                  label: item.name,
                  value: item.id,
                  code: item.baseCode,
                }))
              : []
          }
          onChange={handleChangeProvince}
          allowClear
        />
        <CustomSelect
          className="select-district"
          value={districtSelected?.id || undefined}
          placeholder={intl.formatMessage({
            id: 'common.district.name',
          })}
          options={
            listDistrict && listDistrict.data && listDistrict.data.length > 0
              ? listDistrict.data.map((item) => ({
                  label: item.name,
                  value: item.id,
                  code: item.baseCode,
                }))
              : []
          }
          onChange={handleChangeDistrict}
          allowClear
        />
        <CustomSelect
          className="select-ward"
          value={wardSelected?.id || undefined}
          placeholder={intl.formatMessage({
            id: 'common.ward.name',
          })}
          options={
            listWard && listWard.data && listWard.data.length > 0
              ? listWard.data.map((item) => ({
                  label: item.name,
                  value: item.id,
                  code: item.baseCode,
                }))
              : []
          }
          onChange={handleChangeWard}
          allowClear
        />
      </div>

      {permisstion.read && (
        <TableWrap
          className="custom-table table-visible"
          data={listClinic?.data.content}
          // isLoading={isLoading}
          page={page}
          size={size}
          total={listClinic?.data.total}
          setSize={setSize}
          setPage={setPage}
          showPagination={true}
        >
          <Column
            title={intl.formatMessage({
              id: 'clinic.list.table.name',
            })}
            dataIndex="fullName"
            width={'15%'}
          />
          <Column
            title={intl.formatMessage({
              id: 'clinic.list.table.manager',
            })}
            dataIndex="manager"
            width={'15%'}
            render={(_, record: any) => {
              if (record.adminClinic && record.adminClinic.length > 0) {
                const data = record.adminClinic.map((item: any) => item.fullName);
                return (
                  <div className="manager-clinic">
                    <div>{record.adminClinic[0].fullName}</div>
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
              id: 'clinic.list.table.address',
            })}
            dataIndex="address"
            width={'25%'}
            render={(_, record: any) => {
              let detailAddress: string[] = [];
              if (record.ward) {
                detailAddress.push(record.ward.name);
              }
              if (record.district) {
                detailAddress.push(record.district.name);
              }
              if (record.province) {
                detailAddress.push(record.province.name);
              }
              return (
                <>
                  {record.address} {detailAddress.join(' - ')}
                </>
              );
            }}
          />
          <Column
            title={intl.formatMessage({
              id: 'clinic.list.table.status',
            })}
            dataIndex="status"
            width={'15%'}
            render={(_, record: any) => {
              let status = record.status ? Status.ACTIVE : Status.INACTIVE;
              return (
                <div className="status-clinic">
                  {status ? (
                    <>
                      <IconSVG type={status} />
                      <div>
                        {intl.formatMessage({
                          id: `common.${status}`,
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
                <div
                  className={permisstion.delete ? '' : 'disable'}
                  onClick={() => permisstion.delete && setIsShowModalDelete({ id: record.id, name: record.fullName })}
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
        onClose={handleClose}
      />
    </Card>
  );
};

export default ListClinic;
