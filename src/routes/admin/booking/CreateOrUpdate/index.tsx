import React, { useEffect, useState } from 'react';
import { Card, Form, message, Select } from 'antd';
import useIntl from '../../../../util/useIntl';
import { IntlShape } from 'react-intl';
import { NavigateFunction, Params, useNavigate, useParams, useSearchParams } from 'react-router-dom';
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
  Prescription as PrescriptionType,
  UpdateStatusBookingDto,
} from '../../../../apis/client-axios';
import dayjs from 'dayjs';
import { BookingStatus } from '../../../../util/constant';
import ClinicInfo from '../../../../components/booking/ClinicInfo';
import { RootState, useAppDispatch } from '../../../../store';
import { roundTimeToNearestHalfHour } from '../../../../util/comm.func';
import { ConfirmCancelModal } from '../../../../components/booking/ConfirmCancelModal';
import { ADMIN_ROUTE_PATH } from '../../../../constants/route';
import { CustomHandleSuccess } from '../../../../components/response/success';
import { ActionUser, PERMISSIONS } from '../../../../constants/enum';
import { CustomHandleError } from '../../../../components/response/error';
import Prescription from '../../../../components/booking/Prescription';
import { useSelector } from 'react-redux';
import CheckPermission, { Permission } from '../../../../util/check-permission';

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
  const [prescription, setPrescription] = useState<PrescriptionType>();
  const { authUser } = useSelector((state: RootState) => state.auth);
  const [permisstion, setPermisstion] = useState<Permission>({
    read: false,
    create: false,
    delete: false,
    update: false,
  });

  const navigate: NavigateFunction = useNavigate();
  const queryClient: QueryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const routeScheduleId: string | null = searchParams.get('routeScheduleId');
  const routeClinicId: string | null = searchParams.get('routeClinicId');
  const routeDate: string | null = searchParams.get('routeDate');
  const navigateBack = () => {
    if (routeClinicId && routeScheduleId) {
      navigate(`${ADMIN_ROUTE_PATH.SCHEDULE_DOCTOR}/${routeScheduleId}?clinicId=${routeClinicId}`);
    } else if (routeClinicId && routeDate) {
      navigate(`${ADMIN_ROUTE_PATH.CLINIC_BOOKING_MANAGEMENT}/${routeClinicId}?date=${routeDate}`);
    } else {
      navigate(ADMIN_ROUTE_PATH.BOOKING_MANAGEMENT);
    }
  };

  useEffect(() => {
    if (authUser?.user?.roles) {
      setPermisstion({
        read: Boolean(CheckPermission(PERMISSIONS.ReadBooking, authUser)),
        create: Boolean(CheckPermission(PERMISSIONS.CreateBooking, authUser)),
        delete: Boolean(CheckPermission(PERMISSIONS.DeleteBooking, authUser)),
        update: Boolean(CheckPermission(PERMISSIONS.UpdateBooking, authUser)),
      });
    }
  }, [authUser]);

  const { data: bookingData } = useQuery({
    queryKey: ['adminBookingDetail', id],
    queryFn: () => {
      return adminBookingApi.adminBookingControllerFindOne(id!);
    },
    enabled: !!(id && permisstion.read),
  });

  const { mutate: UpdateBooking } = useMutation({
    mutationFn: (dto: AdminUpdateBookingDto) => {
      return adminBookingApi.adminBookingControllerUpdate(id!, dto);
    },
    onSuccess: () => {
      CustomHandleSuccess(ActionUser.EDIT, intl);
      queryClient.invalidateQueries({ queryKey: ['adminBookingDetail'] });
      navigateBack();
    },
    onError: (error: any): void => {
      CustomHandleError(error.response.data, intl);
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
      navigateBack();
    },
    onError: (error: any): void => {
      CustomHandleError(error.response.data, intl);
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
      setShowModalCancel(false);
      navigateBack();
    },
    onError: (error: any) => {
      CustomHandleError(error?.response?.data, intl);
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

  // const { data: checkCustomerData } = useQuery({
  //   queryKey: ['checkCustomerData', { id }],
  //   queryFn: () => customerApi.customerControllerGetByUserId(bookingData?.data.createdByUserId || ''),
  //   enabled: !!id && !!bookingData?.data.createdByUserId,
  // });

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
    setPrescription(data?.prescription);
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
      prescription: {
        ...prescription,
        diagnosticResults: data.prescription.diagnosticResults,
      },
      appointmentStartTime: date.format(),
      id,
      appointmentEndTime: date.add(30, 'minute').format(),
      doctorClinicId: doctorClinic?.id ?? null,
      clinicId: clinic?.id,
      customerId: customer?.id,
    };
    setIsSubmit(true);
    if (!booking.customerId || !booking.clinicId) {
      return;
    }
    if (booking.status === BookingStatusEnum.Approved && !booking.doctorClinicId) {
      message.error(
        intl.formatMessage({
          id: 'booking.doctor-clinic.missing',
        })
      );
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
    } else {
      navigateBack();
    }
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
            defaultClinicId={routeClinicId}
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
            defaultDoctorClinicId={routeScheduleId}
            status={status}
            form={form}
            clinic={clinic}
            setDoctorClinic={setDoctorClinic}
            doctorClinic={doctorClinic}
            role={'admin'}
            type={id ? 'update' : 'create'}
          />
          <CustomerInfo
            status={status}
            customer={customer}
            form={form}
            setCustomer={setCustomer}
            role={'admin'}
            type={id ? 'update' : 'create'}
            isSubmit={isSubmit}
          />
          {id && (
            <Prescription
              isPrescribed={
                !!(
                  bookingData?.data?.prescription?.prescriptionMedicine?.length &&
                  bookingData?.data?.prescription?.prescriptionMedicine?.length > 0
                )
              }
              prescription={prescription}
              role={'admin'}
              setPrescription={setPrescription}
              type={'update'}
              status={status}
            />
          )}
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
            />
          </div>
          <div className={'action-area'}>
            <Action
              status={status}
              form={form}
              type={id ? 'update' : 'create'}
              role={'admin'}
              onCancel={() => {
                id ? setShowModalCancel(true) : navigateBack();
              }}
              disableSubmit={id ? !permisstion.update : !permisstion.create}
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
