import { QueryClient, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, Form, message } from 'antd';
import useForm from 'antd/es/form/hooks/useForm';
import { useEffect, useState } from 'react';
import { IntlShape } from 'react-intl';
import { clinicsApi, medicineApi } from '../../../apis';
import { AdministratorClinic, UpdateClinicDto, UpdateClinicForAdminClinic } from '../../../apis/client-axios';
import CustomButton from '../../../components/buttons/CustomButton';
import { MedicineStatus, MedicineUnit } from '../../../constants/enum';
import useIntl from '../../../util/useIntl';
import { CategorySelect } from './CategorySelect';
import { ClinicInfo } from './ClinicInfo';
import { ScheduleSetting } from './ScheduleSetting';
import { useAppSelector } from '../../../store';

interface Unit {
  id: string;
  label: MedicineUnit;
}
interface Status {
  id: string;
  label: MedicineStatus;
}

interface Medicine {
  id: string;
  name?: string;
  usage?: string;
  feature?: string;
  unit?: string;
  status?: string;
}
const ListMedicine = () => {
  const intl: IntlShape = useIntl();
  const queryClient: QueryClient = useQueryClient();
  const [provinceId, setProvinceId] = useState<string>();
  const [districtId, setDistrictId] = useState<string>();
  const [background, setBackground] = useState<string>();
  const [form] = useForm();
  const [clinicId, setClinicId] = useState<string>();
  const user = useAppSelector((state) => state.auth).authUser;

  const { data: dataClinic } = useQuery(
    ['getDetailClinic', clinicId],
    () => clinicsApi.clinicControllerGetById(clinicId!),
    {
      onError: (error) => {},
      onSuccess: (response) => {
        const categoryIds = response.data.categories.map((e) => e.id);
        form.setFieldsValue({
          ...response.data,
          status: response.data.status ? 1 : 0,
          categoryIds: categoryIds,
        });
        setProvinceId(response.data.provinceId ? response.data.provinceId : undefined);
        setDistrictId(response.data.districtId ? response.data.districtId : undefined);
        if (response.data.avatar) {
          setBackground(process.env.REACT_APP_URL_IMG_S3 + response.data.avatar.preview);
        }
      },
      enabled: !!clinicId,
    }
  );

  useEffect(() => {
    if (user) {
      setClinicId((user as AdministratorClinic).clinicId);
    }
  }, [user]);

  const { mutate: UpdateClinic, status: statusUpdateClinic } = useMutation(
    (updateClinicForAdminClinic: UpdateClinicForAdminClinic) =>
      clinicsApi.clinicControllerUpdateClinicForAdminClinic(updateClinicForAdminClinic),
    {
      onSuccess: ({ data }) => {
        // queryClient.invalidateQueries(['getDetailClinic']);
      },
      onError: (error: any) => {
        message.error(error.message);
      },
    }
  );

  const onFinish = () => {
    const data = form.getFieldsValue();
    UpdateClinic(data);
  };

  return (
    <Card id="setting">
      <Form form={form} onFinish={onFinish} layout={'vertical'}>
        <div className="title">
          {intl.formatMessage({
            id: 'setting.title',
          })}
        </div>
        <div className="content">
          <div className="content__left-container">
            <ClinicInfo
              form={form}
              provinceId={provinceId}
              setProvinceId={setProvinceId}
              districtId={districtId}
              setDistrictId={setDistrictId}
              background={background}
              setBackground={setBackground}
            />
            <ScheduleSetting form={form} />
          </div>
          <div className="content__right-container">
            <CategorySelect form={form} />
            <div className="button-action">
              <CustomButton className="button-save" htmlType="submit">
                {intl.formatMessage({
                  id: 'setting.button.save',
                })}
              </CustomButton>
            </div>
          </div>
        </div>
      </Form>
    </Card>
  );
};
export default ListMedicine;
