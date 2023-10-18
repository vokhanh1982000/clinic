import React, { useEffect, useState } from 'react';
import TableWrap from '../../TableWrap';
import IconSVG from '../../icons/icons';
import { Column } from 'rc-table';
import CustomInput from '../../input/CustomInput';
import { Dropdown, Menu, MenuProps } from 'antd';
import CustomButton from '../../buttons/CustomButton';
import { DownOutlined } from '@ant-design/icons';
import { useIntl } from 'react-intl';
import { useNavigate } from 'react-router';
import { DoctorType, LanguageType, Status } from '../../../constants/enum';
import { ConfirmDeleteModal } from '../../modals/ConfirmDeleteModal';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { categoryApi, doctorClinicApi, doctorSupportApi } from '../../../apis';
import { useAppSelector } from '../../../store';
import { AdministratorClinic } from '../../../apis/client-axios';
import CustomSelect from '../../select/CustomSelect';
import { DefaultOptionType } from 'antd/es/select';

interface DoctorTableProps {
  placeHolder?: string;
  doctorType: DoctorType;
  data?: any;
  deleteFc?: (id: string) => void;
}

interface OptionSpecialist {
  id: string;
  label: string;
}

interface OptionStatus {
  id: string;
  label: string;
}

export const DoctorTable = (props: DoctorTableProps) => {
  const { placeHolder, doctorType, deleteFc } = props;
  const intl = useIntl();
  const navigate = useNavigate();
  const [specialistSelect, setSpecialistSelect] = useState<OptionSpecialist>();
  const [statusSelect, setStatusSelect] = useState<OptionStatus>();
  const [isShowModalDelete, setIsShowModalDelete] = useState<{ id: string | undefined; name: string | undefined }>();
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  const [sort, setSort] = useState<string>('');
  const [categoryId, setCategoryId] = useState<any>([]);
  const [status, setStatus] = useState<number>(-1);
  const [fullTextSearch, setFullTextSearch] = useState<string>('');
  const [clinicId, setClinicId] = useState<string>();
  const user = useAppSelector((state) => state.auth).authUser;
  const queryClient = useQueryClient();

  useEffect(() => {
    if (user) {
      setClinicId((user as AdministratorClinic).clinicId);
    }
  }, [user]);

  const { data: doctorClinics } = useQuery({
    queryKey: ['getDoctorClinic', { page, size, sort, fullTextSearch, categoryId, status }],
    queryFn: () =>
      doctorClinicApi.doctorClinicControllerGetAll(page, size, sort, fullTextSearch, categoryId, undefined, status),
    enabled: !!(doctorType === DoctorType.DOCTOR && clinicId),
  });

  const { data: doctorSupports } = useQuery({
    queryKey: ['getDoctorSupport', { page, size, sort, fullTextSearch, categoryId, status }],
    queryFn: () =>
      doctorSupportApi.doctorSupportControllerFindDoctorSupport(
        page,
        size,
        sort,
        fullTextSearch,
        categoryId,
        status,
        undefined,
        undefined,
        undefined
      ),
    enabled: doctorType === DoctorType.DOCTOR_SUPPORT,
  });

  const { data: category } = useQuery({
    queryKey: ['category'],
    queryFn: () => categoryApi.categoryControllerFindCategory(1, 10, undefined, undefined),
  });

  const handleSearch = (e: any) => {
    if (!e.target.value.trim()) return setFullTextSearch('');
    setFullTextSearch(e.target.value);
    setPage(1);
  };

  const handleDelete = () => {
    if (deleteFc && isShowModalDelete?.id) deleteFc(isShowModalDelete.id);
    setIsShowModalDelete(undefined);
    doctorType === DoctorType.DOCTOR
      ? queryClient.invalidateQueries(['getDoctorClinic'])
      : queryClient.invalidateQueries(['getDoctorSupport']);
  };

  const handleClose = () => {
    setIsShowModalDelete({ id: undefined, name: isShowModalDelete?.name });
  };

  return (
    <div className="doctor-table">
      <div className="doctor-table__filter">
        <CustomInput
          placeholder={intl.formatMessage({
            id: `${doctorType}.list.place-holder`,
          })}
          prefix={<IconSVG type="search" />}
          className="input-search"
          allowClear
          onChange={handleSearch}
        />
        <CustomSelect
          className="select-category"
          placeholder={intl.formatMessage({
            id: 'doctor.list.filter.specialist',
          })}
          onChange={(e) => {
            setCategoryId(e);
          }}
          maxTagCount={2}
          mode="multiple"
          options={category?.data.content?.flatMap((item) => {
            return { value: item.id, label: item.name } as DefaultOptionType;
          })}
        />
        <CustomSelect
          className="select-status"
          placeholder={intl.formatMessage({
            id: 'doctor.list.filter.status',
          })}
          value={status}
          onChange={(e) => {
            setStatus(Number(e));
          }}
          options={[
            {
              value: -1,
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
        data={doctorType === DoctorType.DOCTOR ? doctorClinics?.data.content : doctorSupports?.data.content}
        // isLoading={isLoading}
        page={page}
        size={size}
        total={doctorType === DoctorType.DOCTOR ? doctorClinics?.data.total : doctorSupports?.data.total}
        setSize={setSize}
        setPage={setPage}
        showPagination={true}
      >
        <Column
          title={intl.formatMessage({
            id: 'doctor.list.table.code',
          })}
          dataIndex="code"
          width={'5%'}
          render={(_, record) => {
            return <>{_ ? String(_).toUpperCase() : ''}</>;
          }}
        />
        <Column
          title={intl.formatMessage({
            id: `${doctorType}.list.table.name`,
          })}
          dataIndex="fullName"
          width={'12%'}
        />
        <Column
          title={intl.formatMessage({
            id: 'doctor.list.table.email',
          })}
          dataIndex="emailAddress"
          width={'12%'}
        />
        {doctorType !== DoctorType.DOCTOR && (
          <Column
            title={intl.formatMessage({
              id: 'doctor.list.table.phone',
            })}
            dataIndex="phoneNumber"
            width={'12%'}
          />
        )}
        <Column
          title={intl.formatMessage({
            id: 'doctor.list.table.specialist',
          })}
          dataIndex="categories"
          width={'12%'}
          render={(_, record: any) => {
            const specialist = _.map((item: any) => item.name);
            return <div>{specialist.join(',')}</div>;
          }}
        />
        <Column
          title={intl.formatMessage({
            id: 'doctor.list.table.level',
          })}
          dataIndex="level"
          width={'12%'}
        />
        {/* {doctorType !== DoctorType.DOCTOR && (
          <Column
            title={intl.formatMessage({
              id: 'doctor.list.table.workTime',
            })}
            dataIndex="workTime"
            width={'12%'}
          />
        )} */}
        {doctorType === DoctorType.DOCTOR_SUPPORT && (
          <Column
            title={intl.formatMessage({
              id: 'doctor.list.language',
            })}
            width={'12%'}
            render={() => <div>{LanguageType.VN + ', ' + LanguageType.ENG}</div>}
          />
        )}
        <Column
          title={intl.formatMessage({
            id: 'doctor.list.table.status',
          })}
          dataIndex="status"
          width={'13%'}
          // render={(_, record: any) => (
          //   <div className="status-doctor">
          //     <IconSVG type={record.status} />
          //     <div>
          //       {intl.formatMessage({
          //         id: `doctor.status.${record.status}`,
          //       })}
          //     </div>
          //   </div>
          // )}

          render={(_, record: any) => {
            let statusType = record.status ? Status.ACTIVE : Status.INACTIVE;
            return (
              <div className="status-doctor">
                {status ? (
                  <>
                    <IconSVG type={statusType} />
                    <div>
                      {intl.formatMessage({
                        id: `doctor.status.${record.status}`,
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
            id: 'doctor.list.table.action',
          })}
          dataIndex="id"
          width={'10%'}
          render={(_, record: any) => (
            <div className="action-doctor">
              {doctorType === DoctorType.DOCTOR && (
                <>
                  <div onClick={() => navigate(`detail/${record.id}`)}>
                    <IconSVG type="bokking" />
                  </div>
                  <span className="divider"></span>
                </>
              )}
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
        visible={!!isShowModalDelete?.id}
        onSubmit={handleDelete}
        onClose={handleClose}
      />
    </div>
  );
};
