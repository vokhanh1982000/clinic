import { Button, Form, FormInstance, Modal, Spin, Upload, message } from 'antd';
import { useIntl } from 'react-intl';
import CustomInput from '../input/CustomInput';
import { ActionUser } from '../../constants/enum';
import CustomButton from '../buttons/CustomButton';
import CustomSelect from '../select/CustomSelect';
import IconSVG from '../icons/icons';
import FormWrap from '../FormWrap';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { assetsApi } from '../../apis';

interface CategoryModalProps {
  form: FormInstance;
  visible: boolean;
  title: string;
  action: ActionUser;
  onSubmit: Function;
  onDelete?: Function;
  onClose: () => void;
  avatar: string | undefined;
  setAvatar: React.Dispatch<React.SetStateAction<string | undefined>>;
}

interface UploadProps {
  file: File;
  assetFolderId?: string;
}

export const CategoryModal = (props: CategoryModalProps) => {
  const { form, visible, title, action, onSubmit, onDelete, onClose, avatar, setAvatar } = props;
  const intl = useIntl();
  const [loadingImg, setLoadingImg] = useState<boolean>(false);

  const onFinish = () => {
    const data = form.getFieldsValue();
    onSubmit(data);
  };

  const { mutate: UploadImage, status: statusUploadImage } = useMutation(
    (uploadProps: UploadProps) => assetsApi.assetControllerUploadFile(uploadProps.file, uploadProps.assetFolderId),
    {
      onSuccess: ({ data }) => {
        const newData = data as any;
        form.setFieldValue('iconId', newData.id);
        setAvatar(process.env.REACT_APP_URL_IMG_S3 + newData.preview);
        setLoadingImg(false);
      },
      onError: (error: any) => {
        setLoadingImg(false);
        message.error(error.message);
      },
    }
  );

  const customRequest = async (options: any) => {
    const { file, onSuccess, onError } = options;
    setLoadingImg(true);
    UploadImage({ file });
  };

  return (
    <Modal className="modal-category" open={visible} centered closable={false} maskClosable={false} footer={null}>
      <FormWrap form={form} onFinish={onFinish} layout="vertical">
        <div className="modal-category__content">
          <div className="modal-category__content__header">
            <div className="modal-category__content__header__title">{title}</div>
            <div className="modal-category__content__header__close" onClick={onClose}>
              <IconSVG type="close-modal" />
            </div>
          </div>
          <div className="modal-category__content__rows">
            <div className="icon">
              <div className="icon__display">
                {loadingImg ? <Spin /> : avatar ? <img src={avatar} /> : <IconSVG type="specialist" />}
              </div>
              <hr className="icon__line" />
              <Form.Item name="iconId" className="icon__upload">
                <Upload name="avatar" className="avatar-uploader" showUploadList={false} customRequest={customRequest}>
                  <div className="icon__text">
                    <span>
                      {intl.formatMessage({
                        id: 'common.upload',
                      })}
                    </span>
                    <IconSVG type="upload" />
                  </div>
                </Upload>
              </Form.Item>
            </div>

            <Form.Item
              name="name"
              className="name"
              label={intl.formatMessage({
                id: 'category.modal.create.name',
              })}
              rules={[{ required: true }]}
            >
              <CustomInput />
            </Form.Item>
          </div>

          <div className="modal-category__content__action">
            {action === ActionUser.CREATE ? (
              <>
                <CustomButton className="button-submit" htmlType="submit">
                  {intl.formatMessage({
                    id: 'category.modal.create.button.create',
                  })}
                </CustomButton>
                <CustomButton className="button-cancel" onClick={onClose}>
                  {intl.formatMessage({
                    id: 'category.modal.create.button.cancel',
                  })}
                </CustomButton>
              </>
            ) : (
              <>
                <CustomButton className="button-submit" htmlType="submit">
                  {intl.formatMessage({
                    id: 'category.modal.create.button.edit',
                  })}
                </CustomButton>
                {onDelete && (
                  <CustomButton className="button-delete" onClick={() => onDelete()}>
                    {intl.formatMessage({
                      id: 'category.modal.create.button.delete',
                    })}
                  </CustomButton>
                )}
              </>
            )}
          </div>
        </div>
      </FormWrap>
    </Modal>
  );
};
