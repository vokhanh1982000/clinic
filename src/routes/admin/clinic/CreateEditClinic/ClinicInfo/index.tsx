import { Form, TimePicker } from 'antd';
import { useIntl } from 'react-intl';
import CustomInput from '../../../../../components/input/CustomInput';
import { FORMAT_TIME } from '../../../../../constants/common';
import CustomSelect from '../../../../../components/select/CustomSelect';

export const ClinicInfo = () => {
  const intl = useIntl();
  return (
    <div className="clinic-info">
      <div className="clinic-info__title">
        <div className="clinic-info__title__label">
          {intl.formatMessage({
            id: 'clinic.create.clinic.title',
          })}
        </div>
        <div className="line-title"></div>
      </div>
      <div className="clinic-info__content">
        <div className="clinic-info__content__rows">
          <Form.Item
            className="name"
            label={intl.formatMessage({
              id: 'clinic.create.clinic.name',
            })}
            name={'name'}
            rules={[{ required: true }]}
          >
            <CustomInput />
          </Form.Item>
          <Form.Item
            className="code"
            label={intl.formatMessage({
              id: 'clinic.create.clinic.code',
            })}
            name={'code'}
            rules={[{ required: true }]}
          >
            <CustomInput disabled />
          </Form.Item>
        </div>
        <Form.Item
          className="address"
          label={intl.formatMessage({
            id: 'clinic.create.clinic.address',
          })}
          name={'address'}
          rules={[{ required: true }]}
        >
          <CustomInput />
        </Form.Item>
        <Form.Item
          className="phone"
          label={intl.formatMessage({
            id: 'clinic.create.clinic.phone',
          })}
          name={'phone'}
          rules={[{ required: true }]}
        >
          <CustomInput />
        </Form.Item>
        <div className="clinic-info__content__rows">
          <Form.Item
            className="workTime"
            label={intl.formatMessage({
              id: 'clinic.create.clinic.workTime',
            })}
            name={'workTime'}
            rules={[{ required: true }]}
          >
            <TimePicker.RangePicker format={FORMAT_TIME} />
          </Form.Item>
          <Form.Item
            className="status"
            label={intl.formatMessage({
              id: 'clinic.create.clinic.status',
            })}
            name={'status'}
            rules={[{ required: true }]}
          >
            <CustomSelect
              options={[
                {
                  value: 'active',
                  label: intl.formatMessage({
                    id: 'common.active',
                  }),
                },
                {
                  value: 'inactive',
                  label: intl.formatMessage({
                    id: 'common.inactive',
                  }),
                },
              ]}
            />
          </Form.Item>
        </div>
      </div>
    </div>
  );
};
