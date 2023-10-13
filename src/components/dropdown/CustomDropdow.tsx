import { Button, Dropdown, Space, DropDownProps } from 'antd';
import IconSVG from '../icons/icons';
import { useIntl } from 'react-intl';
import { DownOutlined } from '@ant-design/icons';
import { Administrator } from '../../apis/client-axios';
import { type } from 'os';
import { useQuery } from '@tanstack/react-query';
import { adminApi } from '../../apis';
import { useState } from 'react';

interface CustomDropdownProps extends DropDownProps {
  iconType?: string;
  className?: string;
  position: string;
  setPosition: (text: string | null) => void;
}

const DropdownCustom = (props: CustomDropdownProps) => {
  const intl = useIntl();
  const { iconType, className, position, setPosition } = props;

  const [items, setItem] = useState<{ key: number; label: JSX.Element }[]>([
    {
      key: Number(0),
      label: <div onClick={() => setPosition(null)}>{intl.formatMessage({ id: 'admin.user.all' })}</div>,
    },
  ]);

  const { data: allAdmin } = useQuery({
    queryKey: ['getAllAdmin'],
    queryFn: () => adminApi.administratorControllerGetAll(),
    onSuccess: ({ data }) => {
      const positionAll = data?.filter(
        (item, index, self) => item.position !== null && self.findIndex((i) => i.position === item.position) === index
      );
      const positionItems = positionAll.map((item, index) => {
        return {
          key: index + 1,
          label: <div onClick={() => setPosition(item.position)}>{item.position}</div>,
        };
      }) as { key: number; label: JSX.Element }[];
      setItem([...items, ...positionItems]);
    },
  });

  return (
    <Dropdown className={`ant-custom-dopdown ${className}`} menu={{ items }} placement="bottomLeft" {...props}>
      <Button style={{ width: '184px', height: '48px', textAlign: 'left', marginLeft: '15px', borderRadius: '32px' }}>
        <Space style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Space>
            {iconType && <IconSVG type={iconType}></IconSVG>}
            <div className="front-base" style={{ paddingRight: '15px' }}>
              {intl.formatMessage({
                id: !position ? 'admin.user.position' : position,
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
