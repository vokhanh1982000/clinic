import { Form } from 'antd';
import React from 'react';
import { useIntl } from 'react-intl';
import CustomArea from '../../../../../components/input/CustomArea';

const Achievement = () => {
  const intl = useIntl();
  return (
    <div className="achievement">
      <div className="achievement__history">
        <div className="achievement__history__title">
          <div className="achievement__history__title__label">
            {intl.formatMessage({
              id: 'doctor.create.achievement.history.title',
            })}
          </div>
          <div className="line-title"></div>
        </div>
        <Form.Item className="name" name={'name'} rules={[{ required: true }]}>
          <CustomArea rows={6} style={{ resize: 'none' }} />
        </Form.Item>
      </div>
      <div className="achievement__experiment">
        <div className="achievement__experiment__title">
          <div className="achievement__experiment__title__label">
            {intl.formatMessage({
              id: 'doctor.create.achievement.experiment.title',
            })}
          </div>
          <div className="line-title"></div>
        </div>
        <Form.Item className="name" name={'name'} rules={[{ required: true }]}>
          <CustomArea rows={6} style={{ resize: 'none' }} />
        </Form.Item>
      </div>
    </div>
  );
};

export default Achievement;
