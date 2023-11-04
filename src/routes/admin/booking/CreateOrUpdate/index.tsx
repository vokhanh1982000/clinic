import React, { useEffect, useState } from 'react';
import { Card, Form, message, Select } from 'antd';
import useIntl from '../../../../util/useIntl';
import { IntlShape } from 'react-intl';
import { NavigateFunction, Params, useNavigate, useParams } from 'react-router-dom';
import DoctorInfo from '../../../../components/booking/DoctorInfo';
import CustomerInfo from '../../../../components/booking/CustomerInfo';
import ScheduleInfo, { BookingTime } from '../../../../components/booking/ScheduleInfo';
import Action from '../../../../components/booking/Action';
import IconSVG from '../../../../components/icons/icons';
import useForm from 'antd/es/form/hooks/useForm';
import { QueryClient, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { adminBookingApi, customerApi } from '../../../../apis';
import {
  AdminCreateBookingDto,
  AdminUpdateBookingDto,
  Booking,
  BookingStatusEnum,
  Clinic,
  Customer,
  DoctorClinic,
  UpdateStatusBookingDto,
} from '../../../../apis/client-axios';
import dayjs from 'dayjs';
import { BookingStatus } from '../../../../util/constant';
import ClinicInfo from '../../../../components/booking/ClinicInfo';
import { useAppDispatch } from '../../../../store';
import { roundTimeToNearestHalfHour } from '../../../../util/comm.func';
import { ConfirmCancelModal } from '../../../../components/booking/ConfirmCancelModal';
import { ADMIN_ROUTE_PATH } from '../../../../constants/route';

const CreateOrUpDateBooking = () => {
  const intl: IntlShape = useIntl();
  const { id }: Readonly<Params<string>> = useParams();
  const [form] = useForm();
  const [clinic, setClinic] = useState<Clinic>();
  const [doctorClinic, setDoctorClinic] = useState<DoctorClinic>();
  const [customer, setCustomer] = useState<Customer>();
  const [isSubmit, setIsSubmit] = useState<boolean>();
  const [currentStatus, setCurrentStatus] = useState<BookingStatusEnum>();
  const [date, setDate] = useState<dayjs.Dayjs>(dayjs(roundTimeToNearestHalfHour(new Date())));
  const [status, setStatus] = useState<BookingStatusEnum>();
  const [amTime, setAmTime] = useState<any[]>();
  const [pmTime, setPmTime] = useState<any[]>();
  const dispatch = useAppDispatch();
  const [showModalCancel, setShowModalCancel] = useState<boolean>(false);
  const navigate: NavigateFunction = useNavigate();
  const queryClient: QueryClient = useQueryClient();

  const { data: bookingData } = useQuery({
    queryKey: ['adminBookingDetail', id],
    queryFn: () => {
      return adminBookingApi.adminBookingControllerFindOne(id!);
    },
    enabled: !!id,
  });

  const { mutate: UpdateBooking } = useMutation({
    mutationFn: (dto: AdminUpdateBookingDto) => {
      return adminBookingApi.adminBookingControllerUpdate(id!, dto);
    },
    onSuccess: () => {
      message.success(
        intl.formatMessage({
          id: 'booking.message.update.success',
        })
      );
      queryClient.invalidateQueries({ queryKey: ['adminBookingDetail'] });
    },
    onError: () => {
      message.error(
        intl.formatMessage({
          id: 'booking.message.update.fail',
        })
      );
    },
  });

  const { mutate: CreateBooking } = useMutation({
    mutationFn: (dto: AdminCreateBookingDto) => {
      return adminBookingApi.adminBookingControllerCreate(dto);
    },
    onSuccess: () => {
      message.success(
        intl.formatMessage({
          id: 'booking.message.create.success',
        })
      );
      navigate(ADMIN_ROUTE_PATH.BOOKING_MANAGEMENT);
    },
    onError: () => {
      message.error(
        intl.formatMessage({
          id: 'booking.message.create.fail',
        })
      );
    },
  });

  const { mutate: CancelBooking } = useMutation({
    mutationFn: (dto: UpdateStatusBookingDto) => adminBookingApi.adminBookingControllerCancelBooking(id!, dto),
    onSuccess: () => {
      message.success(
        intl.formatMessage({
          id: 'booking.message.update.success',
        })
      );
      queryClient.invalidateQueries({ queryKey: ['adminBookingDetail'] });
    },
    onError: () => {
      message.error(
        intl.formatMessage({
          id: 'booking.message.update.fail',
        })
      );
    },
  });

  const { data: bookingTimeData } = useQuery({
    queryKey: ['adminBookingTime', { date, clinic, doctorClinic }],
    queryFn: () => {
      return adminBookingApi.adminBookingControllerCheckBookingByDate(
        date.format('YYYY-MM-DD'),
        clinic?.id,
        doctorClinic?.id
      );
    },
    enabled: !!clinic?.id,
  });

  const { data: checkCustomerData } = useQuery({
    queryKey: ['checkCustomerData'],
    queryFn: () => customerApi.customerControllerGetByUserId(bookingData?.data.createdByUserId || ''),
    enabled: !!bookingData?.data.createdByUserId,
  });

  const statusClassName = (status: BookingStatusEnum) => {
    if (status === BookingStatusEnum.Approved) {
      return 'create-booking-header__select-status-approved';
    }
    if (status === BookingStatusEnum.Pending) {
      return 'create-booking-header__select-status-pending';
    }
    if (status === BookingStatusEnum.Cancelled) {
      return 'create-booking-header__select-status-cancelled';
    }
    if (status === BookingStatusEnum.Completed) {
      return 'create-booking-header__select-status-completed';
    }
  };

  useEffect(() => {
    const data: Booking | undefined = bookingData?.data;
    form.setFieldsValue({ ...data, appointmentStartTime: dayjs(data?.appointmentStartTime) });
    setDoctorClinic(data?.doctorClinic);
    setCustomer(data?.customer);
    setClinic(data?.clinic);
    if (bookingData?.data.status) {
      setStatus(bookingData?.data.status);
      setCurrentStatus(bookingData.data.status);
    }
    if (!bookingData?.data.status) {
      setCurrentStatus(BookingStatusEnum.Pending);
      setStatus(BookingStatusEnum.Pending);
    }

    if (data?.appointmentStartTime) {
      setDate(dayjs(data?.appointmentStartTime));
    }
  }, [bookingData]);

  useEffect(() => {
    const data = bookingTimeData?.data as unknown as { arrOfTimeAM: BookingTime[]; arrOfTimePM: BookingTime[] };
    setAmTime(data?.arrOfTimeAM);
    setPmTime(data?.arrOfTimePM);
  }, [bookingTimeData]);
  const handleUpdate = () => {
    const data = form.getFieldsValue();
    const booking: AdminUpdateBookingDto = {
      ...data,
      appointmentStartTime: date.format(),
      id,
      appointmentEndTime: date.add(30, 'minute').format(),
      doctorClinicId: doctorClinic?.id,
      clinicId: clinic?.id,
      customerId: customer?.id,
    };
    setIsSubmit(true);
    if (!booking.customerId || !booking.clinicId) {
      return;
    }
    UpdateBooking(booking);
  };

  const handleCreate = () => {
    const data = form.getFieldsValue();
    const booking: AdminCreateBookingDto = {
      ...data,
      appointmentStartTime: date.format(),
      id,
      appointmentEndTime: date.add(30, 'minute').format(),
      doctorClinicId: doctorClinic?.id,
      clinicId: clinic?.id,
      customerId: customer?.id,
      status: BookingStatusEnum.Pending,
    };
    setIsSubmit(true);
    if (!booking.customerId || !booking.clinicId) {
      return;
    }
    CreateBooking(booking);
  };

  const handleCancel = () => {
    if (id) {
      CancelBooking({ status: BookingStatusEnum.Cancelled });
    }
    navigate(-1);
  };
  const isDisableItemStatus = (item: BookingStatusEnum) => {
    if (status === BookingStatusEnum.Pending) {
      if (item === BookingStatusEnum.Approved || item === BookingStatusEnum.Cancelled) {
        return false;
      }
    }
    if (status === BookingStatusEnum.Approved) {
      if (item === BookingStatusEnum.Completed) {
        return false;
      }
    }
    if (status === BookingStatusEnum.Approved) {
      return true;
    }
    return true;
  };
  console.log(checkCustomerData?.data, 'wapwap');
  return (
    <Card id={'create-booking-management'}>
      <div className={'create-booking-header'}>
        <span className={'create-booking-header__title'}>
          {id
            ? intl.formatMessage({
                id: 'booking.edit.title',
              })
            : intl.formatMessage({
                id: 'booking.create.title',
              })}
        </span>
        <Form className={'header-form'} form={form}>
          {id && (
            <>
              <span className={'create-booking-header__code'}>#{bookingData?.data.order} </span>
              <span
                className={'create-booking-header__copy'}
                onClick={() => {
                  return navigator.clipboard.writeText(`${bookingData?.data.order}`);
                }}
              >
                <IconSVG type={'copy'} />
              </span>
              <Form.Item name={'status'} className={'status'}>
                <Select
                  // disabled={status !== 'pending' && status !== 'approved'}
                  className={`create-booking-header__select-status ${statusClassName(currentStatus!)} `}
                  value={BookingStatusEnum.Pending}
                  options={BookingStatus.map((item) => ({
                    label: intl.formatMessage({ id: item.label }),
                    value: item.value,
                    disabled: isDisableItemStatus(item.value),
                  }))}
                  suffixIcon={<IconSVG type={'dropdown'} />}
                  onChange={(value) => setCurrentStatus(value as BookingStatusEnum)}
                ></Select>
              </Form.Item>
            </>
          )}
        </Form>
      </div>
      <Form
        className={'form-create-booking'}
        layout={'vertical'}
        form={form}
        onFinish={id ? handleUpdate : handleCreate}
      >
        <div className={'left-container'}>
          <ClinicInfo
            isCreatedByCustomer={!!checkCustomerData?.data.id}
            status={status}
            form={form}
            setDoctorClinic={setDoctorClinic}
            setClinic={setClinic}
            clinic={clinic}
            role={'admin'}
            type={id ? 'update' : 'create'}
            isSubmit={isSubmit}
          />
          <DoctorInfo
            isCreatedByCustomer={!!checkCustomerData?.data.id}
            status={status}
            form={form}
            clinic={clinic}
            setDoctorClinic={setDoctorClinic}
            doctorClinic={doctorClinic}
            role={'admin'}
            type={id ? 'update' : 'create'}
          />
          <CustomerInfo
            isCreatedByCustomer={!!checkCustomerData?.data.id}
            status={status}
            customer={customer}
            form={form}
            setCustomer={setCustomer}
            role={'admin'}
            type={id ? 'update' : 'create'}
            isSubmit={isSubmit}
          />
        </div>
        <div className={'right-container'}>
          <div className={'schedule-info-area'}>
            <ScheduleInfo
              status={status}
              form={form}
              type={id ? 'update' : 'create'}
              role={'admin'}
              amTime={amTime}
              pmTime={pmTime}
              date={date}
              setDate={setDate}
              isCreatedByCustomer={!!checkCustomerData?.data.id}
            />
          </div>
          <div className={'action-area'}>
            <Action
              status={status}
              form={form}
              type={id ? 'update' : 'create'}
              role={'admin'}
              onCancel={() => setShowModalCancel(true)}
              isCreatedByCustomer={!!checkCustomerData?.data.id}
            />
          </div>
        </div>
        <ConfirmCancelModal
          name={!id ? '' : `#${bookingData?.data.order}`}
          visible={showModalCancel}
          onSubmit={() => handleCancel()}
          onClose={() => setShowModalCancel(false)}
        />
      </Form>
    </Card>
  );
};

export default CreateOrUpDateBooking;
