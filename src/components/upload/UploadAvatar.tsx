import { Form, Spin, Upload } from 'antd';
import React from 'react';
import IconSVG from '../icons/icons';

interface UploadAvatarProps {
  avatar: string | undefined;
  loadingImg: boolean;
  customRequest: any;
}

const UploadAvatar = (props: UploadAvatarProps) => {
  const { avatar, loadingImg, customRequest } = props;
  return (
    <div id="upload-avatar">
      <span className="upload-avatar">
        {loadingImg ? <Spin /> : avatar ? <img src={avatar} /> : <IconSVG type="avatar-default" />}
        <Form.Item name="avatarId" className="icon-upload">
          <Upload name="avatar" className="avatar-uploader" showUploadList={false} customRequest={customRequest}>
            <span className="icon-camera">
              <IconSVG type="camera" />
            </span>
          </Upload>
        </Form.Item>
      </span>
    </div>
  );
};

export default UploadAvatar;
