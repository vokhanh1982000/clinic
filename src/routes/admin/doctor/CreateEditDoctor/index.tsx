import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, Form, message } from 'antd';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useNavigate, useParams } from 'react-router-dom';
import { categoryApi, doctorSupportApi } from '../../../../apis';
import { CreateDoctorSupport, UpdateDoctorSupport } from '../../../../apis/client-axios';
import FormWrap from '../../../../components/FormWrap';
import { ConfirmDeleteModal } from '../../../../components/modals/ConfirmDeleteModal';
import Achievement from '../../../../components/table/DoctorTable/achievenment';
import DoctorInfo from '../../../../components/table/DoctorTable/information';
import { ActionUser, DoctorType, PERMISSIONS } from '../../../../constants/enum';
import dayjs from 'dayjs';
import { FORMAT_DATE } from '../../../../constants/common';
import { CustomHandleError } from '../../../../components/response/error';
import CheckPermission, { Permission } from '../../../../util/check-permission';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store';
import { CustomHandleSuccess } from '../../../../components/response/success';

const CreateDoctor = () => {
  const intl = useIntl();
  const { id } = useParams();
  const [form] = Form.useForm<any>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isDeleteDoctor, setIsDeleteDoctor] = useState<boolean>(false);
  const [provinceId, setProvinceId] = useState<string>();
  const [districtId, setDistrictId] = useState<string>();
  const [avatar, setAvatar] = useState<string>();
  const { authUser } = useSelector((state: RootState) => state.auth);
  const [permisstion, setPermisstion] = useState<Permission>({
    read: false,
    create: false,
    delete: false,
    update: false,
  });

  useEffect(() => {
    if (authUser?.user?.roles) {
      setPermisstion({
        read: Boolean(CheckPermission(PERMISSIONS.ReadDoctorSuppot, authUser)),
        create: Boolean(CheckPermission(PERMISSIONS.CreateDoctorSuppot, authUser)),
        delete: Boolean(CheckPermission(PERMISSIONS.DeleteDoctorSuppot, authUser)),
        update: Boolean(CheckPermission(PERMISSIONS.UpdateDoctorSuppot, authUser)),
      });
    }
  }, [authUser]);
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
      form.setFieldsValue({
        ...data,
        status: +data.status,
        categoryIds: data.categories.flatMap((item) => item.id),
        languageIds: data.languages?.flatMap((item) => item.id),
        dateOfBirth: data.dateOfBirth ? dayjs(moment(data.dateOfBirth).format(FORMAT_DATE)) : null,
      });
      if (data.avatar) {
        setAvatar(process.env.REACT_APP_URL_IMG_S3 + data.avatar.preview);
      }
      setProvinceId(data.provinceId);
      setDistrictId(data.districtId);
    },
    refetchOnWindowFocus: false,
  });

  const createDoctorSupport = useMutation(
    (createDoctorSupport: CreateDoctorSupport) =>
      doctorSupportApi.doctorSupportControllerCreateDoctorSupport(createDoctorSupport),
    {
      onSuccess: ({ data }) => {
        CustomHandleSuccess(ActionUser.CREATE, intl);
        navigate(-1);
      },
      onError: (error: any) => {
        CustomHandleError(error.response.data, intl);
      },
    }
  );

  const updateDoctorSupport = useMutation(
    (updateDoctorSupport: UpdateDoctorSupport) =>
      doctorSupportApi.doctorSupportControllerUpdateDoctorSupportForAdmin(updateDoctorSupport),
    {
      onSuccess: ({ data }) => {
        CustomHandleSuccess(ActionUser.EDIT, intl);
        navigate(-1);
      },
      onError: (error: any) => {
        CustomHandleError(error.response.data, intl);
      },
    }
  );

  const deleteAdmin = useMutation((id: string) => doctorSupportApi.doctorSupportControllerDeleteDoctorSupport(id), {
    onSuccess: ({ data }) => {
      queryClient.invalidateQueries(['getDoctorSupport']);
      CustomHandleSuccess(ActionUser.DELETE, intl);
      navigate(-1);
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
      createDoctorSupport.mutate({
        ...values,
        status: !!values.status,
        clinicId: null,
        totalRequestReceniver: values.totalRequestReceniver || null,
      });
    } else {
      updateDoctorSupport.mutate({
        ...values,
        status: !!values.status,
        id: id,
        totalRequestReceniver: values.totalRequestReceniver || null,
      });
    }
  };

  return (
    <Card id="create-doctor-management">
      <div className="create-doctor-title">
        {id
          ? intl.formatMessage({
              id: 'doctor-support.clinic.edit.title',
            })
          : intl.formatMessage({
              id: 'doctor-support.clinic.create.title',
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
          doctorType={DoctorType.DOCTOR_SUPPORT}
        />
        <Achievement
          deleteFc={(id: string) => deleteAdmin.mutate(id)}
          n={n}
          setIsDeleteDoctor={setIsDeleteDoctor}
          onSubmit={() => {
            form.submit();
          }}
          permission={permisstion}
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
