import { theme } from 'antd';
import './SidebarLogo.css';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
const SidebarLogo = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const { isDarkMode } = useSelector((state: RootState) => state.setting);

  return (
    <div style={{ background: colorBgContainer }} className="sidebar-logo-container d-flex justify-content-center">
      <img
        width={32}
        height={32}
        className="my-auto"
        src={isDarkMode ? '/assets/icons/logo-white.png' : '/assets/icons/logo.png'}
      />
    </div>
  );
};
export default SidebarLogo;
