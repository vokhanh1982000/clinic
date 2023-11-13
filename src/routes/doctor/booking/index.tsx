import { useQuery } from '@tanstack/react-query';
import { Card, Col, Form, Row } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { ReactNode, useEffect } from 'react';
import { useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import { doctorClinicBookingApi, holidayScheduleApi } from '../../../apis';
import { DoctorClinic } from '../../../apis/client-axios';
import TimelineControl from '../../../components/TimelineControl';
import { IFormData, NOTES, TimelineMode, n } from '../../../components/TimelineControl/constants';
import TimelineMonth from '../../../components/TimelineMonth';
import TimelineWeek from '../../../components/TimelineWeek';
import CustomButton from '../../../components/buttons/CustomButton';
import IconSVG from '../../../components/icons/icons';
import { DOCTOR_CLINIC_ROUTE_NAME } from '../../../constants/route';
import { useAppSelector } from '../../../store';
import { DATE_TIME_FORMAT } from '../../../util/constant';

const ListBooking = () => {
  const intl = useIntl();

  const [form] = Form.useForm<IFormData>();
  const mode: TimelineMode | undefined = Form.useWatch(n('mode'), form) as TimelineMode | undefined;
  const time = Form.useWatch(n('time'), form) as Dayjs | undefined;
  const keyword = Form.useWatch(n('keyword'), form) as string | undefined;

  const navigate = useNavigate();

  const user = useAppSelector((state) => state.auth).authUser as DoctorClinic;

  useEffect(() => {
    form.setFieldsValue({
      [n('time')]: dayjs(),
      [n('mode')]: TimelineMode.WEEK,
    });
  }, []);

  const { data: listBookingWeek, refetch: onRefetchBookingWeek } = useQuery({
    queryKey: ['doctorClinicBookingWeek', time, mode, keyword],
    queryFn: () =>
      doctorClinicBookingApi.doctorClinicBookingControllerGetBookingByWeek(
        dayjs(time).startOf('week').format(DATE_TIME_FORMAT),
        keyword
      ),
    enabled: !!time && mode === TimelineMode.WEEK,
  });

  const { data: listBookingMonth, refetch: onRefetchBookingMonth } = useQuery({
    queryKey: ['doctorClinicBookingMonth', time, mode, keyword],
    queryFn: () =>
      doctorClinicBookingApi.doctorClinicBookingControllerGetBookingByMonth(
        dayjs(time).format(DATE_TIME_FORMAT),
        keyword
      ),
    enabled: !!time,
  });

  const { data: listHolidayMonth, refetch: onRefetchHolidayMonth } = useQuery({
    queryKey: ['doctorClinicHolidayMonth', time, mode],
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

  const handleRefetchWeek = () => {
    onRefetchBookingWeek();
    onRefetchHolidayMonth();
  };

  const renderTimeline = (mode?: TimelineMode) => {
    let currentScreen: ReactNode = null;

    switch (mode) {
      case TimelineMode.WEEK:
        currentScreen = (
          <TimelineWeek
            form={form}
            listBookingWeek={listBookingWeek?.data || []}
            listBookingMonth={listBookingMonth?.data || []}
            user={user}
            onRefetchWeek={handleRefetchWeek}
          />
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
    <Card>
      <Row gutter={[0, 10]} className="timeline-custom-box">
        <Col span={24} className="m-b-22">
          <Row justify="space-between" align="middle" wrap>
            <Col>
              <h3 className="font-size-14 font-weight-700 color-1A1A1A font-family-primary m-b-0 text-capitalize">
                {intl.formatMessage({ id: 'menu.bookingManagement' })}
              </h3>
            </Col>

            <Col>
              <CustomButton
                icon={<IconSVG type="category" />}
                className="width-228 p-0 d-flex align-items-center justify-content-center background-color-primary timeline-custom-header-button"
                onClick={() => navigate(DOCTOR_CLINIC_ROUTE_NAME.LIST)}
              >
                <span className="font-weight-600 color-ffffff">
                  {intl.formatMessage({ id: 'menu.bookingManagement.empty' })}
                </span>
              </CustomButton>
            </Col>
          </Row>
        </Col>

        <Col span={24}>
          <TimelineControl form={form} user={user} />
        </Col>

        <Col span={24}>{renderTimeline(mode)}</Col>

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
    </Card>
  );
};

export default ListBooking;
