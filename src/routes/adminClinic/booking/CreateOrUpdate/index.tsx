import React, { useEffect, useState } from 'react';
import { Card, Form, message, Select } from 'antd';
import useIntl from '../../../../util/useIntl';
import { IntlShape } from 'react-intl';
import { Params, useParams } from 'react-router-dom';
import DoctorInfo from '../../../../components/booking/DoctorInfo';
import CustomerInfo from '../../../../components/booking/CustomerInfo';

import ScheduleInfo from '../../../../components/booking/ScheduleInfo';
import Action from '../../../../components/booking/Action';
import IconSVG from '../../../../components/icons/icons';
import useForm from 'antd/es/form/hooks/useForm';
import { useMutation, useQuery } from '@tanstack/react-query';
import { adminClinicBookingApi, clinicsApi } from '../../../../apis';
import { useAppSelector } from '../../../../store';
import {
  AdminClinicUpdateBookingDto,
  AdministratorClinic,
  Booking,
  BookingStatusEnum,
  Clinic,
  Customer,
  DoctorClinic,
  Prescription as PrescriptionType,
} from '../../../../apis/client-axios';
import Prescription from '../../../../components/booking/Prescription';
import dayjs from 'dayjs';
import { BookingStatus } from '../../../../util/constant';

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

  const { data: bookingData } = useQuery({
    queryKey: ['adminClinicBookingDetail'],
    queryFn: () => {
      return adminClinicBookingApi.adminClinicBookingControllerFindOne(id!);
    },
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
    const data: Booking | undefined = bookingData?.data;
    form.setFieldsValue({ ...data, appointmentStartTime: dayjs(data?.appointmentStartTime) });
    setDoctorClinic(data?.doctorClinic);
    setCustomer(data?.customer);
    setClinic(data?.clinic);
    setPrescription(data?.prescription);
    setCurrentStatus(bookingData?.data.status);
  }, [bookingData]);

  const handleUpdate = () => {
    const data = form.getFieldsValue();
    const booking: AdminClinicUpdateBookingDto = {
      ...data,
      appointmentStartTime: dayjs(data.appointmentStartTime).format(),
      id,
      clinicId: user.clinicId,
      appointmentEndTime: dayjs(data.appointmentStartTime).add(30, 'minute').format(),
      doctorClinicId: doctorClinic?.id,
      customerId: customer?.id,
    };
    UpdateBooking(booking);
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
          <span className={'create-booking-header__code'}>{bookingData?.data.order} </span>
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
              className={`create-booking-header__select-status ${statusClassName(currentStatus!)} `}
              defaultValue="Hoàn thành"
              options={BookingStatus.map((item) => ({
                label: intl.formatMessage({ id: item.label }),
                value: item.value,
              }))}
              suffixIcon={<IconSVG type={'dropdown'} />}
              onChange={(value) => setCurrentStatus(value as BookingStatusEnum)}
            ></Select>
          </Form.Item>
        </Form>
      </div>
      <Form className={'form-create-booking'} layout={'vertical'} form={form} onFinish={handleUpdate}>
        <div className={'left-container'}>
          <DoctorInfo
            form={form}
            clinic={clinic}
            setDoctorClinic={setDoctorClinic}
            doctorClinic={doctorClinic}
            role={'adminClinic'}
            type={id ? 'update' : 'create'}
          />
          <CustomerInfo
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
            <ScheduleInfo form={form} />
          </div>
          <div className={'action-area'}>
            <Action form={form} role={'adminClinic'} type={id ? 'update' : 'create'} />
          </div>
        </div>
      </Form>
    </Card>
  );
};

export default CreateOrUpDateBooking;
