import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Card, message } from 'antd';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { useNavigate } from 'react-router';
import CustomButton from '../../../components/buttons/CustomButton';
import IconSVG from '../../../components/icons/icons';
import { ADMIN_CLINIC_ROUTE_NAME } from '../../../constants/route';
import { DoctorType, PERMISSIONS } from '../../../constants/enum';
import { DoctorTable } from '../../../components/table/DoctorTable';
import { doctorClinicApi } from '../../../apis';
import CheckPermission, { Permission } from '../../../util/check-permission';

const ListDoctor = () => {
  const intl = useIntl();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [permisstion, setPermisstion] = useState<Permission>({
    read: Boolean(CheckPermission(PERMISSIONS.ReadDoctorClinic)),
    create: Boolean(CheckPermission(PERMISSIONS.CreateDoctorClinic)),
    delete: Boolean(CheckPermission(PERMISSIONS.DeleteDoctorClinic)),
    update: Boolean(CheckPermission(PERMISSIONS.UpdateDoctorClinic)),
  });

  const deleteAdmin = useMutation((id: string) => doctorClinicApi.doctorClinicControllerDelete(id), {
    onSuccess: ({ data }) => {
      console.log(data);
      queryClient.invalidateQueries(['getDoctorClinic']);
      message.success(intl.formatMessage({ id: 'doctor.delete.success' }));
    },
    onError: (error) => {
      message.error(intl.formatMessage({ id: `doctor.delete.fail` }));
    },
  });

  return (
    <Card id="doctor-management">
      <div className="doctor-management__header">
        <div className="doctor-management__header__title">
          {intl.formatMessage({
            id: 'doctor.list.title',
          })}
        </div>
        <CustomButton
          className="button-add"
          icon={<IconSVG type="create" />}
          onClick={() => {
            navigate(ADMIN_CLINIC_ROUTE_NAME.CREATE);
          }}
        >
          {intl.formatMessage({
            id: 'doctor.list.button.add',
          })}
        </CustomButton>
      </div>
      <DoctorTable
        permission={permisstion}
        deleteFc={(id: string) => deleteAdmin.mutate(id)}
        doctorType={DoctorType.DOCTOR}
      />
    </Card>
  );
};
export default ListDoctor;
