import { useQuery } from '@tanstack/react-query';
import { Card, Col, Form, Row } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { ReactNode, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { adminBookingApi, clinicsApi, doctorClinicApi, holidayScheduleApi } from '../../../../apis';
import { DoctorClinic } from '../../../../apis/client-axios';
import TimelineControl from '../../../../components/TimelineControl';
import { IFilter, IFormData, NOTES, TimelineMode, n } from '../../../../components/TimelineControl/constants';
import TimelineDay from '../../../../components/TimelineDay';
import TimelineMonth from '../../../../components/TimelineMonth';
import CustomButton from '../../../../components/buttons/CustomButton';
import IconSVG from '../../../../components/icons/icons';
import { ADMIN_CLINIC_ROUTE_PATH, ADMIN_ROUTE_PATH } from '../../../../constants/route';
import { useAppDispatch, useAppSelector } from '../../../../store';
import { updateClinic } from '../../../../store/clinicSlice';
import { DATE_TIME_FORMAT } from '../../../../util/constant';

const ClinicTimeline = () => {
  const intl = useIntl();

  const [form] = Form.useForm<IFormData>();
  const mode: TimelineMode | undefined = Form.useWatch(n('mode'), form) as TimelineMode | undefined;
  const time = Form.useWatch(n('time'), form) as Dayjs | undefined;
  const keyword = Form.useWatch(n('keyword'), form) as string | undefined;

  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();

  const user = useAppSelector((state) => state.auth).authUser as DoctorClinic;

  const [filter, setFilter] = useState<IFilter>({ page: 1, size: 9 });

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const params = Object.fromEntries([...(searchParams as any)]);

    form.setFieldsValue({
      [n('time')]: dayjs(params.date, DATE_TIME_FORMAT),
      [n('mode')]: TimelineMode.DATE,
    });
  }, []);

  const { data: clinic } = useQuery({
    queryKey: ['topbarClinic', id],
    queryFn: () => clinicsApi.clinicControllerGetById(id || ''),
    enabled: !!id,
  });

  const { data: listBookingDay, refetch: onRefetchBookingDay } = useQuery({
    queryKey: ['adminBookingDay', time, mode, id, keyword],
    queryFn: () =>
      adminBookingApi.adminBookingControllerGetBookingByDay(dayjs(time).format(DATE_TIME_FORMAT), keyword, id),
    enabled: !!time && mode === TimelineMode.DATE && !!id,
  });

  const { data: listDoctorClinics, refetch: onRefetchDoctorClinic } = useQuery({
    queryKey: ['adminGetDoctorClinic', filter, keyword, id],
    queryFn: () =>
      doctorClinicApi.doctorClinicControllerGetAll(filter.page, filter.size, filter.sort, keyword, undefined, id),
    enabled: !!filter && mode === TimelineMode.DATE && !!id,
  });

  const { data: listBookingMonth, refetch: onRefetchBookingMonth } = useQuery({
    queryKey: ['adminBookingMonth', time, mode, id, keyword],
    queryFn: () =>
      adminBookingApi.adminBookingControllerGetBookingByMonth(dayjs(time).format(DATE_TIME_FORMAT), keyword, id),
    enabled: !!time && mode === TimelineMode.MONTH && !!id,
  });

  const { data: listHolidayMonth, refetch: onRefetchHolidayMonth } = useQuery({
    queryKey: ['adminHolidayMonth', time, mode, id],
    queryFn: () =>
      holidayScheduleApi.holidayScheduleControllerGetMonth(
        id || '',
        dayjs(time).startOf('month').format(DATE_TIME_FORMAT)
      ),
    enabled: !!time && mode === TimelineMode.MONTH && !!id,
  });

  const handleRefetchMonth = () => {
    onRefetchBookingMonth();
    onRefetchHolidayMonth();
  };

  const handleRefetchDay = () => {
    onRefetchBookingDay();
    onRefetchDoctorClinic();
  };

  const handleChangeFilter = (newFilter: IFilter) => {
    setFilter((prev) => ({ ...prev, ...newFilter }));
  };

  useEffect(() => {
    dispatch(updateClinic(clinic?.data));
  }, [clinic, dispatch]);

  const renderTimeline = (mode?: TimelineMode) => {
    let currentScreen: ReactNode = null;

    switch (mode) {
      case TimelineMode.DATE:
        currentScreen = (
          <TimelineDay
            form={form}
            listBookingDay={listBookingDay?.data || []}
            onRefetchDay={handleRefetchDay}
            user={user}
            listDoctorClinics={listDoctorClinics?.data}
            filter={filter}
            onChangeFilter={handleChangeFilter}
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

  const navigateCreate = () => {
    const route = user?.user?.type === 'administrator' ? ADMIN_ROUTE_PATH : ADMIN_CLINIC_ROUTE_PATH;
    navigate(`${route.CREATE_BOOKING}?routeClinicId=${id}&routeDate=${searchParams.get('date')}`);
  };

  return (
    <Card>
      <Row gutter={[0, 10]}>
        <Col span={24} className="m-b-22">
          <Row justify="space-between" align="middle" wrap>
            <Col>
              <h3 className="font-size-14 font-weight-700 color-1A1A1A font-family-primary m-b-0 text-capitalize">
                {clinic?.data?.fullName}
              </h3>
            </Col>

            <Col>
              <CustomButton
                icon={<IconSVG type="create" />}
                className="width-176 p-0 d-flex align-items-center justify-content-center background-color-primary timeline-custom-header-button"
                onClick={navigateCreate}
              >
                <span className="font-weight-600 color-ffffff">
                  {intl.formatMessage({ id: 'timeline.admin.button.create' })}
                </span>
              </CustomButton>
            </Col>
          </Row>
        </Col>

        <Col span={24}>
          <TimelineControl form={form} user={user} onChangeFilter={handleChangeFilter} />
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
export default ClinicTimeline;
