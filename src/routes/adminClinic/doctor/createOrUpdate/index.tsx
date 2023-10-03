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
import { CreateDoctorClinicDto, UpdateDoctorClinicDto } from '../../../../apis/client-axios';
import { categoryApi, doctorClinicApi } from '../../../../apis';
import moment from 'moment';
import { error } from 'console';
import { values } from 'lodash';

const CreateDoctor = () => {
  const intl = useIntl();
  const { id } = useParams();
  const [form] = Form.useForm<any>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isDeleteDoctor, setIsDeleteDoctor] = useState<boolean>(false);

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
        gender: data.gender && +data.gender,
        status: +data.status,
        categoryIds: data.categories.flatMap((item) => item.id),
        dateOfBirth: data.dateOfBirth ? moment(data.dateOfBirth, 'DD/MM/YYYY') : moment('', 'DD/MM/YYYY'),
      });
    },
  });

  const createDocterClinic = useMutation(
    (createDoctorClinic: CreateDoctorClinicDto) => doctorClinicApi.doctorClinicControllerCreate(createDoctorClinic),
    {
      onSuccess: ({ data }) => {
        navigate(-1);
        console.log(data);
      },
      onError: (error) => {
        message.error(intl.formatMessage({ id: 'doctor.create.error' }));
      },
    }
  );

  const updateDoctorClinic = useMutation(
    (updateDoctorClinic: UpdateDoctorClinicDto) => doctorClinicApi.doctorClinicControllerUpdate(updateDoctorClinic),
    {
      onSuccess: ({ data }) => {
        navigate(-1);
        console.log(data);
      },
      onError: (error) => {
        console.log(error);
      },
    }
  );

  const deleteAdmin = useMutation((id: string) => doctorClinicApi.doctorClinicControllerDelete(id), {
    onSuccess: ({ data }) => {
      console.log(data);
      queryClient.invalidateQueries(['getAdminUser']);
    },
    onError: (error) => {
      message.error(intl.formatMessage({ id: `${error}` }));
    },
  });

  const onFinish = (values: any) => {
    if (!id) {
      createDocterClinic.mutate({
        ...values,
        gender: !!values.gender,
        status: !!values.status,
        dateOfBirth: moment(values.dateOfBirth).format('DD/MM/YYYY'),
        clinicId: null,
      });
    } else {
      console.log({
        ...values,
        gender: !!values.gender,
        status: !!values.status,
        dateOfBirth: moment(values.dateOfBirth).format('DD/MM/YYYY'),
        id: id,
      });
      updateDoctorClinic.mutate({
        ...values,
        gender: !!values.gender,
        status: !!values.status,
        dateOfBirth: moment(values.dateOfBirth).format('DD/MM/YYYY'),
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
        <DoctorInfo category={category?.data.content} n={n} doctorType={DoctorType.DOCTOR} />
        <Achievement
          deleteFc={(id: string) => deleteAdmin.mutate(id)}
          n={n}
          setIsDeleteDoctor={setIsDeleteDoctor}
          onSubmit={() => form.submit()}
        />
      </FormWrap>
      <ConfirmDeleteModal
        name={''}
        visible={isDeleteDoctor}
        onSubmit={() => {
          setIsDeleteDoctor(true);
        }}
        onClose={() => setIsDeleteDoctor(false)}
      />
    </Card>
  );
};

export default CreateDoctor;
