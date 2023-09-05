import { MenuProps } from 'antd';
import {
  AppstoreOutlined,
  CustomerServiceOutlined,
  SettingOutlined,
  UserOutlined,
  UnlockOutlined,
} from '@ant-design/icons';
import { getItem } from '../../containers/SideBar/SidebarContent';

export const adminMenuItems: MenuProps['items'] = [
  getItem('Quản lý hệ thống', '/admin/settings', <SettingOutlined />, [
    getItem('Quản trị viên', '/admin/settings/', <UnlockOutlined />),
    getItem('Khách hàng', '/admin/settings/customers', <UserOutlined />),
  ]),
  getItem('Navigation Two', 'users', <AppstoreOutlined />, [
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
