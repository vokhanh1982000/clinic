import { Avatar, Dropdown, MenuProps } from 'antd';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { memo } from 'react';
import { TAB_SIZE } from '../../constants/ThemeSetting';
import { logOut } from '../../util/logout';
import { useNavigate } from 'react-router';
import {
  ADMIN_CLINIC_ROUTE_NAME,
  ADMIN_CLINIC_ROUTE_PATH,
  ADMIN_ROUTE_PATH,
  DOCTOR_CLINIC_ROUTE_PATH,
} from '../../constants/route';
import { NavigateFunction } from 'react-router-dom';
import { userInfo } from 'os';

const AccountInfo = (props: { infoDropdownItems?: MenuProps['items'] }) => {
  const { authUser } = useSelector((state: RootState) => state.auth);
  const { width } = useSelector((state: RootState) => state.setting);
  const navigate: NavigateFunction = useNavigate();
  const getFullName = () => {
    return authUser?.fullName || '';
  };
  const sampleItems: MenuProps['items'] = [
    {
      key: '2',
      label: 'profile',
      onClick: (): void => {
        if (authUser?.user.type === 'administrator_clinic') {
          navigate(ADMIN_CLINIC_ROUTE_PATH.ADMIN_CLINIC_PROFILE);
        }
        if (authUser?.user.type === 'administrator') {
          navigate(ADMIN_ROUTE_PATH.ADMIN_PROFILE);
        }
        if (authUser?.user.type === 'doctor_clinic') {
          navigate(DOCTOR_CLINIC_ROUTE_PATH.DOCTOR_PROFILE);
        }
      },
    },
    {
      key: '3',
      label: 'Đăng xuất',
      onClick: () => {
        logOut();
      },
    },
  ];
  return (
    <div className="mx-3 cursor-pointer">
      <Dropdown
        trigger={['click']}
        menu={{ items: props.infoDropdownItems || sampleItems }}
        placement="bottomRight"
        arrow={true}
      >
        <div>
          <Avatar className="my-auto" icon={<UserOutlined />} />
          <span className="ms-1 font-base">{width < TAB_SIZE ? '' : getFullName()}</span>
        </div>
      </Dropdown>
    </div>
  );
};

export default memo(AccountInfo);
