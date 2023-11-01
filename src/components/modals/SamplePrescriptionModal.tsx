import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Form, Modal } from 'antd';
import IconSVG from '../icons/icons';
import CustomButton from '../buttons/CustomButton';
import useIntl from '../../util/useIntl';
import { IntlShape } from 'react-intl';
import { useQuery } from '@tanstack/react-query';
import { Prescription as PrescriptionType, PrescriptionMedicine, PrescriptionSample } from '../../apis/client-axios';
import { samplePrescriptionApi } from '../../apis';
import { debounce } from 'lodash';
import CustomInput from '../input/CustomInput';

interface SamplePrescriptionModalProp {
  visible: boolean;
  onClose: () => void;
  prescription?: PrescriptionType;
  setPrescription?: Dispatch<SetStateAction<PrescriptionType | undefined>>;
}

const SamplePrescriptionModal = (props: SamplePrescriptionModalProp) => {
  const intl: IntlShape = useIntl();
  const { visible, onClose, prescription, setPrescription }: SamplePrescriptionModalProp = props;
  const [currentSelectPrescription, setCurrentSelectPrescription] = useState<string>();
  const [fullTextSearch, setFullTextSearch] = useState<string>();
  const [listSamplePrescription, setListSamplePrescription] = useState<PrescriptionSample[]>();
  const { data: listSamplePrescriptionData } = useQuery({
    queryKey: ['listSamplePrescription', { fullTextSearch }],
    queryFn: () => samplePrescriptionApi.prescriptionSampleControllerGetAll(1, 20, undefined, fullTextSearch),
  });

  useEffect(() => {
    setListSamplePrescription(listSamplePrescriptionData?.data.content);
  }, [listSamplePrescriptionData]);

  const debouncedUpdateInputValue = debounce((value) => {
    if (!value.trim()) {
      setFullTextSearch('');
    } else {
      setFullTextSearch(value);
    }
  }, 500);

  const handleSave = () => {
    const currentSelect: PrescriptionSample | undefined = listSamplePrescription?.find(
      (item: PrescriptionSample) => item.id === currentSelectPrescription
    );

    if (currentSelect?.prescriptionSampleMedicine) {
      let cloneData: Partial<PrescriptionMedicine>[] = [];
      for (const item of currentSelect.prescriptionSampleMedicine) {
        cloneData.push({
          id: item.id,
          guide: item.guide,
          quantity: item.quantity,
          medicineId: item.medicineId,
          medicine: item.medicine,
        });
      }

      if (setPrescription) {
        setPrescription((prevState: PrescriptionType | undefined) => {
          if (prevState) {
            return {
              ...prevState,
              prescriptionMedicine: cloneData as PrescriptionMedicine[],
            };
          } else {
            return {
              prescriptionMedicine: cloneData as PrescriptionMedicine[],
            } as PrescriptionType;
          }
        });
      }
    }
    onClose();
  };

  return (
    <Modal
      className={'modal-sample-prescription'}
      open={visible}
      centered
      closable={false}
      maskClosable={false}
      footer={null}
    >
      <div className={'modal-sample-prescription__content'}>
        <div className={'modal-sample-prescription__content__title'}>
          <span>{intl.formatMessage({ id: 'booking.sample-prescription.modal.title' })}</span>
          <span onClick={onClose} className={'modal-medicine__content__title__button-close'}>
            <IconSVG type="close" />
          </span>
        </div>
        <div className={'modal-sample-prescription__content__rows'}>
          <Form.Item className={'search-medicine'}>
            <CustomInput
              prefix={<IconSVG type="search" />}
              onChange={(event) => debouncedUpdateInputValue(event.target.value)}
            />
          </Form.Item>
        </div>
        <div className={'modal-sample-prescription__content__rows'}>
          <div className={'prescription-list'}>
            {listSamplePrescription?.map((item: PrescriptionSample) => {
              return (
                <div className={'prescription-item'}>
                  <div className={'prescription-item__button'} onClick={() => setCurrentSelectPrescription(item.id)}>
                    <IconSVG type={currentSelectPrescription === item.id ? 'radio-active' : 'radio-inactive'} />
                  </div>
                  <div className={'prescription-item__wrap'}>
                    <div className={'prescription-item__wrap__content'}>
                      <div className={'prescription-item__wrap__content__title'}>Status</div>
                      <div className={'prescription-item__wrap__content__content'}>{item.status}</div>
                    </div>
                    <div className={'prescription-item__wrap__content'}>
                      <div className={'prescription-item__wrap__content__title'}>Prescription</div>
                      <div className={'prescription-item__wrap__content__content-mid'}>{item.note}</div>
                    </div>
                    <div className={'prescription-item__wrap__content'}>
                      <div className={'prescription-item__wrap__content__title'}>Feature</div>
                      <div className={'prescription-item__wrap__content__content'}>{item.uses}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className={'modal-sample-prescription__content__action'}>
          <CustomButton className={'button-submit'} onClick={handleSave}>
            {intl.formatMessage({
              id: 'booking.sample-prescription.button.save',
            })}
          </CustomButton>
        </div>
      </div>
    </Modal>
  );
};

export default SamplePrescriptionModal;
