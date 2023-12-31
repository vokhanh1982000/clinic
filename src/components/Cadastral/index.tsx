import { Form, FormInstance } from 'antd';
import { useIntl } from 'react-intl';
import CustomSelect from '../select/CustomSelect';
import CustomInput from '../input/CustomInput';
import { cadastralApi } from '../../apis';
import { useQuery } from '@tanstack/react-query';
import { ValidateLibrary } from '../../validate';

export interface cadastralProp {
  form?: FormInstance;
  provinceId?: string;
  districtId?: string;
  setProvinceId: React.Dispatch<React.SetStateAction<string | undefined>>;
  setDistrictId: React.Dispatch<React.SetStateAction<string | undefined>>;
}

export const CadastalCustom = (props: cadastralProp) => {
  const intl = useIntl();

  const { provinceId, districtId, setProvinceId, setDistrictId, form } = props;
  const { data: listProvince } = useQuery({
    queryKey: ['listProvince'],
    queryFn: () => cadastralApi.cadastralControllerGetProvince(),
  });

  const { data: listDistrict } = useQuery({
    queryKey: ['listDistrict', provinceId],
    queryFn: () => cadastralApi.cadastralControllerGetDistrictByProvinceId(provinceId, undefined),
    enabled: !!provinceId,
  });

  const { data: listWard } = useQuery({
    queryKey: ['listWard', districtId],
    queryFn: () => cadastralApi.cadastralControllerGetWardByDistrictId(undefined, districtId),
    enabled: !!districtId,
  });

  const handleChangeProvince = (value: string) => {
    setProvinceId(value);
    setDistrictId(undefined);
    if (form)
      form.setFieldsValue({
        districtId: undefined,
        wardId: undefined,
      });
  };

  const handleChangeDistrict = (value: string) => {
    setDistrictId(value);
    if (form)
      form.setFieldsValue({
        wardId: undefined,
      });
  };

  return (
    <div className="cadastral">
      <div className="cadastral_item">
        <Form.Item
          className="province"
          label={intl.formatMessage({
            id: 'clinic.create.clinic.province',
          })}
          name={'provinceId'}
        >
          <CustomSelect
            placeholder={intl.formatMessage({ id: 'common.province.name' })}
            options={
              listProvince && listProvince.data && listProvince.data.length > 0
                ? listProvince.data.map((item) => ({
                    label: item.name,
                    value: item.id,
                  }))
                : []
            }
            onChange={handleChangeProvince}
            allowClear
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
            placeholder={intl.formatMessage({ id: 'common.district.name' })}
            options={
              listDistrict && listDistrict.data && listDistrict.data.length > 0
                ? listDistrict.data.map((item) => ({
                    label: item.name,
                    value: item.id,
                  }))
                : []
            }
            onChange={handleChangeDistrict}
            allowClear
          />
        </Form.Item>
      </div>
      <div className="cadastral_item">
        <Form.Item
          className="ward"
          label={intl.formatMessage({
            id: 'clinic.create.clinic.ward',
          })}
          name={'wardId'}
        >
          <CustomSelect
            placeholder={intl.formatMessage({ id: 'common.ward.name' })}
            options={
              listWard && listWard.data && listWard.data.length > 0
                ? listWard.data.map((item) => ({
                    label: item.name,
                    value: item.id,
                  }))
                : []
            }
            allowClear
          />
        </Form.Item>
        <Form.Item
          className="address"
          label={intl.formatMessage({
            id: 'clinic.create.clinic.address',
          })}
          name={'address'}
        >
          <CustomInput placeholder={intl.formatMessage({ id: 'common.address.name' })} />
        </Form.Item>
      </div>
    </div>
  );
};
