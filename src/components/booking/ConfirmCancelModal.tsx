import { Modal } from 'antd';
import { useIntl } from 'react-intl';
import CustomButton from '../buttons/CustomButton';

interface ConfirmCancelModalProps {
  name?: string;
  subName?: string;
  visible: boolean;
  onSubmit: () => void;
  onClose: () => void;
}

export const ConfirmCancelModal = (props: ConfirmCancelModalProps) => {
  const { name, subName, visible, onSubmit, onClose } = props;
  const intl = useIntl();

  return (
    <Modal className="confirm-cancel-modal" open={visible} centered closable={false} maskClosable={false} footer={null}>
      <div className="title">
        {intl.formatMessage({
          id: 'booking.modal-cancel.confirm-cancel',
        })}{' '}
        <span className="text-lowercase">{subName}</span> <span className="name">{name}?</span>
      </div>
      <div className="action">
        <CustomButton className="button-cancel" onClick={onClose}>
          {intl.formatMessage({
            id: 'booking.cancel-modal.button.cancel',
          })}
        </CustomButton>
        <CustomButton className="button-confirm" onClick={onSubmit}>
          {intl.formatMessage({
            id: 'booking.cancel-modal.button.confirm',
          })}
        </CustomButton>
      </div>
    </Modal>
  );
};
