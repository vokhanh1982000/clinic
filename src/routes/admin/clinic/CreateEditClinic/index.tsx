import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, Form, message } from 'antd';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import { useNavigate, useParams } from 'react-router-dom';
import { clinicsApi } from '../../../../apis';
import { CreateClinicDto, UpdateClinicDto } from '../../../../apis/client-axios';
import FormWrap from '../../../../components/FormWrap';
import CustomButton from '../../../../components/buttons/CustomButton';
import { ConfirmDeleteModal } from '../../../../components/modals/ConfirmDeleteModal';
import { ADMIN_ROUTE_NAME } from '../../../../constants/route';
import { ClinicInfo } from './ClinicInfo';
import { DoctorList } from './DoctorList';
import { ManagerInfo } from './ManagerInfo';
import { CategoryCheckbox } from '../../../../components/categoryCheckbox';
import { CustomHandleError } from '../../../../components/response';

const CreateClinic = () => {
  const intl = useIntl();
  const { id } = useParams();
  const [form] = Form.useForm<any>();
  const [formManager] = Form.useForm<any>();
  const [formCategory] = Form.useForm<any>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isDeleteClinic, setIsDeleteClinic] = useState<boolean>(false);
  const [adminsClinic, setAdminsClinic] = useState<any>([]);
  const [provinceId, setProvinceId] = useState<string>();
  const [districtId, setDistrictId] = useState<string>();

  const { data: dataClinic } = useQuery(
    ['getDetailClinic', id],
    () => clinicsApi.clinicControllerGetById(id as string),
    {
      onError: (error) => {},
      onSuccess: (response) => {
        const categoryIds = response.data.categories.map((e) => e.id);
        form.setFieldsValue({
          ...response.data,
          status: response.data.status ? 1 : 0,
        });
        formCategory.setFieldValue('categoryIds', categoryIds);
        setProvinceId(response.data.provinceId ? response.data.provinceId : undefined);
        setDistrictId(response.data.districtId ? response.data.districtId : undefined);
      },
      enabled: !!id,
      refetchOnWindowFocus: false,
    }
  );

  const { mutate: CreateClinic, status: statusCreateClinic } = useMutation(
    (createclinic: CreateClinicDto) => clinicsApi.clinicControllerCreateClinic(createclinic),
    {
      onSuccess: ({ data }) => {
        message.success(intl.formatMessage({ id: `common.createSuccess` }));
        navigate(`/admin/${ADMIN_ROUTE_NAME.CLINIC_MANAGEMENT}`);
      },
      onError: (error: any) => {
        CustomHandleError(error.response.data, intl);
      },
    }
  );

  const { mutate: UpdateClinic, status: statusUpdateClinic } = useMutation(
    (updateClinic: UpdateClinicDto) => clinicsApi.clinicControllerUpdateClinic(updateClinic),
    {
      onSuccess: ({ data }) => {
        message.success(intl.formatMessage({ id: `common.updateSuccess` }));
        navigate(`/admin/${ADMIN_ROUTE_NAME.CLINIC_MANAGEMENT}`);
      },
      onError: (error: any) => {
        CustomHandleError(error.response.data, intl);
      },
    }
  );

  const { mutate: DeleteClinic, status: statusDeleteClinic } = useMutation(
    (id: string) => clinicsApi.clinicControllerDeleteClinic(id),
    {
      onSuccess: (data) => {
        message.success(intl.formatMessage({ id: `common.deleteeSuccess` }));
        navigate(`/admin/${ADMIN_ROUTE_NAME.CLINIC_MANAGEMENT}`);
      },
      onError: (error: any) => {
        CustomHandleError(error.response.data, intl);
      },
    }
  );

  const onFinish = (values: any) => {
    const data = form.getFieldsValue();
    const categoryIds = formCategory.getFieldsValue();
    if (!id) {
      const dataAdminClinic = adminsClinic.map((item: any) => {
        const { id, ...rest } = item;
        return rest;
      });
      CreateClinic({
        ...data,
        status: Boolean(Number(data.status)),
        adminClinic: dataAdminClinic,
        ...categoryIds,
      });
    } else {
      const newObj: any = {};
      for (const key in data) {
        if (data.hasOwnProperty(key) && data[key] !== null && data[key] !== '') {
          newObj[key] = data[key];
        }
      }
      UpdateClinic({
        ...newObj,
        status: Boolean(Number(data.status)),
        id: id,
        ...categoryIds,
      });
    }
  };

  const handleDelete = () => {
    if (id) {
      DeleteClinic(id);
    }
    setIsDeleteClinic(false);
  };

  return (
    <Card id="create-clinic-management">
      <div className="create-clinic-title">
        {id
          ? intl.formatMessage({
              id: 'clinic.edit.title',
            })
          : intl.formatMessage({
              id: 'clinic.create.title',
            })}
      </div>
      <div className="clinic-content">
        <FormWrap form={form} onFinish={onFinish} layout="vertical" className="form-create-clinic">
          <ClinicInfo
            form={form}
            provinceId={provinceId}
            setProvinceId={setProvinceId}
            districtId={districtId}
            setDistrictId={setDistrictId}
          />
        </FormWrap>
        <div className="container-right">
          <div className="form-create-manager">
            <ManagerInfo form={formManager} adminsClinic={adminsClinic} setAdminsClinic={setAdminsClinic} />
            <FormWrap form={formCategory} layout="vertical" className="form-category">
              <CategoryCheckbox form={formCategory} />
            </FormWrap>
          </div>

          <div className="button-action">
            {id ? (
              <div className="more-action">
                <CustomButton className="button-save" onClick={() => form.submit()}>
                  {intl.formatMessage({
                    id: 'clinic.edit.button.save',
                  })}
                </CustomButton>
                <CustomButton
                  className="button-delete"
                  onClick={() => {
                    setIsDeleteClinic(true);
                  }}
                >
                  {intl.formatMessage({
                    id: 'clinic.edit.button.delete',
                  })}
                </CustomButton>
              </div>
            ) : (
              <div className="more-action">
                <CustomButton className="button-create" onClick={() => form.submit()}>
                  {intl.formatMessage({
                    id: 'clinic.create.button.create',
                  })}
                </CustomButton>
                <CustomButton
                  className="button-cancel"
                  onClick={() => {
                    navigate(-1);
                  }}
                >
                  {intl.formatMessage({
                    id: 'clinic.create.button.cancel',
                  })}
                </CustomButton>
              </div>
            )}
          </div>
        </div>
      </div>

      {id && <DoctorList clinicId={id} />}

      <ConfirmDeleteModal
        name={dataClinic?.data.fullName || dataClinic?.data.phoneClinic || ''}
        visible={isDeleteClinic}
        onSubmit={handleDelete}
        onClose={() => setIsDeleteClinic(false)}
      />
    </Card>
  );
};

export default CreateClinic;
