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

interface DoctorTableProps {
  placeHolder?: string;
  doctorType: DoctorType;
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
  const { placeHolder, doctorType } = props;
  const intl = useIntl();
  const navigate = useNavigate();
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  const [sort, setSort] = useState<string>('');
  const [fullTextSearch, setFullTextSearch] = useState<string>('');
  const [specialistSelect, setSpecialistSelect] = useState<OptionSpecialist>();
  const [statusSelect, setStatusSelect] = useState<OptionStatus>();
  const [isShowModalDelete, setIsShowModalDelete] = useState<{ id: string; name: string }>();

  const data = {
    data: {
      content: [
        {
          id: '1237',
          code: '1237',
          name: 'Nguyễn Thị Quỳnh',
          email: 'abc@gmail.com',
          phone: '0968 544 442',
          specialist: 'Dạ Dày',
          level: 'Phó Giáo Sư ',
          workTime: '08:00 - 17:00',
          status: 'active',
        },
      ],
      total: 1,
    },
  };

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
      key: '1',
      label: (
        <div
          onClick={() => {
            setSpecialistSelect({
              id: '1',
              label: intl.formatMessage({
                id: 'doctor.list.filter.status',
              }),
            });
          }}
        >
          {intl.formatMessage({
            id: 'doctor.list.filter.status',
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

  const handleDelete = () => {
    console.log(isShowModalDelete?.id);
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
          dataIndex="name"
          width={'12%'}
        />
        <Column
          title={intl.formatMessage({
            id: 'doctor.list.table.email',
          })}
          dataIndex="email"
          width={'12%'}
        />
        <Column
          title={intl.formatMessage({
            id: 'doctor.list.table.phone',
          })}
          dataIndex="phone"
          width={'12%'}
        />
        <Column
          title={intl.formatMessage({
            id: 'doctor.list.table.specialist',
          })}
          dataIndex="specialist"
          width={'12%'}
        />
        <Column
          title={intl.formatMessage({
            id: 'doctor.list.table.level',
          })}
          dataIndex="level"
          width={'12%'}
        />
        <Column
          title={intl.formatMessage({
            id: 'doctor.list.table.workTime',
          })}
          dataIndex="workTime"
          width={'12%'}
        />
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
                  id: `common.${record.status}`,
                })}
              </div>
            </div>
          )}
        />
        <Column
          title={intl.formatMessage({
            id: 'doctor.list.table.action',
          })}
          dataIndex="action"
          width={'10%'}
          render={(_, record: any) => (
            <div className="action-doctor">
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
