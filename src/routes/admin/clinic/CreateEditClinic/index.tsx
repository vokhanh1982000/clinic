import { useQueryClient } from '@tanstack/react-query';
import { Card, Form } from 'antd';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import { useNavigate, useParams } from 'react-router-dom';
import FormWrap from '../../../../components/FormWrap';
import CustomButton from '../../../../components/buttons/CustomButton';
import { ConfirmDeleteModal } from '../../../../components/modals/ConfirmDeleteModal';
import { ClinicInfo } from './ClinicInfo';
import { DoctorList } from './DoctorList';
import { ManagerInfo } from './ManagerInfo';

const CreateClinic = () => {
  const intl = useIntl();
  const { id } = useParams();
  const [form] = Form.useForm<any>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isDeleteClinic, setIsDeleteClinic] = useState<boolean>(false);

  // const { data: dataclinic } = useQuery({
  //   queryKey: ['getclinicDetail', id],
  //   queryFn: () => clinicApi.clinicControllerGetById(id as string),
  //   enabled: !!id,
  // });

  // const createClinic = useMutation((createclinic: CreateclinicDto) => clinicApi.clinicControllerCreate(createclinic), {
  //   onSuccess: ({ data }) => {
  //     queryClient.invalidateQueries(['getUsers']);
  //     navigate(`/admin/${ADMIN_ROUTE_NAME.clinic_MANAGEMENT}`);
  //   },
  //   onError: (error) => {
  //     message.error(intl.formatMessage({ id: 'clinic.create.error' }));
  //   },
  // });

  // const updateclinic = useMutation(
  //   (updateclinic: UpdateclinicDto) => clinicApi.clinicControllerUpdate(id as string, updateclinic),
  //   {
  //     onSuccess: ({ data }) => {
  //       queryClient.invalidateQueries(['getclinicDetail', id]);
  //       navigate(`/admin/${ADMIN_ROUTE_NAME.clinic_MANAGEMENT}`);
  //     },
  //     onError: (error) => {
  //       message.error(intl.formatMessage({ id: 'clinic.update.error' }));
  //     },
  //   }
  // );

  // const deleteclinic = useMutation((id: string) => clinicApi.clinicControllerDelete(id), {
  //   onSuccess: ({ data }) => {
  //     queryClient.invalidateQueries(['getPermissions']);
  //     queryClient.invalidateQueries(['getclinicDetail', id]);
  //     navigate(`/admin/${ADMIN_ROUTE_NAME.clinic_MANAGEMENT}`);
  //   },
  //   onError: (error) => {
  //     message.error(intl.formatMessage({ id: 'clinic.permission.delete.error' }));
  //   },
  // });

  // const handleDeleteclinic = () => {
  //   Modal.confirm({
  //     title: 'Confirm',
  //     content: 'Are You Sure?',
  //     icon: null,
  //     okText: 'Confirm',
  //     cancelText: 'Cancel',
  //     onOk() {
  //       if (id) deleteclinic.mutate(id);
  //     },
  //     onCancel() {
  //       console.log('cancel');
  //     },
  //     centered: true,
  //   });
  // };

  const onFinish = (values: any) => {
    // const permissions = form.getFieldValue(n('permissions'));
    // if (!id) {
    //   createclinic.mutate({
    //     ...values,
    //     permissions,
    //   });
    // } else {
    //   updateclinic.mutate({
    //     ...values,
    //     permissions,
    //   });
    // }
  };

  return (
    <Card id="create-clinic-management">
      <div className="create-clinic-title">
        {id
          ? intl.formatMessage({
              id: 'clinic.edit.title',
            })
          : intl.formatMessage({
              id: 'clinic.create.title',
            })}
      </div>
      <FormWrap form={form} onFinish={onFinish} layout="vertical" className="form-create-clinic">
        <ClinicInfo />
        <ManagerInfo />
      </FormWrap>

      <DoctorList clinicId={id} />
      <div className="button-action">
        {id ? (
          <div className="more-action">
            <CustomButton className="button-save" onClick={() => form.submit()}>
              {intl.formatMessage({
                id: 'clinic.edit.button.save',
              })}
            </CustomButton>
            <CustomButton
              className="button-delete"
              onClick={() => {
                setIsDeleteClinic(true);
              }}
            >
              {intl.formatMessage({
                id: 'clinic.edit.button.delete',
              })}
            </CustomButton>
          </div>
        ) : (
          <div className="more-action">
            <CustomButton className="button-create" onClick={() => form.submit()}>
              {intl.formatMessage({
                id: 'clinic.create.button.create',
              })}
            </CustomButton>
            <CustomButton
              className="button-cancel"
              onClick={() => {
                navigate(-1);
              }}
            >
              {intl.formatMessage({
                id: 'clinic.create.button.cancel',
              })}
            </CustomButton>
          </div>
        )}
      </div>
      <ConfirmDeleteModal
        name={''}
        visible={isDeleteClinic}
        onSubmit={() => {
          setIsDeleteClinic(false);
        }}
        onClose={() => setIsDeleteClinic(false)}
      />
    </Card>
  );
};

export default CreateClinic;
