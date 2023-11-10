import React, { useEffect, useState } from 'react';
import { Card, Form, Select } from 'antd';
import useIntl from '../../../../util/useIntl';
import { IntlShape } from 'react-intl';
import { Params, useNavigate, useParams } from 'react-router-dom';
import CustomerInfo from '../../../../components/booking/CustomerInfo';

import ScheduleInfo from '../../../../components/booking/ScheduleInfo';
import Action from '../../../../components/booking/Action';
import IconSVG from '../../../../components/icons/icons';
import useForm from 'antd/es/form/hooks/useForm';
import { QueryClient, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { doctorClinicBookingApi } from '../../../../apis';
import { useAppSelector } from '../../../../store';
import {
  AdministratorClinic,
  Booking,
  BookingStatusEnum,
  Clinic,
  Customer,
  DoctorClinic,
  DoctorClinicUpdateBookingDto,
  Prescription as PrescriptionType,
} from '../../../../apis/client-axios';
import Prescription from '../../../../components/booking/Prescription';
import dayjs from 'dayjs';
import { BookingStatus } from '../../../../util/constant';
import { roundTimeToNearestHalfHour } from '../../../../util/comm.func';
import { DOCTOR_CLINIC_ROUTE_PATH } from '../../../../constants/route';
import { CustomHandleError } from '../../../../components/response/error';
import { CustomHandleSuccess } from '../../../../components/response/success';
import { ActionUser } from '../../../../constants/enum';

const CreateOrUpDateBooking = () => {
  const intl: IntlShape = useIntl();
  const { id }: Readonly<Params<string>> = useParams();
  const [form] = useForm();
  const user: AdministratorClinic = useAppSelector((state) => state.auth).authUser as DoctorClinic;
  const [clinic, setClinic] = useState<Clinic>();
  const [doctorClinic, setDoctorClinic] = useState<DoctorClinic>();
  const [customer, setCustomer] = useState<Customer>();
  const [prescription, setPrescription] = useState<PrescriptionType>();
  const [currentStatus, setCurrentStatus] = useState<BookingStatusEnum>();
  const [date, setDate] = useState<dayjs.Dayjs>(dayjs(roundTimeToNearestHalfHour(new Date())));
  const [status, setStatus] = useState<BookingStatusEnum>();
  const queryClient: QueryClient = useQueryClient();
  const navigate = useNavigate();
  const { data: bookingData } = useQuery({
    queryKey: ['bookingDetail', id],
    queryFn: () => {
      return doctorClinicBookingApi.doctorClinicBookingControllerFindOne(id!);
    },
    enabled: !!id,
  });

  const { mutate: UpdateBooking } = useMutation({
    mutationFn: (dto: DoctorClinicUpdateBookingDto) => {
      return doctorClinicBookingApi.doctorClinicBookingControllerUpdate(id!, dto);
    },
    onSuccess: () => {
      CustomHandleSuccess(ActionUser.CREATE, intl);
      queryClient.invalidateQueries({ queryKey: ['bookingDetail'] });
      navigate(DOCTOR_CLINIC_ROUTE_PATH.BOOKING_MANAGEMENT);
    },
    onError: (error: any) => {
      CustomHandleError(error?.response?.data, intl);
    },
  });

  useEffect(() => {
    const data: Booking | undefined = bookingData?.data;
    form.setFieldsValue({ ...data, appointmentStartTime: dayjs(data?.appointmentStartTime) });
    setDoctorClinic(data?.doctorClinic);
    setCustomer(data?.customer);
    setPrescription(data?.prescription);
    setCurrentStatus(bookingData?.data.status);
    setStatus(bookingData?.data.status);
    if (data?.appointmentStartTime) {
      setDate(dayjs(data?.appointmentStartTime));
    }
  }, [bookingData]);

  const handleUpdate = () => {
    const data = form.getFieldsValue();
    const booking: DoctorClinicUpdateBookingDto = {
      ...data,
      prescription: { ...prescription, diagnosticResults: data.prescription.diagnosticResults },
      clinicId: user.clinicId,
      id,
    };
    console.log(booking, 'xu');
    UpdateBooking(booking);
  };

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
          <div className={'create-booking-header__code'}>#{bookingData?.data.order} </div>
          <div
            className={'create-booking-header__copy'}
            onClick={() => {
              return navigator.clipboard.writeText(`#${bookingData?.data.order}`);
            }}
          >
            <IconSVG type={'copy'} />
          </div>
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
        </Form>
      </div>
      <Form className={'form-create-booking'} layout={'vertical'} form={form} onFinish={handleUpdate}>
        <div className={'left-container'}>
          <CustomerInfo
            customer={customer}
            form={form}
            role={'doctor'}
            type={id ? 'update' : 'create'}
            setCustomer={setCustomer}
            status={status}
          />
          <Prescription
            isPrescribed={
              !!(
                bookingData?.data?.prescription?.prescriptionMedicine?.length &&
                bookingData?.data?.prescription?.prescriptionMedicine?.length > 0
              )
            }
            prescription={prescription}
            role={'doctor'}
            setPrescription={setPrescription}
            type={'update'}
            status={status}
          />
        </div>
        <div className={'right-container'}>
          <div className={'schedule-info-area'}>
            <ScheduleInfo form={form} role={'doctor'} date={date} type={'update'} status={status} />
          </div>
          <div className={'action-area'}>
            <Action
              form={form}
              role={'doctor'}
              type={id ? 'update' : 'create'}
              status={status}
              isPrescribed={
                !!(
                  bookingData?.data?.prescription?.prescriptionMedicine?.length &&
                  bookingData?.data?.prescription?.prescriptionMedicine?.length > 0
                )
              }
            />
          </div>
        </div>
      </Form>
    </Card>
  );
};

export default CreateOrUpDateBooking;
