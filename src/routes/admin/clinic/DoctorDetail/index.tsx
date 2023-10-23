import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, Form } from 'antd';
import dayjs from 'dayjs';
import moment from 'moment';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import { useNavigate, useParams } from 'react-router-dom';
import { categoryApi, doctorClinicApi } from '../../../../apis';
import { CreateDoctorSupport } from '../../../../apis/client-axios';
import FormWrap from '../../../../components/FormWrap';
import Achievement from '../../../../components/table/DoctorTable/achievenment';
import DoctorInfo from '../../../../components/table/DoctorTable/information';
import { FORMAT_DATE } from '../../../../constants/common';
import { DoctorType } from '../../../../constants/enum';

const DoctorDetail = () => {
  const intl = useIntl();
  const { id } = useParams();
  const [form] = Form.useForm<any>();
  const [isDeleteDoctor, setIsDeleteDoctor] = useState<boolean>(false);
  const [provinceId, setProvinceId] = useState<string>();
  const [districtId, setDistrictId] = useState<string>();
  const [avatar, setAvatar] = useState<string>();

  const n = (key: keyof CreateDoctorSupport) => {
    return key;
  };

  const { data: category } = useQuery({
    queryKey: ['category'],
    queryFn: () => categoryApi.categoryControllerFindCategory(1, 10),
  });

  const { data: doctorSupport } = useQuery({
    queryKey: ['doctorSupport', id],
    queryFn: () => doctorClinicApi.doctorClinicControllerGetById(id as string),
    enabled: !!id,
    onSuccess: ({ data }) => {
      form.setFieldsValue({
        ...data,
        status: +data.status,
        categoryIds: data.categories?.flatMap((item) => item.id),
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

  return (
    <Card id="create-doctor-management">
      <div className="create-doctor-title">
        {intl.formatMessage({
          id: 'doctor.clinic.edit.title',
        })}
      </div>
      <FormWrap form={form} layout="vertical" className="form-create-doctor" disabled={true}>
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
          n={n}
          setIsDeleteDoctor={setIsDeleteDoctor}
          onSubmit={() => {
            form.submit();
          }}
          disabled={true}
        />
      </FormWrap>
    </Card>
  );
};

export default DoctorDetail;
