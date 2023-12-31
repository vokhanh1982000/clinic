import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { FormInstance, message } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useParams } from 'react-router-dom';
import { adminClinicApi } from '../../../../../apis';
import {
  CreateAdminClinicDto,
  CreateAdminClinicDtoGenderEnum,
  UpdateAdminClinicDto,
  UpdateAdminClinicDtoGenderEnum,
} from '../../../../../apis/client-axios';
import CustomButton from '../../../../../components/buttons/CustomButton';
import IconSVG from '../../../../../components/icons/icons';
import { ConfirmDeleteModal } from '../../../../../components/modals/ConfirmDeleteModal';
import { ManagerModal } from '../../../../../components/modals/ManagerModal';
import { ActionUser, PERMISSIONS } from '../../../../../constants/enum';
import { generateRandomId } from '../../../../../constants/function';
import { CustomHandleError } from '../../../../../components/response/error';
import { CustomHandleSuccess } from '../../../../../components/response/success';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../../store';
import CheckPermission, { Permission } from '../../../../../util/check-permission';

interface ManagerInfoProps {
  form: FormInstance;
  adminsClinic: any;
  setAdminsClinic: React.Dispatch<React.SetStateAction<any>>;
}

export const ManagerInfo = (props: ManagerInfoProps) => {
  const { form, adminsClinic, setAdminsClinic } = props;
  const intl = useIntl();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [isShowManagerCreateModal, setIsShowManagerCreateModal] = useState<boolean>(false);
  const [isShowManagerUpdateModal, setIsShowManagerUpdateModal] = useState<string>();
  const [isDeleteManager, setIsDeleteManager] = useState<{ id: string; name: string }>();
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
        read: Boolean(CheckPermission(PERMISSIONS.ReadAdministratorClinic, authUser)),
        create: Boolean(CheckPermission(PERMISSIONS.CreateAdministratorClinic, authUser)),
        delete: Boolean(CheckPermission(PERMISSIONS.DeleteAdministratorClinic, authUser)),
        update: Boolean(CheckPermission(PERMISSIONS.UpdateAdministratorClinic, authUser)),
      });
    }
  }, [authUser]);

  const { data: listAdminClinic, isLoading } = useQuery({
    queryKey: ['getAdminClinic', id],
    queryFn: () => adminClinicApi.administratorClinicControllerGetAllNoPagination(id!),
    enabled: !!(id && permisstion.read),
  });

  useEffect(() => {
    if (listAdminClinic) {
      setAdminsClinic(listAdminClinic.data);
    }
  }, [listAdminClinic]);

  const { mutate: CreateAdminClinic, status: statusCreateAdminClinic } = useMutation(
    (createAdminClinic: CreateAdminClinicDto) =>
      adminClinicApi.administratorClinicControllerCreateClinic(createAdminClinic),
    {
      onSuccess: ({ data }) => {
        setIsShowManagerCreateModal(false);
        form.resetFields();
        CustomHandleSuccess(ActionUser.CREATE, intl);
        queryClient.invalidateQueries(['getAdminClinic']);
      },
      onError: (error: any) => {
        CustomHandleError(error.response.data, intl);
      },
    }
  );

  const { mutate: UpdateAdminClinic, status: statusUpdateAdminClinic } = useMutation(
    (updateAdminClinic: UpdateAdminClinicDto) =>
      adminClinicApi.administratorClinicControllerUpdateClinic(updateAdminClinic),
    {
      onSuccess: ({ data }) => {
        setIsShowManagerUpdateModal(undefined);
        form.resetFields();
        CustomHandleSuccess(ActionUser.EDIT, intl);
        queryClient.invalidateQueries(['getAdminClinic']);
      },
      onError: (error: any) => {
        CustomHandleError(error.response.data, intl);
      },
    }
  );

  const { mutate: DeleteAdminClinic, status: statusDeleteAdminClinic } = useMutation(
    (id: string) => adminClinicApi.administratorClinicControllerDeleteClinic(id),
    {
      onSuccess: (data) => {
        CustomHandleSuccess(ActionUser.DELETE, intl);
        queryClient.invalidateQueries(['getAdminClinic']);
      },
      onError: (error: any) => {
        CustomHandleError(error.response.data, intl);
      },
    }
  );

  const handleCreate = (values: CreateAdminClinicDto) => {
    if (id) {
      CreateAdminClinic({
        ...values,
        clinicId: id,
      });
    } else {
      setAdminsClinic([...adminsClinic, { ...values, id: generateRandomId() }]);
      setIsShowManagerCreateModal(false);
      form.resetFields();
    }
  };

  const handleUpdate = (values: UpdateAdminClinicDto) => {
    if (id && isShowManagerUpdateModal) {
      UpdateAdminClinic({
        ...values,
        clinicId: id,
        id: isShowManagerUpdateModal,
      });
    } else if (!id && isShowManagerUpdateModal) {
      setAdminsClinic((prevValues: any) =>
        prevValues.map((item: any) => (item.id === isShowManagerUpdateModal ? { ...item, ...values } : item))
      );
      setIsShowManagerUpdateModal(undefined);
      form.resetFields();
    }
  };

  const handleDelete = () => {
    if (isShowManagerUpdateModal) {
      const name = form.getFieldValue('fullName');
      const phoneNumber = form.getFieldValue('phoneNumber');
      setIsDeleteManager({ id: isShowManagerUpdateModal, name: name || phoneNumber });
      setIsShowManagerUpdateModal(undefined);
      return;
    }
    if (isDeleteManager && isDeleteManager.id) {
      if (id) {
        DeleteAdminClinic(isDeleteManager.id);
      } else {
        setAdminsClinic((prevValues: any) => prevValues.filter((item: any) => item.id !== isDeleteManager.id));
      }
    }
    setIsDeleteManager(undefined);
    form.resetFields();
  };

  return (
    <div className="manager-info">
      <div className="manager-info__header">
        <div className="manager-info__header__title">
          <div className="manager-info__header__title__label">
            {intl.formatMessage({
              id: 'clinic.create.manager.title',
            })}
          </div>
          <div className="line-title"></div>
        </div>
        <CustomButton
          className="button-add"
          disabled={!permisstion.create}
          icon={<IconSVG type="create-2" />}
          onClick={() => {
            setIsShowManagerCreateModal(true);
          }}
        >
          {intl.formatMessage({
            id: 'clinic.create.manager.title',
          })}
        </CustomButton>
      </div>
      <div className="list-box">
        <div className={`${adminsClinic.length > 0 && 'manager-info__list'}`}>
          {adminsClinic.length > 0 &&
            adminsClinic.map((manager: any, index: number) => {
              return (
                <div
                  className={`manager-info__list__item ${
                    adminsClinic.length > 1 && index < adminsClinic.length - 1 && 'border-manager'
                  }`}
                  key={manager.id}
                  onClick={() => {
                    form.setFieldsValue({
                      ...manager,
                      dateOfBirth: manager.dateOfBirth ? dayjs(manager.dateOfBirth) : null,
                    });
                    setIsShowManagerUpdateModal(manager.id);
                  }}
                >
                  <div className="manager-info__list__item__info">
                    <div className="manager-info__list__item__info__name">{manager.fullName}</div>
                    <div className="manager-info__list__item__info__email">{manager.emailAddress}</div>
                  </div>
                  <div
                    className="manager-info__list__item__delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (permisstion.delete) {
                        setIsDeleteManager({ id: manager.id, name: manager.fullName || manager.phoneNumber });
                      }
                    }}
                  >
                    <IconSVG type="close-black-light" />
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {isShowManagerCreateModal && (
        <ManagerModal
          form={form}
          visible={isShowManagerCreateModal}
          title={intl.formatMessage({
            id: 'manager.modal.create.title.create',
          })}
          action={ActionUser.CREATE}
          onSubmit={handleCreate}
          onClose={() => {
            setIsShowManagerCreateModal(false);
            form.resetFields();
          }}
          disableCreate={!permisstion.create}
        />
      )}
      {isShowManagerUpdateModal && (
        <ManagerModal
          form={form}
          visible={!!isShowManagerUpdateModal}
          title={intl.formatMessage({
            id: 'manager.modal.create.title.edit',
          })}
          action={ActionUser.EDIT}
          onSubmit={handleUpdate}
          onDelete={handleDelete}
          onClose={() => {
            setIsShowManagerUpdateModal(undefined);
            form.resetFields();
          }}
          disableUpdate={!permisstion.update}
          disableDelete={!permisstion.delete}
        />
      )}
      <ConfirmDeleteModal
        name={isDeleteManager ? isDeleteManager.name : ''}
        subName={intl.formatMessage({
          id: 'clinic.create.manager.title',
        })}
        visible={!!isDeleteManager}
        onSubmit={handleDelete}
        onClose={() => {
          setIsDeleteManager(undefined);
          form.resetFields();
        }}
      />
    </div>
  );
};
