import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Form, Modal } from 'antd';
import IconSVG from '../icons/icons';
import { ValidateLibrary } from '../../validate';
import CustomInput from '../input/CustomInput';
import useIntl from '../../util/useIntl';
import { IntlShape } from 'react-intl';
import CustomArea from '../input/CustomArea';
import CustomButton from '../buttons/CustomButton';
import CustomSearchSelect from '../input/CustomSearchSelect';
import { DoctorClinic, Medicine, PrescriptionMedicine } from '../../apis/client-axios';
import { useQuery } from '@tanstack/react-query';
import { medicineApi } from '../../apis';
import { useAppSelector } from '../../store';
import { debounce } from 'lodash';
import { Option } from 'antd/es/mentions';

interface ProvideMedicineModal {
  type: 'create' | 'update';
  visible: boolean;
  title: string;
  onClose: () => void;
  prescriptionMedicine?: PrescriptionMedicine;
  setPrescriptionMedicine?: Function;
  handleRemovePrescriptionMedicine?: Function;
}
const ProvideMedicineModal = (props: ProvideMedicineModal) => {
  const {
    visible,
    title,
    onClose,
    prescriptionMedicine,
    type,
    setPrescriptionMedicine,
    handleRemovePrescriptionMedicine,
  }: ProvideMedicineModal = props;
  const intl: IntlShape = useIntl();
  const user: DoctorClinic = useAppSelector((state) => state.auth).authUser as DoctorClinic;
  const [currentItem, setCurrentItem] = useState<PrescriptionMedicine>();
  const [fullTextSearch, setFullTextSearch] = useState<string>();
  const [medicineList, setMedicineList] = useState<Medicine[]>();
  const [isSubmit, setIsSubmit] = useState<boolean>(false);

  const { data: medicineData } = useQuery({
    queryKey: ['medicineData', { fullTextSearch }],
    queryFn: () => medicineApi.medicineControllerGetAllForDoctor(fullTextSearch),
    // enabled: !!fullTextSearch,
  });
  const handleSearch = () => {};

  const handleSave = () => {
    setIsSubmit(true);
    if (currentItem) {
      if (
        currentItem.medicine?.name.trim() === '' ||
        !currentItem.medicine?.name ||
        currentItem.quantity === 0 ||
        !currentItem.quantity ||
        currentItem.guide?.trim() === '' ||
        !currentItem.guide
      ) {
        return;
      }
    } else {
      return;
    }

    setPrescriptionMedicine!((prevItems: any) => {
      if (!prevItems) {
        prevItems = [];
      }
      const existingItemIndex = prevItems.findIndex(
        (item: PrescriptionMedicine) => item.medicineId === currentItem?.medicineId
      );

      if (existingItemIndex !== -1) {
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          ...currentItem,
        };
        return updatedItems;
      } else {
        return [...prevItems, currentItem];
      }
    });
    setIsSubmit(false);
    setCurrentItem(undefined);
    onClose();
  };

  useEffect(() => {}, [currentItem]);

  useEffect(() => {
    setCurrentItem(prescriptionMedicine);
  }, [prescriptionMedicine]);

  useEffect(() => {
    setMedicineList(medicineData?.data);
  }, [medicineData]);

  const handleChangeQuantity = (value: any) => {
    let data = currentItem;
    if (!data) {
      data = {} as PrescriptionMedicine;
    }
    const quantity = isNaN(value) ? null : Number(value);
    if (!quantity || quantity > 1000000 || quantity < 1) {
      setIsSubmit(true);
    }
    setCurrentItem({ ...data, quantity } as PrescriptionMedicine);
  };

  const handleChangeGuide = (value: any) => {
    let data = currentItem;
    if (!data) {
      data = {} as PrescriptionMedicine;
    }
    setCurrentItem({ ...data, guide: value } as PrescriptionMedicine);
  };

  const handleChangeMedicine = (value: any, option: any) => {
    // if (type === 'update' && setCurrentItem) {
    setCurrentItem({
      ...currentItem,
      medicineId: option?.key,
      medicine: medicineList?.find((item) => item.id === option?.key),
    } as PrescriptionMedicine);
    // }
  };

  const debouncedUpdateInputValue = debounce((value) => {
    if (!value.trim()) {
      setFullTextSearch('');
    } else {
      setFullTextSearch(value);
    }
  }, 500);
  const handleClose = () => {
    setCurrentItem(undefined);
    setIsSubmit(false);
    onClose();
  };

  const handleDelete = (id?: string) => {
    if (handleRemovePrescriptionMedicine && id) {
      handleRemovePrescriptionMedicine(id);
    }
    onClose();
  };
  return (
    <Modal
      className={'modal-provide-medicine'}
      open={visible}
      centered
      closable={false}
      maskClosable={false}
      footer={null}
    >
      <div className={'modal-provide-medicine__content'}>
        <div className={'modal-provide-medicine__content__title'}>
          <span>{title}</span>
          <span onClick={handleClose} className={'modal-medicine__content__title__button-close'}>
            <IconSVG type="close" />
          </span>
        </div>
        <div className={'modal-provide-medicine__content__rows'}>
          <Form.Item
            className="name"
            label={intl.formatMessage({
              id: 'booking.provide-medicine.name',
            })}
            rules={ValidateLibrary(intl).nameMedicine}
            initialValue={prescriptionMedicine?.medicine?.name}
          >
            <CustomSearchSelect
              suffixIcon={<IconSVG type="dropdown" />}
              placeholder={intl.formatMessage({
                id: 'booking.provide-medicine.name',
              })}
              value={currentItem?.medicine?.name}
              key={currentItem?.medicineId}
              onSearch={debouncedUpdateInputValue}
              allowClear={false}
              onChange={(value, option) => handleChangeMedicine(value, option)}
            >
              {medicineList ? (
                medicineList?.map((item: Medicine) => (
                  <Option key={item.id} value={item.name}>
                    {item.name}
                  </Option>
                ))
              ) : (
                <Option key={currentItem?.medicineId} value={currentItem?.medicine?.name}>
                  {currentItem?.medicine?.name}
                </Option>
              )}
            </CustomSearchSelect>
            {isSubmit && (currentItem?.medicine?.name?.trim() === '' || !currentItem?.medicine?.name) && (
              <span className="text-error">
                {intl.formatMessage({
                  id: 'validate.medicine.required',
                })}
              </span>
            )}
          </Form.Item>
          <Form.Item
            className="quantity"
            label={intl.formatMessage({
              id: 'booking.provide-medicine.quantity',
            })}
          >
            <CustomInput value={currentItem?.quantity ?? 0} onChange={(e) => handleChangeQuantity(e.target.value)} />
            {isSubmit && (!currentItem?.quantity || currentItem?.quantity < 1 || currentItem?.quantity > 100000) && (
              <span className="text-error">
                {intl.formatMessage({
                  id: 'validate.medicine.quantity',
                })}
              </span>
            )}
          </Form.Item>
        </div>
        <div className={'modal-provide-medicine__content__rows'}>
          <Form.Item
            className={'guide'}
            label={intl.formatMessage({
              id: 'booking.provide-medicine.guide',
            })}
          >
            <CustomArea
              onChange={(event) => handleChangeGuide(event.target.value)}
              value={currentItem?.guide}
              rows={6}
              style={{ resize: 'none' }}
              placeholder={intl.formatMessage({
                id: 'booking.provide-medicine.guide',
              })}
            />
            {isSubmit && (currentItem?.guide?.trim() === '' || !currentItem?.guide) && (
              <span className="text-error">
                {intl.formatMessage({
                  id: 'validate.medicine.guide.required',
                })}
              </span>
            )}
          </Form.Item>
        </div>
        <div className={'modal-provide-medicine__content__action'}>
          {type === 'create' && (
            <>
              <CustomButton className="button-submit" onClick={handleSave}>
                {intl.formatMessage({
                  id: 'booking.provide-medicine.modal.button.create',
                })}
              </CustomButton>
              <CustomButton className="button-delete" onClick={handleClose}>
                {intl.formatMessage({
                  id: 'booking.provide-medicine.modal.button.cancel',
                })}
              </CustomButton>
            </>
          )}
          {type === 'update' && (
            <>
              <CustomButton className="button-submit" onClick={handleSave}>
                {intl.formatMessage({
                  id: 'booking.provide-medicine.modal.button.save',
                })}
              </CustomButton>
              <CustomButton className="button-delete" onClick={() => handleDelete(currentItem?.id)}>
                {intl.formatMessage({
                  id: 'booking.provide-medicine.modal.button.delete',
                })}
              </CustomButton>
            </>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ProvideMedicineModal;
