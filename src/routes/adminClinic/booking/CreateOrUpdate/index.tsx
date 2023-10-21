import React from 'react';
import { Card, Form, Select } from 'antd';
import useIntl from '../../../../util/useIntl';
import { IntlShape } from 'react-intl';
import { Params, useParams } from 'react-router-dom';
import { AdminClinicCreateBookingDto } from '../../../../apis/client-axios';
import DoctorInfo from '../../../../components/booking/DoctorInfo';
import CustomerInfo from '../../../../components/booking/CustomerInfo';
import Prescription from '../../../../components/booking/Prescription';

import ScheduleInfo from '../../../../components/booking/ScheduleInfo';
import Action from '../../../../components/booking/Action';
import IconSVG from '../../../../components/icons/icons';

const CreateOrUpDateBooking = () => {
  const intl: IntlShape = useIntl();
  const { id }: Readonly<Params<string>> = useParams();
  const n = (key: keyof AdminClinicCreateBookingDto) => {
    return key;
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
        <span className={'create-booking-header__code'}>#123543 </span>
        <span className={'create-booking-header__copy'}>
          <IconSVG type={'copy'} />
        </span>
        <Select
          className={'create-booking-header__select-status'}
          defaultValue="Hoàn thành"
          style={{ width: 120 }}
          options={[
            { value: 'jack', label: 'Jack' },
            { value: 'lucy', label: 'Lucy' },
            { value: 'Yiminghe', label: 'yiminghe' },
            { value: 'disabled', label: 'Disabled', disabled: true },
          ]}
          suffixIcon={<IconSVG type={'dropdown'} />}
        />
      </div>
      <Form className={'form-create-booking'} layout={'vertical'}>
        <div className={'left-container'}>
          <DoctorInfo />
          <CustomerInfo />
          <Prescription />
        </div>
        <div className={'right-container'}>
          <div className={'schedule-info-area'}>
            <ScheduleInfo />
          </div>
          <div className={'action-area'}>
            <Action />
          </div>
        </div>
      </Form>
    </Card>
  );
};

export default CreateOrUpDateBooking;
