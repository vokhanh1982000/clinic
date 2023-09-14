import React, { useEffect, useState } from 'react';
import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import SidebarLogo from './SidebarLogo';
import { ADMIN_ROUTE_NAME, ADMIN_ROUTE_PATH } from '../../constants/route';

type MenuItem = Required<MenuProps>['items'][number];

export const getItem = (
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: 'group'
): MenuItem => {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
};

const sampleItems: MenuProps['items'] = [
  getItem('Navigation One', 'sub1', <MailOutlined />, [
    getItem('Item 1', 'g1', null, [getItem('Option 1', '1'), getItem('Option 2', '2')], 'group'),
    getItem('Item 2', 'g2', null, [getItem('Option 3', '3'), getItem('Option 4', '4')], 'group'),
  ]),

  getItem('Navigation Two', 'sub2', <AppstoreOutlined />, [
    getItem('Option 5', '5'),
    getItem('Option 6', '6'),
    getItem('Submenu', 'sub3', null, [getItem('Option 7', '7'), getItem('Option 8', '8')]),
  ]),

  { type: 'divider' },

  getItem('Navigation Three', 'sub4', <SettingOutlined />, [
    getItem('Option 9', '9'),
    getItem('Option 10', '10'),
    getItem('Option 11', '11'),
    getItem('Option 12', '12'),
  ]),

  getItem('Group', 'grp', null, [getItem('Option 13', '13'), getItem('Option 14', '14')], 'group'),
];

interface ISideBarContentProp {
  menuItems?: MenuProps['items'];
}

const SidebarContent = (props: ISideBarContentProp) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [current, setCurrent] = useState<string>(location.pathname);

  const selectedKeys = location.pathname.substring(1);
  const defaultOpenKeys = selectedKeys.split('/')[1];

  const onClick: MenuProps['onClick'] = (e) => {
    setCurrent(e.key);
    navigate(e.key);
  };

  useEffect(() => {
    if (location.pathname) {
      Object.values(ADMIN_ROUTE_PATH).forEach((route) => {
        if (current.includes(`${route}`)) {
          setCurrent(route);
        }
      });
    }
  }, [location.pathname]);

  return (
    <>
      <SidebarLogo />
      <Menu
        style={{ height: 'calc(100% - 64px)', width: 355 }}
        onClick={onClick}
        // theme="dark"
        selectedKeys={[current || '']}
        defaultOpenKeys={[defaultOpenKeys]}
        mode="inline"
        items={props.menuItems || sampleItems}
      />
    </>
  );
};

export default SidebarContent;
