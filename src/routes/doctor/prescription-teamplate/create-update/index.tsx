import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Card, Form, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useNavigate, useParams } from 'react-router';
import CheckPermission, { Permission } from '../../../../util/check-permission';
import { PERMISSIONS, Status } from '../../../../constants/enum';
import { doctorClinicApi, samplePrescriptionApi, samplePrescriptionMediceApi } from '../../../../apis';
import CustomButton from '../../../../components/buttons/CustomButton';
import IconSVG from '../../../../components/icons/icons';
import { DoctorTable } from '../../../../components/table/DoctorTable';
import { ADMIN_CLINIC_ROUTE_NAME, DOCTOR_CLINIC_ROUTE_NAME } from '../../../../constants/route';
import CustomInput from '../../../../components/input/CustomInput';
import CustomSelect from '../../../../components/select/CustomSelect';
import TableWrap from '../../../../components/TableWrap';
import Column from 'antd/lib/table/Column';
import { ConfirmDeleteModal } from '../../../../components/modals/ConfirmDeleteModal';
import { useAppSelector } from '../../../../store';
import FormWrap from '../../../../components/FormWrap';
import DoctorInfo from '../../../../components/booking/DoctorInfo';
import Achievement from '../../../../components/table/DoctorTable/achievenment';
import CustomArea from '../../../../components/input/CustomArea';
import { ValidateLibrary } from '../../../../validate';
import { AddMedicineModal } from '../../../../components/modals/AddMedicineModal';
import {
  CreatePrescriptionDto,
  CreatePrescriptionSampleDto,
  CreatePrescriptionSampleMedicineDto,
  DoctorClinic,
  UpdatePrescriptionSampleDto,
  UpdatePrescriptionSampleMedicineDto,
} from '../../../../apis/client-axios';
import { CustomHandleError } from '../../../../components/response';

export interface medicine {
  id: string;
  name: string | undefined;
  quantity: number | undefined;
  guide: string | undefined;
}

