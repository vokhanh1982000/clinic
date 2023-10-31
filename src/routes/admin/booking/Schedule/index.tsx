import { useQuery } from '@tanstack/react-query';
import { Card, Col, Form, Image, Row } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { ReactNode, SyntheticEvent, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useNavigate, useParams } from 'react-router-dom';
import { adminBookingApi, doctorClinicApi, holidayScheduleApi } from '../../../../apis';
import { DoctorClinic } from '../../../../apis/client-axios';
import TimelineControl from '../../../../components/TimelineControl';
import { IFormData, NOTES, TimelineMode, n } from '../../../../components/TimelineControl/constants';
import TimelineMonth from '../../../../components/TimelineMonth';
import TimelineWeek from '../../../../components/TimelineWeek';
import IconSVG from '../../../../components/icons/icons';
import { ADMIN_ROUTE_PATH } from '../../../../constants/route';
import { useAppSelector } from '../../../../store';
import { DATE_TIME_FORMAT } from '../../../../util/constant';

const DoctorSchedule = () => {
  const intl = useIntl();

  const [form] = Form.useForm<IFormData>();
  const mode: TimelineMode | undefined = Form.useWatch(n('mode'), form) as TimelineMode | undefined;
  const time = Form.useWatch(n('time'), form) as Dayjs | undefined;

  const { id } = useParams<{ id: string }>();

  const user = useAppSelector((state) => state.auth).authUser as DoctorClinic;

  const navigate = useNavigate();

  const [isImageError, setIsImageError] = useState<boolean>(false);

  useEffect(() => {
    form.setFieldsValue({
      [n('time')]: dayjs(),
      [n('mode')]: TimelineMode.WEEK,
    });
  }, []);

  const { data: listBookingWeek, refetch: onRefetchBookingWeek } = useQuery({
    queryKey: ['adminScheduleBookingWeek', time, mode],
    queryFn: () =>
      adminBookingApi.adminBookingControllerGetBookingByWeek(
        dayjs(time).startOf('week').format(DATE_TIME_FORMAT),
        undefined,
        id
      ),
    enabled: !!time && mode === TimelineMode.WEEK,
  });

  const { data: listBookingMonth, refetch: onRefetchBookingMonth } = useQuery({
    queryKey: ['adminScheduleBookingMonth', time, mode],
    queryFn: () =>
      adminBookingApi.adminBookingControllerGetBookingByMonth(dayjs(time).format(DATE_TIME_FORMAT), undefined, id),
    enabled: !!time && mode === TimelineMode.MONTH,
  });

  const { data: listHolidayMonth, refetch: onRefetchHolidayMonth } = useQuery({
    queryKey: ['adminScheduleHolidayMonth', time, mode],
    queryFn: () =>
      holidayScheduleApi.holidayScheduleControllerGetMonth(
        user.clinicId,
        dayjs(time).startOf('month').format(DATE_TIME_FORMAT)
      ),
    enabled: !!time && mode === TimelineMode.MONTH,
  });

  const { data: doctorClinicInformation } = useQuery({
    queryKey: ['scheduleDoctorClinicInformation', id],
    queryFn: () => doctorClinicApi.doctorClinicControllerGetById(id as string),
    enabled: !!id,
  });

  const handleRefetchMonth = () => {
    onRefetchBookingMonth();
    onRefetchHolidayMonth();
  };

  const handleRefetchWeek = () => {
    onRefetchBookingWeek();
  };

  const renderTimeline = (mode?: TimelineMode) => {
    let currentScreen: ReactNode = null;

    switch (mode) {
      case TimelineMode.WEEK:
        currentScreen = <TimelineWeek form={form} listBookingWeek={listBookingWeek?.data || []} user={user} />;
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

  const handleErrorImage = (e: SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.onerror = null;
    setIsImageError(true);
  };

  return (
    <Card>
      <Row gutter={[0, 10]}>
        <Col span={24} className="m-b-22">
          <Row justify="space-between" align="middle" wrap>
            <Col>
              <h3 className="font-size-14 font-weight-700 color-1A1A1A font-family-primary m-b-0">
                {intl.formatMessage({ id: 'menu.schedule.doctor' })}
              </h3>
            </Col>

            <Col>
              <div
                className="width-52 height-52 timeline-custom-schedule-avatar cursor-pointer"
                onClick={() => navigate(`${ADMIN_ROUTE_PATH.DETAIL_DOCTOR}/${id}`)}
              >
                {doctorClinicInformation?.data.avatar && !isImageError ? (
                  <Image
                    width={40}
                    height={40}
                    src={process.env.REACT_APP_URL_IMG_S3 + doctorClinicInformation?.data.avatar.preview}
                    alt={doctorClinicInformation?.data.fullName || ''}
                    onError={handleErrorImage}
                    preview={false}
                  />
                ) : (
                  <IconSVG type="avatar-default" />
                )}
              </div>
            </Col>
          </Row>
        </Col>

        <Col span={24}>
          <TimelineControl
            form={form}
            user={user}
            onRefetchMonth={handleRefetchMonth}
            onRefetchWeek={handleRefetchWeek}
          />
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
export default DoctorSchedule;
