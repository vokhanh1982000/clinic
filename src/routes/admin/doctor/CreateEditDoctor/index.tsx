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
  CreateDoctorSupport,
  UpdateDoctorClinicDto,
  UpdateDoctorSupport,
} from '../../../../apis/client-axios';
import { categoryApi, doctorSupportApi } from '../../../../apis';
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

  const n = (key: keyof CreateDoctorSupport) => {
    return key;
  };

  const { data: category } = useQuery({
    queryKey: ['category'],
    queryFn: () => categoryApi.categoryControllerFindCategory(1, 10),
  });

  const { data: doctorSupport } = useQuery({
    queryKey: ['doctorSupport', id],
    queryFn: () => doctorSupportApi.doctorSupportControllerFindDoctorSupportById(id as string),
    enabled: !!id,
    onSuccess: ({ data }) => {
      console.log(data);
      form.setFieldsValue({
        ...data,
        status: +data.status,
        categoryIds: data.categories.flatMap((item) => item.id),
        dateOfBirth: data.dateOfBirth ? moment(data.dateOfBirth, 'YYYY-MM-DD') : moment('', 'YYYY-MM-DD'),
      });
    },
  });

  const createDoctorSupport = useMutation(
    (createDoctorSupport: CreateDoctorSupport) =>
      doctorSupportApi.doctorSupportControllerCreateDoctorSupport(createDoctorSupport),
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

  const updateDoctorSupport = useMutation(
    (updateDoctorSupport: UpdateDoctorSupport) =>
      doctorSupportApi.doctorSupportControllerUpdateDoctorSupportForAdmin(updateDoctorSupport),
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

  const deleteAdmin = useMutation((id: string) => doctorSupportApi.doctorSupportControllerDeleteDoctorSupport(id), {
    onSuccess: ({ data }) => {
      console.log(data);
      queryClient.invalidateQueries(['getDoctorSupport']);
      navigate(-1);
    },
    onError: (error) => {
      message.error(intl.formatMessage({ id: 'common.message.err' }));
    },
  });

  const handelDelete = () => {
    if (id) deleteAdmin.mutate(id);
    setIsDeleteDoctor(false);
  };

  const onFinish = (values: any) => {
    if (!id) {
      createDoctorSupport.mutate({
        ...values,
        status: !!values.status,
        dateOfBirth: moment(values.dateOfBirth).format('YYYY-MM-DD'),
        clinicId: null,
      });
    } else {
      updateDoctorSupport.mutate({
        ...values,
        status: !!values.status,
        dateOfBirth: moment(values.dateOfBirth).format('YYYY-MM-DD'),
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
        <DoctorInfo category={category?.data.content} n={n} doctorType={DoctorType.DOCTOR_SUPPORT} />
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
        onSubmit={() => handelDelete()}
        onClose={() => setIsDeleteDoctor(false)}
      />
    </Card>
  );
};

export default CreateDoctor;
