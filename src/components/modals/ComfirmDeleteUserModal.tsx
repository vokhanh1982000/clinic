import { Avatar, Button, Form, FormInstance, Modal, Spin, Upload, message } from 'antd';
import { useIntl } from 'react-intl';
import CustomInput from '../input/CustomInput';
import { ActionUser, MENU_ITEM_TYPE } from '../../constants/enum';
import CustomButton from '../buttons/CustomButton';
import CustomSelect from '../select/CustomSelect';
import IconSVG from '../icons/icons';
import FormWrap from '../FormWrap';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { assetsApi } from '../../apis';
import { MyUploadProps } from '../../constants/dto';
import { ValidateLibrary } from '../../validate';
import { regexImage } from '../../validate/validator.validate';
import { Permission } from '../../util/check-permission';

interface dataModalProps {
  visible: boolean;
  title: string;
  onSubmit: Function;
  onDelete?: Function;
  onClose: () => void;
  data: confirmModalDto;
}

export interface confirmModalDto {
  id: string | null;
  avatar: string | null;
  name: string | null;
  email: string | null;
  consultingId: string | null;
}

export const ConfirmModal = (props: dataModalProps) => {
  const { visible, title, onSubmit, onDelete, onClose, data } = props;
  const intl = useIntl();
  const [loadingImg, setLoadingImg] = useState<boolean>(false);

  const onFinish = () => {};

  return (
    <Modal className="modal-confirm" open={visible} centered closable={false} maskClosable={false} footer={null}>
      <FormWrap onFinish={onFinish} layout="vertical">
        <div className="modal-confirm__content">
          <div className="modal-confirm__content__header">
            <div className="modal-confirm__content__header__title">{title}</div>
            <div className="modal-confirm__content__header__close" onClick={onClose}>
              <IconSVG type="close-modal" />
            </div>
          </div>
          <div className="modal-confirm__content__rows">
            <div className="modal-confirm__content__rows__title">
              <Avatar src={data.avatar && process.env.REACT_APP_URL_IMG_S3 + data.avatar} className="avatar"></Avatar>
              <div className="modal-confirm__content__rows__title__des">
                <span className="modal-confirm__content__rows__title__des__name">{data.name}</span>
                <div className="d-flex align-items-center">
                  <span className="modal-confirm__content__rows__title__des__status">{data.email}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="modal-confirm__content__action">
            <CustomButton className="button-submit" htmlType="submit">
              {intl.formatMessage({
                id: 'common.accept',
              })}
            </CustomButton>
            <CustomButton className="button-cancel" onClick={onClose}>
              {intl.formatMessage({
                id: 'common.cancel',
              })}
            </CustomButton>
          </div>
        </div>
      </FormWrap>
    </Modal>
  );
};
