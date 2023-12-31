import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useNavigate } from 'react-router';
import CustomButton from '../../../../components/buttons/CustomButton';
import IconSVG from '../../../../components/icons/icons';
import { ADMIN_CLINIC_ROUTE_NAME, ADMIN_ROUTE_NAME, ADMIN_ROUTE_PATH } from '../../../../constants/route';
import { DoctorTable } from '../../../../components/table/DoctorTable';
import { ActionUser, DoctorType, PERMISSIONS } from '../../../../constants/enum';
import { doctorClinicApi, doctorSupportApi } from '../../../../apis';
import CheckPermission, { Permission } from '../../../../util/check-permission';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store';
import { CustomHandleSuccess } from '../../../../components/response/success';
import { CustomHandleError } from '../../../../components/response/error';

const ListDoctor = () => {
  const intl = useIntl();
  const navigate = useNavigate();
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  const [sort, setSort] = useState<string>('');
  const [fullTextSearch, setFullTextSearch] = useState<string>('');
  const [isShowModalDelete, setIsShowModalDelete] = useState<{ id: string; name: string }>();
  const { authUser } = useSelector((state: RootState) => state.auth);
  const [permission, setPermission] = useState<Permission>({
    read: false,
    create: false,
    delete: false,
    update: false,
  });

  useEffect(() => {
    if (authUser?.user?.roles) {
      setPermission({
        read: Boolean(CheckPermission(PERMISSIONS.ReadDoctorSuppot, authUser)),
        create: Boolean(CheckPermission(PERMISSIONS.CreateDoctorSuppot, authUser)),
        delete: Boolean(CheckPermission(PERMISSIONS.DeleteDoctorSuppot, authUser)),
        update: Boolean(CheckPermission(PERMISSIONS.UpdateDoctorSuppot, authUser)),
      });
    }
  }, [authUser]);
  const queryClient = useQueryClient();

  const handleDelete = () => {
    if (isShowModalDelete && isShowModalDelete.id) {
      // deleteRole.mutate(isShowModalDelete.id);
    }
  };

  const deleteAdmin = useMutation((id: string) => doctorSupportApi.doctorSupportControllerDeleteDoctorSupport(id), {
    onSuccess: ({ data }) => {
      CustomHandleSuccess(ActionUser.DELETE, intl);
      queryClient.invalidateQueries(['getDoctorSupport']);
    },
    onError: (error: any) => {
      CustomHandleError(error.response.data, intl);
    },
  });

  const handleClose = () => {
    setIsShowModalDelete(undefined);
  };
  return (
    <Card id="doctor-management">
      <div className="doctor-management__header">
        <div className="doctor-management__header__title">
          {intl.formatMessage({
            id: 'doctor-support.list.title',
          })}
        </div>
        <CustomButton
          disabled={!permission.create}
          className="button-add"
          icon={<IconSVG type="create" />}
          onClick={() => {
            navigate(ADMIN_ROUTE_PATH.CREATE_DOCTOR);
          }}
        >
          {intl.formatMessage({
            id: 'doctor.list.button.add',
          })}
        </CustomButton>
      </div>
      {permission.read && (
        <DoctorTable
          permission={permission}
          deleteFc={(id: string) => deleteAdmin.mutate(id)}
          doctorType={DoctorType.DOCTOR_SUPPORT}
        />
      )}
    </Card>
  );
};
export default ListDoctor;
