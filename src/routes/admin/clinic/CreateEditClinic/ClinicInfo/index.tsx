import { Form, FormInstance, TimePicker } from 'antd';
import { useIntl } from 'react-intl';
import CustomInput from '../../../../../components/input/CustomInput';
import { FORMAT_TIME } from '../../../../../constants/common';
import CustomSelect from '../../../../../components/select/CustomSelect';
import { useQuery } from '@tanstack/react-query';
import { cadastralApi } from '../../../../../apis';
import { useState } from 'react';

interface ClinicInfoParams {
  form: FormInstance;
}

export const ClinicInfo = (props: ClinicInfoParams) => {
  const { form } = props;
  const intl = useIntl();
  const [provinceCode, setProvinceCode] = useState<string>();
  const [districtCode, setDistrictCode] = useState<string>();

  const { data: listProvince, isLoading } = useQuery({
    queryKey: ['customerList'],
    queryFn: () => cadastralApi.cadastralControllerGetProvince(),
  });

  const { data: listDistrict } = useQuery({
    queryKey: ['customerList', provinceCode],
    queryFn: () => cadastralApi.cadastralControllerGetDistrictByProvince(undefined, provinceCode),
    enabled: !!provinceCode,
  });

  const { data: listWard } = useQuery({
    queryKey: ['customerList', districtCode],
    queryFn: () => cadastralApi.cadastralControllerGetWardByCode(undefined, undefined, districtCode),
    enabled: !!districtCode,
  });

  const handleChangeProvince = (value: any, option: any) => {
    setProvinceCode(option.code);
    form.setFieldsValue({
      districtId: undefined,
      wardId: undefined,
    });
  };

  const handleChangeDistrict = (value: any, option: any) => {
    setDistrictCode(option.code);
    form.setFieldsValue({
      wardId: undefined,
    });
  };

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
            name={'fullName'}
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
          >
            <CustomInput />
          </Form.Item>
        </div>
        <div className="clinic-info__content__rows">
          <Form.Item
            className="province"
            label={intl.formatMessage({
              id: 'clinic.create.clinic.province',
            })}
            name={'provinceId'}
          >
            <CustomSelect
              options={
                listProvince && listProvince.data && listProvince.data.length > 0
                  ? listProvince.data.map((item) => ({
                      label: item.name,
                      value: item.id,
                      code: item.baseCode,
                    }))
                  : []
              }
              onChange={handleChangeProvince}
            />
          </Form.Item>
          <Form.Item
            className="district"
            label={intl.formatMessage({
              id: 'clinic.create.clinic.district',
            })}
            name={'districtId'}
          >
            <CustomSelect
              options={
                listDistrict && listDistrict.data && listDistrict.data.length > 0
                  ? listDistrict.data.map((item) => ({
                      label: item.name,
                      value: item.id,
                      code: item.baseCode,
                    }))
                  : []
              }
              onChange={handleChangeDistrict}
            />
          </Form.Item>
        </div>
        <div className="clinic-info__content__rows">
          <Form.Item
            className="ward"
            label={intl.formatMessage({
              id: 'clinic.create.clinic.ward',
            })}
            name={'wardId'}
          >
            <CustomSelect
              options={
                listWard && listWard.data && listWard.data.length > 0
                  ? listWard.data.map((item) => ({
                      label: item.name,
                      value: item.id,
                      code: item.baseCode,
                    }))
                  : []
              }
            />
          </Form.Item>
          <Form.Item
            className="address"
            label={intl.formatMessage({
              id: 'clinic.create.clinic.address',
            })}
            name={'detailAddress'}
          >
            <CustomInput />
          </Form.Item>
        </div>

        <Form.Item
          className="phone"
          label={intl.formatMessage({
            id: 'clinic.create.clinic.phone',
          })}
          name={'phoneClinic'}
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
          >
            <TimePicker.RangePicker format={FORMAT_TIME} />
          </Form.Item>
          <Form.Item
            className="status"
            label={intl.formatMessage({
              id: 'clinic.create.clinic.status',
            })}
            name={'status'}
          >
            <CustomSelect
              options={[
                {
                  value: 1,
                  label: intl.formatMessage({
                    id: 'common.active',
                  }),
                },
                {
                  value: 0,
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
