import { Breadcrumb, Button, Card, Drawer, Layout, MenuProps, theme } from 'antd';
import { Outlet } from 'react-router-dom';
import SidebarContent from '../SideBar/SidebarContent';
import { ReactNode, useEffect, useState } from 'react';
import SidebarLogo from '../SideBar/SidebarLogo';
import Topbar from '../TopBar';
import { TAB_SIZE } from '../../constants/ThemeSetting';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
const { Header, Content, Sider, Footer } = Layout;

interface IMainAppProp {
  menuItems?: MenuProps['items'];
  infoDropdownItems?: MenuProps['items'];
  extraTopbar?: ReactNode;
}

const MainApp = (props: IMainAppProp) => {
  const [collapsed, setCollapsed] = useState(false);
  const { width } = useSelector((state: RootState) => state.setting);

  return (
    <Layout style={{ minHeight: '100vh' }} hasSider={true}>
      <Sider className="shadow sider" trigger={null} collapsible collapsed={width < TAB_SIZE ? false : collapsed}>
        {width < TAB_SIZE ? (
          <Drawer open={collapsed} placement="left" closable={false} onClose={() => setCollapsed(!collapsed)}>
            <SidebarContent menuItems={props.menuItems} />
          </Drawer>
        ) : (
          <SidebarContent menuItems={props.menuItems} />
        )}
      </Sider>
      <Layout>
        <Layout>
          <Topbar
            collapsed={collapsed}
            onCollapsed={() => setCollapsed(!collapsed)}
            infoDropdownItems={props.infoDropdownItems}
          >
            {props.extraTopbar}
          </Topbar>
          <Content
            style={{
              padding: '16px 30px',
              margin: 0,
              height: '1vh',
              overflow: 'auto',
            }}
          >
            <Outlet />
          </Content>
          {/* <Footer style={{ textAlign: "center" }}>
            ©2023 Created by Company
          </Footer> */}
        </Layout>
      </Layout>
    </Layout>
  );
};
export default MainApp;
