import { Form, FormInstance, Modal } from 'antd';
import { useIntl } from 'react-intl';
import { useParams } from 'react-router-dom';
import { FORMAT_DATE } from '../../constants/common';
import { ActionUser, UserGender } from '../../constants/enum';
import { formatPhoneNumberInput, handleInputChangeUpperCase } from '../../constants/function';
import { ValidateLibrary } from '../../validate';
import FormWrap from '../FormWrap';
import CustomButton from '../buttons/CustomButton';
import DatePickerCustom from '../date/datePicker';
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
  disableCreate?: boolean;
  disableUpdate?: boolean;
  disableDelete?: boolean;
}

export const ManagerModal = (props: ManagerModalProps) => {
  const { form, visible, title, action, onSubmit, onDelete, onClose, disableCreate, disableUpdate, disableDelete } =
    props;
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
              rules={ValidateLibrary(intl).fullName}
            >
              <CustomInput maxLength={36} placeholder={intl.formatMessage({ id: 'manager.modal.create.fullName' })} />
            </Form.Item>
            <Form.Item
              name="code"
              className="code"
              label={intl.formatMessage({
                id: 'manager.modal.create.code',
              })}
              rules={ValidateLibrary(intl).code}
            >
              <CustomInput
                maxLength={36}
                onInput={handleInputChangeUpperCase}
                placeholder={intl.formatMessage({ id: 'manager.modal.create.code' })}
              />
            </Form.Item>
          </div>
          <Form.Item
            name="emailAddress"
            label={intl.formatMessage({
              id: 'manager.modal.create.email',
            })}
            rules={ValidateLibrary(intl).email}
          >
            <CustomInput
              placeholder={intl.formatMessage({
                id: 'manager.modal.create.email',
              })}
            />
          </Form.Item>
          <Form.Item
            name="phoneNumber"
            label={intl.formatMessage({
              id: 'manager.modal.create.phone',
            })}
            rules={ValidateLibrary(intl).phoneNumber}
          >
            <CustomInput
              placeholder={intl.formatMessage({
                id: 'manager.modal.create.phone',
              })}
              onInput={formatPhoneNumberInput}
            />
          </Form.Item>
          <div className="modal-manager__content__rows">
            <Form.Item
              name="dateOfBirth"
              className="dob"
              label={intl.formatMessage({
                id: 'manager.modal.create.dob',
              })}
            >
              <DatePickerCustom
                dateFormat={FORMAT_DATE}
                className="date-select"
                placeHolder={intl.formatMessage({
                  id: 'common.place-holder.dob',
                })}
              ></DatePickerCustom>
            </Form.Item>
            <Form.Item
              name="gender"
              className="gender"
              label={intl.formatMessage({
                id: 'manager.modal.create.gender',
              })}
            >
              <CustomSelect
                placeholder={intl.formatMessage({
                  id: 'manager.modal.create.gender',
                })}
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
              rules={ValidateLibrary(intl).passwordCustom}
            >
              <CustomInput
                isPassword
                placeholder={intl.formatMessage({
                  id: 'manager.modal.create.password',
                })}
                maxLength={16}
              />
            </Form.Item>
          )}
          <div className="modal-manager__content__action">
            {action === ActionUser.CREATE ? (
              <>
                <CustomButton className="button-submit" disabled={disableCreate} htmlType="submit">
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
                <CustomButton className="button-submit" disabled={disableUpdate} htmlType="submit">
                  {intl.formatMessage({
                    id: 'manager.modal.create.button.edit',
                  })}
                </CustomButton>
                {onDelete && (
                  <CustomButton className="button-delete" disabled={disableDelete} onClick={() => onDelete()}>
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
