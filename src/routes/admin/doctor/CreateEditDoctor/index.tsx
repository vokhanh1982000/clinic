import { useQueryClient } from '@tanstack/react-query';
import { Card, Form } from 'antd';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import { useNavigate, useParams } from 'react-router-dom';
import FormWrap from '../../../../components/FormWrap';
import CustomButton from '../../../../components/buttons/CustomButton';
import { ConfirmDeleteModal } from '../../../../components/modals/ConfirmDeleteModal';
import Achievement from './Achievement';
import DoctorInfo from './DoctorInfo';

const CreateDoctor = () => {
  const intl = useIntl();
  const { id } = useParams();
  const [form] = Form.useForm<any>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isDeleteDoctor, setIsDeleteDoctor] = useState<boolean>(false);

  // const { data: datadoctor } = useQuery({
  //   queryKey: ['getdoctorDetail', id],
  //   queryFn: () => doctorApi.doctorControllerGetById(id as string),
  //   enabled: !!id,
  // });

  // const createdoctor = useMutation((createdoctor: CreatedoctorDto) => doctorApi.doctorControllerCreate(createdoctor), {
  //   onSuccess: ({ data }) => {
  //     queryClient.invalidateQueries(['getUsers']);
  //     navigate(`/admin/${ADMIN_ROUTE_NAME.doctor_MANAGEMENT}`);
  //   },
  //   onError: (error) => {
  //     message.error(intl.formatMessage({ id: 'doctor.create.error' }));
  //   },
  // });

  // const updatedoctor = useMutation(
  //   (updatedoctor: UpdatedoctorDto) => doctorApi.doctorControllerUpdate(id as string, updatedoctor),
  //   {
  //     onSuccess: ({ data }) => {
  //       queryClient.invalidateQueries(['getdoctorDetail', id]);
  //       navigate(`/admin/${ADMIN_ROUTE_NAME.doctor_MANAGEMENT}`);
  //     },
  //     onError: (error) => {
  //       message.error(intl.formatMessage({ id: 'doctor.update.error' }));
  //     },
  //   }
  // );

  // const deletedoctor = useMutation((id: string) => doctorApi.doctorControllerDelete(id), {
  //   onSuccess: ({ data }) => {
  //     queryClient.invalidateQueries(['getPermissions']);
  //     queryClient.invalidateQueries(['getdoctorDetail', id]);
  //     navigate(`/admin/${ADMIN_ROUTE_NAME.doctor_MANAGEMENT}`);
  //   },
  //   onError: (error) => {
  //     message.error(intl.formatMessage({ id: 'doctor.permission.delete.error' }));
  //   },
  // });

  // const handleDeletedoctor = () => {
  //   Modal.confirm({
  //     title: 'Confirm',
  //     content: 'Are You Sure?',
  //     icon: null,
  //     okText: 'Confirm',
  //     cancelText: 'Cancel',
  //     onOk() {
  //       if (id) deletedoctor.mutate(id);
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
    //   createdoctor.mutate({
    //     ...values,
    //     permissions,
    //   });
    // } else {
    //   updatedoctor.mutate({
    //     ...values,
    //     permissions,
    //   });
    // }
  };

  return (
    <Card id="create-doctor-management">
      <div className="create-doctor-title">
        {id
          ? intl.formatMessage({
              id: 'doctor.edit.title',
            })
          : intl.formatMessage({
              id: 'doctor.create.title',
            })}
      </div>
      <FormWrap form={form} onFinish={onFinish} layout="vertical" className="form-create-doctor">
        <DoctorInfo />
        <Achievement />
      </FormWrap>

      <div className="button-action">
        {id ? (
          <div className="more-action">
            <CustomButton className="button-save" onClick={() => form.submit()}>
              {intl.formatMessage({
                id: 'doctor.edit.button.save',
              })}
            </CustomButton>
            <CustomButton
              className="button-delete"
              onClick={() => {
                setIsDeleteDoctor(true);
              }}
            >
              {intl.formatMessage({
                id: 'doctor.edit.button.delete',
              })}
            </CustomButton>
          </div>
        ) : (
          <div className="more-action">
            <CustomButton className="button-create" onClick={() => form.submit()}>
              {intl.formatMessage({
                id: 'doctor.create.button.create',
              })}
            </CustomButton>
            <CustomButton
              className="button-cancel"
              onClick={() => {
                navigate(-1);
              }}
            >
              {intl.formatMessage({
                id: 'doctor.create.button.cancel',
              })}
            </CustomButton>
          </div>
        )}
      </div>

      <ConfirmDeleteModal
        name={''}
        visible={isDeleteDoctor}
        onSubmit={() => {
          setIsDeleteDoctor(false);
        }}
        onClose={() => setIsDeleteDoctor(false)}
      />
    </Card>
  );
};

export default CreateDoctor;
