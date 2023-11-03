import { QueryClient, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, Form, FormInstance, message } from 'antd';
import useForm from 'antd/es/form/hooks/useForm';
import { useEffect, useState } from 'react';
import { IntlShape } from 'react-intl';
import { clinicsApi, medicineApi } from '../../../apis';
import {
  AdministratorClinic,
  UpdateAdminClinicDto,
  UpdateClinicDto,
  UpdateClinicForAdminClinic,
  WorkSchedule,
} from '../../../apis/client-axios';
import CustomButton from '../../../components/buttons/CustomButton';
import { ActionUser, MedicineStatus, MedicineUnit } from '../../../constants/enum';
import useIntl from '../../../util/useIntl';
import { CategorySelect } from './CategorySelect';
import { ClinicInfo } from './ClinicInfo';
import { ScheduleSetting } from './ScheduleSetting';
import { useAppSelector } from '../../../store';
import dayjs from 'dayjs';
import { CategoryCheckbox } from '../../../components/categoryCheckbox';
import { CustomHandleSuccess } from '../../../components/response/success';
import { CustomHandleError } from '../../../components/response/error';

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
interface ScheduleSettingParams {
  form: FormInstance;
  scheduleData: WorkScheduleRange[];
}
export interface WorkScheduleRange extends WorkSchedule {
  am: any[];
  pm: any[];
}
let initSchedule: WorkScheduleRange[] = [];
for (let index = 0; index < 7; index++) {
  const item: Partial<WorkScheduleRange> = {
    day: index,
    status: false,
    pmFrom: '13:00',
    pmTo: '17:00',
    amFrom: '08:00',
    amTo: '12:00',
    am: [dayjs('08:00', 'HH:mm'), dayjs('12:00', 'HH:mm')],
    pm: [dayjs('13:00', 'HH:mm'), dayjs('17:00', 'HH:mm')],
  };
  initSchedule.push(item as WorkScheduleRange);
}

const firstItem = initSchedule.shift();
initSchedule.push(firstItem as WorkScheduleRange);

const Setting = () => {
  const intl: IntlShape = useIntl();
  const queryClient: QueryClient = useQueryClient();
  const [provinceId, setProvinceId] = useState<string>();
  const [districtId, setDistrictId] = useState<string>();
  const [background, setBackground] = useState<string>();
  const [form] = useForm();
  const [clinicId, setClinicId] = useState<string>();
  const user = useAppSelector((state) => state.auth).authUser;
  const [workSchedule, setWorkSchedule] = useState<WorkScheduleRange[]>(initSchedule);
  const { data: dataClinic } = useQuery(
    ['getDetailClinic', clinicId],
    () => clinicsApi.clinicControllerGetById(clinicId!),
    {
      onError: (error) => {},
      onSuccess: (response) => {
        const categoryIds = response.data.categories.map((e) => e.id);
        const timeRange: WorkScheduleRange[] | undefined = response?.data?.workSchedules?.map((item) => {
          return {
            ...item,
            am: [dayjs(item.amFrom, 'HH:mm'), dayjs(item.amTo, 'HH:mm')],
            pm: [dayjs(item.pmFrom, 'HH:mm'), dayjs(item.pmTo, 'HH:mm')],
          };
        });

        form.setFieldsValue({
          ...response.data,
          status: response.data.status ? 1 : 0,
          categoryIds: categoryIds,
          workScheduleRange: timeRange,
        });
        if (timeRange && timeRange.length > 0) {
          setWorkSchedule(timeRange);
        }
        setProvinceId(response.data.provinceId ? response.data.provinceId : undefined);
        setDistrictId(response.data.districtId ? response.data.districtId : undefined);
        setBackground(
          response.data.avatar
            ? process.env.REACT_APP_URL_IMG_S3 + response.data.avatar.preview
            : '/assets/images/background_default_clinic.svg'
        );
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
        queryClient.invalidateQueries(['getDetailClinic']);
        CustomHandleSuccess(ActionUser.EDIT, intl);
      },
      onError: (error: any) => {
        CustomHandleError(error.response.data, intl);
      },
    }
  );

  const onFinish = () => {
    const data = form.getFieldsValue();
    data.workSchedules = workSchedule;
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
            <CategoryCheckbox form={form} className="custom-category-checkbox" />
            <ScheduleSetting form={form} scheduleData={workSchedule} setWorkSchedule={setWorkSchedule} />
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
export default Setting;
