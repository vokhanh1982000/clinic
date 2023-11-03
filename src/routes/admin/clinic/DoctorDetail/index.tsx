import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, Form } from 'antd';
import dayjs from 'dayjs';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useNavigate, useParams } from 'react-router-dom';
import { categoryApi, doctorClinicApi } from '../../../../apis';
import { CreateDoctorSupport } from '../../../../apis/client-axios';
import FormWrap from '../../../../components/FormWrap';
import Achievement from '../../../../components/table/DoctorTable/achievenment';
import DoctorInfo from '../../../../components/table/DoctorTable/information';
import { FORMAT_DATE } from '../../../../constants/common';
import { DoctorType, PERMISSIONS } from '../../../../constants/enum';
import CheckPermission, { Permission } from '../../../../util/check-permission';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store';
import CustomButton from '../../../../components/buttons/CustomButton';
import IconSVG from '../../../../components/icons/icons';
import { ADMIN_ROUTE_PATH } from '../../../../constants/route';

const DoctorDetail = () => {
  const intl = useIntl();
  const { id } = useParams();
  const [form] = Form.useForm<any>();
  const navigate = useNavigate();
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
        read: Boolean(CheckPermission(PERMISSIONS.ReadClinic, authUser)),
        create: Boolean(CheckPermission(PERMISSIONS.CreateClinic, authUser)),
        delete: Boolean(CheckPermission(PERMISSIONS.DeleteClinic, authUser)),
        update: Boolean(CheckPermission(PERMISSIONS.UpdateClinic, authUser)),
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
      <div className="create-doctor-header">
        <div className="create-doctor-title">
          {intl.formatMessage({
            id: 'doctor-detail.clinic.edit.title',
          })}
        </div>
        <CustomButton
          className="button-schedule"
          icon={<IconSVG type="booking-active" />}
          onClick={() => {
            navigate(`${ADMIN_ROUTE_PATH.SCHEDULE_DOCTOR}/${id}`);
          }}
        >
          {intl.formatMessage({
            id: 'doctor-detail.clinic.button.schedule',
          })}
        </CustomButton>
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
          permission={permisstion}
        />
      </FormWrap>
    </Card>
  );
};

export default DoctorDetail;
