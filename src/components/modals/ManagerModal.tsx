import { Button, Form, FormInstance, Modal } from 'antd';
import { useIntl } from 'react-intl';
import CustomInput from '../input/CustomInput';
import { ActionUser } from '../../constants/enum';
import CustomButton from '../buttons/CustomButton';
import CustomSelect from '../select/CustomSelect';
import IconSVG from '../icons/icons';

interface ManagerModalProps {
  form?: FormInstance;
  visible: boolean;
  title: string;
  action: ActionUser;
  onSubmit: Function;
  onClose: () => void;
}

export const ManagerModal = (props: ManagerModalProps) => {
  const { form, visible, title, action, onSubmit, onClose } = props;
  const intl = useIntl();

  return (
    <Modal className="modal-manager" open={visible} centered closable={false} maskClosable={false} footer={null}>
      <div className="modal-manager__content">
        <div className="modal-manager__content__header">
          <div className="modal-manager__content__header__title">{title}</div>
          <div className="modal-manager__content__header__close" onClick={onClose}>
            <IconSVG type="close-modal" />
          </div>
        </div>

        <div className="modal-manager__content__rows">
          <Form.Item
            name="name"
            className="name"
            label={intl.formatMessage({
              id: 'manager.modal.create.fullName',
            })}
          >
            <CustomInput />
          </Form.Item>
          <Form.Item
            name="quantity"
            className="quantity"
            label={intl.formatMessage({
              id: 'manager.modal.create.code',
            })}
          >
            <CustomInput disabled />
          </Form.Item>
        </div>
        <Form.Item
          name="effect"
          label={intl.formatMessage({
            id: 'manager.modal.create.email',
          })}
        >
          <CustomInput />
        </Form.Item>
        <Form.Item
          name="feature"
          label={intl.formatMessage({
            id: 'manager.modal.create.phone',
          })}
        >
          <CustomInput />
        </Form.Item>
        <div className="modal-manager__content__rows">
          <Form.Item
            name="unit"
            className="unit"
            label={intl.formatMessage({
              id: 'manager.modal.create.dob',
            })}
          >
            <CustomSelect />
          </Form.Item>
          <Form.Item
            name="status"
            className="status"
            label={intl.formatMessage({
              id: 'manager.modal.create.gender',
            })}
          >
            <CustomSelect />
          </Form.Item>
        </div>
        <div className="modal-manager__content__action">
          {action === ActionUser.CREATE ? (
            <>
              <CustomButton className="button-submit" onClick={() => onSubmit({ data: 'ok' })}>
                {intl.formatMessage({
                  id: 'manager.modal.create.button.create',
                })}
              </CustomButton>
              <CustomButton className="button-cancel" onClick={onClose}>
                {intl.formatMessage({
                  id: 'manager.modal.create.button.cancel',
                })}
              </CustomButton>
            </>
          ) : (
            <>
              <CustomButton className="button-submit" onClick={() => onSubmit({ data: 'ok' })}>
                {intl.formatMessage({
                  id: 'manager.modal.create.button.edit',
                })}
              </CustomButton>
              <CustomButton className="button-delete" onClick={onClose}>
                {intl.formatMessage({
                  id: 'manager.modal.create.button.delete',
                })}
              </CustomButton>
            </>
          )}
        </div>
      </div>
    </Modal>
  );
};