const CreateUpdatePrescriptionTeamplate = () => {
  const intl = useIntl();
  const { id } = useParams();
  const [form] = Form.useForm<any>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isShowModalDelete, setIsShowModalDelete] = useState<{ id: string | undefined; name: string | undefined }>();
  const [medicines, setMedicine] = useState<medicine[]>([]);
  const [showModalCreate, setShowModalCreate] = useState<boolean>(false);
  const doctor: DoctorClinic = useAppSelector((state) => state.auth).authUser as DoctorClinic;

  const n = (key: keyof CreatePrescriptionSampleDto) => {
    return key;
  };

  const { data: prescriptionTeamplate } = useQuery({
    queryKey: ['prescriptionTeamplate', id],
    queryFn: () => samplePrescriptionApi.prescriptionSampleControllerGetById(id as string),
    enabled: !!id,
    onSuccess: ({ data }) => {
      setIsShowModalDelete({ id: undefined, name: data.status });
    },
  });

  const CreatePrescriptionSampleDto = useMutation(
    (CreatePrescriptionSampleDto: CreatePrescriptionSampleDto) =>
      samplePrescriptionApi.prescriptionSampleControllerCreate(CreatePrescriptionSampleDto),
    {
      onSuccess: ({ data }) => {
        navigate(-1);
        message.success(intl.formatMessage({ id: `common.createSuccess` }));
      },
      onError: (error: any) => {
        CustomHandleError(error.response.data, intl);
      },
    }
  );
  const UpdatePrescriptionSampleDto = useMutation(
    (UpdatePrescriptionSampleDto: UpdatePrescriptionSampleDto) =>
      samplePrescriptionApi.prescriptionSampleControllerUpdate(UpdatePrescriptionSampleDto),
    {
      onSuccess: ({ data }) => {
        navigate(-1);
        message.success(intl.formatMessage({ id: `common.updateSuccess` }));
      },
      onError: (error: any) => {
        CustomHandleError(error.response.data, intl);
      },
    }
  );

  const deleteMutation = useMutation((id: string) => samplePrescriptionApi.prescriptionSampleControllerDelete(id), {
    onSuccess: ({ data }) => {
      queryClient.invalidateQueries(['prescriptionTeamplate']);
      navigate(-1);
      message.success(intl.formatMessage({ id: 'common.deleteeSuccess' }));
    },
    onError: (error) => {
      message.error(intl.formatMessage({ id: 'doctor.create.error' }));
    },
  });

  const deleteDetailMutation = useMutation(
    (id: string) => samplePrescriptionMediceApi.prescriptionSampleMediceControllerDelete(id),
    {
      onSuccess: ({ data }) => {
        message.success(intl.formatMessage({ id: 'common.deleteeSuccess' }));
      },
      onError: (error) => {
        message.error(intl.formatMessage({ id: 'doctor.create.error' }));
      },
    }
  );

  useEffect(() => {
    if (prescriptionTeamplate) {
      const data = prescriptionTeamplate?.data.prescriptionSampleMedicine?.map((item, index) => {
        return {
          id: item.id,
          name: item.medicine.name,
          quantity: item.quantity,
          guide: item.guide,
        };
      });
      if (data) setMedicine(data);
      form.setFieldsValue(prescriptionTeamplate.data);
    }
  }, [prescriptionTeamplate]);
  const handelDelete = () => {
    if (isShowModalDelete?.id) deleteMutation.mutate(id as string);
    setIsShowModalDelete(undefined);
  };

  const handleDeleteDetailPrescription = (id: string) => {
    deleteDetailMutation.mutate(id);
    setMedicine(medicines.filter((item) => item.id !== id));
  };

  const onFinish = (values: any) => {
    if (!id) {
      CreatePrescriptionSampleDto.mutate({
        ...values,
        userId: doctor.userId,
        prescriptionSampleMedicineIds: medicines?.map((item) => item.id),
      });
    } else {
      UpdatePrescriptionSampleDto.mutate({
        ...values,
        prescriptionSampleMedicineIds: medicines?.map((item) => item.id),
        id: id,
      });
    }
  };

  return (
    <Card id="create-prescription-teamplate-management">
      <div className="create-prescription-teamplate-title">
        {id
          ? intl.formatMessage({
              id: 'prescription-teamplate.detail.title',
            })
          : intl.formatMessage({
              id: 'prescription-teamplate.create.title',
            })}
      </div>
      <FormWrap form={form} onFinish={onFinish} layout="vertical" className="form-create-prescription-teamplate">
        <div className={'prescription-teamplate-info'}>
          <div className="prescription-teamplate-info__header">
            <div className="prescription-teamplate-info__header__title">
              <div className="prescription-teamplate-info__header__title__label">
                {intl.formatMessage({
                  id: 'prescription-teamplate.detail.table.title',
                })}
              </div>
              <div className="line-title"></div>
            </div>
            <CustomButton
              className="button-add"
              icon={<IconSVG type="create-2" />}
              onClick={() => {
                setShowModalCreate(true);
              }}
            >
              {intl.formatMessage({
                id: 'prescription-teamplate.create.info.title',
              })}
            </CustomButton>
          </div>
          <TableWrap className="custom-table" data={medicines} showPagination={false}>
            <Column
              title={intl.formatMessage({
                id: 'prescription-teamplate.create.idx',
              })}
              dataIndex="idx"
              width={'5%'}
              align="center"
              render={(_, record, index) => <>{index + 1}</>}
            />
            <Column
              title={intl.formatMessage({
                id: `prescription-teamplate.create.name`,
              })}
              dataIndex="name"
              width={'8%'}
            />
            <Column
              title={intl.formatMessage({
                id: `prescription-teamplate.create.quantity.label`,
              })}
              dataIndex="quantity"
              width={'5%'}
            />
            <Column
              title={intl.formatMessage({
                id: `prescription-teamplate.create.uses`,
              })}
              width={'15%'}
              dataIndex="guide"
              render={(value, record: medicine) => {
                return (
                  <div className="uses">
                    {value}
                    <Button type="text" onClick={() => handleDeleteDetailPrescription(record.id)}>
                      <IconSVG type="close" />
                    </Button>
                  </div>
                );
              }}
            />
          </TableWrap>
        </div>
        <div className="achievement">
          <div className="achievement__data">
            <div className="achievement__data__history">
              <div className="achievement__data__history__title">
                <div className="achievement__data__history__title__label">
                  {intl.formatMessage({
                    id: 'prescription-teamplate.detail.info',
                  })}
                </div>
                <div className="line-title"></div>
              </div>
              <div className="prescription-teamplate-info__content__info__rows">
                <Form.Item
                  className="email"
                  label={intl.formatMessage({
                    id: 'prescription-teamplate.detail.status',
                  })}
                  name={n('status')}
                  rules={ValidateLibrary(intl).statusPrescription}
                >
                  <CustomInput placeholder={intl.formatMessage({ id: 'prescription-teamplate.detail.status' })} />
                </Form.Item>
              </div>
              <div className="prescription-teamplate-info__content__info__rows">
                <Form.Item
                  className="name"
                  name={n('uses')}
                  label={intl.formatMessage({
                    id: 'prescription-teamplate.detail.uses',
                  })}
                  rules={ValidateLibrary(intl).usesPrescription}
                >
                  <CustomArea
                    rows={4}
                    style={{ resize: 'none' }}
                    placeholder={intl.formatMessage({
                      id: 'prescription-teamplate.detail.pla.uses',
                    })}
                  />
                </Form.Item>
              </div>
              <div className="prescription-teamplate-info__content__info__rows">
                <Form.Item
                  name={'note'}
                  label={intl.formatMessage({
                    id: 'prescription-teamplate.detail.note',
                  })}
                  rules={ValidateLibrary(intl).notePrescription}
                >
                  <CustomArea
                    rows={4}
                    name={'note'}
                    placeholder={intl.formatMessage({
                      id: 'prescription-teamplate.detail.pla.note',
                    })}
                  />
                </Form.Item>
              </div>
            </div>
          </div>
          <div className="achievement__button">
            <div className="button-action">
              {id ? (
                <div className="more-action">
                  <CustomButton
                    // disabled={!permission.update}
                    className="button-save"
                    onClick={() => {
                      form.submit();
                    }}
                  >
                    {intl.formatMessage({
                      id: 'doctor.edit.button.save',
                    })}
                  </CustomButton>
                  <CustomButton
                    className="button-delete"
                    onClick={() => {
                      setIsShowModalDelete({ id: id, name: isShowModalDelete?.name });
                    }}
                  >
                    {intl.formatMessage({
                      id: 'prescription-teamplate.create.delete',
                    })}
                  </CustomButton>
                </div>
              ) : (
                <div className="more-action">
                  <CustomButton
                    className="button-create"
                    onClick={() => form.submit()}
                    // disabled={!(medicines.length > 1)}
                  >
                    {intl.formatMessage({
                      id: 'prescription-teamplate.create.save',
                    })}
                  </CustomButton>
                  <CustomButton
                    className="button-cancel"
                    onClick={() => {
                      setIsShowModalDelete({ id: undefined, name: isShowModalDelete?.name });
                      navigate(-1);
                    }}
                  >
                    {intl.formatMessage({
                      id: 'prescription-teamplate.create.cancel',
                    })}
                  </CustomButton>
                </div>
              )}
            </div>
          </div>
        </div>
      </FormWrap>
      <AddMedicineModal
        visible={showModalCreate}
        medicines={medicines}
        setMedicine={setMedicine}
        setShowModalCreate={setShowModalCreate}
      />
      <ConfirmDeleteModal
        name={isShowModalDelete && isShowModalDelete.name ? isShowModalDelete.name : ''}
        visible={!!isShowModalDelete?.id}
        onSubmit={() => handelDelete()}
        onClose={() => setIsShowModalDelete(undefined)}
      />
    </Card>
  );
};
export default CreateUpdatePrescriptionTeamplate;
