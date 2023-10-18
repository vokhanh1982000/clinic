import { Form } from 'antd';
import React, { Dispatch, SetStateAction } from 'react';
import { useIntl } from 'react-intl';
import CustomArea from '../../input/CustomArea';
import { useNavigate, useParams } from 'react-router-dom';
import CustomButton from '../../buttons/CustomButton';
import { FormInstance } from 'antd/lib/form/Form';
import { ADMIN_CLINIC_ROUTE_PATH } from '../../../constants/route';

interface Props {
  form?: FormInstance;
  onSubmit: Function;
  n: any;
  deleteFc?: (id: string) => void;
  setIsDeleteDoctor: (value: boolean) => void;
}

const Achievement = (props: Props) => {
  const { form, onSubmit, setIsDeleteDoctor, n, deleteFc } = props;
  const { id } = useParams();
  const intl = useIntl();
  const navigate = useNavigate();

  const handleDelete = () => {
    setIsDeleteDoctor(true);
    // if (deleteFc && id) deleteFc(id);
    // setIsDeleteDoctor(false);
  };

  return (
    <div className="achievement">
      <div className="achievement__data">
        <div className="achievement__data__history">
          <div className="achievement__data__history__title">
            <div className="achievement__data__history__title__label">
              {intl.formatMessage({
                id: 'doctor.create.achievement.history.title',
              })}
            </div>
            <div className="line-title"></div>
          </div>
          <Form.Item
            className="name"
            name={n('overview')}
            rules={[
              {
                pattern: /^(?![\s])[\s\S]*/,
                message: intl.formatMessage({ id: 'common.noti.space' }),
              },
            ]}
          >
            <CustomArea
              rows={6}
              style={{ resize: 'none' }}
              placeholder={intl.formatMessage({
                id: 'doctor.create.achievement.history.title',
              })}
            />
          </Form.Item>
        </div>
        <div className="achievement__data__experiment">
          <div className="achievement__data__experiment__title">
            <div className="achievement__experiment__title__label">
              {intl.formatMessage({
                id: 'doctor.create.achievement.experiment.title',
              })}
            </div>
            <div className="line-title"></div>
          </div>
          <Form.Item
            className="name"
            name={n('experience')}
            rules={[
              {
                pattern: /^(?![\s])[\s\S]*/,
                message: intl.formatMessage({ id: 'common.noti.space' }),
              },
            ]}
          >
            <CustomArea
              rows={6}
              style={{ resize: 'none' }}
              placeholder={intl.formatMessage({
                id: 'doctor.create.achievement.experiment.pla',
              })}
            />
          </Form.Item>
        </div>
      </div>
      <div className="achievement__button">
        <div className="button-action">
          {id ? (
            <div className="more-action">
              <CustomButton
                className="button-save"
                onClick={() => {
                  onSubmit();
                }}
              >
                {intl.formatMessage({
                  id: 'doctor.edit.button.save',
                })}
              </CustomButton>
              <CustomButton className="button-delete" onClick={() => handleDelete()}>
                {intl.formatMessage({
                  id: 'doctor.edit.button.delete',
                })}
              </CustomButton>
            </div>
          ) : (
            <div className="more-action">
              <CustomButton className="button-create" onClick={() => onSubmit()}>
                {intl.formatMessage({
                  id: 'doctor.create.button.create',
                })}
              </CustomButton>
              <CustomButton
                className="button-cancel"
                onClick={() => {
                  navigate(-1);
                }}
              >
                {intl.formatMessage({
                  id: 'doctor.create.button.cancel',
                })}
              </CustomButton>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Achievement;
