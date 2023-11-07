import { Modal } from 'antd';
import { useIntl } from 'react-intl';
import CustomButton from '../buttons/CustomButton';

interface ConfirmDeleteModalProps {
  name: string;
  subName?: string;
  visible: boolean;
  onSubmit: () => void;
  onClose: () => void;
}

export const ConfirmDeleteModal = (props: ConfirmDeleteModalProps) => {
  const { name, subName, visible, onSubmit, onClose } = props;
  const intl = useIntl();

  return (
    <Modal className="confirm-delete-modal" open={visible} centered closable={false} maskClosable={false} footer={null}>
      <div className="title">
        {intl.formatMessage({
          id: 'common.confirm-delete',
        })}{' '}
        <span className="text-lowercase">{subName}</span> <span className="name">{name}?</span>
      </div>
      <div className="action">
        <CustomButton className="button-cancel" onClick={onClose}>
          {intl.formatMessage({
            id: 'common.cancel',
          })}
        </CustomButton>
        <CustomButton className="button-delete" onClick={onSubmit}>
          {intl.formatMessage({
            id: 'common.delete',
          })}
        </CustomButton>
      </div>
    </Modal>
  );
};
