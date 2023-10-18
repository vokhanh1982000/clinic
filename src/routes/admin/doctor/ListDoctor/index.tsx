import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, message } from 'antd';
import React, { useState } from 'react';
import { useIntl } from 'react-intl';
import { useNavigate } from 'react-router';
import CustomButton from '../../../../components/buttons/CustomButton';
import IconSVG from '../../../../components/icons/icons';
import { ADMIN_CLINIC_ROUTE_NAME, ADMIN_ROUTE_NAME, ADMIN_ROUTE_PATH } from '../../../../constants/route';
import { DoctorTable } from '../../../../components/table/DoctorTable';
import { DoctorType } from '../../../../constants/enum';
import { doctorClinicApi, doctorSupportApi } from '../../../../apis';

const ListDoctor = () => {
  const intl = useIntl();
  const navigate = useNavigate();
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  const [sort, setSort] = useState<string>('');
  const [fullTextSearch, setFullTextSearch] = useState<string>('');
  const [isShowModalDelete, setIsShowModalDelete] = useState<{ id: string; name: string }>();

  const queryClient = useQueryClient();

  const handleDelete = () => {
    if (isShowModalDelete && isShowModalDelete.id) {
      console.log(isShowModalDelete.id);
      // deleteRole.mutate(isShowModalDelete.id);
    }
  };

  const deleteAdmin = useMutation((id: string) => doctorSupportApi.doctorSupportControllerDeleteDoctorSupport(id), {
    onSuccess: ({ data }) => {
      console.log(data);
      queryClient.invalidateQueries(['getDoctorSupport']);
    },
    onError: (error) => {
      message.error(intl.formatMessage({ id: `${error}` }));
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
      <DoctorTable deleteFc={(id: string) => deleteAdmin.mutate(id)} doctorType={DoctorType.DOCTOR_SUPPORT} />
    </Card>
  );
};
export default ListDoctor;
