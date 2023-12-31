import { Button, Form, FormInstance, Modal, Spin, Upload, message } from 'antd';
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
  showType?: MENU_ITEM_TYPE;
  permission: Permission;
}

export const CategoryModal = (props: CategoryModalProps) => {
  const { form, visible, title, action, onSubmit, onDelete, onClose, avatar, setAvatar, showType, permission } = props;
  const intl = useIntl();
  const [loadingImg, setLoadingImg] = useState<boolean>(false);

  const onFinish = () => {
    const data = form.getFieldsValue();
    onSubmit(data);
  };

  const { mutate: UploadImage, status: statusUploadImage } = useMutation(
    (uploadProps: MyUploadProps) =>
      assetsApi.assetControllerUploadFile(uploadProps.file, undefined, uploadProps.s3FilePath),
    {
      onSuccess: ({ data }) => {
        const newData = data as any;
        form.setFieldValue('iconId', newData.id);
        setAvatar(process.env.REACT_APP_URL_IMG_S3 + newData.preview);
        setLoadingImg(false);
      },
      onError: (error: any) => {
        setLoadingImg(false);
        message.error(
          intl.formatMessage({
            id: 'error.IMAGE_INVALID',
          })
        );
      },
    }
  );

  const customRequest = async (options: any) => {
    const { file, onSuccess, onError } = options;
    if (!file || !regexImage.test(file.name)) {
      message.error(
        intl.formatMessage({
          id: 'error.IMAGE_INVALID',
        })
      );
      return;
    }
    setLoadingImg(true);
    UploadImage({ file, assetFolderId: undefined, s3FilePath: 'category' });
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
            {showType === MENU_ITEM_TYPE.LANGUAGE ? (
              <></>
            ) : (
              <div className="icon">
                <div className="icon__display">
                  {loadingImg ? <Spin /> : avatar ? <img src={avatar} /> : <IconSVG type="specialist" />}
                </div>
                <hr className="icon__line" />
                <Form.Item name="iconId" className="icon__upload">
                  <Upload
                    name="avatar"
                    className="avatar-uploader"
                    showUploadList={false}
                    customRequest={customRequest}
                  >
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
            )}

            <Form.Item
              name="name"
              className="name"
              label={intl.formatMessage({
                id: showType === MENU_ITEM_TYPE.LANGUAGE ? 'language.form.title' : 'category.modal.create.name',
              })}
              rules={
                showType === MENU_ITEM_TYPE.LANGUAGE
                  ? ValidateLibrary(intl).languageName
                  : ValidateLibrary(intl).nameCategory
              }
            >
              <CustomInput
                maxLength={255}
                placeholder={
                  showType === MENU_ITEM_TYPE.LANGUAGE
                    ? intl.formatMessage({
                        id: 'language.form.title',
                      })
                    : intl.formatMessage({
                        id: 'category.modal.create.name',
                      })
                }
              />
            </Form.Item>
          </div>

          <div className="modal-category__content__action">
            {action === ActionUser.CREATE ? (
              <>
                <CustomButton className="button-submit" htmlType="submit" disabled={!permission.create}>
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
                <CustomButton className="button-submit" htmlType="submit" disabled={!permission.update}>
                  {intl.formatMessage({
                    id: 'category.modal.create.button.edit',
                  })}
                </CustomButton>
                {onDelete && (
                  <CustomButton className="button-delete" onClick={() => onDelete()} disabled={!permission.delete}>
                    {intl.formatMessage({
                      id:
                        showType === MENU_ITEM_TYPE.LANGUAGE
                          ? 'language.form.btn.delete'
                          : 'category.modal.create.button.delete',
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
