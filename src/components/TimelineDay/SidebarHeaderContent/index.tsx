import { Button } from 'antd';
import { FC } from 'react';
import { useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import { Administrator, AdministratorClinic, Customer, DoctorClinic } from '../../../apis/client-axios';
import { ADMIN_CLINIC_ROUTE_PATH, ADMIN_ROUTE_PATH } from '../../../constants/route';

interface SidebarHeaderContentProps {
  doctorClinicId?: string;
  user: Administrator | Customer | AdministratorClinic | DoctorClinic;
  clinicId?: string;
}

const SidebarHeaderContent: FC<SidebarHeaderContentProps> = (props) => {
  const { doctorClinicId, user, clinicId } = props;

  const navigate = useNavigate();

  const intl = useIntl();

  const handleClick = (type: 'doctor' | 'schedule') => {
    const route = user.user.type === 'administrator' ? ADMIN_ROUTE_PATH : ADMIN_CLINIC_ROUTE_PATH;

    if (type === 'doctor') {
      navigate(
        `${
          user.user.type === 'administrator' ? ADMIN_ROUTE_PATH.DETAIL_DOCTOR_CLINIC : route.DETAIL_DOCTOR
        }/${doctorClinicId}`
      );
    } else if (type === 'schedule') {
      navigate(`${route.SCHEDULE_DOCTOR}/${doctorClinicId}?clinicId=${clinicId}`);
    }
  };

  return (
    <div className="d-flex flex-column gap-16 justify-content-center">
      <Button
        type="text"
        className="font-size-16 font-weight-400 timeline-custom-day-popover-button"
        onClick={() => handleClick('doctor')}
      >
        {intl.formatMessage({ id: 'timeline.doctor.information' })}
      </Button>
      <Button
        type="text"
        className="font-size-16 font-weight-400 timeline-custom-day-popover-button"
        onClick={() => handleClick('schedule')}
      >
        {intl.formatMessage({ id: 'timeline.doctor.schedule' })}
      </Button>
    </div>
  );
};

export default SidebarHeaderContent;
