import { useMutation, useQuery } from '@tanstack/react-query';
import { Card, Col, DatePicker, Form, Input, Row, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs, { Dayjs } from 'dayjs';
import { debounce } from 'lodash';
import moment from 'moment';
import { ChangeEvent, KeyboardEvent, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { adminBookingApi } from '../../../apis';
import { Booking } from '../../../apis/client-axios';
import FormWrap from '../../../components/FormWrap';
import TableWrap from '../../../components/TableWrap';
import { IFilter, NOTES } from '../../../components/TimelineControl/constants';
import CustomButton from '../../../components/buttons/CustomButton';
import IconSVG from '../../../components/icons/icons';
import CustomInput from '../../../components/input/CustomInput';
import { ConfirmDeleteModal } from '../../../components/modals/ConfirmDeleteModal';
import CustomSelect from '../../../components/select/CustomSelect';
import { PERMISSIONS } from '../../../constants/enum';
import { ADMIN_ROUTE_NAME, ADMIN_ROUTE_PATH } from '../../../constants/route';
import { RootState } from '../../../store';
import CheckPermission, { Permission } from '../../../util/check-permission';
import {
  DATE_TIME_FORMAT,
  SHORT_DATE_FORMAT,
  TABLE_DATE_TIME_FORMAT,
  statusBackgroundColor,
} from '../../../util/constant';

interface IFormData {
  keyword?: string;
  time?: Dayjs;
  status?: string[];
}

const n = (key: keyof IFormData) => key;

const { RangePicker } = DatePicker;

const ListBooking = () => {
  const intl = useIntl();

  const [form] = Form.useForm<IFormData>();
  const keyword = Form.useWatch(n('keyword'), form) as string | undefined;
  const time = Form.useWatch(n('time'), form) as Dayjs[] | undefined;
  const status = Form.useWatch(n('status'), form) as
    | Array<'completed' | 'pending' | 'cancelled' | 'approved' | 'all'>
    | undefined;

  const navigate = useNavigate();
  const [filter, setFilter] = useState<IFilter>({ page: 1, size: 10 });
  const { authUser } = useSelector((state: RootState) => state.auth);
  const [permisstion, setPermisstion] = useState<Permission>({
    read: false,
    create: false,
    delete: false,
    update: false,
  });
  const [permisstionClinic, setPermisstionClinic] = useState<Permission>({
    read: false,
    create: false,
    delete: false,
    update: false,
  });
  const [isShowModalDelete, setIsShowModalDelete] = useState<{ id: string; name: string }>();

  useEffect(() => {
    if (authUser?.user?.roles) {
      setPermisstion({
        read: Boolean(CheckPermission(PERMISSIONS.ReadBooking, authUser)),
        create: Boolean(CheckPermission(PERMISSIONS.CreateBooking, authUser)),
        delete: Boolean(CheckPermission(PERMISSIONS.DeleteBooking, authUser)),
        update: Boolean(CheckPermission(PERMISSIONS.UpdateBooking, authUser)),
      });
      setPermisstionClinic({
        read: Boolean(CheckPermission(PERMISSIONS.ReadClinic, authUser)),
        create: Boolean(CheckPermission(PERMISSIONS.CreateClinic, authUser)),
        delete: Boolean(CheckPermission(PERMISSIONS.DeleteClinic, authUser)),
        update: Boolean(CheckPermission(PERMISSIONS.UpdateClinic, authUser)),
      });
    }
  }, [authUser]);

  const { data: listBookingDayPaginated, refetch: onRefetchListBooking } = useQuery({
    queryKey: ['adminBookingDayPaginated', time, filter, status, keyword],
    queryFn: () =>
      adminBookingApi.adminBookingControllerGetPaginatedBooking(
        filter.page,
        filter.size,
        filter.sort,
        keyword,
        Array.isArray(time) && time.length === 2 ? dayjs(time[0]).format(DATE_TIME_FORMAT) : undefined,
        Array.isArray(time) && time.length === 2 ? dayjs(time[1]).format(DATE_TIME_FORMAT) : undefined,
        Array.isArray(status) && status.filter((item) => item !== 'all').length > 0
          ? (status as Array<'completed' | 'pending' | 'cancelled' | 'approved'>)
          : undefined
      ),
    enabled: !!filter,
  });

  const { mutate: DeleteBooking } = useMutation({
    mutationFn: (id: string) => adminBookingApi.adminBookingControllerRemove(id),
    onSuccess: () => {
      message.success(intl.formatMessage({ id: 'common.deleteeSuccess' }));
      onRefetchListBooking();
    },
    onError: () => {
      message.error(intl.formatMessage({ id: 'common.common.deleteFail' }));
    },
  });

  const handleDelete = () => {
    if (isShowModalDelete && isShowModalDelete.id) {
      DeleteBooking(isShowModalDelete.id);
    }
    setIsShowModalDelete(undefined);
  };

  const columns: ColumnsType<Booking> = [
    {
      align: 'center',
      key: 'code',
      width: '7%',
      title: intl.formatMessage({ id: 'timeline.adminClinic.bookingManagement.code' }),
      render: (value: Booking) => <span className="font-size-14 font-family-primary color-1A1A1A">{value.order}</span>,
    },
    {
      align: 'left',
      key: 'clinic',
      title: intl.formatMessage({ id: 'timeline.adminClinic.bookingManagement.clinic' }),
      width: '25%',
      render: (value: Booking) => (
        <span
          className="font-size-14 font-family-primary color-1A1A1A cursor-pointer text-decoration-underline"
          onClick={() =>
            permisstionClinic.read &&
            navigate(
              `${ADMIN_ROUTE_NAME.CLINIC}/${value.clinicId}?date=${moment(value.appointmentStartTime).format(
                DATE_TIME_FORMAT
              )}`
            )
          }
        >
          {value.clinic?.fullName}
        </span>
      ),
    },
    {
      align: 'left',
      key: 'doctor',
      title: intl.formatMessage({ id: 'timeline.adminClinic.bookingManagement.doctor' }),
      width: '17%',
      render: (value: Booking) => (
        <span
          className="font-size-14 font-family-primary color-1A1A1A cursor-pointer text-decoration-underline"
          onClick={() =>
            navigate(`${ADMIN_ROUTE_PATH.SCHEDULE_DOCTOR}/${value.doctorClinicId}?clinicId=${value.clinicId}`)
          }
        >
          {value.doctorClinic?.fullName}
        </span>
      ),
    },
    {
      align: 'left',
      key: 'patient',
      title: intl.formatMessage({ id: 'timeline.adminClinic.bookingManagement.patient' }),
      width: '17%',
      render: (value: Booking) => (
        <span className="font-size-14 font-family-primary color-1A1A1A">{value.customer?.fullName}</span>
      ),
    },
    {
      align: 'left',
      key: 'time',
      title: intl.formatMessage({ id: 'timeline.adminClinic.bookingManagement.time' }),
      width: '17%',
      render: (value: Booking) => (
        <span className="font-size-14 font-family-primary color-1A1A1A">
          {moment(value.appointmentStartTime || new Date()).format(TABLE_DATE_TIME_FORMAT)}
        </span>
      ),
    },
    {
      align: 'left',
      key: 'status',
      title: intl.formatMessage({ id: 'timeline.adminClinic.bookingManagement.status' }),
      width: '17%',
      render: (value: Booking) => {
        const findStatus = NOTES.find((note) => note.status === value.status);

        return (
          <div className="d-flex align-items-center">
            <div
              className="border-radius-circle width-8 height-8 m-r-4"
              style={{ backgroundColor: statusBackgroundColor[value.status as keyof typeof statusBackgroundColor] }}
            />
            <span className="font-size-14 font-family-primary color-1A1A1A">
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
      render: (value: Booking) => (
        <div className="d-flex align-items-center justify-content-center gap-12">
          <div
            className="cursor-pointer"
            onClick={() => navigate(`${ADMIN_ROUTE_PATH.DETAIL_BOOKING}/${value.id}?routeEmpty=1`)}
          >
            <IconSVG type="edit" />
          </div>
          <span className="divider"></span>
          <div
            className="cursor-pointer"
            onClick={() => setIsShowModalDelete({ id: value.id, name: value.order.toString() })}
          >
            <IconSVG type="delete" />
          </div>
        </div>
      ),
    },
  ];

  const handleKeyDown = (e: KeyboardEvent<HTMLFormElement>) => {
    if (e.code === 'Enter') form.submit();
  };

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    if (debouncedUpdateInputValue.cancel) {
      debouncedUpdateInputValue.cancel();
    }

    debouncedUpdateInputValue(e.target.value);
  };

  const debouncedUpdateInputValue = debounce((value) => {
    form.setFieldValue(n('keyword'), value);
    setFilter((prev) => ({ ...prev, page: 1 }));
  }, 500);

  const handlePressEnter = (e: KeyboardEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    form.setFieldValue(n('keyword'), value);
    setFilter((prev) => ({ ...prev, page: 1 }));
  };

  const handleSelectStatus = (value: string) => {
    setFilter((prev) => ({ ...prev, page: 1 }));

    const allStatus = NOTES.filter((_, index) => index < NOTES.length - 1);
    const status = form.getFieldValue(n('status')) as string[];

    if (status.includes('all') && value !== 'all') {
      form.setFieldValue(
        n('status'),
        status.filter((item) => item !== 'all')
      );

      return;
    }

    if ((status.length === allStatus.length && value !== 'all') || value === 'all') {
      form.setFieldValue(n('status'), ['all']);
    }
  };

  return (
    <Card id={'list-booking'}>
      <Row gutter={[0, 16]}>
        <Col span={24}>
          <h3 className="font-size-14 font-weight-700 color-1A1A1A font-family-primary text-capitalize m-b-0">
            {intl.formatMessage({ id: 'menu.bookingManagement' })}
          </h3>
        </Col>
        <Col span={24} className={'form-area'}>
          <FormWrap name="bookingManagementEmpty" form={form} onKeyDown={handleKeyDown} layout="inline">
            <Form.Item name={n('keyword')} className="d-none">
              <Input />
            </Form.Item>
            <CustomInput
              placeholder={intl.formatMessage({ id: 'timeline.control.search.placeholder' })}
              prefix={<IconSVG type="search" />}
              className="input-search width-350 timeline-custom-input"
              allowClear
              onChange={handleSearch}
              onPressEnter={handlePressEnter}
            />
            <Form.Item name={n('time')} className="m-b-0">
              <RangePicker
                className="height-48 timeline-custom-range-picker"
                format={SHORT_DATE_FORMAT}
                inputReadOnly
                onChange={() => setFilter((prev) => ({ ...prev, page: 1 }))}
              />
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
                className="width-184 height-48 timeline-custom-select"
                allowClear
                onSelect={handleSelectStatus}
              />
            </Form.Item>
          </FormWrap>
          <div className={'action'}>
            <CustomButton
              icon={<IconSVG type="create" />}
              className={'action__create'}
              onClick={() => navigate(ADMIN_ROUTE_PATH.CREATE_BOOKING)}
              disabled={!permisstion.create}
            >
              {intl.formatMessage({ id: 'timeline.admin.button.create' })}
            </CustomButton>
          </div>
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
          />
        </Col>
      </Row>

      <ConfirmDeleteModal
        name={
          isShowModalDelete && isShowModalDelete.name
            ? intl.formatMessage({ id: 'common.code' }) + ' ' + isShowModalDelete.name
            : ''
        }
        subName={intl.formatMessage({ id: 'timeline.schedule' })}
        visible={!!isShowModalDelete}
        onSubmit={handleDelete}
        onClose={() => {
          setIsShowModalDelete(undefined);
        }}
      />
    </Card>
  );
};
export default ListBooking;
