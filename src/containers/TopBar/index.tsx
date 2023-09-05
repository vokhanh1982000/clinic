import { Button, Layout, MenuProps, Row, theme } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import LanguageDropdown from './LanguageDropdown';
import AccountInfo from './AccountInfo';
import DarkModeSwitch from './DarkModeSwitch';
import { ReactNode } from 'react';
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

  return (
    <Header style={{ padding: 0, background: colorBgContainer }} className="d-flex justify-content-between">
      <Row>
        <Button
          type="text"
          icon={props.collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={() => props.onCollapsed && props.onCollapsed()}
          style={{
            fontSize: '16px',
            width: 64,
            height: 64,
          }}
        />
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
