import { Form, FormInstance, TimePicker } from 'antd';
import { useIntl } from 'react-intl';
import CustomInput from '../../../../../components/input/CustomInput';
import { FORMAT_TIME } from '../../../../../constants/common';
import CustomSelect from '../../../../../components/select/CustomSelect';
import { useQuery } from '@tanstack/react-query';
import { cadastralApi } from '../../../../../apis';
import { useEffect, useState } from 'react';
import { CadastalCustom } from '../../../../../components/Cadastral';
import { ValidateLibrary } from '../../../../../validate';
import { useParams } from 'react-router-dom';
import { formatPhoneNumberInput, handleInputChangeUpperCase } from '../../../../../constants/function';

interface ClinicInfoParams {
  form: FormInstance;
  provinceId: string | undefined;
  setProvinceId: React.Dispatch<React.SetStateAction<string | undefined>>;
  districtId: string | undefined;
  setDistrictId: React.Dispatch<React.SetStateAction<string | undefined>>;
}

export const ClinicInfo = (props: ClinicInfoParams) => {
  const { form, provinceId, setProvinceId, districtId, setDistrictId } = props;
  const intl = useIntl();
  const { id } = useParams();

  useEffect(() => {
    if (!id) {
      form.setFieldValue('status', 1);
    }
  }, []);

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
            rules={ValidateLibrary(intl).nameClinic}
          >
            <CustomInput
              placeholder={intl.formatMessage({
                id: 'clinic.create.clinic.name',
              })}
              maxLength={255}
            />
          </Form.Item>
          <Form.Item
            className="code"
            label={intl.formatMessage({
              id: 'clinic.create.clinic.code',
            })}
            name={'code'}
            rules={ValidateLibrary(intl).clinicCode}
          >
            <CustomInput
              placeholder={intl.formatMessage({
                id: 'clinic.create.clinic.code',
              })}
              maxLength={36}
              onInput={handleInputChangeUpperCase}
            />
          </Form.Item>
        </div>
        <CadastalCustom
          form={form}
          provinceId={provinceId}
          districtId={districtId}
          setProvinceId={setProvinceId}
          setDistrictId={setDistrictId}
        ></CadastalCustom>
        <Form.Item
          className="phone"
          label={intl.formatMessage({
            id: 'clinic.create.clinic.phone',
          })}
          name={'phoneClinic'}
          rules={ValidateLibrary(intl).phoneClinic}
        >
          <CustomInput
            placeholder={intl.formatMessage({
              id: 'clinic.create.clinic.phone',
            })}
            onInput={formatPhoneNumberInput}
          />
        </Form.Item>
        <Form.Item
          className="phone"
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
  );
};
