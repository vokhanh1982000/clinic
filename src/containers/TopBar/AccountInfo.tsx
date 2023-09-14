import { Avatar, Dropdown, MenuProps } from 'antd';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { memo } from 'react';
import { TAB_SIZE } from '../../constants/ThemeSetting';
import { logOut } from '../../util/logout';

const AccountInfo = (props: { infoDropdownItems?: MenuProps['items'] }) => {
  const { authUser } = useSelector((state: RootState) => state.auth);
  const { width } = useSelector((state: RootState) => state.setting);
  const getFullName = () => {
    return authUser?.fullName || '';
  };
  const sampleItems: MenuProps['items'] = [
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
          <span className="ms-1">{width < TAB_SIZE ? '' : getFullName()}</span>
        </div>
      </Dropdown>
    </div>
  );
};

export default memo(AccountInfo);
