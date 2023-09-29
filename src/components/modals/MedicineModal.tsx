import { Form, FormInstance, Modal, Select } from 'antd';
import { useIntl } from 'react-intl';
import CustomInput from '../input/CustomInput';
import { ActionUser, MedicineStatus, MedicineUnit } from '../../constants/enum';
import CustomButton from '../buttons/CustomButton';
import CustomSelect from '../select/CustomSelect';
import React, { useState } from 'react';
import { Option } from 'antd/es/mentions';
import IconSVG from '../icons/icons';

interface MedicineModalProps {
  form?: FormInstance;
  visible: boolean;
  title: string;
  action: ActionUser;
  onSubmit: Function;
  onClose: () => void;
  onDelete?: Function;
  isSuperAdmin: boolean;
}

export const MedicineModal = (props: MedicineModalProps) => {
  const { form, visible, title, action, onSubmit, onClose, onDelete, isSuperAdmin } = props;

  const intl = useIntl();
  const [unit, setUnit] = useState<MedicineUnit>();
  const [status, setStatus] = useState<MedicineStatus>();

  const dropDownUnits: any = [
    {
      key: MedicineUnit.JAR,
      label: intl.formatMessage({
        id: `medicine.unit.${MedicineUnit.JAR}`,
      }),
    },
    {
      key: MedicineUnit.PELLET,
      label: intl.formatMessage({
        id: `medicine.unit.${MedicineUnit.PELLET}`,
      }),
    },
  ];

  const dropDownStatus: any = [
    {
      key: MedicineStatus.STILL,
      label: intl.formatMessage({
        id: `medicine.status.${MedicineStatus.STILL}`,
      }),
    },
    {
      key: MedicineStatus.NONE_LEFT,
      label: intl.formatMessage({
        id: `medicine.status.${MedicineStatus.NONE_LEFT}`,
      }),
    },
  ];

  return (
    <Modal className="modal-medicine" open={visible} centered closable={false} maskClosable={false} footer={null}>
      <div className="modal-medicine__content">
        <div className="modal-medicine__content__title">
          <span>{title}</span>
          <span onClick={() => onClose()} className={'modal-medicine__content__title__button-close'}>
            <IconSVG type="close" />
          </span>
        </div>
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
        {!isSuperAdmin && (
          <div className="modal-medicine__content__rows">
            <Form.Item
              name="unit"
              className="unit"
              label={intl.formatMessage({
                id: 'medicine.modal.create.unit',
              })}
            >
              <Select
                className={'ant-custom-select'}
                onSelect={(value): void => {
                  form?.setFieldsValue({
                    unit: value,
                  });
                }}
              >
                {dropDownUnits.map((item: any) => {
                  return <Option value={item.key}>{item.label}</Option>;
                })}
              </Select>
            </Form.Item>
            <Form.Item
              name="status"
              className="status"
              label={intl.formatMessage({
                id: 'medicine.modal.create.status',
              })}
            >
              <Select className={'ant-custom-select'}>
                {dropDownStatus.map((item: any) => {
                  return <Option value={item.key}>{item.label}</Option>;
                })}
              </Select>
            </Form.Item>
          </div>
        )}
        {isSuperAdmin && (

            <Form.Item
              name="unit"
              className="unit"
              label={intl.formatMessage({
                id: 'medicine.modal.create.unit',
              })}
            >
              <Select
                className={'ant-custom-select'}
                onSelect={(value): void => {
                  form?.setFieldsValue({
                    unit: value,
                  });
                }}
              >
                {dropDownUnits.map((item: any) => {
                  return <Option value={item.key}>{item.label}</Option>;
                })}
              </Select>
            </Form.Item>

        )}
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
