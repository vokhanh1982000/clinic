import { Form, FormInstance, Modal } from 'antd';
import { useIntl } from 'react-intl';
import CustomInput from '../input/CustomInput';
import { ActionUser } from '../../constants/enum';
import CustomButton from '../buttons/CustomButton';
import CustomSelect from '../select/CustomSelect';

interface MedicineModalProps {
  form?: FormInstance;
  visible: boolean;
  title: string;
  action: ActionUser;
  onSubmit: Function;
  onClose: () => void;
  onDelete?: Function;
}

export const MedicineModal = (props: MedicineModalProps) => {
  const { form, visible, title, action, onSubmit, onClose, onDelete } = props;
  const intl = useIntl();

  return (
    <Modal className="modal-medicine" open={visible} centered closable={false} maskClosable={false} footer={null}>
      <div className="modal-medicine__content">
        <div className="modal-medicine__content__title">{title}</div>
        <div className="modal-medicine__content__rows">
          <Form.Item
            name="name"
            className="name"
            label={intl.formatMessage({
              id: 'medicine.modal.create.name',
            })}
          >
            <CustomInput />
          </Form.Item>
        </div>
        <Form.Item
          name="usage"
          label={intl.formatMessage({
            id: 'medicine.modal.create.usage',
          })}
        >
          <CustomInput />
        </Form.Item>
        <Form.Item
          name="feature"
          label={intl.formatMessage({
            id: 'medicine.modal.create.feature',
          })}
        >
          <CustomInput />
        </Form.Item>
        <div className="modal-medicine__content__rows">
          <Form.Item
            name="unit"
            className="unit"
            label={intl.formatMessage({
              id: 'medicine.modal.create.unit',
            })}
          >
            <CustomSelect />
          </Form.Item>
          <Form.Item
            name="status"
            className="status"
            label={intl.formatMessage({
              id: 'medicine.modal.create.status',
            })}
          >
            <CustomSelect />
          </Form.Item>
        </div>
        <div className="modal-medicine__content__action">
          {action === ActionUser.CREATE ? (
            <>
              <CustomButton className="button-submit" onClick={() => onSubmit({ data: 'ok' })}>
                {intl.formatMessage({
                  id: 'medicine.modal.create.button.create',
                })}
              </CustomButton>
              <CustomButton className="button-cancel" onClick={onClose}>
                {intl.formatMessage({
                  id: 'medicine.modal.create.button.cancel',
                })}
              </CustomButton>
            </>
          ) : (
            <>
              <CustomButton className="button-submit" onClick={() => onSubmit({ data: 'ok' })}>
                {intl.formatMessage({
                  id: 'medicine.modal.create.button.save',
                })}
              </CustomButton>
              {onDelete && (
                <CustomButton className="button-delete" onClick={() => onDelete()}>
                  {intl.formatMessage({
                    id: 'medicine.modal.create.button.delete',
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
