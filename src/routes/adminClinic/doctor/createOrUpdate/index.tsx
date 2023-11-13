import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, Form } from 'antd';
import dayjs from 'dayjs';
import { isNumber } from 'lodash';
import moment from 'moment';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import { useNavigate, useParams } from 'react-router-dom';
import { categoryApi, doctorClinicApi } from '../../../../apis';
import { CreateDoctorClinicDto, UpdateDoctorClinicDto } from '../../../../apis/client-axios';
import FormWrap from '../../../../components/FormWrap';
import CustomButton from '../../../../components/buttons/CustomButton';
import IconSVG from '../../../../components/icons/icons';
import { ConfirmDeleteModal } from '../../../../components/modals/ConfirmDeleteModal';
import { CustomHandleError } from '../../../../components/response/error';
import { CustomHandleSuccess } from '../../../../components/response/success';
import Achievement from '../../../../components/table/DoctorTable/achievenment';
import DoctorInfo from '../../../../components/table/DoctorTable/information';
import { FORMAT_DATE } from '../../../../constants/common';
import { ActionUser, DoctorType } from '../../../../constants/enum';
import { ADMIN_CLINIC_ROUTE_PATH } from '../../../../constants/route';
import { Permission } from '../../../../util/check-permission';

const CreateDoctor = () => {
  const intl = useIntl();
  const { id } = useParams();
  const [form] = Form.useForm<any>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isDeleteDoctor, setIsDeleteDoctor] = useState<boolean>(false);
  const [doctorName, setDoctorName] = useState<string>('');
  const [provinceId, setProvinceId] = useState<string>();
  const [districtId, setDistrictId] = useState<string>();
  const [avatar, setAvatar] = useState<string>();
  const [permisstion, setPermisstion] = useState<Permission>({
    read: true,
    create: true,
    delete: true,
    update: true,
  });
  const n = (key: keyof CreateDoctorClinicDto) => {
    return key;
  };

  const { data: category } = useQuery({
    queryKey: ['category'],
    queryFn: () => categoryApi.categoryControllerFindCategory(1, 10),
  });

  const { data: docterClinic } = useQuery({
    queryKey: ['docterClinic', id],
    queryFn: () => doctorClinicApi.doctorClinicControllerGetById(id as string),
    enabled: !!id,
    onSuccess: ({ data }) => {
      form.setFieldsValue({
        ...data,
        status: +data.status,
        categoryIds: data.categories.flatMap((item) => item.id),
        // dateOfBirth: data.dateOfBirth ? moment(data.dateOfBirth, FORMAT_DATE) : null,
        dateOfBirth: data.dateOfBirth ? dayjs(moment(data.dateOfBirth).format(FORMAT_DATE)) : null,
      });
      if (data.avatar) {
        setAvatar(process.env.REACT_APP_URL_IMG_S3 + data.avatar.preview);
      }
      if (data.fullName) setDoctorName(data.fullName);
      data.provinceId && setProvinceId(data.provinceId);
      data.districtId && setDistrictId(data.districtId);
    },
    refetchOnWindowFocus: false,
  });

  const createDocterClinic = useMutation(
    (createDoctorClinic: CreateDoctorClinicDto) => doctorClinicApi.doctorClinicControllerCreate(createDoctorClinic),
    {
      onSuccess: ({ data }) => {
        navigate(-1);
        CustomHandleSuccess(ActionUser.CREATE, intl);
      },
      onError: (error: any) => {
        CustomHandleError(error.response.data, intl);
      },
    }
  );

  const updateDoctorClinic = useMutation(
    (updateDoctorClinic: UpdateDoctorClinicDto) =>
      doctorClinicApi.doctorClinicControllerUpdateForAdminClinic(updateDoctorClinic),
    {
      onSuccess: ({ data }) => {
        navigate(-1);
        CustomHandleSuccess(ActionUser.EDIT, intl);
      },
      onError: (error: any) => {
        CustomHandleError(error.response.data, intl);
      },
    }
  );

  const deleteAdmin = useMutation((id: string) => doctorClinicApi.doctorClinicControllerDelete(id), {
    onSuccess: ({ data }) => {
      console.log(data);
      queryClient.invalidateQueries(['getAdminUser']);
      navigate(-1);
      CustomHandleSuccess(ActionUser.DELETE, intl);
    },
    onError: (error: any) => {
      CustomHandleError(error.response.data, intl);
    },
  });

  const handelDelete = () => {
    if (id) deleteAdmin.mutate(id);
    setIsDeleteDoctor(false);
  };

  const onFinish = (values: any) => {
    if (!id) {
      createDocterClinic.mutate({
        ...values,
        status: isNumber(values.status) ? !!values.status : true,
        // dateOfBirth: values.dateOfBirth ? moment(values.dateOfBirth).format(FORMAT_DATE) : null,
        emailAddress: values.emailAddress ? values.emailAddress : '',
        clinicId: null,
      });
    } else {
      updateDoctorClinic.mutate({
        ...values,
        status: isNumber(values.status) ? !!values.status : true,
        // dateOfBirth: values.dateOfBirth ? moment(values.dateOfBirth).format(FORMAT_DATE) : null,
        id: id,
      });
    }
  };

  return (
    <Card id="create-doctor-management">
      <div className="create-doctor-header">
        <div className="create-doctor-title">
          {id
            ? intl.formatMessage({
                id: 'doctor.clinic.edit.title',
              })
            : intl.formatMessage({
                id: 'doctor.clinic.create.title',
              })}
        </div>
        {id && (
          <CustomButton
            className="button-schedule"
            icon={<IconSVG type="booking-active" />}
            onClick={() => {
              navigate(`${ADMIN_CLINIC_ROUTE_PATH.SCHEDULE_DOCTOR}/${id}`);
            }}
          >
            {intl.formatMessage({
              id: 'doctor-detail.clinic.button.schedule',
            })}
          </CustomButton>
        )}
      </div>
      <FormWrap form={form} onFinish={onFinish} layout="vertical" className="form-create-doctor">
        <DoctorInfo
          form={form}
          avatar={avatar}
          provinceId={provinceId}
          districtId={districtId}
          setAvatar={setAvatar}
          setProvinceId={setProvinceId}
          setDistrictId={setDistrictId}
          category={category?.data.content}
          n={n}
          doctorType={DoctorType.DOCTOR}
        />
        <Achievement
          deleteFc={(id: string) => deleteAdmin.mutate(id)}
          n={n}
          setIsDeleteDoctor={setIsDeleteDoctor}
          onSubmit={() => form.submit()}
          permission={permisstion}
        />
      </FormWrap>
      <ConfirmDeleteModal
        name={doctorName && doctorName}
        visible={isDeleteDoctor}
        onSubmit={() => handelDelete()}
        onClose={() => setIsDeleteDoctor(false)}
      />
    </Card>
  );
};

export default CreateDoctor;
