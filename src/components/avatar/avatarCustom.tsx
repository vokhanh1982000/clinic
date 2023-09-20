import TextArea from 'antd/es/input/TextArea';
import { useIntl } from 'react-intl';
import type { TextAreaProps } from 'rc-textarea/lib/interface';
import { Avatar, AvatarProps, Upload } from 'antd';
import IconSVG from '../icons/icons';
import { CameraOutlined } from '@ant-design/icons';

interface CustomAvatarProps extends AvatarProps {
  className?: string;
  src?: string;
}

const CustomAvatar = (props: CustomAvatarProps) => {
  const intl = useIntl();
  const { src, className } = props;

  return (
    <Upload className="ant-custom-avatar">
      <Avatar src={`${src}`} icon={<IconSVG type="user" />} className={`ant-custom-avatar ${className}`} {...props} />
      <CameraOutlined className="camera" />
    </Upload>
  );
};

export default CustomAvatar;
