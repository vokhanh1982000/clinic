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
import { useQuery } from '@tanstack/react-query';
import { categoryApi, doctorClinicApi, doctorSupportApi } from '../../../apis';
import { useAppSelector } from '../../../store';
import { AdministratorClinic } from '../../../apis/client-axios';

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
  const [categoryId, setCategoryId] = useState<string[]>([]);
  const [status, setStatus] = useState<number>(-1);
  const [fullTextSearch, setFullTextSearch] = useState<string>('');
  const [clinicId, setClinicId] = useState<string>();
  const user = useAppSelector((state) => state.auth).authUser;

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

  const statusDoctor: any = [
    {
      key: '0',
      label: (
        <div onClick={() => setStatus(-1)}>
          {intl.formatMessage({
            id: 'All',
          })}
        </div>
      ),
    },
    {
      key: '1',
      label: (
        <div onClick={() => setStatus(1)}>
          {intl.formatMessage({
            id: 'doctor.status.true',
          })}
        </div>
      ),
    },
    {
      key: '2',
      label: (
        <div onClick={() => setStatus(0)}>
          {intl.formatMessage({
            id: 'doctor.status.false',
          })}
        </div>
      ),
    },
  ];

  const handleSearch = (e: any) => {
    if (!e.target.value.trim()) return setFullTextSearch('');
    setFullTextSearch(e.target.value);
  };

  const handleDelete = () => {
    if (deleteFc && isShowModalDelete?.id) deleteFc(isShowModalDelete.id);
    setIsShowModalDelete(undefined);
  };

  const handleClose = () => {
    setIsShowModalDelete({ id: undefined, name: isShowModalDelete?.name });
  };

  const menu = (
    <Menu>
      <Menu.Item key="0" onClick={() => setCategoryId([])}>
        All
      </Menu.Item>
      {category?.data.content?.map((item) => (
        <Menu.Item
          key={item.id}
          onClick={() => {
            setSpecialistSelect({ id: item.id, label: item.name });
            setCategoryId([item.id]);
          }}
        >
          {item.name}
        </Menu.Item>
      ))}
    </Menu>
  );

  return (
    <div className="doctor-table">
      <div className="doctor-table__filter">
        <CustomInput
          placeholder={intl.formatMessage({
            id: `${doctorType}.list.place-holder`,
          })}
          prefix={<IconSVG type="search" />}
          className="input-search"
          onChange={handleSearch}
        />
        <Dropdown overlay={menu} className="dropdown-location" placement="bottomLeft" trigger={['click']}>
          <CustomButton className="button-location">
            <IconSVG type="specialist"></IconSVG>
            <div>
              {specialistSelect
                ? specialistSelect.label
                : intl.formatMessage({
                    id: 'doctor.list.filter.specialist',
                  })}
            </div>
            <DownOutlined />
          </CustomButton>
        </Dropdown>
        <Dropdown
          className="dropdown-location"
          menu={{ items: statusDoctor }}
          placement="bottomLeft"
          trigger={['click']}
        >
          <CustomButton className="button-location">
            <IconSVG type="status"></IconSVG>
            <div>
              {specialistSelect
                ? specialistSelect.label
                : intl.formatMessage({
                    id: 'doctor.list.filter.status',
                  })}
            </div>
            <DownOutlined />
          </CustomButton>
        </Dropdown>
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
            let status = record.status ? Status.ACTIVE : Status.INACTIVE;
            return (
              <div className="status-doctor">
                {status ? (
                  <>
                    <IconSVG type={status} />
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
