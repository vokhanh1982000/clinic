import { DatePicker, Form, FormInstance } from 'antd';
import React, { Dispatch, SetStateAction } from 'react';
import { IntlShape } from 'react-intl';
import useIntl from '../../util/useIntl';
import CustomArea from '../input/CustomArea';
import { Option } from 'antd/es/mentions';
import dayjs from 'dayjs';
import IconSVG from '../icons/icons';
import CustomSelectTime from '../select/CustomSelectTime';
import { BookingStatusEnum } from '../../apis/client-axios';

export type BookingTime = {
  time: string;
  status: 'EXPIRED' | 'AVAILABLE' | 'NOT_AVAILABLE' | 'FULL' | 'DAY_OFF';
};

interface ScheduleInfoProp {
  role?: 'doctor' | 'admin' | 'adminClinic';
  form: FormInstance;
  type?: 'create' | 'update';
  amTime?: BookingTime[];
  pmTime?: BookingTime[];
  date?: dayjs.Dayjs;
  setDate?: Dispatch<SetStateAction<dayjs.Dayjs>>;
  status?: BookingStatusEnum;
  isCreatedByCustomer?: boolean;
}
const ScheduleInfo = (props: ScheduleInfoProp) => {
  const { role, type, pmTime, amTime, date, setDate, status, isCreatedByCustomer }: ScheduleInfoProp = props;
  const intl: IntlShape = useIntl();
  const className = () => {
    if ((role === 'admin' || role === 'adminClinic') && type === 'create') return '';
    if (role === 'adminClinic' && type === 'update' && status === BookingStatusEnum.Pending) return '';
    if (role === 'admin' && type === 'update' && !isCreatedByCustomer) return '';
    if (role === 'admin' && type === 'update' && isCreatedByCustomer) return 'disable';
    return 'disable';
  };

  const handleSetTime = (item: BookingTime) => {
    if (setDate) {
      setDate &&
        setDate(
          dayjs(date)
            .set('hour', Number(item.time.slice(0, 2)))
            .set('minute', Number(item.time.slice(3)))
        );
    }
  };
  const handleSetDate = (value: dayjs.Dayjs | null) => {
    if (value && setDate) {
      value = value.set('second', 0).set('millisecond', 0);
      setDate(value);
    }
  };

  const getClassNameColor = (item: BookingTime) => {
    let status = '';
    if (item.time === date?.format('HH:mm')) {
      status = 'current_select';
    }
    if (
      item.status === 'FULL' ||
      item.status === 'EXPIRED' ||
      item.status === 'NOT_AVAILABLE' ||
      item.status === 'DAY_OFF'
    )
      status = `${status} ${item.status.toLowerCase()} disable_select`;
    if (status !== '') return status;
    return item.status.toLowerCase();
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
            // name="appointmentStartTime"
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
              value={date}
              onChange={(value) => handleSetDate(value)}
            />
          </Form.Item>
        </div>
        <div className={'schedule-info__content__rows'}>
          <Form.Item
            className={'hour'}
            label={intl.formatMessage({
              id: 'booking.create.hour',
            })}
          >
            {/*<TimePicker format={FORMAT_TIME} minuteStep={30} disabled={role === 'doctor'} />*/}
            <CustomSelectTime
              key={1}
              value={date?.format('HH:mm')}
              optionLabelProp={'label'}
              disabled={className() === 'disable'}
              suffixIcon={<IconSVG type={'suffix-time'} />}
            >
              <Option>
                <div className={'time-picker'}>
                  <div className={'time-picker__title'}>Chọn giờ</div>
                  <div className={'time-picker__content'}>
                    <div className={'time-picker__content__title'}>Sáng</div>
                    <div className={'time-picker__content__list-item'}>
                      {amTime?.map((item: BookingTime) => {
                        return (
                          <div
                            className={`time-picker__content__list-item__item ${getClassNameColor(item)}`}
                            onClick={() => handleSetTime(item)}
                          >
                            {item.time}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div className={'time-picker__content'}>
                    <div className={'time-picker__content__title'}>Chiều</div>
                    <div className={'time-picker__content__list-item'}>
                      {pmTime?.map((item: BookingTime) => {
                        return (
                          <div
                            className={`time-picker__content__list-item__item ${getClassNameColor(item)}`}
                            onClick={() => handleSetTime(item)}
                          >
                            {item.time}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </Option>
            </CustomSelectTime>
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
              disabled={className() === 'disable'}
              rows={6}
              style={{ resize: 'none' }}
              placeholder={intl.formatMessage({
                id: 'booking.create.note',
              })}
            />
          </Form.Item>
        </div>
      </div>
    </div>
  );
};

export default ScheduleInfo;
