import { useQuery } from '@tanstack/react-query';
import { Card, Col, Form, Image, Row, Spin } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { ReactNode, SyntheticEvent, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { adminBookingApi, doctorClinicApi, holidayScheduleApi } from '../../../../apis';
import { DoctorClinic } from '../../../../apis/client-axios';
import TimelineControl from '../../../../components/TimelineControl';
import { IFormData, NOTES, TimelineMode, n } from '../../../../components/TimelineControl/constants';
import TimelineMonth from '../../../../components/TimelineMonth';
import TimelineWeek from '../../../../components/TimelineWeek';
import IconSVG from '../../../../components/icons/icons';
import { PERMISSIONS } from '../../../../constants/enum';
import { ADMIN_ROUTE_PATH } from '../../../../constants/route';
import { RootState, useAppSelector } from '../../../../store';
import CheckPermission, { Permission } from '../../../../util/check-permission';
import { DATE_TIME_FORMAT } from '../../../../util/constant';

const DoctorSchedule = () => {
  const intl = useIntl();

  const [form] = Form.useForm<IFormData>();
  const mode: TimelineMode | undefined = Form.useWatch(n('mode'), form) as TimelineMode | undefined;
  const time = Form.useWatch(n('time'), form) as Dayjs | undefined;

  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const params = Object.fromEntries([...(searchParams as any)]);

  const user = useAppSelector((state) => state.auth).authUser as DoctorClinic;

  const navigate = useNavigate();

  const [isImageError, setIsImageError] = useState<boolean>(false);

  const { authUser } = useSelector((state: RootState) => state.auth);
  const [permisstion, setPermisstion] = useState<Permission>({
    read: false,
    create: false,
    delete: false,
    update: false,
  });

  useEffect(() => {
    form.setFieldsValue({
      [n('time')]: dayjs(),
      [n('mode')]: TimelineMode.WEEK,
    });
  }, []);

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

  const {
    data: listBookingWeek,
    refetch: onRefetchBookingWeek,
    isLoading: isLoadingBookingWeek,
    isFetching: isFetchingBookingWeek,
  } = useQuery({
    queryKey: ['adminScheduleBookingWeek', time, mode, params.clinicId],
    queryFn: () =>
      adminBookingApi.adminBookingControllerGetBookingByWeek(
        dayjs(time).startOf('week').format(DATE_TIME_FORMAT),
        undefined,
        params.clinicId,
        id
      ),
    enabled: !!time && mode === TimelineMode.WEEK && !!params.clinicId,
  });

  const {
    data: listBookingMonth,
    refetch: onRefetchBookingMonth,
    isLoading: isLoadingBookingMonth,
  } = useQuery({
    queryKey: ['adminScheduleBookingMonth', time, mode, params.clinicId],
    queryFn: () =>
      adminBookingApi.adminBookingControllerGetBookingByMonth(
        dayjs(time).format(DATE_TIME_FORMAT),
        undefined,
        params.clinicId,
        id
      ),
    enabled: !!time && !!params.clinicId,
  });

  const {
    data: listHolidayMonth,
    refetch: onRefetchHolidayMonth,
    isLoading: isLoadingHolidayMonth,
  } = useQuery({
    queryKey: ['adminScheduleHolidayMonth', time, mode, params.clinicId],
    queryFn: () =>
      holidayScheduleApi.holidayScheduleControllerGetMonth(
        params.clinicId,
        dayjs(time).startOf('month').format(DATE_TIME_FORMAT)
      ),
    enabled: !!time && !!params.clinicId,
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
    onRefetchHolidayMonth();
    onRefetchBookingWeek();
  };

  const renderTimeline = (mode?: TimelineMode) => {
    let currentScreen: ReactNode = null;

    switch (mode) {
      case TimelineMode.WEEK:
        currentScreen =
          !isFetchingBookingWeek && !isLoadingBookingWeek && !isLoadingHolidayMonth && !isLoadingBookingMonth ? (
            <TimelineWeek
              form={form}
              listBookingWeek={listBookingWeek?.data || []}
              listBookingMonth={listBookingMonth?.data || []}
              listHolidayMonth={listHolidayMonth?.data || []}
              user={user}
              onRefetchWeek={handleRefetchWeek}
              permission={permisstion}
            />
          ) : (
            <Spin />
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
                onClick={() => navigate(`${ADMIN_ROUTE_PATH.DETAIL_DOCTOR_CLINIC}/${id}`)}
              >
                {doctorClinicInformation?.data.avatar && !isImageError ? (
                  <Image
                    width={52}
                    height={52}
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
export default DoctorSchedule;
