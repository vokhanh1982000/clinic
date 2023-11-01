import { Button, Form, FormInstance, Modal, message } from 'antd';
import { useIntl } from 'react-intl';
import CustomInput from '../input/CustomInput';
import { ActionUser } from '../../constants/enum';
import CustomButton from '../buttons/CustomButton';
import CustomSelect from '../select/CustomSelect';
import TextArea from 'antd/es/input/TextArea';
import CustomArea from '../input/CustomArea';
import IconSVG from '../icons/icons';
import { useMutation, useQuery } from '@tanstack/react-query';
import { medicineApi, samplePrescriptionMediceApi } from '../../apis';
import { CustomHandleError } from '../response';
import { CreatePrescriptionSampleMedicineDto, UpdatePrescriptionSampleMedicineDto } from '../../apis/client-axios';
import FormWrap from '../FormWrap';
import { DefaultOptionType } from 'antd/es/select';
import { useNavigate } from 'react-router';
import { medicine } from '../../routes/doctor/prescription-teamplate/create-update';
import { useState } from 'react';
import { ValidateLibrary } from '../../validate';
interface AddMedicineModalProps {
  // form?: FormInstance;
  visible: boolean;
  setShowModalCreate: Function;
  id?: string;
  medicines: medicine[] | undefined;
  setMedicine: Function;
}

export const AddMedicineModal = (props: AddMedicineModalProps) => {
  const { visible, setShowModalCreate, id, medicines, setMedicine } = props;
  const [form] = Form.useForm<any>();
  const intl = useIntl();
  const [name, setName] = useState<string>();

  const n = (key: keyof CreatePrescriptionSampleMedicineDto) => {
    return key;
  };

  const { data: ListMedicine } = useQuery({
    queryKey: ['ListMedicine'],
    queryFn: () => medicineApi.medicineControllerGetAllForDoctor(undefined),
  });

  const CreatePrescriptionSampleMedicineDto = useMutation(
    (CreatePrescriptionSampleMedicineDto: CreatePrescriptionSampleMedicineDto) =>
      samplePrescriptionMediceApi.prescriptionSampleMediceControllerCreate(CreatePrescriptionSampleMedicineDto),
    {
      onSuccess: ({ data }: any) => {
        medicines
          ? setMedicine([...medicines, { ...data.data, name: name }])
          : setMedicine([{ ...data.data, name: name }]);
        message.success(intl.formatMessage({ id: `common.createSuccess` }));
        setShowModalCreate(false);
      },
      onError: (error: any) => {
        CustomHandleError(error.response.data, intl);
      },
    }
  );
  const UpdatePrescriptionSampleMedicineDto = useMutation(
    (UpdatePrescriptionSampleMedicineDto: UpdatePrescriptionSampleMedicineDto) =>
      samplePrescriptionMediceApi.prescriptionSampleMediceControllerUpdate(UpdatePrescriptionSampleMedicineDto),
    {
      onSuccess: ({ data }) => {
        message.success(intl.formatMessage({ id: `common.createSuccess` }));
      },
      onError: (error: any) => {
        CustomHandleError(error.response.data, intl);
      },
    }
  );

  const handleSetName = (value: string) => {
    const medicine = ListMedicine?.data.find((item) => item.id === value);
    if (medicine) setName(medicine.name);
  };

  const onFinish = (values: any) => {
    id
      ? UpdatePrescriptionSampleMedicineDto.mutate({ ...values, id: id })
      : CreatePrescriptionSampleMedicineDto.mutate({ ...values });
    form.resetFields();
  };
  return (
    <FormWrap form={form} onFinish={onFinish} layout="vertical">
      <Modal className="modal-add-medicine" open={visible} centered closable={false} maskClosable={false} footer={null}>
        <div className="modal-add-medicine__content">
          <div className="modal-add-medicine__content__title">
            {intl.formatMessage({
              id: 'medicine.order.modal.create.title',
            })}
          </div>
          <div className="modal-add-medicine__content__rows">
            <Form.Item
              name={n('medicineId')}
              className="name"
              label={intl.formatMessage({
                id: 'medicine.order.modal.create.name',
              })}
              required
              rules={ValidateLibrary(intl).idMedicine}
            >
              {/* <CustomInput className="flex-reverse" prefix={<IconSVG type="search" />} /> */}
              <CustomSelect
                className="select-category"
                placeholder={intl.formatMessage({
                  id: 'medicine.order.modal.create.name',
                })}
                showSearch={true}
                filterOption={(input, option) => {
                  return !!option?.label?.toString().includes(input?.trim());
                }}
                allowClear
                options={ListMedicine?.data.flatMap((item) => {
                  return { value: item.id, label: item.name } as DefaultOptionType;
                })}
                onSelect={(e: string) => handleSetName(e)}
              />
            </Form.Item>
            <Form.Item
              name={n('quantity')}
              className="quantity"
              label={intl.formatMessage({
                id: 'medicine.order.modal.create.quantity',
              })}
              rules={ValidateLibrary(intl).quantityMedicine}
            >
              <CustomInput type="number" />
            </Form.Item>
          </div>
          <Form.Item
            name={'guide'}
            label={intl.formatMessage({
              id: 'prescription-teamplate.create.uses',
            })}
            rules={ValidateLibrary(intl).guideMedicine}
          >
            <CustomArea rows={6} style={{ resize: 'none' }} />
          </Form.Item>
          <div className="modal-add-medicine__content__action">
            <CustomButton className="button-submit" onClick={form.submit}>
              {intl.formatMessage({
                id: 'medicine.order.modal.create.button.create',
              })}
            </CustomButton>
            <CustomButton
              className="button-cancel"
              onClick={() => {
                form.resetFields();
                setShowModalCreate(false);
              }}
            >
              {intl.formatMessage({
                id: 'medicine.order.modal.create.button.cancel',
              })}
            </CustomButton>
          </div>
        </div>
      </Modal>
    </FormWrap>
  );
};
