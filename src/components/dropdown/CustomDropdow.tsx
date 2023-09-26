import { Button, Dropdown, Space, DropDownProps } from 'antd';
import IconSVG from '../icons/icons';
import { useIntl } from 'react-intl';
import { DownOutlined } from '@ant-design/icons';
import { Administrator } from '../../apis/client-axios';

interface CustomDropdownProps extends DropDownProps {
  iconType: string;
  className?: string;
  data: string[] | undefined;
  setFilterSearch: (text: string | null) => void;
}

const DropdownCustom = (props: CustomDropdownProps) => {
  const intl = useIntl();
  const { iconType, className, data, setFilterSearch } = props;
  const items = data?.map((item, index) => {
    return {
      key: index + 1,
      label: <div onClick={() => setFilterSearch(item)}>{item}</div>,
    };
  });

  items?.unshift({
    key: 0,
    label: <div onClick={() => setFilterSearch(null)}>{intl.formatMessage({ id: 'admin.user.all' })}</div>,
  });
  console.log('item', items);

  return (
    <Dropdown className={`ant-custom-dopdown ${className}`} menu={{ items }} placement="bottomLeft" {...props}>
      <Button style={{ height: '48px', textAlign: 'left', marginLeft: '15px', borderRadius: '32px' }}>
        <Space style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Space>
            <IconSVG type={iconType}></IconSVG>
            <div className="front-base" style={{ paddingRight: '15px' }}>
              {intl.formatMessage({
                id: 'admin.user.position',
              })}
            </div>
          </Space>
          <DownOutlined />
        </Space>
      </Button>
    </Dropdown>
  );
};

export default DropdownCustom;
