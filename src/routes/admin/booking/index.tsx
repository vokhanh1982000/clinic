import { useQuery } from '@tanstack/react-query';
import { Card, Col, DatePicker, Form, Row } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs, { Dayjs } from 'dayjs';
import moment from 'moment';
import { KeyboardEvent, useState } from 'react';
import { useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import { adminBookingApi } from '../../../apis';
import { Booking } from '../../../apis/client-axios';
import FormSearch from '../../../components/FormSearch';
import FormWrap from '../../../components/FormWrap';
import TableWrap from '../../../components/TableWrap';
import { NOTES } from '../../../components/TimelineControl/constants';
import CustomSelect from '../../../components/select/CustomSelect';
import { ADMIN_ROUTE_NAME, ADMIN_ROUTE_PATH } from '../../../constants/route';
import { DATE_TIME_FORMAT, statusBackgroundColor } from '../../../util/constant';

interface IFormData {
  keyword?: string;
  time?: Dayjs;
  status?: string[];
}

interface IFilter {
  page: number;
  size?: number;
  sort?: string;
}

const n = (key: keyof IFormData) => key;

const { RangePicker } = DatePicker;

const ListBooking = () => {
  const intl = useIntl();

  const [form] = Form.useForm<IFormData>();
  const keyword = Form.useWatch(n('keyword'), form) as string | undefined;
  const time = Form.useWatch(n('time'), form) as Dayjs[] | undefined;
  const status = Form.useWatch(n('status'), form) as
    | Array<'completed' | 'pending' | 'cancelled' | 'approved'>
    | undefined;

  const navigate = useNavigate();

  const [filter, setFilter] = useState<IFilter>({ page: 1, size: 10 });

  const { data: listBookingDayPaginated, refetch: onRefetchBookingDayPaginated } = useQuery({
    queryKey: ['adminBookingDayPaginated', time, filter, status],
    queryFn: () =>
      adminBookingApi.adminBookingControllerGetPaginatedBooking(
        filter.page,
        filter.size,
        filter.sort,
        keyword,
        Array.isArray(time) && time.length === 2 ? dayjs(time[0]).format(DATE_TIME_FORMAT) : undefined,
        Array.isArray(time) && time.length === 2 ? dayjs(time[1]).format(DATE_TIME_FORMAT) : undefined,
        Array.isArray(status) && status.length > 0 ? status : undefined
      ),
    enabled: !!filter,
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
      key: 'clinic',
      title: intl.formatMessage({ id: 'timeline.adminClinic.bookingManagement.clinic' }),
      render: (value: Booking) => (
        <span
          className="font-size-16 font-family-primary color-1A1A1A cursor-pointer"
          onClick={() => navigate(`${ADMIN_ROUTE_NAME.CLINIC}/${value.clinicId}`)}
        >
          {value.clinic?.fullName}
        </span>
      ),
    },
    {
      align: 'left',
      key: 'doctor',
      title: intl.formatMessage({ id: 'timeline.adminClinic.bookingManagement.doctor' }),
      render: (value: Booking) => (
        <span
          className="font-size-16 font-family-primary color-1A1A1A cursor-pointer"
          onClick={() => navigate(`${ADMIN_ROUTE_PATH.SCHEDULE_DOCTOR}/${value.clinicId}`)}
        >
          {value.doctorClinic?.fullName}
        </span>
      ),
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
              style={{ backgroundColor: statusBackgroundColor[value.status as keyof typeof statusBackgroundColor] }}
            />
            <span className="font-size-16 font-family-primary color-1A1A1A">
              {intl.formatMessage({ id: findStatus?.messageId })}
            </span>
          </div>
        );
      },
    },
  ];

  const handleKeyDown = (e: KeyboardEvent<HTMLFormElement>) => {
    if (e.code === 'Enter') form.submit();
  };

  const onFinish = () => {
    onRefetchBookingDayPaginated();
  };

  return (
    <Card>
      <Row gutter={[0, 16]}>
        <Col span={24}>
          <h3 className="font-size-24 font-weight-700 color-1A1A1A font-family-primary text-capitalize m-b-0">
            {intl.formatMessage({ id: 'menu.bookingManagement' })}
          </h3>
        </Col>
        <Col span={24}>
          <FormWrap
            name="bookingManagementEmpty"
            form={form}
            onFinish={onFinish}
            onKeyDown={handleKeyDown}
            layout="inline"
          >
            <FormSearch
              name={n('keyword')}
              inputProps={{ placeholder: intl.formatMessage({ id: 'customer.list.search' }) }}
            />
            <Form.Item name={n('time')} className="m-b-0">
              <RangePicker className="height-48 timeline-custom-range-picker" />
            </Form.Item>
            <Form.Item name={n('status')} className="m-b-0">
              <CustomSelect
                maxTagCount={2}
                showSearch={false}
                mode="multiple"
                placeholder={intl.formatMessage({ id: 'timeline.adminClinic.bookingManagement.status' })}
                options={[
                  {
                    value: 'all',
                    label: intl.formatMessage({
                      id: 'common.option.all',
                    }),
                  },
                  ...NOTES.filter((_, index) => index < NOTES.length - 1).map((note) => ({
                    label: intl.formatMessage({ id: note.messageId }),
                    value: note.status,
                  })),
                ]}
                className="width-184 height-48"
                allowClear
              />
            </Form.Item>
          </FormWrap>
        </Col>
        <Col span={24}>
          <TableWrap
            className="custom-table"
            showPagination
            columns={columns}
            data={listBookingDayPaginated?.data.content}
            setPage={(page) => setFilter((prev) => ({ ...prev, page }))}
            setSize={(size) => setFilter((prev) => ({ ...prev, size }))}
            rowKey="key"
            page={filter.page}
            size={filter.size}
            total={listBookingDayPaginated?.data.total}
            scroll={{ y: 'calc(100vh - 345px)' }}
          />
        </Col>
      </Row>
    </Card>
  );
};
export default ListBooking;
