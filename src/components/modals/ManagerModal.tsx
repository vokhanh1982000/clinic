import { DatePicker, Form, FormInstance, Modal } from 'antd';
import { useIntl } from 'react-intl';
import { useParams } from 'react-router-dom';
import { FORMAT_DATE } from '../../constants/common';
import { ActionUser, UserGender } from '../../constants/enum';
import FormWrap from '../FormWrap';
import CustomButton from '../buttons/CustomButton';
import IconSVG from '../icons/icons';
import CustomInput from '../input/CustomInput';
import CustomSelect from '../select/CustomSelect';

interface ManagerModalProps {
  form: FormInstance;
  visible: boolean;
  title: string;
  action: ActionUser;
  onSubmit: Function;
  onDelete?: Function;
  onClose: () => void;
}

export const ManagerModal = (props: ManagerModalProps) => {
  const { form, visible, title, action, onSubmit, onDelete, onClose } = props;
  const intl = useIntl();
  const { id } = useParams();

  const onFinish = () => {
    const data = form.getFieldsValue();
    onSubmit(data);
  };

  return (
    <Modal className="modal-manager" open={visible} centered closable={false} maskClosable={false} footer={null}>
      <FormWrap form={form} onFinish={onFinish} layout="vertical">
        <div className="modal-manager__content">
          <div className="modal-manager__content__header">
            <div className="modal-manager__content__header__title">{title}</div>
            <div className="modal-manager__content__header__close" onClick={onClose}>
              <IconSVG type="close-modal" />
            </div>
          </div>

          <div className="modal-manager__content__rows">
            <Form.Item
              name="fullName"
              className="name"
              label={intl.formatMessage({
                id: 'manager.modal.create.fullName',
              })}
            >
              <CustomInput />
            </Form.Item>
            <Form.Item
              name="code"
              className="code"
              label={intl.formatMessage({
                id: 'manager.modal.create.code',
              })}
            >
              <CustomInput />
            </Form.Item>
          </div>
          <Form.Item
            name="emailAddress"
            label={intl.formatMessage({
              id: 'manager.modal.create.email',
            })}
          >
            <CustomInput />
          </Form.Item>
          <Form.Item
            name="phoneNumber"
            label={intl.formatMessage({
              id: 'manager.modal.create.phone',
            })}
            rules={[{ required: true }]}
          >
            <CustomInput />
          </Form.Item>
          <div className="modal-manager__content__rows">
            <Form.Item
              name="dateOfBirth"
              className="dob"
              label={intl.formatMessage({
                id: 'manager.modal.create.dob',
              })}
            >
              <DatePicker format={FORMAT_DATE} />
            </Form.Item>
            <Form.Item
              name="gender"
              className="gender"
              label={intl.formatMessage({
                id: 'manager.modal.create.gender',
              })}
            >
              <CustomSelect
                options={[
                  {
                    value: UserGender.MALE,
                    label: intl.formatMessage({
                      id: 'common.gender.male',
                    }),
                  },
                  {
                    value: UserGender.FEMALE,
                    label: intl.formatMessage({
                      id: 'common.gender.female',
                    }),
                  },
                ]}
              />
            </Form.Item>
          </div>
          {/* display when create clinic (all case) */}
          {(action === ActionUser.CREATE || (action === ActionUser.EDIT && !id)) && (
            <Form.Item
              name="password"
              className="password"
              label={intl.formatMessage({
                id: 'manager.modal.create.password',
              })}
            >
              <CustomInput isPassword />
            </Form.Item>
          )}
          <div className="modal-manager__content__action">
            {action === ActionUser.CREATE ? (
              <>
                <CustomButton className="button-submit" htmlType="submit">
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
                <CustomButton className="button-submit" htmlType="submit">
                  {intl.formatMessage({
                    id: 'manager.modal.create.button.edit',
                  })}
                </CustomButton>
                {onDelete && (
                  <CustomButton className="button-delete" onClick={() => onDelete()}>
                    {intl.formatMessage({
                      id: 'manager.modal.create.button.delete',
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
