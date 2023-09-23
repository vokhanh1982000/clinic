import { useIntl } from 'react-intl';
import CustomButton from '../../../../../components/buttons/CustomButton';
import IconSVG from '../../../../../components/icons/icons';
import { useState } from 'react';
import { ManagerModal } from '../../../../../components/modals/ManagerModal';
import { ActionUser } from '../../../../../constants/enum';
import { ConfirmDeleteModal } from '../../../../../components/modals/ConfirmDeleteModal';

export const ManagerInfo = () => {
  const intl = useIntl();
  const [isShowManagerModal, setIsShowManagerModal] = useState<{ visible: boolean; action: ActionUser }>({
    visible: false,
    action: ActionUser.CREATE,
  });
  const [isDeleteManager, setIsDeleteManager] = useState<{ id: string; name: string }>();

  const handleSubmit = () => {
    console.log('123');
  };

  const listManager = [
    {
      id: '1',
      name: 'Nguyễn Văn A',
      email: 'AFE@gmail.com',
    },
    {
      id: '2',
      name: 'Nguyễn Văn B',
      email: 'ADD@gmail.com',
    },
  ];

  return (
    <div className="manager-info">
      <div className="manager-info__header">
        <div className="manager-info__header__title">
          <div className="manager-info__header__title__label">
            {intl.formatMessage({
              id: 'clinic.create.manager.title',
            })}
          </div>
          <div className="line-title"></div>
        </div>
        <CustomButton
          className="button-add"
          icon={<IconSVG type="create-2" />}
          onClick={() => {
            setIsShowManagerModal({ visible: true, action: ActionUser.CREATE });
          }}
        >
          {intl.formatMessage({
            id: 'clinic.create.manager.title',
          })}
        </CustomButton>
      </div>
      <div className="manager-info__list">
        {listManager &&
          listManager.map((manager, index) => {
            return (
              <div
                className={`manager-info__list__item ${
                  listManager.length > 1 && index < listManager.length - 1 && 'border-manager'
                }`}
                key={manager.id}
                onClick={() => {
                  setIsShowManagerModal({ visible: true, action: ActionUser.EDIT });
                }}
              >
                <div className="manager-info__list__item__info">
                  <div className="manager-info__list__item__info__name">{manager.name}</div>
                  <div className="manager-info__list__item__info__email">{manager.email}</div>
                </div>
                <div
                  className="manager-info__list__item__delete"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsDeleteManager({ id: manager.id, name: manager.name });
                  }}
                >
                  <IconSVG type="close" />
                </div>
              </div>
            );
          })}
      </div>
      <ManagerModal
        visible={isShowManagerModal.visible}
        title={
          isShowManagerModal.action === ActionUser.CREATE
            ? intl.formatMessage({
                id: 'manager.modal.create.title.create',
              })
            : intl.formatMessage({
                id: 'manager.modal.create.title.edit',
              })
        }
        action={isShowManagerModal.action}
        onSubmit={handleSubmit}
        onClose={() => setIsShowManagerModal({ visible: false, action: ActionUser.CREATE })}
      />
      <ConfirmDeleteModal
        name={isDeleteManager ? isDeleteManager.name : ''}
        subName={intl.formatMessage({
          id: 'clinic.create.manager.title',
        })}
        visible={!!isDeleteManager}
        onSubmit={() => {
          setIsDeleteManager(undefined);
        }}
        onClose={() => setIsDeleteManager(undefined)}
      />
    </div>
  );
};
