import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, message } from 'antd';
import Column from 'antd/es/table/Column';
import { useState } from 'react';
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
import { Status } from '../../../../constants/enum';
import { debounce } from 'lodash';

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

  const [provinceSelected, setProvinceSelected] = useState<{ id: string; code: string }>();
  const [districtSelected, setDistrictSelected] = useState<{ id: string; code: string }>();
  const [wardSelected, setWardSelected] = useState<{ id: string; code: string }>();

  const { data: listProvince } = useQuery({
    queryKey: ['provinceList'],
    queryFn: () => cadastralApi.cadastralControllerGetProvince(),
  });

  const { data: listDistrict } = useQuery({
    queryKey: ['districtList', provinceSelected],
    queryFn: () => cadastralApi.cadastralControllerGetDistrictByProvince(undefined, provinceSelected?.code),
    enabled: !!provinceSelected,
  });

  const { data: listWard } = useQuery({
    queryKey: ['wardList', districtSelected],
    queryFn: () => cadastralApi.cadastralControllerGetWardByCode(undefined, undefined, districtSelected?.code),
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
  });

  const { mutate: DeleteClinic, status: statusDeleteClinic } = useMutation(
    (id: string) => clinicsApi.clinicControllerDeleteClinic(id),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['getClinics']);
      },
      onError: (error: any) => {
        message.error(error.message);
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
    setProvinceSelected({ id: option.value, code: option.code });
    setDistrictSelected(undefined);
    setWardSelected(undefined);
  };

  const handleChangeDistrict = (value: any, option: any) => {
    setDistrictSelected({ id: option.value, code: option.code });
    setWardSelected(undefined);
  };

  const handleChangeWard = (value: any, option: any) => {
    setWardSelected({ id: option.value, code: option.code });
  };

  const debouncedUpdateInputValue = debounce((value) => {
    setFullTextSearch(value);
  }, 500);

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
        />
        <CustomSelect
          className="select-province"
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
        />
        <CustomSelect
          className="select-district"
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
        />
        <CustomSelect
          className="select-ward"
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
        />
      </div>

      <TableWrap
        className="custom-table"
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
              return (
                <div className="manager-clinic">
                  <div>{record.manager}</div>
                  {record.adminClinic.length > 1 && <IconSVG type="more" />}
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
            id: 'clinic.list.table.address',
          })}
          dataIndex="status"
          width={'15%'}
          render={(_, record: any) => {
            let status = record.status ? Status.ACTIVE : Status.INACTIVE;
            return (
              <div className="status-customer">
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
        onClose={handleClose}
      />
    </Card>
  );
};

export default ListClinic;
