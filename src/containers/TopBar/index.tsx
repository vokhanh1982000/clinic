import { Breadcrumb, Button, Layout, MenuProps, Row, theme } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import LanguageDropdown from './LanguageDropdown';
import AccountInfo from './AccountInfo';
import DarkModeSwitch from './DarkModeSwitch';
import { ReactNode, useEffect, useState } from 'react';
import { ADMIN_ROUTE_NAME, ADMIN_ROUTE_PATH } from '../../constants/route';
import { useLocation } from 'react-router-dom';
import { useIntl } from 'react-intl';
import { getLabelBreadcrum } from '../../util/menu';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
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

  const DEFAULT_BREADCRUMB: any = [
    {
      href: '/admin',
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
      Object.values(ADMIN_ROUTE_PATH).forEach((route: any) => {
        if (route != '' && location.pathname.includes(`${route}`) && getLabelBreadcrum(route) != '') {
          arr.push({
            href: route,
            title: intl.formatMessage({ id: getLabelBreadcrum(route) }),
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
        <Breadcrumb
          className="d-flex align-items-center breadcrumb-container"
          items={
            breadcrumb || [
              {
                title: (
                  <div className="d-flex align-items-center icon-home">
                    <img src="/assets/icons/admin/icn_home.svg" />
                    <a href="">Application Center</a>
                  </div>
                ),
              },
              {
                title: <a href="">Application Center</a>,
              },
              {
                title: <a href="">Application List</a>,
              },
              {
                title: 'An Application',
              },
            ]
          }
        />
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
      <Row>
        <DarkModeSwitch />
        <LanguageDropdown />
        <AccountInfo infoDropdownItems={props.infoDropdownItems} />
      </Row>
    </Header>
  );
};

export default Topbar;
