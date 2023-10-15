import { Button } from 'antd';
import { FC } from 'react';
import { useIntl } from 'react-intl';

interface SidebarHeaderContentProps {}

const SidebarHeaderContent: FC<SidebarHeaderContentProps> = (props) => {
  const {} = props;

  const intl = useIntl();

  return (
    <div className="d-flex flex-column gap-16 justify-content-center">
      <Button type="text" className="font-size-16 font-weight-400 timeline-custom-day-popover-button">
        {intl.formatMessage({ id: 'timeline.doctor.information' })}
      </Button>
      <Button type="text" className="font-size-16 font-weight-400 timeline-custom-day-popover-button">
        {intl.formatMessage({ id: 'timeline.doctor.schedule' })}
      </Button>
    </div>
  );
};

export default SidebarHeaderContent;
