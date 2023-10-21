import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, Form, message } from 'antd';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import { useNavigate, useParams } from 'react-router-dom';
import FormWrap from '../../../../components/FormWrap';
import CustomButton from '../../../../components/buttons/CustomButton';
import { ConfirmDeleteModal } from '../../../../components/modals/ConfirmDeleteModal';
import DoctorInfo from '../../../../components/table/DoctorTable/information';
import Achievement from '../../../../components/table/DoctorTable/achievenment';
import { DoctorType } from '../../../../constants/enum';
import {
  CreateDoctorClinicDto,
  CreateDoctorClinicDtoGenderEnum,
  UpdateDoctorClinicDto,
} from '../../../../apis/client-axios';
import { categoryApi, doctorClinicApi } from '../../../../apis';
import moment from 'moment';
import { error } from 'console';
import { isNumber, values } from 'lodash';
import { FORMAT_DATE } from '../../../../constants/common';
import dayjs from 'dayjs';
import { CustomHandleError } from '../../../../components/response';

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
        message.success(intl.formatMessage({ id: `common.createSuccess` }));
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
        message.success(intl.formatMessage({ id: `common.updateSuccess` }));
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
      message.success(intl.formatMessage({ id: 'common.deleteeSuccess' }));
    },
    onError: (error) => {
      message.error(intl.formatMessage({ id: 'doctor.create.error' }));
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
      <div className="create-doctor-title">
        {id
          ? intl.formatMessage({
              id: 'doctor.clinic.edit.title',
            })
          : intl.formatMessage({
              id: 'doctor.clinic.create.title',
            })}
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
