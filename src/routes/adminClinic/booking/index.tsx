import { useQuery } from '@tanstack/react-query';
import { Col, Form, Row } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { ReactNode, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { adminClinicBookingApi, holidayScheduleApi } from '../../../apis';
import { DoctorClinic } from '../../../apis/client-axios';
import TimelineControl from '../../../components/TimelineControl';
import { IFormData, NOTES, TimelineMode, n } from '../../../components/TimelineControl/constants';
import TimelineDay from '../../../components/TimelineDay';
import TimelineMonth from '../../../components/TimelineMonth';
import { useAppSelector } from '../../../store';
import { DATE_TIME_FORMAT } from '../../../util/constant';

const ListBooking = () => {
  const intl = useIntl();

  const [form] = Form.useForm<IFormData>();
  const mode: TimelineMode | undefined = Form.useWatch(n('mode'), form) as TimelineMode | undefined;
  const time = Form.useWatch(n('time'), form) as Dayjs | undefined;
  const keyword = Form.useWatch(n('keyword'), form) as string | undefined;

  const user = useAppSelector((state) => state.auth).authUser as DoctorClinic;

  useEffect(() => {
    form.setFieldsValue({
      [n('time')]: dayjs(),
      [n('mode')]: TimelineMode.DATE,
    });
  }, []);

  const { data: listBookingDay, refetch: onRefetchBookingDay } = useQuery({
    queryKey: ['adminClinicBookingDay', time, mode],
    queryFn: () =>
      adminClinicBookingApi.adminClinicBookingControllerGetBookingByDay(dayjs(time).format(DATE_TIME_FORMAT), keyword),
    enabled: !!time && mode === TimelineMode.DATE,
  });

  const { data: listBookingMonth, refetch: onRefetchBookingMonth } = useQuery({
    queryKey: ['adminClinicBookingMonth', time, mode],
    queryFn: () =>
      adminClinicBookingApi.adminClinicBookingControllerGetBookingByMonth(
        dayjs(time).format(DATE_TIME_FORMAT),
        keyword
      ),
    enabled: !!time && mode === TimelineMode.MONTH,
  });

  const { data: listHolidayMonth, refetch: onRefetchHolidayMonth } = useQuery({
    queryKey: ['adminClinicHolidayMonth', time, mode],
    queryFn: () =>
      holidayScheduleApi.holidayScheduleControllerGetMonth(
        user.clinicId,
        dayjs(time).startOf('month').format(DATE_TIME_FORMAT)
      ),
    enabled: !!time && mode === TimelineMode.MONTH,
  });

  const handleRefetchMonth = () => {
    onRefetchBookingMonth();
    onRefetchHolidayMonth();
  };

  const handleRefetchDay = () => {
    onRefetchBookingDay();
  };

  const renderTimeline = (mode?: TimelineMode) => {
    let currentScreen: ReactNode = null;

    switch (mode) {
      case TimelineMode.DATE:
        currentScreen = (
          <TimelineDay form={form} listBookingDay={listBookingDay?.data || []} onRefetchDay={handleRefetchDay} />
        );
        break;
      case TimelineMode.MONTH:
        currentScreen = (
          <TimelineMonth
            form={form}
            listBookingMonth={listBookingMonth?.data || []}
            listHolidayMonth={listHolidayMonth?.data || []}
            onRefetchMonth={handleRefetchMonth}
            user={user}
          />
        );
        break;
      default:
        break;
    }

    return currentScreen;
  };

  return (
    <>
      <Row gutter={[0, 10]}>
        <Col span={24}>
          <TimelineControl form={form} user={user} />
        </Col>

        <Col span={24} className="timeline-custom-container">
          {renderTimeline(mode)}
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
