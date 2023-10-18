import { useQuery } from '@tanstack/react-query';
import { Col, Form, Row } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { useEffect } from 'react';
import { useIntl } from 'react-intl';
import { doctorClinicBookingApi } from '../../../apis';
import { BookingStatusEnum } from '../../../apis/client-axios';
import TimelineControl from '../../../components/TimelineControl';
import TimelineDay from '../../../components/TimelineDay';
import TimelineMonth from '../../../components/TimelineMonth';
import { DATE_TIME_FORMAT } from '../../../util/constant';

export enum TimelineMode {
  DATE = 'date',
  MONTH = 'month',
}

export interface IFormData {
  time?: Dayjs;
  mode?: TimelineMode;
  keyword?: string;
}

export const n = (key: keyof IFormData) => key;

export const NOTES = [
  {
    borderColor: '#20BF6B',
    backgroundColor: 'rgba(32, 191, 107, 0.20)',
    messageId: 'timeline.doctor.note.complete',
    status: BookingStatusEnum.Completed,
  },
  {
    borderColor: '#3867D6',
    backgroundColor: 'rgba(56, 103, 214, 0.20)',
    messageId: 'timeline.doctor.note.reviewed',
    status: BookingStatusEnum.Approved,
  },
  {
    borderColor: '#F7B731',
    backgroundColor: 'rgba(247, 183, 49, 0.20)',
    messageId: 'timeline.doctor.note.awaitingReview',
    status: BookingStatusEnum.Pending,
  },
  {
    borderColor: '#FC5C65',
    backgroundColor: 'rgba(252, 92, 101, 0.20)',
    messageId: 'timeline.doctor.note.canceled',
    status: BookingStatusEnum.Cancelled,
  },
  {
    borderColor: '#E5E5E5',
    backgroundColor: '#F2F2F2',
    messageId: 'timeline.doctor.note.dayOff',
  },
];

const ListBooking = () => {
  const intl = useIntl();

  const [form] = Form.useForm<IFormData>();
  const mode: TimelineMode | undefined = Form.useWatch(n('mode'), form) as TimelineMode | undefined;
  const time = Form.useWatch(n('time'), form) as Dayjs | undefined;
  const keyword = Form.useWatch(n('keyword'), form) as string | undefined;

  useEffect(() => {
    form.setFieldsValue({
      [n('time')]: dayjs(),
      [n('mode')]: TimelineMode.DATE,
    });
  }, []);

  const { data: listBookingDay } = useQuery({
    queryKey: ['doctorBookingDay', time, keyword, mode],
    queryFn: () =>
      doctorClinicBookingApi.doctorClinicBookingControllerGetBookingByDay(
        dayjs(time).format(DATE_TIME_FORMAT),
        keyword
      ),
    enabled: !!time && mode === TimelineMode.DATE,
  });

  const { data: listBookingMonth } = useQuery({
    queryKey: ['doctorBookingMonth', time, keyword, mode],
    queryFn: () =>
      doctorClinicBookingApi.doctorClinicBookingControllerGetBookingByMonth(
        dayjs(time).format(DATE_TIME_FORMAT),
        keyword
      ),
    enabled: !!time && mode === TimelineMode.MONTH,
  });

  return (
    <>
      <Row gutter={[0, 10]}>
        <Col span={24}>
          <TimelineControl form={form} />
        </Col>

        <Col span={24}>
          {mode === TimelineMode.DATE ? (
            <TimelineDay form={form} listBookingDay={listBookingDay?.data || []} />
          ) : (
            <TimelineMonth form={form} listBookingMonth={listBookingMonth?.data || []} />
          )}
        </Col>

        <Col span={24}>
          <Row align="middle" gutter={[0, 12]} wrap className="timeline-custom-note">
            <Col span={24}>
              <span className="font-size-18 font-weight-600">{intl.formatMessage({ id: 'timeline.doctor.note' })}</span>
            </Col>
            <Col span={24}>
              <div className="d-flex align-items-center gap-20">
                {NOTES.filter((_, index) => (mode === TimelineMode.DATE ? index < NOTES.length - 1 : index >= 0)).map(
                  (note) => (
                    <div key={note.messageId} className="d-flex align-items-center gap-8">
                      <div
                        className="timeline-custom-note-block"
                        style={{ backgroundColor: note.backgroundColor, borderColor: note.borderColor }}
                      />
                      <span className="font-size-14 font-weight-400">{intl.formatMessage({ id: note.messageId })}</span>
                    </div>
                  )
                )}
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
};
export default ListBooking;
