import { Breadcrumb, Button, Layout, MenuProps, Row, theme } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import LanguageDropdown from './LanguageDropdown';
import AccountInfo from './AccountInfo';
import DarkModeSwitch from './DarkModeSwitch';
import { ReactNode, useEffect, useState } from 'react';
import {
  ADMIN_CLINIC_ROUTE_PATH,
  ADMIN_ROUTE_NAME,
  ADMIN_ROUTE_PATH,
  DOCTOR_CLINIC_ROUTE_PATH,
} from '../../constants/route';
import { useLocation } from 'react-router-dom';
import { useIntl } from 'react-intl';
import { getLabelBreadcrum } from '../../util/menu';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { getRootPath } from '../../util/logout';
import { DownOutlined } from '@ant-design/icons';
const { Header } = Layout;

const Topbar = (props: {
  collapsed?: boolean;
  onCollapsed?: Function;
  infoDropdownItems?: MenuProps['items'];
  children?: ReactNode;
}) => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const location = useLocation();
  const intl = useIntl();
  const { locale } = useSelector((state: RootState) => state.setting);
  const rootPath = getRootPath();
  const DEFAULT_BREADCRUMB: any = [
    {
      href: `/${rootPath}`,
      title: (
        <div className="d-flex align-items-center icon-home">
          <img src="/assets/icons/admin/icn_home.svg" />
          {intl.formatMessage({ id: 'menu.home' })}
        </div>
      ),
    },
  ];

  const [breadcrumb, setBreadcrumb] = useState(DEFAULT_BREADCRUMB);

  useEffect(() => {
    if (location.pathname) {
      let arr = [...DEFAULT_BREADCRUMB];
      const src =
        rootPath == 'admin'
          ? ADMIN_ROUTE_PATH
          : rootPath == 'admin-clinic'
          ? ADMIN_CLINIC_ROUTE_PATH
          : DOCTOR_CLINIC_ROUTE_PATH;
      Object.values(src).forEach((route: any) => {
        if (route != '' && location.pathname.includes(`${route}`) && getLabelBreadcrum(route, rootPath) != '') {
          arr.push({
            href: route,
            title: intl.formatMessage({ id: getLabelBreadcrum(route, rootPath) }),
          });
        }
      });
      delete arr[arr.length - 1].href;
      setBreadcrumb(arr);
    }
  }, [location.pathname, locale]);

  return (
    <Header style={{ padding: 0, background: colorBgContainer }} className="d-flex justify-content-between">
      <Row>
        <Breadcrumb className="d-flex align-items-center breadcrumb-container" items={breadcrumb} />
        {/* <Button
          type="text"
          icon={props.collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => props.onCollapsed && props.onCollapsed()}
          style={{
            fontSize: '16px',
            width: 64,
            height: 64,
          }}
        /> */}
        {props.children}
      </Row>
      <Row style={{ fontFamily: 'Open Sans', fontWeight: '600', fontSize: '16px' }}>
        {/* <DarkModeSwitch /> */}
        <LanguageDropdown />
        <AccountInfo infoDropdownItems={props.infoDropdownItems} />
        <DownOutlined style={{ paddingRight: '60px' }} />
      </Row>
    </Header>
  );
};

export default Topbar;
