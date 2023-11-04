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
import { adminClinicBookingApi } from '../../../../apis';
import { useAppSelector } from '../../../../store';
import {
  AdminClinicCreateBookingDto,
  AdminClinicUpdateBookingDto,
  AdministratorClinic,
  Booking,
  BookingStatusEnum,
  Clinic,
  Customer,
  DoctorClinic,
  Prescription as PrescriptionType,
  UpdateStatusBookingDto,
} from '../../../../apis/client-axios';
import Prescription from '../../../../components/booking/Prescription';
import dayjs from 'dayjs';
import { BookingStatus } from '../../../../util/constant';
import { roundTimeToNearestHalfHour } from '../../../../util/comm.func';
import { ConfirmCancelModal } from '../../../../components/booking/ConfirmCancelModal';
import { ADMIN_CLINIC_ROUTE_PATH } from '../../../../constants/route';

const CreateOrUpDateBooking = () => {
  const intl: IntlShape = useIntl();
  const { id }: Readonly<Params<string>> = useParams();
  const [form] = useForm();
  const user: AdministratorClinic = useAppSelector((state) => state.auth).authUser as AdministratorClinic;
  const [clinic, setClinic] = useState<Clinic>();
  const [doctorClinic, setDoctorClinic] = useState<DoctorClinic>();
  const [customer, setCustomer] = useState<Customer>();
  const [prescription, setPrescription] = useState<PrescriptionType>();
  const [currentStatus, setCurrentStatus] = useState<BookingStatusEnum>();
  const [date, setDate] = useState<dayjs.Dayjs>(dayjs(roundTimeToNearestHalfHour(new Date())));
  const [amTime, setAmTime] = useState<any[]>();
  const [pmTime, setPmTime] = useState<any[]>();
  const [showModalCancel, setShowModalCancel] = useState<boolean>(false);
  const [status, setStatus] = useState<BookingStatusEnum>();
  const navigate: NavigateFunction = useNavigate();
  const queryClient: QueryClient = useQueryClient();
  const { data: bookingData } = useQuery({
    queryKey: ['adminClinicBookingDetail', id],
    queryFn: () => {
      return adminClinicBookingApi.adminClinicBookingControllerFindOne(id!);
    },
    enabled: !!id,
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

  const { mutate: UpdateBooking } = useMutation({
    mutationFn: (dto: AdminClinicUpdateBookingDto) => {
      return adminClinicBookingApi.adminClinicBookingControllerUpdate(id!, dto);
    },
    onSuccess: () => {
      message.success(
        intl.formatMessage({
          id: 'booking.message.update.success',
        })
      );
      queryClient.invalidateQueries({ queryKey: ['adminClinicBookingDetail'] });
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
    mutationFn: (dto: AdminClinicCreateBookingDto) => {
      return adminClinicBookingApi.adminClinicBookingControllerCreate(dto);
    },
    onSuccess: () => {
      message.success(
        intl.formatMessage({
          id: 'booking.message.create.success',
        })
      );
      navigate(ADMIN_CLINIC_ROUTE_PATH.BOOKING_MANAGEMENT);
    },
    onError: () => {
      message.error(
        intl.formatMessage({
          id: 'booking.message.create.fail',
        })
      );
    },
  });

  const { data: bookingTimeData } = useQuery({
    queryKey: ['adminClinicBookingTime', { date, clinic, doctorClinic }],
    queryFn: () => {
      return adminClinicBookingApi.adminClinicBookingControllerCheckBookingByDate(
        date.format('YYYY-MM-DD'),
        user?.clinicId,
        doctorClinic?.id
      );
    },
    enabled: !!user?.clinicId,
  });

  const { mutate: CancelBooking } = useMutation({
    mutationFn: (dto: UpdateStatusBookingDto) =>
      adminClinicBookingApi.adminClinicBookingControllerCancelBooking(id!, dto),
    onSuccess: () => {
      message.success(
        intl.formatMessage({
          id: 'booking.message.update.success',
        })
      );
      queryClient.invalidateQueries({ queryKey: ['adminClinicBookingDetail'] });
    },
    onError: () => {
      message.error(
        intl.formatMessage({
          id: 'booking.message.update.fail',
        })
      );
    },
  });

  useEffect(() => {
    const data = bookingTimeData?.data as unknown as { arrOfTimeAM: BookingTime[]; arrOfTimePM: BookingTime[] };
    setAmTime(data?.arrOfTimeAM);
    setPmTime(data?.arrOfTimePM);
  }, [bookingTimeData]);

  useEffect(() => {
    const data: Booking | undefined = bookingData?.data;
    form.setFieldsValue({ ...data, appointmentStartTime: dayjs(data?.appointmentStartTime) });
    setDoctorClinic(data?.doctorClinic);
    setCustomer(data?.customer);
    setClinic(data?.clinic);
    setPrescription(data?.prescription);
    setCurrentStatus(bookingData?.data.status);
    setStatus(bookingData?.data.status);
    if (data?.appointmentStartTime) {
      setDate(dayjs(data?.appointmentStartTime));
    }
  }, [bookingData]);
  const handleUpdate = () => {
    const data = form.getFieldsValue();
    const booking: AdminClinicUpdateBookingDto = {
      ...data,
      appointmentStartTime: date.format(),
      id,
      clinicId: user.clinicId,
      appointmentEndTime: date.add(30, 'minute').format(),
      doctorClinicId: doctorClinic?.id,
      customerId: customer?.id,
    };
    UpdateBooking(booking);
  };

  const handleCreate = () => {
    const data = form.getFieldsValue();
    const booking: AdminClinicCreateBookingDto = {
      ...data,
      appointmentStartTime: date.format(),
      id,
      appointmentEndTime: date.add(30, 'minute').format(),
      doctorClinicId: doctorClinic?.id,
      clinicId: user.clinicId,
      customerId: customer?.id,
      status: BookingStatusEnum.Pending,
      prescription: undefined,
    };
    // setIsSubmit(true);
    // if (!booking.customerId || !booking.clinicId) {
    //   return;
    // }
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
                  return navigator.clipboard.writeText(`#${bookingData?.data.order}`);
                }}
              >
                <IconSVG type={'copy'} />
              </span>
              <Form.Item name={'status'} className={'status'}>
                <Select
                  className={`create-booking-header__select-status ${statusClassName(currentStatus!)} `}
                  defaultValue="Hoàn thành"
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
          <DoctorInfo
            status={status}
            form={form}
            clinic={clinic}
            setDoctorClinic={setDoctorClinic}
            doctorClinic={doctorClinic}
            role={'adminClinic'}
            type={id ? 'update' : 'create'}
          />
          <CustomerInfo
            status={status}
            customer={customer}
            form={form}
            setCustomer={setCustomer}
            role={'adminClinic'}
            type={id ? 'update' : 'create'}
          />
          <Prescription prescription={prescription} />
        </div>
        <div className={'right-container'}>
          <div className={'schedule-info-area'}>
            <ScheduleInfo
              form={form}
              amTime={amTime}
              pmTime={pmTime}
              date={date}
              setDate={setDate}
              status={status}
              role={'adminClinic'}
              type={id ? 'update' : 'create'}
            />
          </div>
          <div className={'action-area'}>
            <Action
              status={status}
              form={form}
              role={'adminClinic'}
              type={id ? 'update' : 'create'}
              onCancel={() => setShowModalCancel(true)}
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
