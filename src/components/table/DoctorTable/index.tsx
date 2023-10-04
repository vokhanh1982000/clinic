import React, { useState } from 'react';
import TableWrap from '../../TableWrap';
import IconSVG from '../../icons/icons';
import { Column } from 'rc-table';
import CustomInput from '../../input/CustomInput';
import { Dropdown } from 'antd';
import CustomButton from '../../buttons/CustomButton';
import { DownOutlined } from '@ant-design/icons';
import { useIntl } from 'react-intl';
import { useNavigate } from 'react-router';
import { DoctorType } from '../../../constants/enum';
import { ConfirmDeleteModal } from '../../modals/ConfirmDeleteModal';
import { useQuery } from '@tanstack/react-query';
import { doctorClinicApi } from '../../../apis';

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
  const [isShowModalDelete, setIsShowModalDelete] = useState<{ id: string; name: string }>();
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  const [sort, setSort] = useState<string>('');
  const [categoryId, setCategoryId] = useState<any>(undefined);
  const [status, setStatus] = useState<number>(-1);
  const [fullTextSearch, setFullTextSearch] = useState<string>('');

  const { data, isLoading } = useQuery({
    queryKey: ['getAdminUser', { page, size, sort, fullTextSearch, categoryId, status }],
    queryFn: () => doctorClinicApi.doctorClinicControllerGetAll(page, size, sort, fullTextSearch, categoryId, status),
  });

  console.log(data);

  const items1: any = [
    {
      key: '1',
      label: (
        <div
          onClick={() => {
            setSpecialistSelect({
              id: '1',
              label: intl.formatMessage({
                id: 'doctor.list.filter.specialist',
              }),
            });
          }}
        >
          {intl.formatMessage({
            id: 'doctor.list.filter.specialist',
          })}
        </div>
      ),
    },
    {
      key: '2',
      label: (
        <div
          onClick={() => {
            setSpecialistSelect({ id: '2', label: 'Example1' });
          }}
        >
          Example1
        </div>
      ),
    },
  ];

  const items2: any = [
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
    if (deleteFc && isShowModalDelete) deleteFc(isShowModalDelete.id);
    setIsShowModalDelete(undefined);
  };

  const handleClose = () => {
    setIsShowModalDelete(undefined);
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
          onChange={handleSearch}
        />
        <Dropdown className="dropdown-location" menu={{ items: items1 }} placement="bottomLeft" trigger={['click']}>
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
        <Dropdown className="dropdown-location" menu={{ items: items2 }} placement="bottomLeft" trigger={['click']}>
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
            id: 'doctor.list.table.code',
          })}
          dataIndex="code"
          width={'5%'}
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
        {doctorType !== DoctorType.DOCTOR && (
          <Column
            title={intl.formatMessage({
              id: 'doctor.list.table.workTime',
            })}
            dataIndex="workTime"
            width={'12%'}
          />
        )}
        <Column
          title={intl.formatMessage({
            id: 'doctor.list.table.status',
          })}
          dataIndex="status"
          width={'13%'}
          render={(_, record: any) => (
            <div className="status-doctor">
              <IconSVG type={record.status} />
              <div>
                {intl.formatMessage({
                  id: `doctor.status.${record.status}`,
                })}
              </div>
            </div>
          )}
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
    </div>
  );
};
