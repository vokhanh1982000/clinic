import { useIntl } from 'react-intl';
import TableWrap from '../../../../../components/TableWrap';
import { useState } from 'react';
import Column from 'antd/es/table/Column';
import IconSVG from '../../../../../components/icons/icons';

interface DoctorListProps {
  clinicId?: string;
}

export const DoctorList = (props: DoctorListProps) => {
  const { clinicId } = props;
  const intl = useIntl();
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);

  const data = {
    data: {
      content: [
        {
          id: 1,
          code: 1264,
          name: 'Tăng Thăng Hà',
          email: 'bacsid@gmail.com',
          specialty: 'Chuyên môn 1',
          level: 'Phó Giáo Sư',
          schedule: '08:00 - 16:00',
          status: 'active',
          workStatus: 'Online',
        },
      ],
      total: 1,
    },
  };

  return (
    <div className="list-doctor">
      <div className="list-doctor__title">
        <div className="clinic-info__title__label">
          {intl.formatMessage({
            id: 'clinic.create.doctor-list.title',
          })}
        </div>
        <div className="line-title"></div>
      </div>
      {clinicId && (
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
              id: 'clinic.list.doctor-list.table.code',
            })}
            dataIndex="code"
            width={'10%'}
          />
          <Column
            title={intl.formatMessage({
              id: 'clinic.list.doctor-list.table.doctor',
            })}
            dataIndex="name"
            width={'13%'}
          />
          <Column
            title={intl.formatMessage({
              id: 'clinic.list.doctor-list.table.email',
            })}
            dataIndex="email"
            width={'13%'}
          />
          <Column
            title={intl.formatMessage({
              id: 'clinic.list.doctor-list.table.specialty',
            })}
            dataIndex="specialty"
            width={'12%'}
          />
          <Column
            title={intl.formatMessage({
              id: 'clinic.list.doctor-list.table.level',
            })}
            dataIndex="level"
            width={'12%'}
          />
          <Column
            title={intl.formatMessage({
              id: 'clinic.list.doctor-list.table.schedule',
            })}
            dataIndex="schedule"
            width={'13%'}
          />
          <Column
            title={intl.formatMessage({
              id: 'clinic.list.doctor-list.table.status',
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
              id: 'clinic.list.doctor-list.table.workStatus',
            })}
            dataIndex="workStatus"
            width={'13%'}
          />
        </TableWrap>
      )}
    </div>
  );
};
