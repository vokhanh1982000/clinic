import { useQuery } from '@tanstack/react-query';
import { Card, Col, Form, Row } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import { adminClinicBookingApi } from '../../../../apis';
import { Booking, BookingStatusEnum } from '../../../../apis/client-axios';
import FormSearch from '../../../../components/FormSearch';
import FormWrap from '../../../../components/FormWrap';
import TableWrap from '../../../../components/TableWrap';
import { NOTES } from '../../../../components/TimelineControl/constants';
import moment from 'moment';
import IconSVG from '../../../../components/icons/icons';

interface IFormData {
  keyword?: string;
}

interface IFilter {
  page: number;
  size?: number;
  sort?: string;
}

const n = (key: keyof IFormData) => key;

const backgroundColor = {
  [BookingStatusEnum.Approved]: '#3867D6',
  [BookingStatusEnum.Pending]: '#F7B731',
  [BookingStatusEnum.Cancelled]: '#D63A3A',
};

const ListBookingEmpty = () => {
  const intl = useIntl();

  const [form] = Form.useForm<IFormData>();
  const keyword = Form.useWatch(n('keyword'), form);

  const [filter, setFilter] = useState<IFilter>({ page: 1, size: 10 });

  const { data: listBookingEmpty, refetch: onRefetchBookingEmpty } = useQuery({
    queryKey: ['adminClinicBookingEmpty', filter],
    queryFn: () =>
      adminClinicBookingApi.adminClinicBookingControllerFindBookingPendingDoctor(
        filter.page,
        filter.size,
        filter.sort,
        keyword
      ),
    enabled: !!filter.page && !!filter.size,
  });

  const columns: ColumnsType<Booking> = [
    {
      align: 'center',
      key: 'code',
      title: intl.formatMessage({ id: 'timeline.adminClinic.bookingManagement.code' }),
      render: (value: Booking) => <span className="font-size-16 font-family-primary color-1A1A1A">{value.order}</span>,
    },
    {
      align: 'left',
      key: 'patient',
      title: intl.formatMessage({ id: 'timeline.adminClinic.bookingManagement.patient' }),
      render: (value: Booking) => (
        <span className="font-size-16 font-family-primary color-1A1A1A">{value.customer?.fullName}</span>
      ),
    },
    {
      align: 'left',
      key: 'phoneNumber',
      title: intl.formatMessage({ id: 'timeline.adminClinic.bookingManagement.phoneNumber' }),
      render: (value: Booking) => (
        <span className="font-size-16 font-family-primary color-1A1A1A">{value.customer.phoneNumber}</span>
      ),
    },
    {
      align: 'left',
      key: 'gender',
      title: intl.formatMessage({ id: 'timeline.adminClinic.bookingManagement.gender' }),
      render: (value: Booking) => (
        <span className="font-size-16 font-family-primary color-1A1A1A">
          {intl.formatMessage({ id: `common.gender.${value.customer.gender}` })}
        </span>
      ),
    },
    {
      align: 'left',
      key: 'time',
      title: intl.formatMessage({ id: 'timeline.adminClinic.bookingManagement.time' }),
      render: (value: Booking) => (
        <span className="font-size-16 font-family-primary color-1A1A1A">
          {moment(value.appointmentStartTime || new Date()).format('HH:mm DD/MM/YYYY')}
        </span>
      ),
    },
    {
      align: 'left',
      key: 'status',
      title: intl.formatMessage({ id: 'timeline.adminClinic.bookingManagement.status' }),
      render: (value: Booking) => {
        const findStatus = NOTES.find((note) => note.status === value.status);

        return (
          <div className="d-flex align-items-center">
            <div
              className="border-radius-circle width-8 height-8 m-r-4"
              style={{ backgroundColor: backgroundColor[value.status as keyof typeof backgroundColor] }}
            />
            <span className="font-size-16 font-family-primary color-1A1A1A">
              {intl.formatMessage({ id: findStatus?.messageId })}
            </span>
          </div>
        );
      },
    },
    {
      align: 'center',
      key: 'action',
      title: intl.formatMessage({ id: 'timeline.adminClinic.bookingManagement.action' }),
      render: () => (
        <div className="d-flex align-items-center justify-content-center gap-12">
          <div className="cursor-pointer">
            <IconSVG type="edit" />
          </div>
          <span className="divider"></span>
          <div className="cursor-pointer">
            <IconSVG type="delete" />
          </div>
        </div>
      ),
    },
  ];

  const onFinish = () => {
    onRefetchBookingEmpty();
  };

  return (
    <Card className="custom-card">
      <Row gutter={[0, 16]}>
        <Col span={24}>
          <h3 className="font-size-24 font-weight-700 color-1A1A1A font-family-primary text-capitalize m-t-24 m-b-0">
            {intl.formatMessage({ id: 'menu.bookingManagement.empty' })}
          </h3>
        </Col>
        <Col span={24}>
          <FormWrap name="bookingManagementEmpty" form={form} onFinish={onFinish}>
            <FormSearch
              name={n('keyword')}
              inputProps={{ placeholder: intl.formatMessage({ id: 'customer.list.search' }) }}
            />
          </FormWrap>
        </Col>
        <Col span={24}>
          <TableWrap
            className="custom-table"
            showPagination
            columns={columns}
            data={listBookingEmpty?.data.content}
            setPage={(page) => setFilter((prev) => ({ ...prev, page }))}
            setSize={(size) => setFilter((prev) => ({ ...prev, size }))}
            rowKey="key"
            page={filter.page}
            size={filter.size}
            total={listBookingEmpty?.data.total}
          />
        </Col>
      </Row>
    </Card>
  );
};

export default ListBookingEmpty;
