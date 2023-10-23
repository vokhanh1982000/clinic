import { Button } from 'antd';
import { FC } from 'react';
import { useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import { ADMIN_CLINIC_ROUTE_PATH } from '../../../constants/route';

interface SidebarHeaderContentProps {
  doctorClinicId?: string;
}

const SidebarHeaderContent: FC<SidebarHeaderContentProps> = (props) => {
  const { doctorClinicId } = props;

  const navigate = useNavigate();

  const intl = useIntl();

  const handleClick = (type: 'doctor' | 'schedule') => {
    if (type === 'doctor') {
      navigate(`${ADMIN_CLINIC_ROUTE_PATH.DETAIL_DOCTOR}/${doctorClinicId}`);
    } else if (type === 'schedule') {
      navigate(`${ADMIN_CLINIC_ROUTE_PATH.SCHEDULE_DOCTOR}/${doctorClinicId}`);
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
