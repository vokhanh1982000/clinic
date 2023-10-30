import { DatePicker, Form, FormInstance, TimePicker } from 'antd';
import React from 'react';
import { IntlShape } from 'react-intl';
import useIntl from '../../util/useIntl';
import { FORMAT_TIME } from '../../constants/common';
import CustomArea from '../input/CustomArea';

interface ScheduleInfoProp {
  role?: 'doctor' | 'admin' | 'adminClinic';
  form: FormInstance;
  type?: 'create' | 'update';
}
const ScheduleInfo = (props: ScheduleInfoProp) => {
  const { role, type }: ScheduleInfoProp = props;
  const intl: IntlShape = useIntl();

  const className = () => {
    if (role === 'doctor') {
      return 'disable';
    }
    if (role === 'admin' && type === 'create') {
      return '';
    }
    if (role === 'admin' && type === 'update') {
      return '';
    }
    if (role === 'adminClinic' && type === 'update') {
      return 'disable';
    }
    if (role === 'adminClinic' && type === 'create') {
      return '';
    }
  };
  return (
    <div className={'schedule-info'}>
      <div className="schedule-info__header">
        <div className="schedule-info__header__title">
          <div className="schedule-info__header__title__label">
            {intl.formatMessage({
              id: 'booking.create.schedule-info',
            })}
          </div>
          <div className="line-title"></div>
        </div>
      </div>
      <div className={'schedule-info__break-line'}></div>
      <div className={'schedule-info__content'}>
        <div className={'schedule-info__content_rows'} id={'custom-popup-date-picker'}>
          <Form.Item
            name="appointmentStartTime"
            className="schedule"
            label={intl.formatMessage({
              id: 'booking.create.day',
            })}
          >
            <DatePicker
              open={true}
              superNextIcon={null}
              superPrevIcon={null}
              showToday={false}
              getPopupContainer={() => document.getElementById('custom-popup-date-picker')!}
              popupClassName={`custom-popup-picker ${className()}`}
            />
          </Form.Item>
        </div>
        <div className={'schedule-info__content__rows'}>
          <Form.Item
            name="appointmentStartTime"
            className={'hour'}
            label={intl.formatMessage({
              id: 'booking.create.hour',
            })}
          >
            <TimePicker format={FORMAT_TIME} minuteStep={30} disabled={role === 'doctor'} />
          </Form.Item>
        </div>
        <div className={'schedule-info__content__rows'}>
          <Form.Item
            label={intl.formatMessage({
              id: 'booking.create.note',
            })}
            name={'appointmentNote'}
          >
            <CustomArea
              disabled={role === 'doctor'}
              rows={6}
              style={{ resize: 'none' }}
              placeholder={intl.formatMessage({
                id: 'booking.create.customerNote',
              })}
            />
          </Form.Item>
        </div>
      </div>
    </div>
  );
};

export default ScheduleInfo;
