import { Button, Form, FormInstance, Modal } from 'antd';
import { useIntl } from 'react-intl';
import CustomInput from '../input/CustomInput';
import { ActionUser } from '../../constants/enum';
import CustomButton from '../buttons/CustomButton';
import CustomSelect from '../select/CustomSelect';
import IconSVG from '../icons/icons';

interface CategoryModalProps {
  form?: FormInstance;
  visible: boolean;
  title: string;
  action: ActionUser;
  onSubmit: Function;
  onDelete?: Function;
  onClose: () => void;
}

export const CategoryModal = (props: CategoryModalProps) => {
  const { form, visible, title, action, onSubmit, onDelete, onClose } = props;
  const intl = useIntl();

  return (
    <Modal className="modal-category" open={visible} centered closable={false} maskClosable={false} footer={null}>
      <div className="modal-category__content">
        <div className="modal-category__content__header">
          <div className="modal-category__content__header__title">{title}</div>
          <div className="modal-category__content__header__close" onClick={onClose}>
            <IconSVG type="close-modal" />
          </div>
        </div>

        <Form.Item
          name="name"
          className="name"
          label={intl.formatMessage({
            id: 'category.modal.create.name',
          })}
        >
          <CustomInput />
        </Form.Item>

        <div className="modal-category__content__action">
          {action === ActionUser.CREATE ? (
            <>
              <CustomButton className="button-submit" onClick={() => onSubmit()}>
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
              <CustomButton className="button-submit" onClick={() => onSubmit()}>
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
    </Modal>
  );
};
